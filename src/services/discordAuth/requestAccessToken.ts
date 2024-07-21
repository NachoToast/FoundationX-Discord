import { OAuth2Routes, RESTPostOAuth2AccessTokenResult } from 'discord.js';
import { SecondaryRequestError } from '../../errors/SecondaryRequestError.js';
import { makeRequestBody } from './core/makeRequestBody.js';

/**
 * Makes a POST request to the Discord token URL, which upgrades an
 * authorisation code into an access token.
 *
 * @throws Throws a {@link SecondaryRequestError} if the request fails, which
 * is normally due to an invalid code or redirect URI.
 */
export async function requestAccessToken(
    code: string,
    redirectUri: string,
): Promise<RESTPostOAuth2AccessTokenResult> {
    const body = makeRequestBody();
    body.set('code', code);
    body.set('redirect_uri', redirectUri);
    body.set('grant_type', 'authorization_code');

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
            'Access Token Request Failure',
            'Failed to obtain Discord access token. The supplied code or redirect URI may be invalid.',
            error,
        );
    }
}
