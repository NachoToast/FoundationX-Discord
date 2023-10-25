import { Stats } from './Stats';

export type RankedStat = keyof Pick<Stats, 'Deaths' | 'DeathsToFallDamage' | 'DeathsToSuicide' | 'DeathsToTesla' | 'DeathsToGod' | 'KillsAgainstPlayers' | 'KillsAgaisntSCPs' | 'KillsAgaisntShyGuy' | 'KillsWithJailbird' | 'KillsWithMicro' | 'KillsWithFunnyGun' | 'GrenadesThrown' | 'MedkitsUsed' | 'PainkillersUsed' | 'CasesUnlocked' | 'PepsisEaten' | 'HatsWorn' | 'DoorsTouched' | 'LongestSession' | 'TotalPlaytime' >;

export interface StatsRanking {
    /**
     * For rankings:
     * "(You have) the Xth highest {name} in the server!"
     * e.g. "You have the 5th highest death count in the server!"
     * 
     * For percentiles:
     * "(Your) {name} is in the top X% of users!"
     * e.g. "Your longest session is in the top 5% of users!"
     */
    name: string
    top10: string[];
    p75: number; // top 25%
    p90: number; // top 10%
    p95: number; // top 5%
    p99: number; // top 1%
}
