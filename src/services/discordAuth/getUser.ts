import { APIUser, RouteBases } from 'discord.js';
import { SecondaryRequestError } from '../../errors/SecondaryRequestError.js';

/**
 * Fetches the Discord user associated with the given Discord OAuth token.
 *
 * @throws Throws a {@link SecondaryRequestError} if the request fails, which
 * is normally due to an expired token.
 */
export async function getUserFromToken(token: string): Promise<APIUser> {
    try {
        const data = await fetch(`${RouteBases.api}/users/@me`, {
            headers: {
                authorization: `Bearer ${token}`,
                'Accept-Encoding': 'application/json',
            },
        });

        if (!data.ok) {
            throw await data.json();
        }

        return (await data.json()) as APIUser;
    } catch (error) {
        throw new SecondaryRequestError(
            'User Fetch Failure',
            'Unable to fetch user info, the access token may be expired.',
            error,
        );
    }
}
