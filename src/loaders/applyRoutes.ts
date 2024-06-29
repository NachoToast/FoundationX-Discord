import { getIp, getRoot } from '../routes/index.js';

export function applyRoutes(): void {
    const { app } = AppGlobals;

    // Miscellaneous
    app.get('/', getRoot);
    app.get('/ip', getIp);
}
