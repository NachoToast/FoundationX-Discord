import { APIUser } from 'discord.js';
import { ObjectId } from 'mongodb';
import { SteamConnection } from '../../public/SteamConnection.js';
import { UserRank } from '../../public/UserRank.js';
import { getUserDb, UserDocument } from './db.js';

/** Creates a new user from a Discord login. */
export async function createNewUser(
    discord: APIUser,
    steamConnections: SteamConnection[],
    ip: string | null,
): Promise<UserDocument> {
    const now = Date.now();

    const newUser: UserDocument = {
        _id: new ObjectId(),
        rank: UserRank.None,
        discord: {
            id: discord.id,
            username: discord.username,
            avatar: discord.avatar,
            lastUpdatedAt: now,
        },
        steam: steamConnections.at(0) ?? null,
        otherSteamConnections: steamConnections.slice(1),
        economy: { balance: 0, lifetimeBalance: 0, lifetimePurchaseCount: 0 },
        meta: {
            latestIp: ip,
            firstSeenAt: now,
            lastSeenAt: now,
        },
        actionsPerformedLog: [],
        actionsReceivedLog: [],
    };

    await getUserDb().insertOne(newUser);

    return newUser;
}
