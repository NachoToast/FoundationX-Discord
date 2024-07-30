import { getUserDb, UserDocument } from './db.js';

export async function getTopEarners(
    isLifetime: boolean,
): Promise<UserDocument[]> {
    return await getUserDb()
        .find({}, { limit: 10 })
        .sort({
            [isLifetime ? 'economy.lifetimeBalance' : 'economy.balance']: -1,
        })
        .toArray();
}
