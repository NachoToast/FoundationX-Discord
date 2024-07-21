import { LogAction } from './LogAction.js';
import { SteamConnection } from './SteamConnection.js';
import { User } from './User.js';
import { UserRank } from './UserRank.js';

export interface LogItem<T extends LogAction = LogAction> {
    id: string;

    doneById: User['id'];

    doneOnId: User['id'];

    doneAt: number;

    type: T;
}

export interface RankLog extends LogItem<LogAction.RankChange> {
    oldRank: UserRank;

    newRank: UserRank;
}

export interface ClearLog extends LogItem<LogAction.ClearLog> {
    numCleared: number;
}

export interface DiscordRefreshLog extends LogItem<LogAction.DiscordRefresh> {
    oldDiscord: User['discord'];

    oldSteamConections?: SteamConnection[];

    newDiscord: Omit<User['discord'], 'lastUpdatedAt'>;

    newSteamConnections?: SteamConnection[];
}
