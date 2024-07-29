import { SteamId64 } from '../../../../public/SteamId64.js';
import { UserService } from '../../../../services/index.js';
import { AuthScope } from '../../types/auth/AuthScope.js';
import { EndpointProvider } from '../../types/express/EndpointProvider.js';

type EarningsRequest = {
    steamId: SteamId64;
    username: string;
    balanceInc: number;
}[];

const tokens = new Set<string>();

export const postEarnings: EndpointProvider<EarningsRequest> = {
    auth: AuthScope.Plugin,
    onStart() {
        for (const token of AppGlobals.config.modules.webApi.economyBotTokens) {
            tokens.add(token);
        }
    },
    isTokenValid(token) {
        return tokens.has(token);
    },
    async handleRequest({ req, res }) {
        const promiseArr = req.body.map(({ steamId, username, balanceInc }) => {
            return UserService.upsertFromSteamEarning(
                steamId,
                username,
                balanceInc,
            );
        });

        const results = await Promise.allSettled(promiseArr);

        res.sendStatus(200);

        for (const result of results) {
            if (result.status === 'rejected') {
                console.error(result.reason);
            }
        }
    },
};
