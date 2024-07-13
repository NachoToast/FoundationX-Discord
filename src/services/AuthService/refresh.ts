import { ConnectionService } from 'discord.js';
import { ForbiddenError } from '../../classes/index.js';
import { LoginOrSignupResponse } from '../../types/index.js';
import { UserService } from '../index.js';
import { getAssociatedUser } from './core/getAssociatedUser.js';
import { getUserConnections } from './core/getUserConnections.js';
import { makeSiteToken } from './core/makeSiteToken.js';
import { refreshAccessToken } from './core/refreshAccessToken.js';
import { validateSiteToken } from './core/validateSiteToken.js';

export async function refresh(
    siteToken?: string,
    ip?: string,
): Promise<LoginOrSignupResponse> {
    const { refreshToken, discordId } = validateSiteToken(siteToken);

    const discordAuth = await refreshAccessToken(refreshToken);

    const [discordUser, connections] = await Promise.all([
        getAssociatedUser(discordAuth.access_token),
        getUserConnections(discordAuth.access_token),
    ]);

    const steamConnection = connections.find(
        (e) => e.type === ConnectionService.Steam,
    );

    if (steamConnection === undefined) {
        throw new ForbiddenError(
            'No Steam Connection',
            'You must connect your Steam account to Discord in order to refresh your session.',
        );
    }

    if (!steamConnection.verified) {
        throw new ForbiddenError(
            'Unverified Steam Connection',
            'You must verify your Steam account connection in order to refresh your session.',
        );
    }

    return {
        user: await UserService.updateExistingUser(
            steamConnection.id,
            steamConnection.name,
            discordId,
            discordUser,
            ip,
        ),
        discordAuth,
        siteAuth: makeSiteToken(
            discordAuth,
            discordUser.id,
            steamConnection.id,
        ),
    };
}
