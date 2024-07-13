import { Collection } from 'mongodb';
import { User } from '../../../types/index.js';

interface ReverseUser {
    /** Discord user ID. */
    _id: string;

    steamId64: string;
}

let reverseUserDb: Collection<ReverseUser> | null = null;

function getReverseUserDb(): Collection<ReverseUser> {
    return (reverseUserDb ??= AppGlobals.db.collection('reverseUsers'));
}

function handleUserAdded(user: User, discordId: string): void {
    getReverseUserDb()
        .insertOne({
            _id: discordId,
            steamId64: user._id,
        })
        .catch((error: unknown) => {
            console.log(error);
        });
}

function handleUserModified(
    user: User,
    oldDiscordId?: string,
    newDiscordId?: string,
): void {
    if (oldDiscordId === newDiscordId) return;

    const promiseArr: Promise<unknown>[] = [
        getReverseUserDb().deleteOne({ _id: oldDiscordId }),
    ];

    if (newDiscordId) {
        promiseArr.push(
            getReverseUserDb().insertOne({
                _id: newDiscordId,
                steamId64: user._id,
            }),
        );
    }

    Promise.all(promiseArr).catch((error: unknown) => {
        console.log(error);
    });
}

export const reverseUserDatabase = {
    handleUserAdded,
    handleUserModified,
};
