import { Snowflake } from 'discord.js';
import { Collection } from 'mongodb';

interface MessageDocument {
    /** User ID of the bot combined with `dev` or `prod` based on config. */
    _id: string;

    /** ID of the message. */
    messageId: Snowflake;
}

let messageDb: Collection<MessageDocument> | null = null;

function getMessageDb(): Collection<MessageDocument> {
    return (messageDb ??= AppGlobals.db.collection('react-role-messages'));
}

function getId(): string {
    return `${AppGlobals.client.user.id}-${AppGlobals.config.production ? 'prod' : 'dev'}`;
}

export async function getSavedMessageId(): Promise<Snowflake | null> {
    const result = await getMessageDb().findOne({ _id: getId() });

    return result?.messageId ?? null;
}

export async function setSavedMessageId(messageId: Snowflake): Promise<void> {
    await getMessageDb().updateOne(
        { _id: getId() },
        { $set: { messageId } },
        { upsert: true },
    );
}
