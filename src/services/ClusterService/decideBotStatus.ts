import { ActivityType, PresenceData, PresenceStatusData } from 'discord.js';
import { chooseRandomGame } from './chooseRandomGame.js';
import { ServerStats } from './types/ServerStats.js';

const IDLE_GAME_CHANCE = 0.15;

export function decideBotStatus(stats: ServerStats): PresenceData {
    if (stats.online === 'ERROR') {
        // If the API errored (or gave us an invalid response), show the
        // relevant error code.
        return {
            activities: [
                {
                    type: ActivityType.Watching,
                    name: `Error ${stats.code}`,
                },
            ],
            status: 'dnd',
        };
    }

    if (!stats.online) {
        // If the server is offline, become invisible.
        return {
            activities: [{ type: ActivityType.Watching, name: 'Offline' }],
            status: 'invisible',
        };
    }

    // Otherwise the server is online.

    let status: PresenceStatusData;

    switch (stats.playersOnline) {
        case 0:
            status = 'idle'; // An empty server shows as idle.
            break;
        case stats.playerCap:
            status = 'dnd'; // A full server shows as do not disturb.
            break;
        default:
            status = 'online'; // A partially full server shows as online.
            break;
    }

    if (status === 'idle' && Math.random() < IDLE_GAME_CHANCE) {
        return {
            activities: [
                {
                    type: ActivityType.Playing,
                    name: chooseRandomGame(),
                },
            ],
        };
    }

    return {
        activities: [
            {
                type: ActivityType.Watching,
                name: `${stats.playersOnline.toString()}/${stats.playerCap.toString()}`,
            },
        ],
        status,
    };
}
