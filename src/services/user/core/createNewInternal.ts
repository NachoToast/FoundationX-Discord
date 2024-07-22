import { ObjectId } from 'mongodb';
import { UserRank } from '../../../public/UserRank.js';
import { UserDocument } from '../db.js';

export function createNewInternal(now: number): UserDocument {
    return {
        _id: new ObjectId(),
        rank: UserRank.None,
        discord: null,
        steam: null,
        otherSteamConnections: [],
        economy: { balance: 0, lifetimeBalance: 0, lifetimePurchaseCount: 0 },
        meta: {
            latestIp: null,
            firstSeenAt: now,
            lastSeenAt: now,
            firstSeenAtDiscord: null,
            lastSeenAtDiscord: null,
            firstSeenAtSteam: null,
            lastSeenAtSteam: null,
        },
        actionsPerformedLog: [],
        actionsReceivedLog: [],
    };
}
