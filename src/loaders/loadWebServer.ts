import { Server, createServer } from 'http';
import { applyHandlers } from '../server';
import { Config } from '../types/Config';
import { Models } from '../types/Models';
import { Colour } from '../types/Utility';

export function loadWebServer(config: Config, models: Models): Promise<Server> {
    const server = createServer(applyHandlers(config, models));

    return new Promise((resolve) => {
        server.listen(config.steamLinking.port, () => {
            const address = server.address();
            if (typeof address !== 'object' || address === null) {
                throw new Error('Expected server.address() to be an object.');
            }

            const host = address.address.replace('::', 'localhost');
            const port = address.port;

            console.log(
                `Listening on ${Colour.FgMagenta}http://${host}:${port}${Colour.Reset}`,
            );
            resolve(server);
        });
    });
}
