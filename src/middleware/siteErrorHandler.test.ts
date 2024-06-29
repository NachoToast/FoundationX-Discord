import express from 'express';
import request from 'supertest';
import { describe, expect, test, vi } from 'vitest';
import { SiteError } from '../classes/index.js';
import { mockGlobals } from '../tests/index.js';
import { siteErrorHandler } from './siteErrorHandler.js';

mockGlobals();

// Silence console.logs from within middleware.
vi.spyOn(global.console, 'log').mockImplementation(() => null);

class MockedSiteError extends SiteError<null> {
    public readonly statusCode = 401;

    public constructor() {
        super('', '', null);
    }
}

describe.concurrent(siteErrorHandler.name, () => {
    test('catches SiteErrors', async () => {
        const app = express();

        app.get('/', () => {
            throw new MockedSiteError();
        });

        app.use(siteErrorHandler());

        const res = await request(app).get('/').send();

        expect(res.statusCode).toBe(401);
    });

    test('skips other Errors', async () => {
        const app = express();

        app.get('/', () => {
            throw new Error();
        });

        app.use(siteErrorHandler());

        const res = await request(app).get('/').send();

        expect(res.statusCode).toBe(500);
    });
});
