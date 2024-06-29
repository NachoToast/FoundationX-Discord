import { ServerStats } from './types/ServerStats.js';

const API_URL = 'https://api.scplist.kr/api/servers';

/** Fetches and parses server stats from a third-party API. */
export async function fetchServerStats(serverId: string): Promise<ServerStats> {
    try {
        const response = await fetch(`${API_URL}/${serverId}`, {
            headers: { Accept: 'application/json;charset=UTF-8' },
        });

        if (!response.ok) {
            return {
                online: 'ERROR',
                code: response.status.toString(),
            };
        }

        const data = await response.json();

        if (typeof data !== 'object' || data === null) {
            return {
                online: 'ERROR',
                code: 'INT-OBJ',
            };
        }

        if (!('online' in data) || typeof data.online !== 'boolean') {
            return {
                online: 'ERROR',
                code: 'INT-ONL',
            };
        }

        if (!('players' in data) || typeof data.players !== 'string') {
            return {
                online: 'ERROR',
                code: 'INT-PLA',
            };
        }

        const [playersOnline, playerCap] = data.players
            .split('/')
            .map((e) => Number(e));

        if (playersOnline === undefined || playerCap === undefined) {
            return {
                online: 'ERROR',
                code: 'INT-PLA2',
            };
        }

        if (!Number.isInteger(playersOnline) || !Number.isInteger(playerCap)) {
            return {
                online: 'ERROR',
                code: 'INT-PLA3',
            };
        }

        return {
            online: data.online,
            playersOnline,
            playerCap,
        };
    } catch (error) {
        if (!(error instanceof Error)) {
            throw error;
        }

        console.error(error);

        return {
            online: 'ERROR',
            code: `INT-${error.name}`,
        };
    }
}
