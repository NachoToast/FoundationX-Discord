import { ActivityType, Client, PresenceStatusData } from 'discord.js';
import { fetchServerStats } from '../cluster/fetchServerStats';
import { Config } from '../types/Config';

const games: string[] = [
    'Age of Empires II',
    'Among Us',
    'Baldurs Gate 3',
    'Barotrauma',
    'Cities: Skylines',
    'Counter-Strike 2',
    'Crab Game',
    'Cult of the Lamb',
    'Cyberpunk 2077',
    'Dead by Daylight',
    'Deep Rock Galactic',
    'Destiny 2',
    'Elden Ring',
    'EVE Online',
    'Factorio',
    'Fall Guys',
    'Fortnite',
    'Frostpunk',
    'HITMAN 3',
    'Hollow Knight',
    'League of Legends',
    'Lethal Company',
    'Lost Ark',
    'Minecraft',
    'Outer Wilds',
    'Overwatch 2',
    'Palworld',
    'Portal 2',
    'Prison Architect',
    'Rimworld',
    'Roblox',
    'Rocket League',
    'Rust',
    'Satisfactory',
    'Skyrim',
    'Stardew Valley',
    'Stellaris',
    'Team Fortress 2',
    'Terraria',
    'THE FINALS',
    'Timberborn',
    'Town of Salem',
    'Unturned',
    'VR Chat',
    'Warframe',
];

function chooseRandomGame(): string {
    return games[Math.floor(Math.random() * games.length)];
}

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
            status: 'dnd',
        });
    } else if (stats.online) {
        let status: PresenceStatusData;
        switch (stats.playersOnline) {
            case 0:
                status = 'idle';
                break;
            case stats.playerCap:
                status = 'dnd';
                break;
            default:
                status = 'online';
                break;
        }

        if (status === 'idle' && Math.random() < 0.15) {
            bot.user.setPresence({
                activities: [
                    {
                        type: ActivityType.Playing,
                        name: chooseRandomGame(),
                    },
                ],
                status,
            });
        } else {
            bot.user.setPresence({
                activities: [
                    {
                        type: ActivityType.Watching,
                        name: `${stats.playersOnline}/${stats.playerCap}`,
                    },
                ],
                status,
            });
        }
    } else {
        bot.user.setPresence({
            activities: [
                {
                    type: ActivityType.Watching,
                    name: 'Offline',
                },
            ],
            status: 'invisible',
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
}
