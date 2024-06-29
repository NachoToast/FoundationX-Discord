import express from 'express';
import request from 'supertest';
import { MiddlewareProvider } from '../types/index.js';

interface StubAppProps {
    preRouteMiddleware?: MiddlewareProvider[];
    postRouteMiddleware?: MiddlewareProvider[];
}

export function stubApp({
    preRouteMiddleware,
    postRouteMiddleware,
}: StubAppProps = {}): ReturnType<typeof request> {
    const app = express();

    if (preRouteMiddleware !== undefined) {
        for (const middleware of preRouteMiddleware) {
            app.use(middleware());
        }
    }

    app.get('/', (_req, res) => res.sendStatus(200));

    if (postRouteMiddleware !== undefined) {
        for (const middleware of postRouteMiddleware) {
            app.use(middleware());
        }
    }

    return request(app);
}
