import { ObjectId, StrictFilter } from 'mongodb';
import { NotFoundError } from '../../errors/NotFoundError.js';
import { DiscordIdString } from '../../public/DiscordIdString.js';
import { SteamId64 } from '../../public/SteamId64.js';
import { getUserDb, UserDocument } from './db.js';

/**
 * Fetches a user via their direct ID.
 *
 * @throws Throws a {@link NotFoundError} if the user does not exist in the
 * database.
 */
export async function getUserById(id: string): Promise<UserDocument> {
    const user = await getUserDb().findOne({ _id: new ObjectId(id) });

    if (user === null) {
        throw new NotFoundError(
            'User Not Found',
            'Could not find a user with that ID in the database.',
        );
    }

    return user;
}

/**
 * Fetches a user via their Steam ID.
 *
 * @throws Throws a {@link NotFoundError} if the user does not exist in the
 * database.
 */
export async function getUserBySteamId(
    steamId: SteamId64,
): Promise<UserDocument> {
    const filter: StrictFilter<UserDocument> = { 'steam.id': steamId };

    const user = await getUserDb().findOne(filter);

    if (user === null) {
        throw new NotFoundError(
            'User Not Found',
            'Could not find a user with that Steam ID in the database.',
        );
    }

    return user;
}

/**
 * Fetches a user via their Discord ID.
 *
 * @throws Throws a {@link NotFoundError} if the user does not exist in the
 * database.
 */
export async function getUserByDiscordId(
    discordId: DiscordIdString,
): Promise<UserDocument> {
    const filter: StrictFilter<UserDocument> = { 'discord.id': discordId };

    const user = await getUserDb().findOne(filter);

    if (user === null) {
        throw new NotFoundError(
            'User Not Found',
            'Could not find a user with that ID in the database.',
        );
    }

    return user;
}
