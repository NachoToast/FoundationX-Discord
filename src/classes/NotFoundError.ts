import { SiteError } from './SiteError.js';

/**
 * Error thrown when a server or user does not exist in the database.
 *
 * Has status code 404 (Not Found), since the user has requested a resource that does not exist.
 */
export class NotFoundError extends SiteError<null> {
    public readonly statusCode = 404;

    public constructor(title: Capitalize<string>, description: string) {
        super(title, description, null);
    }
}
