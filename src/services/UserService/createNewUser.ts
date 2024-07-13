import { APIUser } from 'discord.js';
import { User } from '../../types/index.js';
import { reverseUserDatabase } from './core/reverseUserDatabase.js';
import { getUserDb } from './core/userDatabase.js';

export async function createNewUser(
    steamId64: string,
    steamName: string,
    discord?: APIUser,
    ip?: string,
): Promise<User> {
    const newUser: User = {
        _id: steamId64,
        username: steamName,

        economy: {
            balance: 0,
            lifetimeBalance: 0,
            lifetimePurchaseCount: 0,
        },

        meta: {
            firstSeenAt: Date.now(),
            lastSeenAt: Date.now(),
        },
    };

    if (discord) {
        newUser.discord = {
            id: discord.id,
            username: discord.username,
            avatar: discord.avatar,
        };
    }

    if (ip) {
        newUser.meta.latestIp = ip;
    }

    await getUserDb().insertOne(newUser);

    if (discord) {
        reverseUserDatabase.handleUserAdded(newUser, discord.id);
    }

    return newUser;
}
