import { EconomyService } from '../../../../services/index.js';
import { AuthScope } from '../../types/auth/AuthScope.js';
import { EndpointProvider } from '../../types/express/EndpointProvider.js';

const tokens = new Set<string>();

export const deletePayouts: EndpointProvider<string[]> = {
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
        await EconomyService.deletePayouts(req.body);

        res.sendStatus(200);
    },
};
