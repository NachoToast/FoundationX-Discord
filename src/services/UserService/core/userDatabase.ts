import { Collection } from 'mongodb';
import { User } from '../../../types/index.js';

let userDb: Collection<User> | null = null;

export function getUserDb(): Collection<User> {
    return (userDb ??= AppGlobals.db.collection('users'));
}
