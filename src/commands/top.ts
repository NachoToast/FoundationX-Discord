import { EmbedBuilder } from 'discord.js';
import { Command } from '../types/Command';
import { RankedStat, Stats } from '../types/Database';
import { StatsModel } from '../types/Models';
import { formatDuration, histogram } from './stats/makeEmbed';

function capitalizeEachWord(s: string): string {
    return s
        .split(/\s/g)
        .map((e) => e[0].toUpperCase() + e.slice(1))
        .join(' ');
}

function* medalGenerator(): Generator<string, string, string> {
    yield '🥇';
    yield '🥈';
    yield '🥉';
    let i = 4;
    while (i > 0) {
        yield `**#${i++}**`.toString();
    }
    return '';
}

async function getRank(
    statsModel: StatsModel,
    steamId: string,
    stat: RankedStat,
): Promise<{ rank: number; value: number } | null> {
    const idk = statsModel.aggregate<Stats & { rankingForStat: number }>([
        {
            $setWindowFields: {
                sortBy: { [stat]: -1 },
                output: {
                    rankingForStat: { $rank: {} },
                },
            },
        },
        {
            $match: { _id: steamId },
        },
    ]);

    const result = await idk.next();

    if (result === null) return null;

    return { rank: result.rankingForStat, value: result[stat] };
}

export const topCommand: Command = {
    name: 'top',

    description: 'List the top 10 players for a certain statistic',

    async execute({
        client,
        interaction,
        member,
        config,
        statsCollector,
        models,
    }) {
        await interaction.deferReply();

        const stat = interaction.options.getString('stat', true) as RankedStat;

        const [leaderboard, steamLink] = await Promise.all([
            statsCollector.getTopXForStat(stat),
            models.steamModel.findOne({ _id: interaction.user.id }),
        ]);

        if (leaderboard.length === 0) {
            await interaction.editReply({
                content: `The leaderboard for ${stat} is empty!`,
            });
            return;
        }

        let valueFormatter = (x: number): string => x.toString();
        if (stat === 'TotalPlaytime' || stat === 'LongestSession') {
            valueFormatter = (x: number) => formatDuration(x);
        }

        const embed = new EmbedBuilder()
            .setColor(config.embedColour)
            .setTitle(
                `🏆 ${capitalizeEachWord(
                    statsCollector.stats.get(stat)?.name ?? 'unknown stat',
                )} Leaderboard`,
            );

        const output = new Array<string>(leaderboard.length);

        const maxValue = leaderboard[0].value;

        const medals = medalGenerator();

        for (let i = 0; i < leaderboard.length; i++) {
            const { username, id, value } = leaderboard[i];

            output[i] = `${histogram(value, maxValue, 10, '')} ${
                medals.next().value
            } [${
                username ?? id
            }](https://steamcommunity.com/profiles/${id}) - ${valueFormatter(
                value,
            )}`;
        }

        if (
            stat === 'DeathsToTesla' &&
            ['1000257933587775509', '240312568273436674'].includes(member.id)
        ) {
            const barWidth = leaderboard.at(0)?.value ?? 1;

            output.splice(
                0,
                0,
                `${histogram(barWidth, maxValue, 10, '')} 🏅 Jxyn - Infinity`,
            );
        }

        if (steamLink === null) {
            embed.setFooter({
                text: `Check your individual ranking for ${
                    statsCollector.stats.get(stat)?.name ?? 'unknown stat'
                } by linking your Steam account using /stats!`,
                iconURL: client.user.displayAvatarURL(),
            });
        } else if (models.statsModel === undefined) {
            embed.setFooter({
                text: 'Not connected to the stats database, so unable to fetch rankings',
                iconURL: interaction.user.displayAvatarURL(),
            });
        } else {
            const rankData = await getRank(
                models.statsModel,
                steamLink.steamId64,
                stat,
            );

            if (rankData === null) {
                embed.setFooter({
                    text: `You are not ranked for ${
                        statsCollector.stats.get(stat)?.name ?? 'unknown stat'
                    }`,
                    iconURL: interaction.user.displayAvatarURL(),
                });
            } else if (rankData.rank > 10) {
                if (rankData.rank > 11) output.push('...');
                output.push(
                    `${histogram(rankData.value, maxValue, 10, '')} **#${
                        rankData.rank
                    }** [${
                        member.displayName
                    }](https://steamcommunity.com/profiles/${
                        steamLink.steamId64
                    }) - ${valueFormatter(rankData.value)}`,
                );
            }
        }

        embed.setDescription(output.join('\n'));

        await interaction.editReply({ embeds: [embed] });
    },

    build(baseCommand, { statsCollector }) {
        const choices = Array.from(statsCollector.stats.entries()).map((e) => ({
            name: e[1].name,
            value: e[0],
        }));

        baseCommand.addStringOption((option) =>
            option
                .setName('stat')
                .setDescription('The statistic to see the leaderboard of')
                .setRequired(true)
                .addChoices(...choices),
        );
    },
};
