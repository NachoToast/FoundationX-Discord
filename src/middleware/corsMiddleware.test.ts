import { beforeAll, describe, expect, test } from 'vitest';
import {
    ResponseData,
    getResponseData,
    mockGlobals,
    stubApp,
} from '../tests/index.js';
import { corsMiddleware } from './corsMiddleware.js';

mockGlobals();

const corsHeader = 'access-control-allow-origin';

describe.concurrent(corsMiddleware.name, () => {
    describe.concurrent('wildcard ("*") origin', () => {
        let responseNoOrigin: ResponseData;
        let responseWithOrigin: ResponseData;

        beforeAll(async () => {
            AppGlobals.config.webApi.clientUrls = ['*'];

            // mockGlobals
            const app = stubApp({ preRouteMiddleware: [corsMiddleware] });

            const [response1, response2] = await Promise.all([
                app.get('/').send(),
                app.get('/').set('origin', 'https://example.com').send(),
            ]);

            responseNoOrigin = getResponseData(response1, corsHeader);
            responseWithOrigin = getResponseData(response2, corsHeader);
        });

        test('always allows undefined origin', () => {
            expect(responseNoOrigin.status).toBe(200);
        });

        test('allows any origin', () => {
            expect(responseWithOrigin.status).toBe(200);
        });

        test('has a wildcard Access-Control-Allow-Origin header', () => {
            expect(responseNoOrigin.headerValue).toBe('*');
            expect(responseWithOrigin.headerValue).toBe('*');
        });
    });

    describe.concurrent('static whitelist', () => {
        let responseNoOrigin: ResponseData;
        let responseOkOrigin: ResponseData;
        let responseBadOrigin: ResponseData;

        const whitelistedOrigin = 'https://example.com';
        const nonWhitelistedOrigin = 'https://google.com';

        beforeAll(async () => {
            AppGlobals.config.webApi.clientUrls = [whitelistedOrigin];

            const app = stubApp({ preRouteMiddleware: [corsMiddleware] });

            const [response1, response2, response3] = await Promise.all([
                app.get('/').send(),
                app.get('/').set('origin', whitelistedOrigin).send(),
                app.get('/').set('origin', nonWhitelistedOrigin).send(),
            ]);

            responseNoOrigin = getResponseData(response1, corsHeader);
            responseOkOrigin = getResponseData(response2, corsHeader);
            responseBadOrigin = getResponseData(response3, corsHeader);
        });

        test('always allows undefined origin', () => {
            expect(responseNoOrigin.status).toBe(200);
        });

        test('allows whitelisted origins', () => {
            expect(responseOkOrigin.status).toBe(200);
        });

        test("doesn't allow non-whitelisted origins", () => {
            expect(responseBadOrigin.status).toBe(400);
        });

        test('has relevant Access-Control-Allow-Origin headers', () => {
            expect(responseNoOrigin.headerValue).toBeUndefined();
            expect(responseOkOrigin.headerValue).toBe(whitelistedOrigin);
            expect(responseBadOrigin.headerValue).toBeUndefined();
        });
    });
});
