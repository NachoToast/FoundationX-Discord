import cors, { CorsOptions } from 'cors';
import { CorsError } from '../../../errors/CorsError.js';
import { MiddlewareProvider } from '../types/express/MiddlewareProvider.js';

export function makeOriginFunction(): CorsOptions['origin'] {
    const allowedUrls = new Set(AppGlobals.config.modules.webApi.clientUrls);

    if (allowedUrls.has('*')) return '*';

    return (origin, callback) => {
        // Origin is undefined on non-browser requests (e.g. Insomnia).
        if (origin === undefined || allowedUrls.has(origin)) {
            callback(null, true);
        } else {
            callback(new CorsError(origin));
        }
    };
}

export const corsMiddleware: MiddlewareProvider = () => {
    const origin = makeOriginFunction();

    return cors({
        origin,
        exposedHeaders: ['RateLimit', 'RateLimit-Policy'],
    });
};
