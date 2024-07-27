import { StrictMatchKeysAndValues } from 'mongodb';
import { DiscordIdString } from '../../public/DiscordIdString.js';
import { getUserDb, UserDocument } from './db.js';

interface RankedUser extends UserDocument {
    rankingForStat: number;
}

export async function getRank(
    id: DiscordIdString,
    key: keyof StrictMatchKeysAndValues<UserDocument>,
): Promise<RankedUser | null> {
    const aggregate = getUserDb().aggregate<RankedUser>([
        {
            $setWindowFields: {
                sortBy: { [key]: -1 },
                output: {
                    rank: { $rank: {} },
                },
            },
        },
        {
            $match: { 'discord.id': id },
        },
    ]);

    return await aggregate.next();
}
