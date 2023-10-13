import { Snowflake } from 'discord.js';

export interface StatsBot {
    /**
     * Discord Bot token for the main bot.
     * @example 'ABC123.DEF456...'
     */
    discordBotToken: Snowflake;

    serverId: string;
}
