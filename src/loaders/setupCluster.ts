import { Client } from 'discord.js';
import { ServerStatsService } from '../services/index.js';
import { Colour } from '../types/index.js';
import { TimeoutError, awaitOrTimeout, logAction } from './util/index.js';

/** Creates a Discord bot client for each cluster instance. */
export async function setupCluster(): Promise<void> {
    const { servers, expectedUpdateInterval, loginTimeout } =
        AppGlobals.config.serverStats;

    await Promise.all(
        Object.entriesT(servers).map(
            async ([serverId, { discordToken }], i) => {
                const startTime = Date.now();

                const client = new Client<true>({ intents: [] });

                try {
                    await awaitOrTimeout(
                        client.login(discordToken),
                        loginTimeout,
                    );

                    await ServerStatsService.updatePresence(client, serverId);
                } catch (error) {
                    if (!(error instanceof TimeoutError)) {
                        throw error;
                    }

                    console.error(
                        error.makeMessage(
                            `login with cluster bot ${(i + 1).toString()}`,
                        ),
                    );
                    process.exit(1);
                }

                logAction(
                    'Cluster',
                    `Instance ${(i + 1).toString()} logged in as ${Colour.FgCyan}${client.user.displayName}${Colour.Reset}`,
                    startTime,
                );

                setInterval(() => {
                    void ServerStatsService.updatePresence(client, serverId);
                }, 1_000 * expectedUpdateInterval);
            },
        ),
    );
}
