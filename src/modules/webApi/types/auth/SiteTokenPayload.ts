/**
 * The payload of a JSON Web Token (JWT) that has been signed by this
 * application.
 *
 * These JWTs should be included in the `AUthorization` header of any elevated
 * requests to the web API.
 */
export interface SiteTokenPayload {
    userId: string;

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
