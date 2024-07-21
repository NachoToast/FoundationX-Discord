/** Contructs a request body to send to any of the Discord OAuth endpoints. */
export function makeRequestBody(): URLSearchParams {
    const { clientId, clientSecret } = AppGlobals.config.services.discordAuth;

    return new URLSearchParams([
        ['client_id', clientId],
        ['client_secret', clientSecret],
    ]);
}
