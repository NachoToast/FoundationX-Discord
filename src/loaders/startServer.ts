import { Colour } from '../types/index.js';
import { logAction } from './util/index.js';

/** Starts the Express app on the configured port. */
export async function startServer(): Promise<void> {
    const startTime = Date.now();

    const { config, app } = AppGlobals;
    const { port } = config.webApi;

    return new Promise((resolve) => {
        const server = app.listen(port, () => {
            const addressData = server.address();

            let reportedLocation: string;

            if (addressData === null) {
                reportedLocation = 'an unknown address';
            } else if (typeof addressData === 'string') {
                reportedLocation = addressData;
            } else {
                const { address, port } = addressData;
                reportedLocation = `http://${address.replace('::', 'localhost')}:${port.toString()}`;
            }

            logAction(
                'App',
                `Listening on ${Colour.FgCyan}${reportedLocation}${Colour.Reset}`,
                startTime,
            );

            resolve();
        });
    });
}
