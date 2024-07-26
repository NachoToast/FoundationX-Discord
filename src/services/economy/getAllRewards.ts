import { EconomyReward } from '../../public/EconomyReward.js';
import { EconomyRewardType } from '../../public/EconomyRewardType.js';

export function getAllRewards(): EconomyReward[] {
    const HARDCODED_REWARDS_WIP: Omit<
        EconomyReward,
        | 'id'
        | 'postedAt'
        | 'postedById'
        | 'lastUpdatedAt'
        | 'expiresAt'
        | 'type'
    >[] = [
        // MARK: Medical
        {
            title: 'Painkillers',
            subtitle: 'Slowly restores health over time.',
            description:
                'This bottle of painkillers will restore up to 50HP over the course of 15 seconds. Not approved by the FDA.',
            cost: 25,
            quantity: 1,
            image: 'painkillers',
            itemId: 34,
        },
        {
            title: 'First Aid Kit',
            subtitle: 'Heals your injuries.',
            description:
                'This 0.7kg first aid kit contains enough medical supplies to heal 65HP in less than 5 seconds!',
            cost: 50,
            quantity: 1,
            image: 'medkit',
            itemId: 14,
        },
        {
            title: 'Adrenaline',
            subtitle:
                'Provides a temporary health boost and a short burst of stamina.',
            description:
                "Don't worry - adrenaline has zero addictive properties!*\n*Study paid for by Permacura. Permacura: put your life in our hands.",
            cost: 68,
            quantity: 1,
            image: 'adrenaline',
            itemId: 33,
        },
        // MARK: Ammo
        {
            title: '9x19mm Ammo',
            subtitle: 'Several boxes of 9x19mm calibre bullets.',
            description:
                'Usable by the COM-15, COM-18, COM-45, Crossvec, and FSP-9.',
            cost: 50,
            quantity: 5,
            image: 'ammo_9',
            itemId: 29,
        },
        {
            title: '5.56x45mm Ammo',
            subtitle: 'Several boxes of 5.56x45mm calibre bullets.',
            description: 'Usable by the FR-MG-0 and MTF-E11-SR.',
            cost: 75,
            quantity: 5,
            image: 'ammo_5',
            itemId: 22,
        },
        {
            title: '7.62x39mm Ammo',
            subtitle: 'Several boxes of 7.62x39mm calibre bullets.',
            description: 'Usable by the A7, AK, and Logicer.',
            cost: 75,
            quantity: 5,
            image: 'ammo_7',
            itemId: 28,
        },
        {
            title: '12/70 Buckshot Ammo',
            subtitle: 'Several boxes of 12/70 calibre buckshot shells.',
            description: 'Exclusively used by the shotgun.',
            cost: 65,
            quantity: 5,
            image: 'ammo_buckshot',
            itemId: 19,
        },
        {
            title: '.44 Mag Ammo',
            subtitle: 'Several magazines of .44 calibre bullets.',
            description: 'Exclusively used by the .44 revolver.',
            cost: 60,
            quantity: 5,
            image: 'ammo_44',
            itemId: 27,
        },
        // Armor
        {
            title: 'Light Armour',
            subtitle: 'Reduces damage from bullets and grenades.',
            description: 'A lightweight vest that provides some protection.',
            cost: 25,
            quantity: 1,
            image: 'armour_light',
            itemId: 36,
        },
        {
            title: 'Combat Armour',
            subtitle: 'Reduces damage from bullets and grenades.',
            description:
                'A sturdy vest that provides decent protection, at the cost of stamina.',
            cost: 50,
            quantity: 1,
            image: 'armour_combat',
            itemId: 37,
        },
        {
            title: 'Heavy Armour',
            subtitle: 'Reduces damage from bullets and grenades',
            description:
                'A heavy, padded vest that provides excellent protection, but heavily reduces stamina.',
            cost: 75,
            quantity: 1,
            image: 'armour_heavy',
            itemId: 38,
        },
    ];

    return HARDCODED_REWARDS_WIP.map((e, i) => ({
        ...e,
        id: `temp-${i.toString()}`,
        postedAt: Date.now(),
        lastUpdatedAt: Date.now(),
        expiresAt: null,
        postedById: 'does-not-exist',
        type: EconomyRewardType.Item,
    }));
}
