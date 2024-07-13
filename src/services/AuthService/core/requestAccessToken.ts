import { OAuth2Routes, RESTPostOAuth2AccessTokenResult } from 'discord.js';
import { SecondaryRequestError } from '../../../classes/index.js';
import { makeRequestBody } from './makeRequestBody.js';

/**
 * Makes a POST request to the Discord token URL, used to upgrade an
 * authorization code into an access token.
 *
 * @param {String} code Authorization code returned by Discord.
 * @param {String} redirectUri Redirect URI, should exactly match one from the
 * application settings.
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
            // eslint-disable-next-line @typescript-eslint/naming-convention
            headers: { 'Accept-Encoding': 'application/json' },
            method: 'POST',
        });

        if (!data.ok) {
            throw await data.json();
        }

        return (await data.json()) as RESTPostOAuth2AccessTokenResult;
    } catch (error) {
        throw new SecondaryRequestError(
            'Access Token Request Failure',
            'Supplied code or redirect URI may be invalid.',
            error,
        );
    }
}
