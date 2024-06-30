import { Client } from 'discord.js';
import { decideBotStatus } from './decideBotStatus.js';
import { getServerStats } from './serverStatsDatabase.js';

export async function updatePresence(
    client: Client<true>,
    serverId: string,
): Promise<void> {
    const stats = await getServerStats(serverId);

    const presence = decideBotStatus(stats);

    client.user.setPresence(presence);
}
