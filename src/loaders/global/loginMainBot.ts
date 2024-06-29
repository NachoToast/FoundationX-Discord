import { ActivityType, Client, GatewayIntentBits } from 'discord.js';
import { Colour, Config } from '../../types/index.js';
import { TimeoutError, awaitOrTimeout, logAction } from '../util/index.js';

const INTENTS: GatewayIntentBits[] = [GatewayIntentBits.Guilds];

/** Creates a Discord bot instance for the main bot. */
export async function loginMainBot(config: Config): Promise<Client<true>> {
    const startTime = Date.now();

    const client = new Client<true>({
        intents: INTENTS,
    });

    try {
        const { token, loginTimeout } = config.mainBot;

        await awaitOrTimeout(client.login(token), loginTimeout);
    } catch (error) {
        if (!(error instanceof TimeoutError)) {
            throw error;
        }

        console.error(error.makeMessage('login to Discord'));
        process.exit(1);
    }

    client.user.setPresence({
        status: 'online',
        activities: [{ type: ActivityType.Competing, name: 'the tower' }],
    });

    logAction(
        'MainBot',
        `Logged in as ${Colour.FgCyan}${client.user.displayName}${Colour.Reset}`,
        startTime,
    );

    return client;
}
