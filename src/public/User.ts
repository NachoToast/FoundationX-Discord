import { DiscordIdString } from './DiscordIdString.js';
import { LogItem } from './LogItems.js';
import { SteamConnection } from './SteamConnection.js';
import { UserRank } from './UserRank.js';

export interface User {
    id: string;

    rank: UserRank;

    discord: {
        id?: DiscordIdString;

        username: string;

        avatar: string | null;

        lastUpdatedAt?: number;
    } | null;

    steam?: SteamConnection | null;

    manualSteamId?: string | null;

    otherSteamConnections?: SteamConnection[];

    economy: {
        balance: number;

        lifetimeBalance: number;

        lifetimePurchaseCount: number;
    };

    meta: {
        latestIp?: string | null;

        firstSeenAt: number;

        lastSeenAt: number;

        firstSeenAtDiscord?: number | null;

        lastSeenAtDiscord?: number | null;

        firstSeenAtSteam?: number | null;

        lastSeenAtSteam?: number | null;
    };

    actionsPerformedLog?: LogItem['id'][];

    actionsReceivedLog?: LogItem['id'][];
}
