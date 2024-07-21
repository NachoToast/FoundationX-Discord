import { APIConnection, ConnectionService, RouteBases } from 'discord.js';
import { SecondaryRequestError } from '../../errors/SecondaryRequestError.js';
import { SteamConnection } from '../../public/SteamConnection.js';

/**
 * Fetches the connections of the Discord user associated with the given
 * Discord OAuth token.
 *
 * @throws Throws a {@link SecondaryRequestError} if the request fails, which
 * is normally due to an expired token.
 */
export async function getUserConnections(
    token: string,
): Promise<SteamConnection[]> {
    try {
        const data = await fetch(`${RouteBases.api}/users/@me/connections`, {
            headers: {
                authorization: `Bearer ${token}`,
                'Accept-Encoding': 'application/json',
            },
        });

        if (!data.ok) {
            throw await data.json();
        }

        const allConnections = (await data.json()) as APIConnection[];

        return allConnections
            .filter((c) => {
                if (c.type !== ConnectionService.Steam) return false;
                if (c.revoked) return false;
                if (!c.verified) return false;

                return true;
            })
            .map((c) => ({ id: c.id, username: c.name }));
    } catch (error) {
        throw new SecondaryRequestError(
            'User Connections Fetch Failure',
            'Unable to fetch user connections, the access token may be expired.',
            error,
        );
    }
}
