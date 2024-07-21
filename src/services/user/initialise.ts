import { getUserDb } from './db.js';

export async function initialise(): Promise<void> {
    await getUserDb().createIndexes(
        [
            { key: { 'steam.id': 1 } },
            { key: { 'discord.id': 1 }, unique: true },
            { key: { 'steam.username': 'text', 'discord.username': 'text' } },
        ],
        {},
    );
}
