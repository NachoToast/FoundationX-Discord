import { MongoClient } from 'mongodb';
import { Config } from '../types/Config';
import { Levels, Stats } from '../types/Database';
import { Models, SteamLink } from '../types/Models';

interface LoadMongoReturn extends Models {
    steamClient: MongoClient;
    statsClient: MongoClient;
}

async function loadSteamMongo(
    config: Config['steamLinking'],
): Promise<Pick<LoadMongoReturn, 'steamModel' | 'steamClient'>> {
    const steamClient = await new MongoClient(config.mongoURI).connect();

    const db = steamClient.db(config.mongoDbName);

    const steamModel = db.collection<SteamLink>('steam');

    return { steamModel, steamClient };
}

async function loadStatsAndLevelsMongo(
    config: Config['mainBot']['stats'],
): Promise<
    Pick<LoadMongoReturn, 'statsModel' | 'levelsModel' | 'statsClient'>
> {
    const statsClient = await new MongoClient(config.mongoURI).connect();

    const db = statsClient.db(config.mongoDbName);

    const statsModel = db.collection<Stats>('Stats');
    const levelsModel = db.collection<Levels>('PlayerLevels');

    return { statsModel, levelsModel, statsClient };
}

export async function loadMongo(config: Config): Promise<LoadMongoReturn> {
    const [steamMongoData, statsMongoData] = await Promise.all([
        loadSteamMongo(config.steamLinking),
        loadStatsAndLevelsMongo(config.mainBot.stats),
    ]);

    console.log('Connected to MongoDB');

    return { ...steamMongoData, ...statsMongoData };
}
