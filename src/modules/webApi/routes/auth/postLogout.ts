import { DiscordAuthService, UserService } from '../../../../services/index.js';
import { AuthScope } from '../../types/auth/AuthScope.js';
import { EndpointProvider } from '../../types/express/EndpointProvider.js';

export const postLogout: EndpointProvider = {
    auth: AuthScope.TokenOnly,
    async handleRequest({ req, res, auth }) {
        await DiscordAuthService.revokeAccessToken(auth.refreshToken);

        UserService.updateFromLogout(auth.userId, req.ip ?? null);

        res.sendStatus(200);
    },
};
