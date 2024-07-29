import { getUserDb } from './db.js';

export async function initialise(): Promise<void> {
    await getUserDb().createIndexes([
        {
            key: { 'steam.id': 1 },
            partialFilterExpression: { 'steam.id': { $exists: true } },
        },
        {
            key: { manualSteamId: 1 },
            partialFilterExpression: { manualSteamId: { $exists: true } },
        },
        {
            key: { 'discord.id': 1 },
            unique: true,
            partialFilterExpression: { 'discord.id': { $exists: true } },
        },
        {
            key: { 'steam.username': 'text', 'discord.username': 'text' },
            partialFilterExpression: {
                $or: [
                    { 'steam.username': { $exists: true } },
                    { 'discord.username': { $exists: true } },
                ],
            },
        },
        {
            key: { 'economy.balance': -1 },
            partialFilterExpression: { 'economy.balance': { $exists: true } },
        },
    ]);
}
