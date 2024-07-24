import { Collection, WithId } from 'mongodb';
import { Payout } from '../../public/Payout.js';

export type PayoutDocument = WithId<Omit<Payout, 'id'>>;

let payoutDb: Collection<PayoutDocument> | null = null;

export function getPayoutDb(): Collection<PayoutDocument> {
    return (payoutDb ??= AppGlobals.db.collection('payouts'));
}
