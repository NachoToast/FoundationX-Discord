import { APIUser, RouteBases } from 'discord.js';
import { SecondaryRequestError } from '../../../classes/index.js';

export async function getAssociatedUser(accessToken: string): Promise<APIUser> {
    try {
        const data = await fetch(`${RouteBases.api}/users/@me`, {
            headers: {
                authorization: `Bearer ${accessToken}`,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Accept-Encoding': 'application/json',
            },
        });

        if (!data.ok) {
            throw await data.json();
        }

        return (await data.json()) as APIUser;
    } catch (error) {
        throw new SecondaryRequestError(
            'Failed to fetch user info',
            'Discord account was deleted, or access token is invalid',
            error,
        );
    }
}
