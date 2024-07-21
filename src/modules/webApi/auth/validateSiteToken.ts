import jwt from 'jsonwebtoken';
import { AuthError } from '../../../errors/AuthError.js';
import { SiteTokenPayload } from '../types/auth/SiteTokenPayload.js';

/**
 * Validates a JWT authorization header.
 * @param {string | undefined } [token] Authorization header value (e.g.
 * `Bearer abcdefg...`).
 *
 * @throws Throws an {@link AuthError} if the token is invalid.
 */
export function validateSiteToken(token: string | undefined): SiteTokenPayload {
    if (token === undefined) {
        throw new AuthError(
            'Missing Authorization',
            'A token was not provided in the authorization header.',
        );
    }

    const { jwtSecret } = AppGlobals.config.modules.webApi;

    let payload;

    try {
        payload = jwt.verify(token.slice(`Bearer `.length), jwtSecret);
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            // see https://www.npmjs.com/package/jsonwebtoken JsonWebTokenError
            throw new AuthError(
                'Invalid Authorization',
                `Unable to verify your site token (${error.message}).`,
            );
        }

        if (error instanceof jwt.TokenExpiredError) {
            throw new AuthError(
                'Session Expired',
                'Site token has expired, logging out is required.',
            );
        }

        throw new AuthError(
            'Unknown Authorization Error',
            'An unexpected error occurred.',
        );
    }

    // All the below conditions are never likely to be true, since we only sign
    // our JWTs with valid paylods (see `makeSiteToken`).

    if (typeof payload === 'string') {
        throw new AuthError(
            'Invalid Token Payload Type',
            'Got a string, but expected an object.',
        );
    }

    if (payload.exp === undefined) {
        throw new AuthError('Invalid Token', 'Token lacks an expiration date.');
    }

    const userId: unknown = payload['userId'];
    const accessToken: unknown = payload['accessToken'];
    const refreshToken: unknown = payload['refreshToken'];

    if (typeof userId !== 'string') {
        throw new AuthError(
            'Invalid Token Payload Shape',
            `Missing 'userId' (expected string, got ${typeof userId}).`,
        );
    }
    if (typeof accessToken !== 'string') {
        throw new AuthError(
            'Invalid Token Payload Shape',
            `Missing 'access_token' (expected string, got ${typeof accessToken}).`,
        );
    }

    if (typeof refreshToken !== 'string') {
        throw new AuthError(
            'Invalid Token Payload Shape',
            `Missing 'refresh_token' (expected string, got ${typeof refreshToken}).`,
        );
    }

    return {
        userId,
        accessToken,
        refreshToken,
    };
}
