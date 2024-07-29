import { StrictFilter, StrictUpdateFilter } from 'mongodb';
import { getUserDb, UserDocument } from './db.js';

export async function setBalanceDirect(
    discordId: string,
    balance: number,
): Promise<boolean> {
    const filter: StrictFilter<UserDocument> = { 'discord.id': discordId };

    const update: StrictUpdateFilter<UserDocument> = {
        $set: { 'economy.balance': balance },
    };

    const { modifiedCount } = await getUserDb().updateOne(filter, update);

    return modifiedCount === 1;
}
