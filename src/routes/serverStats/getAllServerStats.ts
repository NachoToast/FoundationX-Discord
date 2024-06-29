import { ServerStatsService } from '../../services/index.js';
import { Endpoint, OutServerStats } from '../../types/index.js';

export const getAllServerStats: Endpoint<
    void,
    { serverId: string; stats: OutServerStats | null }[]
> = (_req, res, next) => {
    const serverIds = Object.keys(AppGlobals.config.serverStats.servers);

    Promise.all(
        serverIds.map(async (serverId) => {
            const stats = await ServerStatsService.getServerStats(serverId);

            return { serverId, stats };
        }),
    )
        .then((results) => {
            res.status(200).json(results);
        })
        .catch((error: unknown) => {
            next(error);
        });
};
