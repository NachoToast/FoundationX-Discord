import { Collection } from 'mongodb';
import { Stats, SteamLink } from '../Database';
export * from '../Database/SteamLink';

export type SteamModel = Collection<SteamLink>;

export type StatsModel = Collection<Stats>;

export interface Models {
    steamModel: SteamModel;
    statsModel: StatsModel;
}
