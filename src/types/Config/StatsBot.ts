import { Snowflake } from 'discord.js';

export interface StatsBot {
    /**
     * Discord Bot token for the main bot.
     * @example 'ABC123.DEF456...'
     */
    discordBotToken: Snowflake;

    /** SCP: Secret Lab account ID for this server. */
    accountId: string;

    /** SCP: Secret Lab API key for this server. */
    apiKey: string;
}
