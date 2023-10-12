import { ServerResponse } from 'http';
import { OAuth2Routes, RESTPostOAuth2AccessTokenResult } from 'discord.js';
import { Config } from '../types/Config';
import { parseResponseError } from './parseResponseError';

/**
 * Fetches OAuth result from an authorisation code,
 * returning null if an error occurs.
 */
export async function handleAuthCode(
    code: string,
    redirectUri: string,
    config: Config,
    res: ServerResponse,
): Promise<RESTPostOAuth2AccessTokenResult | null> {
    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: config.steamLinking.discordClientId,
        client_secret: config.steamLinking.discordClientSecret,
        redirect_uri: redirectUri,
        code,
    });

    const response = await fetch(OAuth2Routes.tokenURL, {
        method: 'POST',
        body,
        headers: {
            'Accept-Encoding': 'application/json',
        },
    });

    if (!response.ok) {
        await parseResponseError(response, res);
        return null;
    }

    return (await response.json()) as RESTPostOAuth2AccessTokenResult;
}
