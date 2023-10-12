import { RequestListener } from 'http';
import { Config } from '../types/Config';
import { Models } from '../types/Models';
import { rootHandler } from './rootHandler';

/** Wraps and returns a request handler. */
export function applyHandlers(config: Config, models: Models): RequestListener {
    return (req, res) => {
        rootHandler(req, res, config, models).catch((e) => {
            console.log(e);

            if (!res.writableEnded) {
                res.writeHead(500);
                res.end('Internal Server Error');
            }
        });
    };
}
