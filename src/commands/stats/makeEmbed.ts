import { User, HexColorString, EmbedBuilder, APIEmbedField } from 'discord.js';
import { CommandParams } from '../../types/Command';
import { Levels, Stats } from '../../types/Database';

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

const histogram = (num: number, total: number, length = 5): string => {
    const fillPart = Math.round((num / total) * length);
    const filled = '🟦'.repeat(fillPart);
    const empty = '⬛'.repeat(length - fillPart);

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
    context: User | string,
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

    if (typeof context === 'string') {
        embed
            .setTitle(`Stats for ${context}`)
            .setURL(`https://steamcommunity.com/profiles/${context}`);

        if (context === '76561199218191222') {
            embed.setImage(
                'https://miro.medium.com/v2/resize:fit:630/1*U_YWaNfECxoLRh0dmlpVOg.jpeg',
            );
        }
    } else {
        embed
            .setTitle(`Stats for ${context.displayName}`)
            .setThumbnail(context.displayAvatarURL());

        if (context.id === '826388910770487326') {
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
