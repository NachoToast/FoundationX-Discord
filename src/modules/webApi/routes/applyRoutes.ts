import express, { Express } from 'express';
import { readFileSync } from 'fs';
import { JsonObject, serve, setup } from 'swagger-ui-express';
import { postLogin } from './auth/postLogin.js';
import { postLogout } from './auth/postLogout.js';
import { postRefresh } from './auth/postRefresh.js';
import { postEarnings } from './economy/earnings/postEarnings.js';
import { getIp } from './miscellaneous/getIp.js';
import { getRoot } from './miscellaneous/getRoot.js';
import { registerProvider } from './registerProvider.js';
import { getAllServerStats } from './serverStats/getAllServerStats.js';
import { getServerStats } from './serverStats/getServerStats.js';
import { postServerStats } from './serverStats/postServerStats.js';

export function applyRoutes(app: Express): void {
    app.get('/', registerProvider(getRoot));

    app.get('/ip', registerProvider(getIp));

    app.post('/login', registerProvider(postLogin));
    app.post('/logout', registerProvider(postLogout));
    app.post('/refresh', registerProvider(postRefresh));

    app.get('/server-stats/:id', registerProvider(getServerStats));
    app.get('/server-stats', registerProvider(getAllServerStats));
    app.post('/server-stats', registerProvider(postServerStats));

    app.post('/economy/earnings', registerProvider(postEarnings));
}

export function applyStaticRoutes(app: Express): void {
    app.use('/static', express.static('static', { extensions: ['html'] }));

    app.use('/favicon.ico', express.static('static/favicon.ico'));

    addApiSpec(app);
}

/** Adds an `/api-spec` and `/spec` route to the app. */
function addApiSpec(app: Express): void {
    // ESM JSON imports are experimental, so for now we'll use this method to
    // import the API spec.
    const apiSpec = JSON.parse(
        readFileSync('openapi.json', 'utf-8'),
    ) as JsonObject;

    app.use(
        '/api-docs',
        serve,
        setup(apiSpec, { customSiteTitle: 'FoundationX API' }),
    );

    app.use('/spec', express.static('openapi.json'));
}
