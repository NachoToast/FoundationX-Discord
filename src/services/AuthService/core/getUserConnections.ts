import { APIConnection, RouteBases } from 'discord.js';
import { SecondaryRequestError } from '../../../classes/index.js';

export async function getUserConnections(
    accessToken: string,
): Promise<APIConnection[]> {
    try {
        const data = await fetch(`${RouteBases.api}/users/@me/connections`, {
            headers: {
                authorization: `Bearer ${accessToken}`,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Accept-Encoding': 'application/json',
            },
        });

        if (!data.ok) {
            throw await data.json();
        }

        return (await data.json()) as APIConnection[];
    } catch (error) {
        throw new SecondaryRequestError(
            'Failed to fetch user info',
            'Discord account was deleted, or access token is invalid',
            error,
        );
    }
}
