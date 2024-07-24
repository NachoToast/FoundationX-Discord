import { SteamId64 } from '../../public/SteamId64.js';
import { getPayoutDb, PayoutDocument } from './db.js';

export async function getPayoutsBySteamId(
    steamIdArray: SteamId64[],
): Promise<PayoutDocument[]> {
    return await getPayoutDb()
        .find({ userSteamId: { $in: steamIdArray } })
        .toArray();
}
