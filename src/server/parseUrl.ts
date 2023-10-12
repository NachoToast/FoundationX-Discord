import { IncomingMessage, ServerResponse } from 'http';

/** Parses the request URL, returning null if the URL is invalid. */
export function parseUrl(
    req: IncomingMessage,
    res: ServerResponse,
): URL | null {
    if (req.url === undefined) {
        res.writeHead(400);
        res.end('Unknown URL');
        return null;
    }

    if (!URL.canParse(req.url, `http://${req.headers.host}`)) {
        res.writeHead(400);
        res.end('Invalid URL');
        return null;
    }

    return new URL(req.url, `http://${req.headers.host}`);
}
