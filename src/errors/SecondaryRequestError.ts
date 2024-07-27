import { SiteError } from './SiteError.js';

/**
 * Error thrown when an API call made by the server to another server fails.
 *
 * Although this **should** have a status code of 501 (Bad Gateway), Cloudflare
 * likes to overwrite 502 errors with it's own error page, so 501 is used
 * instead.
 */
export class SecondaryRequestError extends SiteError<string | null> {
    public readonly statusCode = 501;

    public constructor(
        title: Capitalize<string>,
        description: string,
        error: unknown,
    ) {
        if (error instanceof Error) {
            super(title, description, error.message);
        } else {
            super(title, description, null);
        }

        if (!AppGlobals.config.production) {
            console.error(error);
        }
    }
}
