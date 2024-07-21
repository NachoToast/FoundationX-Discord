import { ChatInputCommandInteraction, TimestampStyles } from 'discord.js';
import { Command } from './Command.js';

export class StatusCommand extends Command {
    public constructor() {
        super('status', 'Check the status of the bot.');
    }

    private static pingHint(ping: number): string {
        if (ping < 500) return 'good';
        if (ping < 1000) return 'ok';
        if (ping < 2000) return 'bad';
        if (ping < 3000) return 'very bad';
        return 'oh god';
    }

    private static relativeTime(timestamp: number): string {
        return `<${TimestampStyles.ShortTime}:${Math.floor(
            timestamp / 1000,
        ).toString()}:${TimestampStyles.RelativeTime}>`;
    }

    public override async onInvoke(
        interaction: ChatInputCommandInteraction,
    ): Promise<void> {
        const ping = Math.abs(Date.now() - interaction.createdTimestamp);
        const apiLatency = Math.round(interaction.client.ws.ping);
        const started = AppGlobals.startTime.getTime();
        const memory = Math.ceil(process.memoryUsage().heapUsed / 1024 ** 2);

        const output: string[] = [
            `**FoundationX Discord Bot**`,
            `Started: ${StatusCommand.relativeTime(started)}`,
            `Latency: ${ping.toLocaleString()}ms (${StatusCommand.pingHint(ping)})`,
            `API Latency: ${apiLatency.toLocaleString()}ms`,
            `Memory: ${memory.toLocaleString()} MB`,
        ];

        await interaction.reply(output.join('\n> '));
    }
}
