import { ServerStats } from '../../../../public/ServerStats.js';
import { ServerStatsService } from '../../../../services/index.js';
import { AuthScope } from '../../types/auth/AuthScope.js';
import { EndpointProvider } from '../../types/express/EndpointProvider.js';

type ServerStatsRequest = Omit<ServerStats, '_id' | 'reportedAt'>;

const tokenServerMap = new Map<string, string>();

export const postServerStats: EndpointProvider<ServerStatsRequest> = {
    auth: AuthScope.Plugin,
    onStart() {
        for (const bot of AppGlobals.config.modules.webApi.serverStatsBots) {
            tokenServerMap.set(bot.siteToken, bot.serverId);
        }
    },
    isTokenValid(token) {
        return tokenServerMap.has(token);
    },
    async handleRequest({ req, res, token }) {
        const id = tokenServerMap.get(token);

        if (id === undefined) {
            throw new Error(
                `Failed to update server stats from token ${token}, no corresponding server ID found`,
            );
        }

        await ServerStatsService.upsertServerStats(id, req.body);

        res.sendStatus(200);
    },
};
