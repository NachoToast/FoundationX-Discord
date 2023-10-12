import { User, HexColorString, EmbedBuilder, APIEmbedField } from 'discord.js';
import { CommandParams } from '../../types/Command';
import { Stats } from '../../types/Database';

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
        rows[i] = `${histogram(num, maxValue)}\u1CBC\u1CBC${num.toString()}${
            x ? 'x' : ''
        } ${name} (${percentage(num, total)})`;
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
    colour: HexColorString,
): Promise<void> {
    const embed = new EmbedBuilder()
        .setColor(colour)
        .setDescription(
            [
                `Total Playtime **${formatDuration(stats.TotalPlaytime)}**`,
                `Longest Session **${formatDuration(stats.LongestSession)}**`,
            ].join('\n'),
        );

    if (typeof context === 'string') {
        embed
            .setTitle(`Stats for ${context}`)
            .setURL(`https://steamcommunity.com/profiles/${context}`);
    } else {
        embed
            .setTitle(`Stats for ${context.displayName}`)
            .setThumbnail(context.displayAvatarURL());
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
        },
    ]);

    await interaction.reply({ embeds: [embed] });
}
