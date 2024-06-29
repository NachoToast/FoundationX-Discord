import { loadAll } from './loaders/index.js';

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

await loadAll();
