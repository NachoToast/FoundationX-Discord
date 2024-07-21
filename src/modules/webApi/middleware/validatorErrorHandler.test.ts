import express from 'express';
import { HttpError } from 'express-openapi-validator/dist/framework/types.js';
import request from 'supertest';
import { describe, expect, test } from 'vitest';
import { mockGlobals } from '../../../tests/mockGlobals.js';
import { validatorErrorHandler } from './validatorErrorHandler.js';

mockGlobals();

describe(validatorErrorHandler.name, () => {
    test('catches HttpErrors', async () => {
        const app = express();

        app.get('/', () => {
            throw new HttpError({ name: '', path: '', status: 401 });
        });

        app.use(validatorErrorHandler());

        const res = await request(app).get('/').send();

        expect(res.statusCode).toBe(400);
    });

    test('skips other Errors', async () => {
        const app = express();

        app.get('/', () => {
            throw new Error();
        });

        app.use(validatorErrorHandler());

        const res = await request(app).get('/').send();

        expect(res.statusCode).toBe(500);
    });
});
