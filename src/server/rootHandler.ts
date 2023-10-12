import { IncomingMessage, ServerResponse } from 'http';
import { Config } from '../types/Config';
import { Models } from '../types/Models';
import { handleAccessToken } from './handleAccessToken';
import { handleAuthCode } from './handleAuthCode';
import { handleConnections } from './handleConnections';
import { parseUrl } from './parseUrl';

/** Request handler that manages calls to other handling functions. */
export async function rootHandler(
    req: IncomingMessage,
    res: ServerResponse,
    config: Config,
    models: Models,
): Promise<void> {
    const url = parseUrl(req, res);
    if (url === null) return;

    const code = url.searchParams.get('code');

    if (code !== null) {
        const auth = await handleAuthCode(code, url.origin, config, res);
        if (auth === null) return;

        const data = await handleAccessToken(auth.access_token, res);
        if (data === null) return;

        const { connections, userData } = data;
        await handleConnections(connections, userData, res, models.steamModel);
        return;
    }

    res.writeHead(404);
    res.end('Not Found');
}
