import { ObjectId, StrictFilter, StrictUpdateFilter } from 'mongodb';
import { SteamId64 } from '../../public/SteamId64.js';
import { UserRank } from '../../public/UserRank.js';
import { getUserDb, UserDocument } from './db.js';

/**
 * Updates the balance of a Steam user, creating a new one if no user exists.
 *
 * If multiple users exist with the given {@link steamId}, only the first one
 * will be updated.
 */
export async function upsertFromSteamEarning(
    steamId: SteamId64,
    username: string,
    balanceIncrement: number,
): Promise<void> {
    const now = Date.now();

    const filter1: StrictFilter<UserDocument> = {
        'steam.id': steamId,
    };

    const filter2: StrictFilter<UserDocument> = {
        manualSteamId: steamId,
    };

    const filter: StrictFilter<UserDocument> = { $or: [filter1, filter2] };

    const update: StrictUpdateFilter<UserDocument> = {
        $set: {
            'steam.username': username,
            'meta.lastSeenAt': now,
            'meta.lastSeenAtSteam': now,
        },
        $inc: {
            'economy.balance': balanceIncrement,
            'economy.lifetimeBalance': balanceIncrement,
        },
        $setOnInsert: {
            _id: new ObjectId(),
            rank: UserRank.None,
            discord: null,
            'steam.id': steamId,
            manualSteamId: null,
            otherSteamConnections: [],
            'economy.lifetimePurchaseCount': 0,
            'meta.latestIp': null,
            'meta.firstSeenAt': now,
            'meta.firstSeenAtSteam': now,
            'meta.firstSeenAtDiscord': null,
            'meta.lastSeenAtDiscord': null,
            actionsPerformedLog: [],
            actionsReceivedLog: [],
        },
    };

    await getUserDb().updateOne(filter, update, { upsert: true });
}
