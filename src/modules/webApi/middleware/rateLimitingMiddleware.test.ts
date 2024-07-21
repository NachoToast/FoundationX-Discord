import { beforeAll, describe, expect, test } from 'vitest';
import { mockGlobals } from '../../../tests/mockGlobals.js';
import { ResponseData, getResponseData } from '../tests/getResponseData.js';
import { stubApp } from '../tests/stubApp.js';
import { rateLimitingMiddleware } from './rateLimitingMiddleware.js';

mockGlobals();

describe.concurrent(rateLimitingMiddleware.name, () => {
    let responseNormalA: ResponseData;
    let responseNormalB: ResponseData;
    let responseRateLimited: ResponseData;

    beforeAll(async () => {
        AppGlobals.config.modules.webApi.rateLimit = 2;
        const app = stubApp({ preRouteMiddleware: [rateLimitingMiddleware] });

        const [response1, response2] = await Promise.all([
            app.get('/').send(),
            app.get('/').send(),
        ]);

        // Now should be rate limited.
        const response3 = await app.get('/').send();

        responseNormalA = getResponseData(response1);
        responseNormalB = getResponseData(response2);
        responseRateLimited = getResponseData(response3);
    });

    test("does nothing when not limit isn't yet reached", () => {
        expect(responseNormalA.status).toBe(200);
        expect(responseNormalB.status).toBe(200);
    });

    test('starts rate limiting when limit is reached', () => {
        expect(responseRateLimited.status).toBe(429);
    });
});
