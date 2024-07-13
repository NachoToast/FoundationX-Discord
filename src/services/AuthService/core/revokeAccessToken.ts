import { OAuth2Routes } from 'discord.js';
import { SecondaryRequestError } from '../../../classes/index.js';
import { makeRequestBody } from './makeRequestBody.js';

/**
 * Makes a POST request to the Discord token revocation URL, used to invalidate
 * an access token.
 */
export async function revokeAccessToken(accessToken: string): Promise<void> {
    const body = makeRequestBody();
    body.set('token', accessToken);

    try {
        await fetch(OAuth2Routes.tokenRevocationURL, { body, method: 'POST' });
    } catch (error) {
        throw new SecondaryRequestError(
            'Access Token Revocation Failure',
            'Supplied access token may be invalid.',
            error,
        );
    }
}
