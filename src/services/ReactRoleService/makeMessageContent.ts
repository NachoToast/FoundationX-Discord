import {
    ActionRowBuilder,
    BaseMessageOptions,
    ButtonBuilder,
    EmbedBuilder,
} from 'discord.js';

/** Creates an embed and buttons for every role that can be added/removed. */
export function makeMessageContent(): BaseMessageOptions {
    const { embedColour, reactRoles } = AppGlobals.config.mainBot;

    const embed = new EmbedBuilder()
        .setColor(embedColour)
        .setTitle('Personal Roles')
        .setDescription('Click on a button to add/remove a role!');

    const buttons = new Array<ButtonBuilder>();

    for (const [roleId, role] of Object.entriesT(reactRoles.roles)) {
        const button = new ButtonBuilder()
            .setCustomId(roleId)
            .setStyle(role.style)
            .setLabel(role.label)
            .setEmoji(role.emoji);

        buttons.push(button);
    }

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buttons);

    return { embeds: [embed], components: [row] };
}
