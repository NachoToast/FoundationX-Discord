import { ActivityType, PresenceData, PresenceStatusData } from 'discord.js';
import { OutServerStats } from '../../types/index.js';
import { chooseRandomGame } from './chooseRandomGame.js';

const IDLE_GAME_CHANCE = 0.15;

const BUFFER_SECONDS = 10;

const OFFLINE_STATE: PresenceData = {
    activities: [{ type: ActivityType.Watching, name: 'Offline' }],
    status: 'invisible',
};

export function decideBotStatus(stats: OutServerStats | null): PresenceData {
    if (stats === null) {
        return OFFLINE_STATE;
    }

    /** Seconds since last reported. */
    const timeSinceReport = Math.floor((Date.now() - stats.reportedAt) / 1_000);

    if (
        timeSinceReport >
        AppGlobals.config.serverStats.expectedUpdateInterval + BUFFER_SECONDS
    ) {
        // If the server hasn't reported in a while, show as offline.
        return OFFLINE_STATE;
    }

    // Otherwise the server is online.

    let status: PresenceStatusData;

    switch (stats.playerCount) {
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
                name: `${stats.playerCount.toString()}/${stats.playerCap.toString()}`,
            },
        ],
        status,
    };
}
