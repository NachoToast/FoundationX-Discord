import { ObjectId } from 'mongodb';
import { getPayoutDb } from './db.js';

export async function deletePayouts(idArray: string[]): Promise<void> {
    const targetIds = idArray.map((id) => new ObjectId(id));

    await getPayoutDb().deleteMany({ _id: { $in: targetIds } });
}
