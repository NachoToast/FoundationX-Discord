import { Collection, Document } from 'mongodb';
import { InServerStats, OutServerStats } from '../../types/index.js';

interface ServerStatsDocument extends OutServerStats {
    /** ID of the server. */
    _id: string;
}

let serverStatsDb: Collection<ServerStatsDocument> | null = null;

function getServerStatsDb(): Collection<ServerStatsDocument> {
    return (serverStatsDb ??= AppGlobals.db.collection('server-stats'));
}

function stripId<T extends Document>(document: T): Omit<T, '_id'> {
    const partial: Omit<T, '_id'> & { _id?: T['_id'] } = document;
    delete partial._id;
    return partial;
}

export async function getServerStats(
    serverId: string,
): Promise<OutServerStats | null> {
    const result = await getServerStatsDb().findOne({ _id: serverId });

    return result && stripId(result);
}

export async function updateServerStats(
    serverId: string,
    stats: InServerStats,
): Promise<OutServerStats | null> {
    const result = await getServerStatsDb().findOneAndUpdate(
        { _id: serverId },
        { $set: { ...stats, reportedAt: Date.now() } },
        { upsert: true, returnDocument: 'after' },
    );

    return result && stripId(result);
}
