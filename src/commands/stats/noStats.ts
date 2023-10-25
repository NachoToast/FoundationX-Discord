import { HexColorString, EmbedBuilder, userMention } from 'discord.js';
import { CommandParams } from '../../types/Command';
import { IContext } from './IContext';

export async function sendNoStats(
    interaction: CommandParams['interaction'],
    context: IContext,
    self: boolean,
    colour: HexColorString,
): Promise<void> {
    const embed = new EmbedBuilder().setColor(colour);

    if (context.type === 'steam') {
        const { id, profileUrl, username } = context.user;

        embed.setURL(`https://steamcommunity.com/profiles/${id}`);

        if (username !== undefined) {
            embed.setDescription(
                `No stats found linked to Steam account \`${username}\``,
            );
        } else {
            embed.setDescription(
                `No stats found linked to Steam ID \`${context.user.id}\``,
            );
        }

        embed.setThumbnail(profileUrl ?? null);
    } else {
        const { user } = context;

        embed
            .setThumbnail(user.displayAvatarURL())
            .setDescription(
                `No stats found linked to ${
                    self ? 'your' : `${userMention(user.id)}'s`
                } Steam account.`,
            );
    }

    await interaction.reply({ embeds: [embed] });
}
