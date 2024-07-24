import { DiscordIdString } from './DiscordIdString.js';
import { EconomyReward } from './EconomyReward.js';
import { SteamId64 } from './SteamId64.js';
import { User } from './User.js';

export interface Payout {
    id: string;

    userId: User['id'];

    userSteamId: SteamId64;

    userDiscordId: DiscordIdString | null;

    rewardId: EconomyReward['id'];

    costPaid: number;
}
