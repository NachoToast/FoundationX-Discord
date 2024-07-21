import { User } from './User.js';

export interface LoginOrSignupResponse {
    user: User;

    /** Seconds until session expires. */
    expiresIn: number;

    /**
     * Signed JWT to use in `Authorization` header for any elevated requests to
     * the API.
     */
    siteToken: string;
}
