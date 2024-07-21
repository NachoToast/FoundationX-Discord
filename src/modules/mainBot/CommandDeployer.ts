import {
    Client,
    OAuth2Guild,
    REST,
    RESTPostAPIApplicationCommandsJSONBody as RawSlashCommand,
    Routes,
    Snowflake,
} from 'discord.js';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Colour } from '../../global/types/Colour.js';

interface CommandDeploy {
    /** ID of the application that these commands were deployed to. */
    applicationId: Snowflake;

    /** Guild IDs that the commands were deployed to. */
    guilds: Snowflake[];

    /** Stringified deployed commands. */
    commands: string[];
}

/** A utility class for deploying slash commands to Discord. */
export class CommandDeployer {
    private readonly client: Client<true>;

    private readonly filePath: string;

    private readonly rest: REST;

    private readonly commands: RawSlashCommand[];

    public constructor(
        client: Client<true>,
        fileName: string,
        commands: RawSlashCommand[],
    ) {
        if (!existsSync('data')) {
            mkdirSync('data');
        }

        this.client = client;

        this.filePath = join('data', fileName);

        this.rest = new REST({ version: '10' }).setToken(client.token);

        this.commands = commands;
    }

    private get applicationId(): Snowflake {
        return this.client.application.id;
    }

    public async deploy(): Promise<string> {
        const numCommands = this.commands.length.toString();

        if (AppGlobals.config.production) {
            await this.deployGlobally();
            return `Deployed ${numCommands} commands globally`;
        }

        const numGuildsDeployed = await this.deployLocally();

        if (numGuildsDeployed === -1) {
            return `Skipped local deployment of ${numCommands} commands`;
        }

        return `Deployed ${numCommands} commands locally to ${numGuildsDeployed.toString()} guild${numGuildsDeployed !== 1 ? 's' : ''}`;
    }

    private canSkipLocalDeployment(guilds: OAuth2Guild[]): boolean {
        try {
            const previousDeployment = JSON.parse(
                readFileSync(this.filePath, 'utf-8'),
            ) as CommandDeploy;

            if (previousDeployment.applicationId !== this.applicationId) {
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

            if (this.commands.length !== oldCommands.size) {
                // Early exit: The number of commands has changed.
                return false;
            }

            for (const command of this.commands) {
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

    private setPreviousDeployment(guilds: OAuth2Guild[]): void {
        try {
            const payload: CommandDeploy = {
                applicationId: this.applicationId,
                guilds: guilds.map((e) => e.id),
                commands: this.commands.map((e) => JSON.stringify(e)),
            };

            writeFileSync(this.filePath, JSON.stringify(payload), 'utf-8');
        } catch {
            //
        }
    }

    private async deployGlobally(): Promise<void> {
        await this.rest.put(Routes.applicationCommands(this.applicationId), {
            body: this.commands,
        });
    }

    private async deployLocally(): Promise<number> {
        const fetchedGuilds = await this.client.guilds.fetch();

        const allGuilds = Array.from(fetchedGuilds.values());

        if (this.canSkipLocalDeployment(allGuilds)) {
            return -1;
        }

        const deployments = await Promise.all(
            allGuilds.map((guild) => this.deployToGuild(guild)),
        );

        const deployedGuilds = allGuilds.filter((_, i) => deployments[i]);

        this.setPreviousDeployment(deployedGuilds);

        return deployedGuilds.length;
    }

    private async deployToGuild(guild: OAuth2Guild): Promise<boolean> {
        try {
            await this.rest.put(
                Routes.applicationGuildCommands(this.applicationId, guild.id),
                { body: this.commands },
            );

            return true;
        } catch (error) {
            const verb = this.commands.length === 0 ? 'undeploy' : 'deploy';

            console.warn(
                `Failed to ${verb} commands to ${Colour.FgMagenta}${guild.name}${Colour.Reset}`,
                error,
            );

            return false;
        }
    }
}
