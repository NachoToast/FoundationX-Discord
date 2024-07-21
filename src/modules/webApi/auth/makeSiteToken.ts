import { RESTPostOAuth2AccessTokenResult } from 'discord.js';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { SiteTokenPayload } from '../types/auth/SiteTokenPayload.js';

/** Creates a JsonWebToken with a payload of necessary user data. */
export function makeSiteToken(
    discordAuth: RESTPostOAuth2AccessTokenResult,
    userId: ObjectId,
): string {
    const { jwtSecret } = AppGlobals.config.modules.webApi;

    const { access_token, refresh_token, expires_in } = discordAuth;

    const payload: SiteTokenPayload = {
        userId: userId.toHexString(),
        accessToken: access_token,
        refreshToken: refresh_token,
    };

    return jwt.sign(payload, jwtSecret, { expiresIn: expires_in });
}
