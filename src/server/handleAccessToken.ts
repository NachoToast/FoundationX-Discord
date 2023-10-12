import { ServerResponse } from 'http';
import {
    APIConnection,
    APIUser,
    RESTPostOAuth2AccessTokenResult,
    RouteBases,
    Snowflake,
} from 'discord.js';
import { parseResponseError } from './parseResponseError';

/** Gets the connections of a Discord user given an access token. */
async function getConnections(
    accessToken: RESTPostOAuth2AccessTokenResult['access_token'],
): Promise<
    | { success: true; connections: APIConnection[] }
    | { success: false; response: Response }
> {
    const response = await fetch(`${RouteBases.api}/users/@me/connections`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        return { success: false, response };
    }

    const connections = (await response.json()) as APIConnection[];

    return { success: true, connections };
}

/** Gets the user data of a Discord user given an access token. */
async function getUserData(
    accessToken: Snowflake,
): Promise<
    { success: true; user: APIUser } | { success: false; response: Response }
> {
    const response = await fetch(`${RouteBases.api}/users/@me`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        return { success: false, response };
    }

    const user = (await response.json()) as APIUser;

    return { success: true, user };
}

/**
 * Handles an access token by getting the user's connections and user data,
 * returning null if an error occurs.
 */
export async function handleAccessToken(
    accessToken: RESTPostOAuth2AccessTokenResult['access_token'],
    res: ServerResponse,
): Promise<{ connections: APIConnection[]; userData: APIUser } | null> {
    const [connections, userData] = await Promise.all([
        getConnections(accessToken),
        getUserData(accessToken),
    ]);

    if (!connections.success) {
        await parseResponseError(connections.response, res);
        return null;
    }

    if (!userData.success) {
        await parseResponseError(userData.response, res);
        return null;
    }

    return { userData: userData.user, connections: connections.connections };
}
