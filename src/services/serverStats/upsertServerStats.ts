import { ServerStats } from '../../public/ServerStats.js';
import { getServerStatsDb } from './db.js';

/**
 * Updates the stats for a SCP:SL server.
 *
 * If the server doesn't exist in the database, it will be created.
 */
export async function upsertServerStats(
    serverId: string,
    newStats: Omit<ServerStats, '_id' | 'reportedAt'>,
): Promise<void> {
    await getServerStatsDb().updateOne(
        { _id: serverId },
        { $set: { ...newStats, reportedAt: Date.now() } },
        { upsert: true },
    );
}
