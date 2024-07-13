/* eslint-disable @typescript-eslint/naming-convention */
import { APIUser } from 'discord.js';
import { StrictUpdateFilter } from 'mongodb';
import { NotFoundError } from '../../classes/index.js';
import { User } from '../../types/index.js';
import { reverseUserDatabase } from './core/reverseUserDatabase.js';
import { getUserDb } from './core/userDatabase.js';

export async function updateExistingUser(
    steamId64: string,
    steamName: string,
    oldDiscordId?: string,
    discord?: APIUser,
    ip?: string,
): Promise<User> {
    const update: StrictUpdateFilter<User> = {
        $set: {
            username: steamName,
            'meta.lastSeenAt': Date.now(),
        },
    };

    if (discord) {
        update.$set = {
            ...update.$set,
            discord: {
                id: discord.id,
                username: discord.username,
                avatar: discord.avatar,
            },
        };
    } else {
        update.$unset = { discord: true };
    }

    if (ip) {
        update.$set = { ...update.$set, 'meta.latestIp': ip };
    }

    const updatedUser = await getUserDb().findOneAndUpdate(
        {
            _id: steamId64,
        },
        update,
        { returnDocument: 'after' },
    );

    if (updatedUser === null) {
        throw new NotFoundError(
            'User Not Found',
            'A user with the specified Steam ID does not exist.',
        );
    }

    if (discord) {
        reverseUserDatabase.handleUserModified(
            updatedUser,
            oldDiscordId,
            discord.id,
        );
    }

    return updatedUser;
}
