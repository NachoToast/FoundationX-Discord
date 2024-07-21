import { SiteError } from './SiteError.js';

/**
 * Error thrown when a request is made with insufficient or malformed
 * credentials, such as having an invalid site token.
 *
 * Has status code 401 (Unauthorized), since the user has failed
 * authentication.
 */
export class AuthError extends SiteError<null> {
    public readonly statusCode = 401;

    public constructor(title: Capitalize<string>, description: string) {
        super(title, description, null);
    }
}
