import { MongoClient } from 'mongodb';
import { Config } from '../types/Config';
import { Stats } from '../types/Database';
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

async function loadStatsMongo(
    config: Config['mainBot']['stats'],
): Promise<Pick<LoadMongoReturn, 'statsModel' | 'statsClient'>> {
    const statsClient = await new MongoClient(config.mongoURI).connect();

    const db = statsClient.db(config.mongoDbName);

    const statsModel = db.collection<Stats>('Stats');

    return { statsModel, statsClient };
}

export async function loadMongo(config: Config): Promise<LoadMongoReturn> {
    const [steamMongoData, statsMongoData] = await Promise.all([
        loadSteamMongo(config.steamLinking),
        loadStatsMongo(config.mainBot.stats),
    ]);

    console.log('Connected to MongoDB');

    return { ...steamMongoData, ...statsMongoData };
}
