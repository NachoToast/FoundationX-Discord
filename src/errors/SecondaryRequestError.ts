import { SiteError } from './SiteError.js';

/**
 * Error thrown when an API call made by the server to another server fails.
 *
 * Has status code 501 (Bad Gateway), since the server is acting as a gateway
 * or proxy and received an invalid response from the upstream server.
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
