import { NotFoundError } from '../../classes/index.js';
import { ServerStatsService } from '../../services/index.js';
import { Endpoint, OutServerStats } from '../../types/index.js';

export const getServerStats: Endpoint<
    void,
    OutServerStats,
    { id: string },
    void
> = (req, res, next) => {
    const servers = AppGlobals.config.serverStats.servers;

    const serverId = req.params.id;

    if (!servers[serverId]) {
        throw new NotFoundError(
            'Unrecognised Server ID',
            'A server with that ID is not tracked by this API.',
        );
    }

    ServerStatsService.getServerStats(serverId)
        .then((fetchedStats) => {
            if (fetchedStats === null) {
                res.sendStatus(202); // Accepted.
            } else {
                res.status(200).json(fetchedStats);
            }
        })
        .catch((error: unknown) => {
            next(error);
        });
};
