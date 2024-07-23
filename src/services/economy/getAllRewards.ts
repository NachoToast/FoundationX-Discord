import { EconomyReward } from '../../public/EconomyReward.js';
import { EconomyRewardType } from '../../public/EconomyRewardType.js';

export function getAllRewards(): EconomyReward[] {
    return [
        {
            id: 'temp-1',
            title: 'Medkit',
            subtitle: 'One Time',
            description:
                'This state-of-the-art medkit will heal you up and get you back in the fight!',
            image: 'medkit',
            cost: 59,
            postedAt: 1721713575499,
            postedById: 'does-not-exist',
            lastUpdatedAt: 1721713575499,
            expiresAt: 1722318420560,
            type: EconomyRewardType.Item,
            itemId: 0,
            quantity: 1,
        },
        {
            id: 'temp-2',
            title: 'Candy',
            subtitle: 'One Time',
            description:
                "Delicious mysterious candy, just don't ask what's in it.",
            image: 'candy',
            cost: 49,
            postedAt: 1721627272029,
            postedById: 'does-not-exist',
            lastUpdatedAt: 1721627272029,
            expiresAt: 1722318420560,
            type: EconomyRewardType.Item,
            itemId: 0,
            quantity: 1,
        },
        {
            id: 'temp-3',
            title: 'Jailbird',
            subtitle: 'One Time',
            description:
                'Channel your inner Half-Life 2 scientist with this revolutionary new invention!',
            image: 'jailbird',
            cost: 49,
            postedAt: 1721627272029,
            postedById: 'does-not-exist',
            lastUpdatedAt: 1721627272029,
            expiresAt: 1722318420560,
            type: EconomyRewardType.Item,
            itemId: 0,
            quantity: 1,
        },
        {
            id: 'temp-4',
            title: 'Medkit',
            subtitle: 'One Time',
            description: 'Boring old medkit.',
            image: 'medkit',
            cost: 59,
            postedAt: 1721627272029,
            postedById: 'does-not-exist',
            lastUpdatedAt: 1721627292029,
            expiresAt: 1722318420560,
            type: EconomyRewardType.Item,
            itemId: 0,
            quantity: 1,
        },
    ];
}
