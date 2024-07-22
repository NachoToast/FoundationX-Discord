import { ObjectId, StrictUpdateFilter } from 'mongodb';
import { UserDocument, getUserDb } from './db.js';

/** Updates user metadata asynchronously. */
export function updateFromLogout(id: string, ip: string | null): void {
    const update: StrictUpdateFilter<UserDocument> = {
        $set: {
            'meta.latestIp': ip,
            'meta.lastSeenAt': Date.now(),
            'meta.lastSeenAtDiscord': Date.now(),
        },
    };

    getUserDb()
        .updateOne({ _id: new ObjectId(id) }, update)
        .catch((error: unknown) => {
            console.warn(
                `Failed to update user metadata for user ${id}:`,
                error,
            );
        });
}
