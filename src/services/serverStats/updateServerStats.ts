import { ServerStats } from '../../public/ServerStats.js';
import { getServerStatsDb } from './db.js';

/**
 * Updates the stats for a SCP:SL server.
 *
 * If the server doesn't exist in the database, it will be created.
 */
export async function updateServerStats(
    serverId: string,
    newStats: Omit<ServerStats, '_id' | 'reportedAt'>,
): Promise<ServerStats> {
    const server = await getServerStatsDb().findOneAndUpdate(
        { _id: serverId },
        { $set: { ...newStats, reportedAt: Date.now() } },
        { upsert: true, returnDocument: 'after' },
    );

    if (server === null) {
        throw new Error(
            `Failed to update server stats for server ${serverId}, upsert returned null`,
        );
    }

    return server;
}
