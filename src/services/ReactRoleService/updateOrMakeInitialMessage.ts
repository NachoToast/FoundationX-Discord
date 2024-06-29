import { fetchExistingMessage } from './fetchExistingMessage.js';
import { fetchReactRoleChannel } from './fetchReactRoleChannel.js';
import { makeInteractionListeners } from './makeInteractionListeners.js';
import { makeMessageContent } from './makeMessageContent.js';
import { setSavedMessageId } from './messageDatabase.js';

/**
 * Sends (or updates if existing) a react role message to the configured
 * channel.
 */
export async function updateOrMakeInitialMessage(): Promise<void> {
    const channel = await fetchReactRoleChannel();

    const messageContent = makeMessageContent();

    let message = await fetchExistingMessage(channel);

    if (message === null) {
        message = await channel.send(messageContent);
        await setSavedMessageId(message.id);
    } else {
        await message.edit(messageContent);
    }

    makeInteractionListeners(message);
}
