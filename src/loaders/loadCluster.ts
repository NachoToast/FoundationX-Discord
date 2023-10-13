import { ActivityType, Client } from 'discord.js';
import { fetchServerStats } from '../cluster/fetchServerStats';
import { Config } from '../types/Config';

async function clusterUpdate(
    bot: Client<true>,
    serverId: string,
): Promise<void> {
    const stats = await fetchServerStats(serverId);
    if (stats.online === 'ERROR') {
        bot.user.setPresence({
            activities: [
                {
                    type: ActivityType.Watching,
                    name:
                        stats.code !== undefined
                            ? `Error ${stats.code}`
                            : 'Unknown Error',
                },
            ],
            status: 'idle',
        });
    } else if (stats.online) {
        bot.user.setPresence({
            activities: [
                {
                    type: ActivityType.Watching,
                    name: `${stats.playersOnline}/${stats.playerCap}`,
                },
            ],
            status: stats.playersOnline === stats.playerCap ? 'dnd' : 'online',
        });
    } else {
        bot.user.setPresence({
            activities: [
                {
                    type: ActivityType.Watching,
                    name: 'Offline',
                },
            ],
            status: 'idle',
        });
    }
}

export async function loadCluster(config: Config): Promise<void> {
    const clusters = await Promise.all(
        config.cluster.map(async (cluster, i) => {
            const client = new Client<true>({ intents: [] });
            await client.login(cluster.discordBotToken);
            console.log(`Cluster-${i}${client.user.displayName} logged in`);
            return client;
        }),
    );

    for (let i = 0; i < clusters.length; i++) {
        const cluster = clusters[i];
        clusterUpdate(cluster, config.cluster[i].serverId).catch(console.error);
        setInterval(
            () =>
                void clusterUpdate(cluster, config.cluster[i].serverId).catch(
                    () => null,
                ),
            1000 * 60,
        );
    }

    await fetchServerStats(config.cluster[0].serverId);
}
