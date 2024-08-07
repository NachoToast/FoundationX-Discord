import { APIUser } from 'discord.js';
import {
    FindOneAndUpdateOptions,
    StrictFilter,
    StrictUpdateFilter,
} from 'mongodb';
import { NotFoundError } from '../../errors/NotFoundError.js';
import { SteamConnection } from '../../public/SteamConnection.js';
import { getUserDb, UserDocument } from './db.js';

/**
 * Updates an existing user from a Discord login.
 *
 * @throws Throws a {@link NotFoundError} if the user does not exist in the
 * database.
 */
export async function updateFromDiscord(
    discord: APIUser,
    steamConnections: SteamConnection[],
    ip: string | null,
): Promise<UserDocument> {
    const now = Date.now();

    const filterConditions: StrictFilter<UserDocument>[] = [
        { 'discord.id': discord.id },
    ];

    const firstSteamConnection = steamConnections.at(0) ?? null;
    if (firstSteamConnection !== null) {
        filterConditions.push({ 'steam.id': firstSteamConnection.id });
    }

    const filter: StrictFilter<UserDocument> = { $or: filterConditions };

    const update: StrictUpdateFilter<UserDocument> = {
        $set: {
            discord: {
                id: discord.id,
                username: discord.username,
                avatar: discord.avatar,
                lastUpdatedAt: now,
            },

            steam: firstSteamConnection,
            otherSteamConnections: steamConnections.slice(1),

            'meta.latestIp': ip,
            'meta.lastSeenAt': now,
            'meta.lastSeenAtDiscord': now,
        },
    };

    const options: FindOneAndUpdateOptions = { returnDocument: 'after' };

    const user = await getUserDb().findOneAndUpdate(filter, update, options);

    if (user === null) {
        throw new NotFoundError(
            'User Not Found',
            'Could not find a user with that Discord ID in the database for updating.',
        );
    }

    return user;
}
