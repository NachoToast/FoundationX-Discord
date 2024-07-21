import { APIUser } from 'discord.js';
import {
    FindOneAndUpdateOptions,
    ObjectId,
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
export async function updateExistingUser(
    discord: APIUser,
    steamConnections: SteamConnection[],
    ip: string | null,
): Promise<UserDocument> {
    const now = Date.now();

    const filter: StrictFilter<UserDocument> = { 'discord.id': discord.id };

    const update: StrictUpdateFilter<UserDocument> = {
        $set: {
            'discord.id': discord.id,
            'discord.username': discord.username,
            'discord.avatar': discord.avatar,
            'discord.lastUpdatedAt': now,

            steam: steamConnections.at(0) ?? null,
            otherSteamConnections: steamConnections.slice(1),

            'meta.latestIp': ip,
            'meta.lastSeenAt': now,
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

/** Updates user metadata asynchronously. */
export function updateExistingUserBasic(id: string, ip: string | null): void {
    const update: StrictUpdateFilter<UserDocument> = {
        $set: {
            'meta.latestIp': ip,
            'meta.lastSeenAt': Date.now(),
        },
    };

    getUserDb()
        .updateOne({ _id: new ObjectId(id) }, update)
        .catch((error: unknown) => {
            console.warn(
                `Failed to update user metadata for user ${id}:`,
                error,
            );
        });
}
