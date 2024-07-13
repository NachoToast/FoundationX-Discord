/* eslint-disable @typescript-eslint/naming-convention */
import { RESTPostOAuth2AccessTokenResult } from 'discord.js';
import jwt from 'jsonwebtoken';
import { SiteTokenPayload } from '../../../types/index.js';

/** Creates a JsonWebToken with a payload of necessary user data. */
export function makeSiteToken(
    discordAuth: RESTPostOAuth2AccessTokenResult,
    discordId: string,
    steamId64: string,
): string {
    const secretKey = AppGlobals.config.webApi.jwtSecret;
    const { access_token, refresh_token, expires_in } = discordAuth;

    const payload: SiteTokenPayload = {
        steamId64,
        discordId,
        accessToken: access_token,
        refreshToken: refresh_token,
    };

    return jwt.sign(payload, secretKey, { expiresIn: expires_in });
}
