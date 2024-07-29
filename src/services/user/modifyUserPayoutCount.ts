import { ObjectId } from 'mongodb';
import { getUserDb } from './db.js';

export async function modifyUserPayoutCount(
    id: ObjectId,
    amount: number,
): Promise<void> {
    await getUserDb().updateOne(
        { _id: id },
        {
            $inc: {
                'economy.pendingPayouts': amount,
            },
        },
    );
}
