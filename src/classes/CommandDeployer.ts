import {
    OAuth2Guild,
    REST,
    RESTPostAPIApplicationCommandsJSONBody as RawSlashCommand,
    Routes,
    SlashCommandBuilder,
    Snowflake,
} from 'discord.js';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Colour, SlashCommand } from '../types/index.js';

export interface CommandDeploy {
    /** ID of the bot that these commands were deployed to. */
    id: Snowflake;

    /** Guild IDs that the commands were deployed to. */
    guilds: Snowflake[];

    commands: string[];
}

/** A utility class for deploying slash commands to Discord. */
export class CommandDeployer {
    private static readonly FILE = join('data', 'latestCommandDeploy.json');

    private readonly rest: REST;

    public constructor() {
        this.rest = new REST({ version: '10' }).setToken(
            AppGlobals.client.token,
        );
    }

    private static get applicationId(): string {
        return AppGlobals.client.user.id;
    }

    public static canSkipLocalDeployment(
        commands: RawSlashCommand[],
        guilds: OAuth2Guild[],
    ): boolean {
        try {
            const previousDeployment = JSON.parse(
                readFileSync(this.FILE, 'utf-8'),
            ) as CommandDeploy;

            if (previousDeployment.id !== this.applicationId) {
                return false;
            }

            const oldGuilds = new Set(previousDeployment.guilds);

            if (guilds.length > oldGuilds.size) {
                // Early exit: A new guild has obviously been added.
                return false;
            }

            for (const guild of guilds) {
                if (!oldGuilds.has(guild.id)) {
                    return false;
                }
            }

            // No new guilds, so check if commands are the same.

            const oldCommands = new Set(previousDeployment.commands);

            if (commands.length !== oldCommands.size) {
                // Early exit: The number of commands has changed.
                return false;
            }

            for (const command of commands) {
                if (!oldCommands.has(JSON.stringify(command))) {
                    return false;
                }
            }

            // No new commands either, so we can skip deployment.
            return true;
        } catch (error) {
            return false;
        }
    }

    private static setPreviousDeployment(
        commands: RawSlashCommand[],
        guilds: OAuth2Guild[],
    ): void {
        try {
            const payload: CommandDeploy = {
                id: this.applicationId,
                guilds: guilds.map((e) => e.id),
                commands: commands.map((e) => JSON.stringify(e)),
            };

            writeFileSync(this.FILE, JSON.stringify(payload), 'utf-8');
        } catch (error) {
            //
        }
    }

    private static serialise(commands: SlashCommand[]): RawSlashCommand[] {
        return commands.map((e) => {
            const command = new SlashCommandBuilder()
                .setName(e.name)
                .setDescription(e.description)
                .setDMPermission(false);

            e.build?.(command);

            return command.toJSON();
        });
    }

    public async deployGlobally(commands: SlashCommand[]): Promise<void> {
        await this.rest.put(
            Routes.applicationCommands(CommandDeployer.applicationId),
            {
                body: CommandDeployer.serialise(commands),
            },
        );
    }

    public async deployLocally(commands: SlashCommand[]): Promise<number> {
        const rawCommands = CommandDeployer.serialise(commands);

        const allGuilds = Array.from(
            (await AppGlobals.client.guilds.fetch()).values(),
        );

        if (CommandDeployer.canSkipLocalDeployment(rawCommands, allGuilds)) {
            return -1;
        }

        const deployments = await Promise.all(
            allGuilds.map((guild) => this.deployToGuild(guild, rawCommands)),
        );

        const deployedGuilds = allGuilds.filter((_, i) => deployments[i]);

        CommandDeployer.setPreviousDeployment(rawCommands, deployedGuilds);

        return deployedGuilds.length;
    }

    private async deployToGuild(
        guild: OAuth2Guild,
        body: RawSlashCommand[],
    ): Promise<boolean> {
        try {
            await this.rest.put(
                Routes.applicationGuildCommands(
                    CommandDeployer.applicationId,
                    guild.id,
                ),
                { body },
            );

            return true;
        } catch (error) {
            const verb = body.length === 0 ? 'undeploy' : 'deploy';

            console.error(
                `Failed to ${verb} commands to ${Colour.FgMagenta}${guild.name}${Colour.Reset}`,
                error,
            );

            return false;
        }
    }
}
