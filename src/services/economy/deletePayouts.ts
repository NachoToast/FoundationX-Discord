import { ObjectId } from 'mongodb';
import { UserService } from '../index.js';
import { getPayoutDb, PayoutDocument } from './db.js';

async function decreasePayoutCounts(payouts: PayoutDocument[]): Promise<void> {
    const countsPerUserId = new Map<string, number>();

    for (const payout of payouts) {
        const existingCount = countsPerUserId.get(payout.userId) ?? 0;
        countsPerUserId.set(payout.userId, existingCount + 1);
    }

    const results = await Promise.allSettled(
        Array.from(countsPerUserId.entries()).map(([userId, count]) => {
            return UserService.modifyUserPayoutCount(
                new ObjectId(userId),
                -count,
            );
        }),
    );

    for (const result of results) {
        if (result.status === 'rejected') {
            console.error(result.reason);
        }
    }
}

export async function deletePayouts(idArray: string[]): Promise<void> {
    const targetIds = idArray.map((id) => new ObjectId(id));

    const payoutDb = getPayoutDb();

    const deletedItems = await payoutDb
        .find({ _id: { $in: targetIds } })
        .toArray();

    await Promise.all([
        payoutDb.deleteMany({ _id: { $in: targetIds } }),
        decreasePayoutCounts(deletedItems),
    ]);
}
