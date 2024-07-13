import jwt from 'jsonwebtoken';
import { AuthError } from '../../../classes/index.js';
import { SiteTokenPayload } from '../../../types/index.js';

/**
 * Validates an authorization header.
 * @param {string | undefined} token Authorization header value (e.g. `Bearer
 * abcdefg...`).
 */
export function validateSiteToken(token: string | undefined): SiteTokenPayload {
    if (token === undefined) {
        throw new AuthError(
            'Missing Authorization',
            'A token was not provided in the authorization header.',
        );
    }

    const secretKey = AppGlobals.config.webApi.jwtSecret;

    let payload;

    try {
        payload = jwt.verify(token.slice('Bearer '.length), secretKey);
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            // see https://www.npmjs.com/package/jsonwebtoken > JsonWebTokenError
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

    // all the below conditions are never likely to be true, since we only sign
    // our JWTs with valid paylods (see `makeSiteToken`)

    if (typeof payload === 'string') {
        throw new AuthError(
            'Invalid Token Payload Type',
            'Got a string, but expected an object.',
        );
    }

    if (payload.exp === undefined) {
        throw new AuthError('Invalid Token', 'Token lacks an expiration date.');
    }

    const steamId64: unknown = payload['steamId64'];

    if (typeof steamId64 !== 'string') {
        throw new AuthError(
            'Invalid Token Payload Shape',
            `Missing 'steamId64' (expected string, got ${typeof steamId64}).`,
        );
    }

    const discordId: unknown = payload['discordId'];

    if (typeof discordId !== 'string') {
        throw new AuthError(
            'Invalid Token Payload Shape',
            `Missing 'discordId' (expected string, got ${typeof discordId}).`,
        );
    }

    const accessToken: unknown = payload['accessToken'];

    if (typeof accessToken !== 'string') {
        throw new AuthError(
            'Invalid Token Payload Shape',
            `Missing 'access_token' (expected string, got ${typeof accessToken}).`,
        );
    }

    const refreshToken: unknown = payload['refreshToken'];

    if (typeof refreshToken !== 'string') {
        throw new AuthError(
            'Invalid Token Payload Shape',
            `Missing 'refresh_token' (expected string, got ${typeof refreshToken}).`,
        );
    }

    return {
        steamId64,
        discordId,
        accessToken,
        refreshToken,
    };
}
