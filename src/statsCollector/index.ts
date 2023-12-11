import { getSteamData } from '../getSteamData';
import { RankedStat, Stats, StatsRanking } from '../types/Database';
import { StatsModel } from '../types/Models';

interface StatsInsight {
    description: string;
    importance: number;

    isLeaderboard: boolean;
}

type PlayerLeaderboardStat = {
    id: string;
    value: number;
} & Awaited<ReturnType<typeof getSteamData>>;

export class StatsCollector {
    private static readonly _updateIntervalMinutes = 60; // 1 hour

    private readonly _statsModel: StatsModel;

    public readonly stats: Map<RankedStat, StatsRanking>;

    public constructor(statsModel: StatsModel) {
        this._statsModel = statsModel;

        const stats: [RankedStat, string][] = [
            ['Deaths', 'total deaths'],
            ['DeathsToFallDamage', 'fall damage deaths'],
            ['DeathsToSuicide', 'suicide rate'],
            ['DeathsToTesla', 'tesla death count'],
            ['DeathsToGod', 'mod death rate'],
            ['KillsAgainstPlayers', 'player kill count'],
            ['KillsAgaisntSCPs', 'SCP kill count'],
            ['KillsAgaisntShyGuy', 'SCP-096 kill count'],
            ['KillsWithJailbird', 'jailbird kill count'],
            ['KillsWithMicro', 'Micro-HID kill count'],
            ['KillsWithFunnyGun', 'Com-45 kill count'],
            ['GrenadesThrown', 'number of grenades thrown'],
            ['MedkitsUsed', 'medkits used'],
            ['PainkillersUsed', 'painkillers eaten'],
            ['CasesUnlocked', 'cases unlocked'],
            ['ColasEaten', 'SCP-207 drank'],
            ['PepsisEaten', "SCP-207?'s drank"],
            ['HatsWorn', "SCP-268's worn"],
            ['DoorsTouched', 'doors used'],
            ['LongestSession', 'session length'],
            ['TotalPlaytime', 'playtime'],
        ];

        this.stats = new Map(
            stats.map<[RankedStat, StatsRanking]>((a) => [
                a[0],
                {
                    name: a[1],
                    top10: [],
                    p75: Infinity,
                    p90: Infinity,
                    p95: Infinity,
                    p99: Infinity,
                },
            ]),
        );

        setInterval(
            () => {
                void this.updateAll();
            },
            StatsCollector._updateIntervalMinutes * 60 * 1000,
        );

        void this.updateAll();
    }

    private async updateSingle(name: RankedStat): Promise<void> {
        const cursor = this._statsModel
            .find()
            .project<Stats>({ _id: 1, [name]: 1 })
            .sort({ [name]: 'asc' });

        const rawData: [string, number][] = [];

        for await (const doc of cursor) {
            rawData.push([doc._id, doc[name]]);
        }

        const data = rawData.map((e) => e[1]);

        const p75 = StatsCollector.empiricalQuartile(data, 0.75);
        const p90 = StatsCollector.empiricalQuartile(data, 0.9);
        const p95 = StatsCollector.empiricalQuartile(data, 0.95);
        const p99 = StatsCollector.empiricalQuartile(data, 0.99);

        const existingStat = this.stats.get(name);
        if (existingStat === undefined) return;

        existingStat.top10 = rawData
            .slice(-10)
            .reverse()
            .map((e) => e[0]);
        existingStat.p75 = p75;
        existingStat.p90 = p90;
        existingStat.p95 = p95;
        existingStat.p99 = p99;

        return;
    }

    private async updateAll(): Promise<void> {
        for (const key of this.stats.keys()) {
            try {
                // console.log(`Updating ${key}...`);
                await this.updateSingle(key);
            } catch (error) {
                console.log(error);
            }
        }
        console.log('Finished updating stats.');
    }

    private getRankingForStat(
        steamId: string,
        statName: RankedStat,
        statValue: number,
    ): StatsInsight | null {
        const rankingData = this.stats.get(statName);
        if (rankingData === undefined) return null;

        const placement = rankingData.top10.indexOf(steamId);
        if (placement === 0) {
            return {
                description: `🥇 **#1** ${rankingData.name}!`,
                importance: placement,
                isLeaderboard: true,
            };
        }

        if (placement === 1) {
            return {
                description: `🥈 **#2** ${rankingData.name}!`,
                importance: placement,
                isLeaderboard: true,
            };
        }

        if (placement === 2) {
            return {
                description: `🥉 **#3** ${rankingData.name}!`,
                importance: placement,
                isLeaderboard: true,
            };
        }

        if (placement !== -1) {
            return {
                description: `⭐ **#${placement + 1}** ${rankingData.name}!`,
                importance: placement,
                isLeaderboard: false,
            };
        }

        if (statValue >= rankingData.p99) {
            return {
                description: `Top **1%** ${rankingData.name}!`,
                importance: 10,
                isLeaderboard: false,
            };
        }

        if (statValue >= rankingData.p95) {
            return {
                description: `Top **5%** ${rankingData.name}!`,
                importance: 11,
                isLeaderboard: false,
            };
        }

        if (statValue >= rankingData.p90) {
            return {
                description: `Top **10%** ${rankingData.name}!`,
                importance: 12,
                isLeaderboard: false,
            };
        }

        if (statValue >= rankingData.p75) {
            return {
                description: `Top **25%** ${rankingData.name}!`,
                importance: 13,
                isLeaderboard: false,
            };
        }

        return null;
    }

    public getRankingFor(steamId: string, stats: Stats): string[] {
        const outputA: StatsInsight[] = [];
        const outputB: StatsInsight[] = [];

        for (const statName of this.stats.keys()) {
            const statValue = stats[statName];
            const insight = this.getRankingForStat(
                steamId,
                statName,
                statValue,
            );
            if (insight !== null) {
                if (insight.isLeaderboard) {
                    outputB.push(insight);
                } else {
                    outputA.push(insight);
                }
            }
        }

        outputA.sort((a, b) => a.importance - b.importance);
        outputB.sort((a, b) => a.importance - b.importance);

        const combinedOutput = [...outputB, ...outputA];

        return combinedOutput
            .slice(0, Math.max(outputB.length, 5))
            .map((e) => e.description);
    }

    private static clamp(x: number, min: number, max: number): number {
        return Math.min(Math.max(x, min), max);
    }

    private static empiricalQuartile(
        items: number[],
        quartile: number,
    ): number {
        const rank = quartile * (items.length + 1);

        const lowerIndex = StatsCollector.clamp(
            Math.floor(rank),
            1,
            items.length,
        );
        const upperIndex = StatsCollector.clamp(
            Math.ceil(rank),
            1,
            items.length,
        );

        if (lowerIndex === upperIndex) {
            return items[lowerIndex - 1];
        }

        const lowerValue = items[lowerIndex - 1];
        const upperValue = items[upperIndex - 1];
        const interpolation = rank - lowerIndex;

        return lowerValue + interpolation * (upperValue - lowerValue);
    }

    public async getTopXForStat(
        stat: RankedStat,
        limit: number = 10,
    ): Promise<PlayerLeaderboardStat[]> {
        const topX = await this._statsModel
            .find({}, { limit, sort: { [stat]: 'desc' } })
            .project<Stats>({ _id: 1, [stat]: 1 })
            .toArray();

        async function makeProfileLine(
            id: string,
            value: number,
        ): Promise<PlayerLeaderboardStat> {
            const profileData = await getSteamData(id);
            return { id, value, ...profileData };
        }

        return await Promise.all(
            topX.map((e) => makeProfileLine(e._id, e[stat])),
        );
    }
}
