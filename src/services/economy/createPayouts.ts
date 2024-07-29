import { ObjectId } from 'mongodb';
import { BrokeError } from '../../errors/BrokeError.js';
import { ForbiddenError } from '../../errors/ForbiddenError.js';
import { getUserDb, UserDocument } from '../user/db.js';
import { getPayoutDb, PayoutDocument } from './db.js';
import { getAllRewards } from './getAllRewards.js';

export async function createPayouts(
    user: UserDocument,
    rewardIds: string[],
): Promise<[PayoutDocument[], number]> {
    let userSteamId: string;

    const { steam, manualSteamId } = user;

    if (steam !== null) {
        userSteamId = steam.id;
    } else if (manualSteamId !== null) {
        userSteamId = manualSteamId;
    } else {
        throw new ForbiddenError(
            'Missing Steam Connection',
            'A Steam link is required to purchase rewards.',
        );
    }

    const relevantRewards = new Map(
        getAllRewards()
            .filter((e) => rewardIds.includes(e.id))
            .map((e) => [e.id, e]),
    );

    let requiredBalance = 0;

    for (const reward of relevantRewards.values()) {
        requiredBalance += reward.cost;
    }

    if (user.economy.balance < requiredBalance) {
        throw new BrokeError(user.economy.balance, requiredBalance);
    }

    const now = Date.now();

    let actualSpent = 0;

    const payouts = rewardIds
        .map<PayoutDocument | null>((id) => {
            const reward = relevantRewards.get(id);
            if (reward === undefined) return null;

            actualSpent += reward.cost;

            return {
                _id: new ObjectId(),
                purchasedAt: now,
                userId: user._id.toHexString(),
                userSteamId,
                userDiscordId: user.discord?.id ?? null,
                rewardId: reward.id,
                costPaid: reward.cost,
            } satisfies PayoutDocument;
        })
        .filter((x): x is PayoutDocument => x !== null);

    if (payouts.length === 0) {
        return [[], 0];
    }

    await Promise.all([
        getPayoutDb().insertMany(payouts),
        getUserDb().updateOne(
            { _id: user._id },
            { $inc: { 'economy.balance': -actualSpent } },
        ),
    ]);

    return [payouts, actualSpent];
}
