import { connectToDatabase } from './connectToDatabase.js';
import { loadCommit } from './loadCommit.js';
import { loadConfig } from './loadConfig.js';
import { loginMainBot } from './loginMainBot.js';
import { setupApp } from './setupApp.js';

export async function doGlobalLoad(): Promise<void> {
    const startTime = new Date();
    const config = loadConfig();
    const commit = loadCommit();
    const app = setupApp(config);

    const [client, db] = await Promise.all([
        loginMainBot(config),
        connectToDatabase(config),
    ]);

    globalThis.AppGlobals = { config, client, app, db, startTime, commit };
}
