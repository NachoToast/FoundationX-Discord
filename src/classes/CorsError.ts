import { SiteError } from './SiteError.js';

/**
 * Error thrown when a request's origin header is present and not in the
 * configured client URLs whitelist.
 *
 * Has status code 400 (Bad Request), since this is an error on the user's side
 * of things.
 */
export class CorsError extends SiteError<string> {
    public readonly statusCode = 400;

    public constructor(origin: string) {
        super(
            'Invalid Origin',
            'The origin header of your request is invalid (CORS).',
            origin,
        );
    }
}
