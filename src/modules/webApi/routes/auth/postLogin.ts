import { NotFoundError } from '../../../../errors/NotFoundError.js';
import { convertId } from '../../../../global/util/idHelpers.js';
import { LoginOrSignupResponse } from '../../../../public/LoginOrSignupResponse.js';
import { DiscordAuthService, UserService } from '../../../../services/index.js';
import { makeSiteToken } from '../../auth/makeSiteToken.js';
import { AuthScope } from '../../types/auth/AuthScope.js';
import { EndpointProvider } from '../../types/express/EndpointProvider.js';

interface LoginRequest {
    code: string;

    redirectUri: string;
}

export const postLogin: EndpointProvider<LoginRequest, LoginOrSignupResponse> =
    {
        auth: AuthScope.None,
        async handleRequest({ req, res }) {
            const { code, redirectUri } = req.body;

            const discordAuth = await DiscordAuthService.requestAccessToken(
                code,
                redirectUri,
            );

            const [discordUser, connections] = await Promise.all([
                DiscordAuthService.getUserFromToken(discordAuth.access_token),
                DiscordAuthService.getUserConnections(discordAuth.access_token),
            ]);

            let user;

            try {
                user = await UserService.updateFromDiscord(
                    discordUser,
                    connections,
                    req.ip ?? null,
                );
            } catch (error) {
                if (error instanceof NotFoundError) {
                    user = await UserService.createFromDiscord(
                        discordUser,
                        connections,
                        req.ip ?? null,
                    );
                } else {
                    throw error;
                }
            }

            res.status(200).json({
                user: convertId(user),
                expiresIn: discordAuth.expires_in,
                siteToken: makeSiteToken(discordAuth, user._id),
            });
        },
    };
