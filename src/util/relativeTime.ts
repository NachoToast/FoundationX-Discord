import { TimestampStyles } from 'discord.js';

export function relativeTime(timestamp: number): string {
    return `<${TimestampStyles.ShortTime}:${Math.floor(
        timestamp / 1000,
    ).toString()}:${TimestampStyles.RelativeTime}>`;
}
