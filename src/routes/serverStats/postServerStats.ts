import { AuthError, NotFoundError } from '../../classes/index.js';
import { ServerStatsService } from '../../services/index.js';
import { Endpoint, InServerStats, OutServerStats } from '../../types/index.js';

export const postServerStats: Endpoint<
    InServerStats,
    OutServerStats,
    { id: string },
    void
> = (req, res, next) => {
    const servers = AppGlobals.config.serverStats.servers;

    const serverId = req.params.id;

    const expectedAuthToken = servers[serverId];

    if (expectedAuthToken === undefined) {
        throw new NotFoundError(
            'Unrecognised Server ID',
            'A server with that ID is not tracked by this API.',
        );
    }

    const authToken = req.get('Authorization');

    if (authToken === undefined) {
        throw new AuthError(
            'Missing Authorization',
            'A token in the Authorization header is required to update ',
        );
    }

    if (authToken !== expectedAuthToken) {
        throw new AuthError(
            'Invalid Authorization',
            'The token in the Authorization header is not valid for this server.',
        );
    }

    ServerStatsService.updateServerStats(serverId, req.body)
        .then((updatedStats) => {
            if (updatedStats === null) {
                next(new Error('Failed to update server stats.'));
            } else {
                res.status(200).json(updatedStats);
            }
        })
        .catch((error: unknown) => {
            next(error);
        });
};
