import { ConnectionService } from 'discord.js';
import { ForbiddenError, NotFoundError } from '../../classes/index.js';
import { LoginOrSignupResponse } from '../../types/index.js';
import { UserService } from '../index.js';
import { getAssociatedUser } from './core/getAssociatedUser.js';
import { getUserConnections } from './core/getUserConnections.js';
import { makeSiteToken } from './core/makeSiteToken.js';
import { requestAccessToken } from './core/requestAccessToken.js';

export async function loginOrSignup(
    code: string,
    redirectUri: string,
    ip?: string,
): Promise<LoginOrSignupResponse> {
    const discordAuth = await requestAccessToken(code, redirectUri);

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
            'You must connect your Steam account to Discord in order to login/register.',
        );
    }

    if (!steamConnection.verified) {
        throw new ForbiddenError(
            'Unverified Steam Connection',
            'You must verify your Steam account connection in order to login/register.',
        );
    }

    let response: LoginOrSignupResponse;

    try {
        const existingUser = await UserService.getUserBySteamId(
            steamConnection.id,
        );

        // login
        response = {
            user: await UserService.updateExistingUser(
                steamConnection.id,
                steamConnection.name,
                existingUser.discord?.id,
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
    } catch (error) {
        if (!(error instanceof NotFoundError)) {
            throw error;
        }

        // signup
        response = {
            user: await UserService.createNewUser(
                steamConnection.id,
                steamConnection.name,
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

    return response;
}
