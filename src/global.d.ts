import { Db } from 'mongodb';
import { Config } from './global/types/Config.ts';

declare global {
    declare interface Error {
        code?: unknown;
    }

    declare interface ObjectConstructor {
        /** {@link Object.keys} but type-aware. */
        keysT<T extends object>(obj: T): (keyof T)[];

        /** {@link Object.values} but type-aware. */
        valuesT<T extends object>(obj: T): T[keyof T][];

        /** {@link Object.entries} but type-aware. */
        entriesT<T extends object>(obj: T): [keyof T, T[keyof T]][];

        /** {@link Object.fromEntries} but type-aware, records only. */
        fromEntriesT<T, K>(entries: Iterable<[T, K]>): Record<T, K>;
    }

    // eslint-disable-next-line no-var
    var AppGlobals: {
        readonly config: Config;

        readonly db: Db;

        readonly startTime: Date;
    };
}
