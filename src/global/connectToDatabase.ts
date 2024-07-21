import { Db, MongoClient, MongoClientOptions, ServerApiVersion } from 'mongodb';
import { Colour } from './types/Colour.js';
import { Config } from './types/Config.js';
import { awaitOrTimeout, TimeoutError } from './util/awaitOrTimeout.js';

const options: MongoClientOptions = {
    serverApi: {
        version: ServerApiVersion.v1,
        deprecationErrors: true,
    },
};

/** Connects to the configured MongoDB database. */
export async function connectToDatabase(config: Config): Promise<Db> {
    const { uri, dbName, connectTimeout } = config.services.mongoDb;

    const startTime = Date.now();

    const client = new MongoClient(uri, options);

    try {
        await awaitOrTimeout(client.connect(), connectTimeout);
    } catch (error) {
        if (!(error instanceof TimeoutError)) {
            throw error;
        }

        console.error(error.makeMessage('connect to MongoDB'));
        process.exit(1);
    }

    console.log(
        `[${Colour.FgGreen}MongoDB${Colour.Reset}] Connected to ${Colour.FgCyan}${dbName}${Colour.Reset} (${Colour.FgYellow}${(Date.now() - startTime).toLocaleString()}ms${Colour.Reset})`,
    );

    return client.db(dbName);
}
