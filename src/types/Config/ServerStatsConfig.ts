export interface ServerStatsConfig {
    /**
     * Expected number of seconds between updates.
     *
     * A server is internally deemed 'offline' if an update is not received in
     * roughly this amount of time.
     */
    expectedUpdateInterval: number;

    /** Server IDs mapped to their respective auth tokens.*/
    servers: Record<string, string>;
}
