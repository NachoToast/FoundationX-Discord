import cors, { CorsOptions } from 'cors';
import { CorsError } from '../classes/index.js';
import { MiddlewareProvider } from '../types/index.js';

export function makeOriginFunction(
    clientUrls: Set<string>,
): CorsOptions['origin'] {
    if (clientUrls.has('*')) return '*';

    return (origin, callback) => {
        // Origin is undefined on non-browser requests (e.g. Insomnia).
        if (origin === undefined || clientUrls.has(origin)) {
            callback(null, true);
        } else {
            callback(new CorsError(origin));
        }
    };
}

export const corsMiddleware: MiddlewareProvider = () => {
    const clientUrls = new Set(AppGlobals.config.webApi.clientUrls);

    return cors({
        origin: makeOriginFunction(clientUrls),
        exposedHeaders: ['RateLimit', 'RateLimit-Policy'],
    });
};
