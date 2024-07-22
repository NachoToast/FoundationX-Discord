import { convertId } from '../../../../global/util/idHelpers.js';
import { LoginOrSignupResponse } from '../../../../public/LoginOrSignupResponse.js';
import { DiscordAuthService, UserService } from '../../../../services/index.js';
import { makeSiteToken } from '../../auth/makeSiteToken.js';
import { AuthScope } from '../../types/auth/AuthScope.js';
import { EndpointProvider } from '../../types/express/EndpointProvider.js';

export const postRefresh: EndpointProvider<void, LoginOrSignupResponse> = {
    auth: AuthScope.TokenOnly,
    async handleRequest({ req, res, auth }) {
        const newDiscordAuth = await DiscordAuthService.refreshAccessToken(
            auth.refreshToken,
        );

        const [discordUser, connections] = await Promise.all([
            DiscordAuthService.getUserFromToken(newDiscordAuth.access_token),
            DiscordAuthService.getUserConnections(newDiscordAuth.access_token),
        ]);

        const user = await UserService.updateFromDiscord(
            discordUser,
            connections,
            req.ip ?? null,
        );

        res.status(200).json({
            user: convertId(user),
            expiresIn: newDiscordAuth.expires_in,
            siteToken: makeSiteToken(newDiscordAuth, user._id),
        });
    },
};
