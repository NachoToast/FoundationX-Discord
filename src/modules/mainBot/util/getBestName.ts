import { userMention } from 'discord.js';
import { UserDocument } from '../../../services/user/db.js';

export function getBestName(user: UserDocument): string {
    if (user.discord) {
        return userMention(user.discord.id);
    }

    if (user.steam) {
        return user.steam.username;
    }

    return '*Unknown*';
}
