/** Statistics for a SCP: SL server that is tracked by our API. */
export interface ServerStats {
    /** SCP:SL server ID. */
    _id: string;

    /** Unix timestamp (ms). */
    reportedAt: number;

    playerCount: number;

    playerCap: number;
}
