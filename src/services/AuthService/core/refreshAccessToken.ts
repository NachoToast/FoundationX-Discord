import { OAuth2Routes, RESTPostOAuth2AccessTokenResult } from 'discord.js';
import { SecondaryRequestError } from '../../../classes/index.js';
import { makeRequestBody } from './makeRequestBody.js';

/**
 * Makes a POST request to the Discord token refresh URL, used to delay the
 * expiration of an access token.
 */
export async function refreshAccessToken(
    refreshToken: string,
): Promise<RESTPostOAuth2AccessTokenResult> {
    const body = makeRequestBody();
    body.set('refresh_token', refreshToken);
    body.set('grant_type', 'refresh_token');

    try {
        const data = await fetch(OAuth2Routes.tokenURL, {
            body,
            headers: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                'Accept-Encoding': 'application/json',
            },
            method: 'POST',
        });

        if (!data.ok) {
            throw await data.json();
        }

        return (await data.json()) as RESTPostOAuth2AccessTokenResult;
    } catch (error) {
        throw new SecondaryRequestError(
            'Access Token Refresh Failure',
            'Supplied refresh token may be invalid.',
            error,
        );
    }
}
