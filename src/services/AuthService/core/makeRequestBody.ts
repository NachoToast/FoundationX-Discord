export function makeRequestBody(): URLSearchParams {
    const { clientId, clientSecret } = AppGlobals.config.discordAuth;

    return new URLSearchParams([
        ['client_id', clientId],
        ['client_secret', clientSecret],
    ]);
}
