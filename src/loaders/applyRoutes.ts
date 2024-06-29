import {
    getIp,
    getRoot,
    getServerStats,
    postServerStats,
} from '../routes/index.js';

export function applyRoutes(): void {
    const { app } = AppGlobals;

    // Miscellaneous
    app.get('/', getRoot);
    app.get('/ip', getIp);

    // Server Stats
    app.get('/server-stats/:id', getServerStats);
    app.post('/server-stats/:id', postServerStats);
}
