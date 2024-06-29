import { SiteError } from './SiteError.js';

/**
 * Error thrown when a user's site token (JWT) is missing or invalid.
 *
 * Has status code 401 (Unauthorized), since the user has failed authentication.
 */
export class AuthError extends SiteError<null> {
    public readonly statusCode = 401;

    public constructor(title: Capitalize<string>, description: string) {
        super(title, description, null);
    }
}
