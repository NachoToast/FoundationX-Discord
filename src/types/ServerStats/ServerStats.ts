export interface OutServerStats {
    reportedAt: number;

    playerCount: number;

    playerCap: number;
}

export type InServerStats = Omit<OutServerStats, 'reportedAt'>;
