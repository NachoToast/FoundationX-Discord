import { Collection } from 'mongodb';
import { ServerStats } from '../../public/ServerStats.js';

let serverStatsDb: Collection<ServerStats> | null = null;

export function getServerStatsDb(): Collection<ServerStats> {
    return (serverStatsDb ??= AppGlobals.db.collection('server-stats'));
}
