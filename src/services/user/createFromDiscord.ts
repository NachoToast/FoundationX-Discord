import { APIUser } from 'discord.js';
import { SteamConnection } from '../../public/SteamConnection.js';
import { createNewInternal } from './core/createNewInternal.js';
import { getUserDb, UserDocument } from './db.js';

/** Creates a new user from a Discord login. */
export async function createFromDiscord(
    discord: APIUser,
    steamConnections: SteamConnection[],
    ip: string | null,
): Promise<UserDocument> {
    const now = Date.now();

    const newUser = createNewInternal(now);

    newUser.discord = {
        id: discord.id,
        username: discord.username,
        avatar: discord.avatar,
        lastUpdatedAt: now,
    };

    newUser.steam = steamConnections.at(0) ?? null;
    newUser.otherSteamConnections = steamConnections.slice(1);

    newUser.meta.latestIp = ip;
    newUser.meta.firstSeenAtDiscord = now;
    newUser.meta.lastSeenAtDiscord = now;

    await getUserDb().insertOne(newUser);

    return newUser;
}
