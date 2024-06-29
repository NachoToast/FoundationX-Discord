import { HexColorString, Snowflake } from 'discord.js';
import { ClusterBot } from './ClusterBot.js';
import { ReactRole } from './ReactRole.js';

/** Expected values from the `.env` file. */
export interface Config {
    /**
     * Whether to run in 'production' mode.
     *
     * Note that commands will be deployed globally if this is true.
     */
    production: boolean;

    /** ID of the user to ping when an error occurrs. */
    developerUserId?: Snowflake;

    mainBot: {
        embedColour: HexColorString;

        token: string;

        /**
         * Time in seconds to wait for the bot to login before throwing an
         * error.
         *
         * Set to 0 for no timeout.
         */
        loginTimeout: number;

        /**
         * Time in seconds to wait for the bot to deploy commands before
         * throwing an error.
         *
         * Set to 0 for no timeout.
         */
        deployTimeout: number;

        reactRoles: {
            guildId: Snowflake;

            channelId: Snowflake;

            roles: Record<Snowflake, ReactRole>;
        };
    };

    cluster: {
        /** Stats refetch interval in seconds. */
        updateInterval: number;

        /**
         * Time in seconds to wait for the bot to login before throwing an
         * error.
         *
         * Set to 0 for no timeout.
         */
        loginTimeout: number;

        bots: ClusterBot[];
    };

    webApi: {
        /** Port that the web API will listen on. */
        port: number;

        /**
         * CORS origins to allow.
         *
         * Websites with any of these URLs can make requests to the server
         * without having their browser throw a security error.
         *
         * The wildcard '*' can be used to allow all origins.
         */
        clientUrls: string[];

        /**
         * Maximum number of requests a client can make to the server over a
         * minute.
         *
         * Set to 0 for no limit.
         */
        rateLimit: number;

        /**
         * Number of proxy servers between server and client (Cloudflare, AWS,
         * NGINX, etc.).
         *
         * Use the `/ip` endpoint to check this value is correct.
         *
         * For more info see:
         * https://express-rate-limit.mintlify.app/guides/troubleshooting-proxy-issues
         */
        proxyCount: number;
    };

    mongoDb: {
        /** MongoDB connection URI. */
        uri: string;

        dbName: string;

        /**
         * Time in seconds to wait to connect to the MongoDB database before
         * throwing an error.
         *
         * Set to 0 for no timeout.
         */
        connectTimeout: number;
    };
}
