import { SiteError } from './SiteError.js';

/**
 * Error thrown when a user does not have the required permissions to do an
 * attempted action, or the action is impossible regardless of permissions.
 *
 * Has status code 403 (Forbidden), since the user has failed authorization or
 * otherwise attempted a forbidden action.
 */
export class ForbiddenError extends SiteError<null> {
    public readonly statusCode = 403;

    public constructor(
        title: Capitalize<string>,
        description: string,
        requiredPermissions: null,
    ) {
        super(title, description, requiredPermissions);
    }
}
