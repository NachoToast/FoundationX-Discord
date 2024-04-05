import { Collection } from 'mongodb';
import { Levels, Stats, SteamLink } from '../Database';
export * from '../Database/SteamLink';

export type SteamModel = Collection<SteamLink>;

export type StatsModel = Collection<Stats>;

export type LevelsModel = Collection<Levels>;

export interface Models {
    steamModel: SteamModel;
    levelsModel?: LevelsModel;
    statsModel?: StatsModel;
}
