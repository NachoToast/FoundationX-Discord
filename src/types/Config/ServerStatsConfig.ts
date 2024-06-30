interface ServerStatsInstance {
    authToken: string;

    discordToken: string;
}

export interface ServerStatsConfig {
    /**
     * Expected number of seconds between updates.
     *
     * A server is internally deemed 'offline' if an update is not received in
     * roughly this amount of time.
     */
    expectedUpdateInterval: number;

    /**
     * Time in seconds to wait for the bot to login before throwing an
     * error.
     *
     * Set to 0 for no timeout.
     */
    loginTimeout: number;

    /** Server IDs mapped to their respective auth tokens.*/
    servers: Record<string, ServerStatsInstance>;
}
