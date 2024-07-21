import { OAuth2Routes, RESTPostOAuth2AccessTokenResult } from 'discord.js';
import { SecondaryRequestError } from '../../errors/SecondaryRequestError.js';
import { makeRequestBody } from './core/makeRequestBody.js';

/**
 * Makes a POST request to the Discord token refresh URL, which extends an
 * existing OAuth session.
 *
 * @throws Throws a {@link SecondaryRequestError} if the request fails, which
 * is normally due to an invalid refresh token.
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
            'Failed to refresh Discord OAuth session. The supplied refresh token may be invalid, or the session may have already expired.',
            error,
        );
    }
}
