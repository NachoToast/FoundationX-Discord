import { convertId } from '../../../../global/util/idHelpers.js';
import { Payout } from '../../../../public/Payout.js';
import { SteamId64 } from '../../../../public/SteamId64.js';
import { EconomyService } from '../../../../services/index.js';
import { AuthScope } from '../../types/auth/AuthScope.js';
import { EndpointProvider } from '../../types/express/EndpointProvider.js';

interface Query {
    steamIds: SteamId64[];
}

const tokens = new Set<string>();

export const getPayouts: EndpointProvider<void, Payout[], void, Query> = {
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
        const data = await EconomyService.getPayoutsBySteamId(
            req.query.steamIds,
        );

        res.status(200).json(data.map((payout) => convertId(payout)));
    },
};
