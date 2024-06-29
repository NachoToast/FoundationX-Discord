import { ButtonInteraction } from 'discord.js';
import { ReactRole } from '../../types/index.js';

/** Creates and sends a feedback message for a button click. */
export async function sendFeedbackMessage(
    interaction: ButtonInteraction<'cached'>,
    action: 'add' | 'remove',
    role: ReactRole,
): Promise<void> {
    const { addMessage, removeMessage, label } = role;

    let feedbackMessage: string;

    if (action === 'add') {
        if (addMessage === undefined) {
            feedbackMessage = `You now have the **${label}** role`;
        } else {
            feedbackMessage = addMessage.replaceAll('%s', label);
        }
    } else {
        if (removeMessage === undefined) {
            feedbackMessage = `You no longer have the **${label}** role`;
        } else {
            feedbackMessage = removeMessage.replaceAll('%s', label);
        }
    }

    await interaction.reply({ content: feedbackMessage, ephemeral: true });
}
