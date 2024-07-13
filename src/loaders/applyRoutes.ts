import {
    getAllServerStats,
    getIp,
    getRoot,
    getServerStats,
    postLogin,
    postLogout,
    postRefresh,
    postServerStats,
} from '../routes/index.js';

export function applyRoutes(): void {
    const { app } = AppGlobals;

    // Auth
    app.post('/login', postLogin);
    app.post('/logout', postLogout);
    app.post('/refresh', postRefresh);

    // Miscellaneous
    app.get('/', getRoot);
    app.get('/ip', getIp);

    // Server Stats
    app.get('/server-stats/:id', getServerStats);
    app.post('/server-stats/:id', postServerStats);
    app.get('/server-stats', getAllServerStats);
}
