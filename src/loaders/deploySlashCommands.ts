import { CommandDeployer } from '../classes/index.js';
import { allCommands } from '../commands/index.js';
import { TimeoutError, awaitOrTimeout, logAction } from './util/index.js';

/** Deploys slash commands for the main bot to Discord. */
export async function deploySlashCommands(): Promise<void> {
    const { production, mainBot } = AppGlobals.config;

    const startTime = Date.now();

    const commandDeployer = new CommandDeployer();

    let message: string;

    try {
        if (production) {
            await awaitOrTimeout(
                commandDeployer.deployGlobally(allCommands),
                mainBot.deployTimeout,
            );

            message = `Deployed ${allCommands.length.toString()} commands globally`;
        } else {
            const [deployedGuildCount] = await awaitOrTimeout(
                Promise.all([
                    commandDeployer.deployLocally(allCommands),
                    commandDeployer.deployGlobally([]),
                ]),
                mainBot.deployTimeout,
            );

            if (deployedGuildCount === -1) {
                message = `Skipped local deployment of ${allCommands.length.toString()} commands`;
            } else {
                message = `Deployed ${allCommands.length.toString()} commands locally to ${deployedGuildCount.toString()} guild${deployedGuildCount !== 1 ? 's' : ''}`;
            }
        }
    } catch (error) {
        if (!(error instanceof TimeoutError)) {
            throw error;
        }

        console.error(
            error.makeMessage(
                `deploy slash commands ${production ? 'globally' : 'locally'}`,
            ),
        );
        process.exit(1);
    }

    logAction('MainBot', message, startTime);
}
