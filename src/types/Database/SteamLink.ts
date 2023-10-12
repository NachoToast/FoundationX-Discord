import { Snowflake } from 'discord.js';

export interface SteamLink {
    _id: Snowflake;
    steamId64: string;
}
