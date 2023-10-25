import { ActivityType, Client, GatewayIntentBits } from 'discord.js';
import { deployCommands, registerCommandHandlers } from '../commands';
import { setupReactRoles } from '../reactRoles';
import { StatsCollector } from '../statsCollector';
import { Config } from '../types/Config';
import { Models } from '../types/Models';
import { Colour } from '../types/Utility';

export async function loadMainBot(
    config: Config,
    models: Models,
    statsCollector: StatsCollector,
): Promise<Client<true>> {
    const client = new Client<true>({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    });

    await client.login(config.mainBot.discordBotToken);

    console.log(
        `Logged in as ${Colour.FgMagenta}${client.user.username}${Colour.Reset}`,
    );

    client.user.setPresence({
        status: 'online',
        activities: [{ type: ActivityType.Competing, name: 'the tower' }],
    });

    await Promise.all([
        deployCommands(client, config, statsCollector),
        setupReactRoles(client, config.mainBot.reactRoles),
    ]);

    registerCommandHandlers(client, models, config, statsCollector);

    return client;
}
