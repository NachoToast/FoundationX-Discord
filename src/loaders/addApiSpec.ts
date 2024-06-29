import express from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { JsonObject, serve, setup } from 'swagger-ui-express';

/** Adds an `/api-spec` and `/spec` route to the app. */
export function addApiSpec(): void {
    const { app } = AppGlobals;

    const specPath = join('data', 'openapi.json');

    // ESM JSON imports are experimental, so for now we'll use this method to
    // import the API spec.
    const apiSpec = JSON.parse(readFileSync(specPath, 'utf-8')) as JsonObject;

    app.use(
        '/api-docs',
        serve,
        setup(apiSpec, { customSiteTitle: 'FoundationX API' }),
    );

    app.use('/spec', express.static(specPath));
}
