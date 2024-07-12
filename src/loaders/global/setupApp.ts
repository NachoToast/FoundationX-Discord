import express, { Express } from 'express';
import { Config } from '../../types/index.js';
import { logAction } from '../util/index.js';

export function setupApp(config: Config): Express {
    const app = express();

    app.set('env', config.production ? 'production' : 'development');

    const proxyCount = config.webApi.proxyCount;

    if (proxyCount > 0) {
        app.set('trust proxy', proxyCount);

        logAction(
            'App',
            `${proxyCount.toString()} Prox${proxyCount !== 1 ? 'ies' : 'y'} configured`,
        );
    }

    app.use('/static', express.static('static'));
    app.use('/favicon.ico', express.static('static/favicon.ico'));

    return app;
}
