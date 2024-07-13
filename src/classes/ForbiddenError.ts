import { SiteError } from './SiteError.js';

export class ForbiddenError extends SiteError<null> {
    public readonly statusCode = 403;

    public constructor(title: Capitalize<string>, description: string) {
        super(title, description, null);
    }
}
