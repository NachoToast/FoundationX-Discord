import { AuthScope } from '../../types/auth/AuthScope.js';
import { EndpointProvider } from '../../types/express/EndpointProvider.js';

interface AppInfo {
    startTime: number;

    receivedRequest: number;
}

export const getRoot: EndpointProvider<void, string | AppInfo> = {
    auth: AuthScope.None,
    // eslint-disable-next-line @typescript-eslint/require-await
    async handleRequest({ req, res }) {
        if (req.headers.accept?.startsWith('application/json')) {
            res.status(200).json({
                receivedRequest: Date.now(),
                startTime: AppGlobals.startTime.getTime(),
            });
        } else {
            res.status(200).send(
                `You found the FoundationX API!<br />Having a look around? Check out the <a href="/api-docs">API documentation!</a>`,
            );
        }
    },
};
