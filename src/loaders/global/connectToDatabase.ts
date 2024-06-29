import { Db, MongoClient, MongoClientOptions, ServerApiVersion } from 'mongodb';
import { Colour, Config } from '../../types/index.js';
import { TimeoutError, awaitOrTimeout, logAction } from '../util/index.js';

const options: MongoClientOptions = {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
};

/** Connects to the configured MongoDB database. */
export async function connectToDatabase(config: Config): Promise<Db> {
    const startTime = Date.now();

    const { uri, dbName, connectTimeout } = config.mongoDb;

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

    logAction(
        'MongoDB',
        `Connected to ${Colour.FgCyan}${dbName}${Colour.Reset}`,
        startTime,
    );

    return client.db(dbName);
}
