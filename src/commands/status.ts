import { SlashCommand } from '../types/index.js';
import { relativeTime } from '../util/relativeTime.js';

function pingHint(ping: number): string {
    if (ping < 500) return 'good';
    if (ping < 1000) return 'ok';
    if (ping < 2000) return 'bad';
    if (ping < 3000) return 'very bad';
    return 'oh god';
}

export const statusCommand: SlashCommand = {
    name: 'status',
    description: "Get information about the bot's status",
    async onInvoke({ interaction }) {
        const { client, startTime, commit } = AppGlobals;

        const ping = Math.abs(Date.now() - interaction.createdTimestamp);
        const apiLatency = Math.round(client.ws.ping);
        const started = startTime.getTime();
        const memory = Math.ceil(process.memoryUsage().heapUsed / 1024 ** 2);

        const output: string[] = [
            `**FoundationX Discord Bot**`,
            `Version: *unknown*`,
            `Started: ${relativeTime(started)}`,
            `Latency: ${ping.toLocaleString()}ms (${pingHint(ping)})`,
            `API Latency: ${apiLatency.toLocaleString()}ms`,
            `Memory: ${memory.toLocaleString()} MB`,
        ];

        if (commit !== null) {
            output[1] = `Version: [${commit.slice(0, 7)}](<https://github.com/NachoToast/FoundationX-API/commit/${commit}>)`;
        }

        await interaction.reply(output.join('\n> '));
    },
};
