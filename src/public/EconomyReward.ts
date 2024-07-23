import { EconomyRewardType } from './EconomyRewardType.js';
import { User } from './User.js';

interface EconomyRewardBase<T extends EconomyRewardType> {
    id: string;

    title: string;

    subtitle: string;

    description: string;

    image: string;

    cost: number;

    postedAt: number;

    postedById: User['id'];

    lastUpdatedAt: number;

    expiresAt: number | null;

    type: T;
}

export interface ItemReward extends EconomyRewardBase<EconomyRewardType.Item> {
    itemId: number;

    quantity: number;
}

export type EconomyReward = ItemReward;
