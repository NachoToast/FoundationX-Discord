import { OAuth2Routes } from 'discord.js';
import { SecondaryRequestError } from '../../errors/SecondaryRequestError.js';
import { makeRequestBody } from './core/makeRequestBody.js';

/**
 * Makes a POST request to the Discord token revocation URL, which revokes an
 * existing access token.
 *
 * @throws Throws a {@link SecondaryRequestError} if the request fails, which
 * is normally due to an invalid access token.
 */
export async function revokeAccessToken(accessToken: string): Promise<void> {
    const body = makeRequestBody();
    body.set('token', accessToken);

    try {
        const res = await fetch(OAuth2Routes.tokenRevocationURL, {
            body,
            method: 'POST',
        });

        if (!res.ok) {
            throw await res.json();
        }
    } catch (error) {
        throw new SecondaryRequestError(
            'Access Token Revocation Failure',
            'Failed to revoke Discord access token, the supplied access token may be invalid, or the session may have already expired.',
            error,
        );
    }
}
