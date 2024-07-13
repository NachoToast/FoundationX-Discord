import { RESTPostOAuth2AccessTokenResult } from 'discord.js';
import { User } from '../User/index.js';

export interface LoginOrSignupResponse {
    user: User;

    discordAuth: RESTPostOAuth2AccessTokenResult;

    /**
     * Signed JWT to use in Authorization header for any elevated requests to
     * the API.
     */
    siteAuth: string;
}
