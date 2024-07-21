import { NotFoundError } from '../../errors/NotFoundError.js';
import { ServerStats } from '../../public/ServerStats.js';
import { getServerStatsDb } from './db.js';

/**
 * Fetches server stats via SCP: SL server ID.
 *
 * @throws Throws a {@link NotFoundError} if the server does not exist in the
 * database.
 */
export async function getStatsById(serverId: string): Promise<ServerStats> {
    const server = await getServerStatsDb().findOne({ _id: serverId });

    if (server === null) {
        throw new NotFoundError(
            'Server Not Found',
            'Could not find a server with that ID in the database.',
        );
    }

    return server;
}
