import { LogItemType } from './LogItemType.js';
import { SteamConnection } from './SteamConnection.js';
import { User } from './User.js';
import { UserRank } from './UserRank.js';

export interface LogItem<T extends LogItemType = LogItemType> {
    id: string;

    doneById: User['id'];

    doneOnId: User['id'];

    doneAt: number;

    type: T;
}

export interface RankLog extends LogItem<LogItemType.RankChange> {
    oldRank: UserRank;

    newRank: UserRank;
}

export interface ClearLog extends LogItem<LogItemType.ClearLog> {
    numCleared: number;
}

export interface DiscordRefreshLog extends LogItem<LogItemType.DiscordRefresh> {
    oldDiscord: User['discord'];

    oldSteamConections?: SteamConnection[];

    newDiscord: Omit<User['discord'], 'lastUpdatedAt'>;

    newSteamConnections?: SteamConnection[];
}
