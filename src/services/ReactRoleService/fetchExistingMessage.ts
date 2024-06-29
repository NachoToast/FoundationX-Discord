import { Collection, Message, TextChannel } from 'discord.js';
import { getSavedMessageId } from './messageDatabase.js';

/**
 * Attempts to find and return the existing message for react-roles, if one
 * exists.
 */
export async function fetchExistingMessage(
    channel: TextChannel,
): Promise<Message<true> | null> {
    const previousMessageId = await getSavedMessageId();

    if (previousMessageId === null) {
        return null;
    }

    try {
        const fetchedMessage = await channel.messages.fetch(previousMessageId);

        if (fetchedMessage instanceof Collection) {
            throw new Error();
        }

        return fetchedMessage;
    } catch (error) {
        return null;
    }
}
