import { DiscordIdString } from '../../public/DiscordIdString.js';
import { getPayoutDb, PayoutDocument } from './db.js';

export async function getPayoutsByDiscordId(
    discordId: DiscordIdString,
): Promise<PayoutDocument[]> {
    return await getPayoutDb().find({ userDiscordId: discordId }).toArray();
}
