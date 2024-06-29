import { ButtonInteraction } from 'discord.js';
import { sendFeedbackMessage } from './sendFeedbackMessage.js';

/** Handles a button click to give/remove a role. */
export async function handleButtonPress(
    interaction: ButtonInteraction<'cached'>,
): Promise<void> {
    const roleId = interaction.customId;

    const role = AppGlobals.config.mainBot.reactRoles.roles[roleId];

    if (role === undefined) {
        throw new Error(`Role not found (ID ${roleId})`);
    }

    let action: 'add' | 'remove';

    if (interaction.member.roles.cache.has(roleId)) {
        // Member already has the role, so remove it.
        action = 'remove';
    } else {
        // Member does not have the role, so add it.
        action = 'add';
    }

    await interaction.member.roles[action](roleId);

    await sendFeedbackMessage(interaction, action, role);
}
