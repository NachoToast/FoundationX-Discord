import { PaginationParams, WithPagination } from '../../public/Pagination.js';
import { ServerStats } from '../../public/ServerStats.js';
import { getServerStatsDb } from './db.js';

/** Fetches the stats of all SCP:SL servers in the database. */
export async function getAllServerStats({
    page,
    perPage,
}: PaginationParams): Promise<WithPagination<ServerStats>> {
    const statsDb = getServerStatsDb();

    const [totalItemCount, items] = await Promise.all([
        statsDb.countDocuments(),
        statsDb.find({}, { limit: perPage, skip: page * perPage }).toArray(),
    ]);

    return {
        totalItemCount,
        items,
    };
}
