import { getPayoutDb } from './db.js';

export async function initialise(): Promise<void> {
    await getPayoutDb().createIndexes([
        { key: { userSteamId: 1 } },
        { key: { userDiscordId: 1 } },
    ]);
}
