export interface User {
    /** SteamID64. */
    _id: string;

    username: string;

    discord?: {
        id: string;

        username: string;

        avatar: string | null;
    };

    economy: {
        balance: number;

        lifetimeBalance: number;

        lifetimePurchaseCount: number;
    };

    meta: {
        latestIp?: string;

        firstSeenAt: number;

        lastSeenAt: number;
    };
}
