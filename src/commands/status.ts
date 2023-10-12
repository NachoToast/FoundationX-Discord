import dayjs, { extend } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Command } from '../types/Command';
import { Colour } from '../types/Utility';

extend(relativeTime);
function pingHint(ping: number): string {
    if (ping < 500) return 'good';
    if (ping < 1000) return 'ok';
    if (ping < 2000) return 'bad';
    if (ping < 3000) return 'very bad';
    return 'oh god';
}

export const statusCommand: Command = {
    name: 'status',
    description: "Sends information about the bot's status",
    async execute({ client, interaction, config }) {
        const ping = Math.abs(Date.now() - interaction.createdTimestamp);
        const apiLatency = Math.round(client.ws.ping);
        const uptime = dayjs(client.readyAt).fromNow(true);
        const memory = process.memoryUsage().heapUsed / 1024 ** 2;

        const output: string[] = [
            `${Colour.Bright}FoundationX Discord Bot${Colour.Reset}`,
            `Version: ${Colour.FgMagenta}${config.commit.slice(0, 7)}${
                Colour.Reset
            }`,
            `Uptime: ${Colour.FgGreen}${
                uptime[0].toUpperCase() + uptime.slice(1)
            }${Colour.Reset}`,
            `Latency: ${Colour.FgYellow}${ping}ms (${pingHint(ping)})${
                Colour.Reset
            }`,
            `API Latency: ${Colour.FgBlue}${apiLatency}ms${Colour.Reset}`,
            `Memory: ${Colour.FgCyan}${Math.ceil(memory)}${Colour.Reset} MB`,
        ];

        await interaction.reply({
            content: '> ```ansi\n> ' + output.join('\n> ') + '\n> ```',
        });
    },
};
