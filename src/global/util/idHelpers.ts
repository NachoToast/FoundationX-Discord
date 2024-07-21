import { WithId } from 'mongodb';

export function convertId<T extends WithId<unknown>>(
    document: T,
): Omit<T, '_id'> & { id: string } {
    const { _id, ...rest } = document;

    return { id: _id.toHexString(), ...rest };
}

export function removeId<T extends { _id: unknown }>(
    document: T,
): Omit<T, '_id'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...rest } = document;

    return rest;
}
