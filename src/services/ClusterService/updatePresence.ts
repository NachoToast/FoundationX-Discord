import { Client } from 'discord.js';
import { decideBotStatus } from './decideBotStatus.js';
import { fetchServerStats } from './fetchServerStats.js';

export async function updatePresence(
    client: Client<true>,
    serverId: string,
): Promise<void> {
    const stats = await fetchServerStats(serverId);

    const presence = decideBotStatus(stats);

    client.user.setPresence(presence);
}
