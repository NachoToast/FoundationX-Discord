import { NotFoundError } from '../../classes/index.js';
import { User } from '../../types/index.js';
import { getUserDb } from './core/userDatabase.js';

/**
 * Fetches a user via their SteamID64.
 *
 * @throws Throws a {@link NotFoundError} if a user could not be found.
 */
export async function getUserBySteamId(steamId64: string): Promise<User> {
    const user = await getUserDb().findOne({ _id: steamId64 });

    if (user === null) {
        throw new NotFoundError(
            'User not found',
            'A user with the specified Steam ID does not exist.',
        );
    }

    return user;
}
