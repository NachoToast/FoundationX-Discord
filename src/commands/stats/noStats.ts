import { User, HexColorString, EmbedBuilder, userMention } from 'discord.js';
import { CommandParams } from '../../types/Command';

export async function sendNoStats(
    interaction: CommandParams['interaction'],
    context: User | string,
    self: boolean,
    colour: HexColorString,
): Promise<void> {
    const embed = new EmbedBuilder().setColor(colour);

    if (typeof context === 'string') {
        embed
            .setURL(`https://steamcommunity.com/profiles/${context}`)
            .setDescription(`No stats found linked to Steam ID \`${context}\``);
    } else {
        embed
            .setThumbnail(context.displayAvatarURL())
            .setDescription(
                `No stats found linked to ${
                    self ? 'your' : `${userMention(context.id)}'s`
                } Steam account.`,
            );
    }

    await interaction.reply({ embeds: [embed] });
}
