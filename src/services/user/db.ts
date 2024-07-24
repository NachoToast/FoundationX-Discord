import { Collection, WithId } from 'mongodb';
import { DeepRequired } from '../../global/types/DeepRequired.js';
import { User } from '../../public/User.js';

export type UserDocument = WithId<Omit<DeepRequired<User>, 'id'>>;

let userDb: Collection<UserDocument> | null = null;

export function getUserDb(): Collection<UserDocument> {
    return (userDb ??= AppGlobals.db.collection('users'));
}
