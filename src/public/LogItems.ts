import { LogItemType } from './LogItemType.js';
import { SteamConnection } from './SteamConnection.js';
import { User } from './User.js';
import { UserRank } from './UserRank.js';

interface LogItemBase<T extends LogItemType> {
    id: string;

    doneById: User['id'];

    doneOnId: User['id'];

    doneAt: number;

    type: T;
}

export interface RankLog extends LogItemBase<LogItemType.RankChange> {
    oldRank: UserRank;

    newRank: UserRank;
}

export interface ClearLog extends LogItemBase<LogItemType.ClearLog> {
    numCleared: number;
}

export interface DiscordRefreshLog
    extends LogItemBase<LogItemType.DiscordRefresh> {
    oldDiscord: User['discord'];

    oldSteamConections?: SteamConnection[];

    newDiscord: Omit<User['discord'], 'lastUpdatedAt'>;

    newSteamConnections?: SteamConnection[];
}

export type LogItem = RankLog | ClearLog | DiscordRefreshLog;
