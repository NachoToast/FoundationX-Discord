/**
 * Shape of the payload that is stored in the body of a site token (a signed
 * JWT).
 *
 * Site tokens are provided in the `Authorization` header of any elevated
 * requests.
 */
export interface SiteTokenPayload {
    steamId64: string;

    discordId: string;

    /**
     * The Discord OAuth2 access token of the requester.
     *
     * This is used to make elevated requests to the Discord API on behalf of
     * this user.
     */
    accessToken: string;

    /**
     * The Discord OAuth2 refresh token of the requester.
     *
     * This can be used to extend the user's current OAuth session.
     */
    refreshToken: string;
}
