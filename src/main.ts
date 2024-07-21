import { connectToDatabase } from './global/connectToDatabase.js';
import { loadConfig } from './global/loadConfig.js';
import { startModules } from './global/startModules.js';
import { startServices } from './global/startServices.js';

const startTime = new Date();

Object.keysT = Object.keys;
Object.entriesT = Object.entries;
Object.fromEntriesT = Object.fromEntries;

process.on('uncaughtException', (error) => {
    console.log('Uncaught exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    console.log('Unhandled rejection:', error);
    process.exit(1);
});

const config = loadConfig();
const db = await connectToDatabase(config);

globalThis.AppGlobals = { config, db, startTime };

await startServices();
await startModules();
