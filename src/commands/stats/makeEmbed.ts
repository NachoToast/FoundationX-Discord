import { HexColorString, EmbedBuilder, APIEmbedField } from 'discord.js';
import { CommandParams } from '../../types/Command';
import { Levels, Stats } from '../../types/Database';
import { IContext } from './IContext';

const formatDuration = (durationSeconds: number): string => {
    if (durationSeconds < 60) {
        return `${durationSeconds}s`;
    }
    if (durationSeconds < 3600) {
        return `${Math.floor(durationSeconds / 60)}m ${durationSeconds % 60}s`;
    }
    const durationMinutes = Math.floor(durationSeconds / 60);
    return `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m ${
        durationSeconds % 60
    }s`;
};

const percentage = (num: number, total: number): string => {
    return `${Math.round((num / total) * 100)}%`;
};

export const histogram = (
    num: number,
    total: number,
    length = 5,
    emptyChar = '⬛',
): string => {
    const fillPart = Math.round((num / total) * length);
    const filled = '<:histogram:1166693406769172531>'.repeat(fillPart);
    const empty = emptyChar.repeat(length - fillPart);

    return filled + empty;
};

function makeField(
    data: [string, number][],
    emoji: string,
    total: number,
    title: string,
    x: boolean = false,
): APIEmbedField {
    data.sort((a, b) => b[1] - a[1]);

    const maxValue = data[0][1];

    const rows = new Array<string>(data.length);
    for (let i = 0; i < data.length; i++) {
        const [name, num] = data[i];
        rows[i] = `${histogram(num, maxValue)} ${num.toString()}${
            x ? 'x' : ''
        } ${name}`;
        if (total > 0) rows[i] += ` (${percentage(num, total)})`;
    }
    return {
        name: `${emoji} ${total} ${title}`,
        value: rows.join('\n'),
    };
}

export async function sendStats(
    interaction: CommandParams['interaction'],
    stats: Stats,
    context: IContext,
    levelData: Levels | null,
    colour: HexColorString,
    insights: string[],
): Promise<void> {
    const description = [
        `Total Playtime **${formatDuration(stats.TotalPlaytime)}**`,
        `Longest Session **${formatDuration(stats.LongestSession)}**`,
    ];

    if (levelData !== null) {
        description.splice(
            0,
            0,
            `Level **${levelData.LVL}** (${levelData.XP} XP)`,
        );
    }

    const embed = new EmbedBuilder()
        .setColor(colour)
        .setDescription(description.join('\n'));

    if (context.type === 'steam') {
        const { id, profileUrl, username } = context.user;

        embed
            .setTitle(`Stats for ${username ?? id}`)
            .setURL(`https://steamcommunity.com/profiles/${id}`);

        embed.setThumbnail(profileUrl ?? null);

        if (id === '76561199218191222') {
            embed.setImage(
                'https://miro.medium.com/v2/resize:fit:630/1*U_YWaNfECxoLRh0dmlpVOg.jpeg',
            );
        }
    } else {
        const { user } = context;

        embed
            .setTitle(`Stats for ${user.displayName}`)
            .setThumbnail(user.displayAvatarURL());

        if (user.id === '826388910770487326') {
            embed.setImage(
                'https://miro.medium.com/v2/resize:fit:630/1*U_YWaNfECxoLRh0dmlpVOg.jpeg',
            );
        }
    }

    const totalKills = stats.KillsAgainstPlayers + stats.KillsAgaisntSCPs;

    const specialKills =
        stats.KillsWithJailbird +
        stats.KillsWithMicro +
        stats.KillsWithFunnyGun;

    const itemsUsed =
        stats.MedkitsUsed +
        stats.PainkillersUsed +
        stats.ColasEaten +
        stats.PepsisEaten +
        stats.HatsWorn +
        stats.GrenadesThrown;

    embed.addFields([
        makeField(
            [
                ['against players', stats.KillsAgainstPlayers],
                ['against SCPs', stats.KillsAgaisntSCPs],
            ],
            '🔫',
            totalKills,
            'Kills',
        ),
        makeField(
            [
                ['Falling', stats.DeathsToFallDamage],
                ['Suicide', stats.DeathsToSuicide],
                ['Mod', stats.DeathsToGod],
                ['Tesla', stats.DeathsToTesla],
            ],
            '💀',
            stats.Deaths,
            'Deaths',
        ),
        makeField(
            [['096', stats.KillsAgaisntShyGuy]],
            '👻',
            stats.KillsAgaisntSCPs,
            'SCPs Killed',
            true,
        ),
        makeField(
            [
                ['Jailbird', stats.KillsWithJailbird],
                ['Micro HID', stats.KillsWithMicro],
                ['Com-45', stats.KillsWithFunnyGun],
            ],
            '🐦',
            specialKills,
            'Special Kills',
        ),
        makeField(
            [
                ['Grenades', stats.GrenadesThrown],
                ['Medkits', stats.MedkitsUsed],
                ['Painkillers', stats.PainkillersUsed],
                ['SCP-207', stats.ColasEaten],
                ['SCP-207?', stats.PepsisEaten],
                ['SCP-268', stats.HatsWorn],
            ],
            '💊',
            itemsUsed,
            'Items Used',
        ),
        {
            name: '🌐 Other',
            value: [
                `${stats.KillsAgaisntCuffedPlayers} Cuffed Human Kills`,
                `${stats.TimesUncuffed} Times Cuffed`,
                `${stats.CasesUnlocked} Cases Unlocked`,
                `${stats.DoorsTouched} Doors Used`,
            ].join('\n'),
            inline: true,
        },
    ]);

    if (insights.length > 0) {
        embed.addFields({
            name: `🌟 ${insights.length} Noteworthy Stat${
                insights.length === 1 ? '' : 's'
            }`,
            value: insights.join('\n'),
            inline: true,
        });
    }

    await interaction.reply({ embeds: [embed] });
}
