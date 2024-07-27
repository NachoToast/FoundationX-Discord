import { getUserDb, UserDocument } from './db.js';

export async function getTopEarners(): Promise<UserDocument[]> {
    return await getUserDb()
        .find({}, { limit: 10 })
        .sort({ 'economy.balance': -1 })
        .toArray();
}
