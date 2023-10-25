import {
    Client,
    REST,
    RESTPostAPIApplicationCommandsJSONBody as RawSlashCommand,
    Routes,
    SlashCommandBuilder,
} from 'discord.js';
import { StatsCollector } from '../../statsCollector';
import { Config } from '../../types/Config';
import { Colour } from '../../types/Utility';
import { commandMap } from './commandMap';

/** Deploys slash commands globally (to all servers), for production use. */
async function deployGlobally(
    rest: REST,
    body: RawSlashCommand[],
    applicationId: string,
): Promise<void> {
    try {
        await rest.put(Routes.applicationCommands(applicationId), {
            body,
        });
    } catch (error) {
        const verb = body.length === 0 ? 'undeploy' : 'deploy';
        console.log(`Failed to ${verb} slash commands globally`, error);
    }
}

/** Deploys slash commands to a single guild, for non-production use. */
async function deployToGuild(
    rest: REST,
    body: RawSlashCommand[],
    applicationId: string,
    guildId: string,
): Promise<void> {
    try {
        await rest.put(
            Routes.applicationGuildCommands(applicationId, guildId),
            { body },
        );
    } catch (error) {
        const verb = body.length === 0 ? 'undeploy' : 'deploy';
        console.log(
            `Failed to ${verb} slash commands to guild ${guildId}`,
            error,
        );
    }
}

async function deployToAllGuilds(
    rest: REST,
    body: RawSlashCommand[],
    applicationId: string,
    client: Client<true>,
): Promise<void> {
    const guilds = await client.guilds.fetch();

    await Promise.all(
        guilds.map(async (guild) => {
            await deployToGuild(rest, body, applicationId, guild.id);
        }),
    );
}

/** Deploys and undeploys slash commands depending on Node environment. */

export async function deployCommands(
    client: Client<true>,
    config: Config,
    statsCollector: StatsCollector,
): Promise<void> {
    const rest = new REST({ version: '10' }).setToken(
        config.mainBot.discordBotToken,
    );
    const applicationId = client.user.id;

    const commands = Array.from(commandMap.values()).map((command) => {
        const builtCommand = new SlashCommandBuilder()
            .setName(command.name)
            .setDescription(command.description);
        command.build?.(builtCommand, {
            client,
            config,
            commands: commandMap,
            statsCollector,
        });
        builtCommand.setDMPermission(false);
        return builtCommand.toJSON();
    });

    if (config.production) {
        await deployGlobally(rest, commands, applicationId);
        console.log(
            `${Colour.FgYellow}Successfully deployed ${commands.length} slash commands globally${Colour.Reset}`,
        );
    } else {
        await Promise.all([
            deployGlobally(rest, [], applicationId),
            deployToAllGuilds(rest, commands, applicationId, client),
        ]);
    }
}
