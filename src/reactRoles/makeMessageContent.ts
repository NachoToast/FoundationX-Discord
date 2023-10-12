import {
    TextChannel,
    BaseMessageOptions,
    EmbedBuilder,
    ButtonBuilder,
    ActionRowBuilder,
} from 'discord.js';
import { Config } from '../types/Config';

/** Makes an embed and row of buttons that can be added to a message. */
export function makeMessageContent(
    channel: TextChannel,
    roles: Config['mainBot']['reactRoles']['roles'],
): BaseMessageOptions {
    const embed = new EmbedBuilder()
        .setColor('#3F48CC')
        .setTitle('Personal Roles')
        .setDescription('Click on a button to add/remove a role!');

    const buttons: ButtonBuilder[] = [];

    for (const [roleId, role] of Object.entries(roles)) {
        const button = new ButtonBuilder()
            .setCustomId(`${channel.guildId}-${roleId}`)
            .setStyle(role.style)
            .setLabel(role.label)
            .setEmoji(role.emoji);

        buttons.push(button);
    }

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);

    return { embeds: [embed], components: [row] };
}
