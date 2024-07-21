import { AuthScope } from '../../types/auth/AuthScope.js';
import { EndpointProvider } from '../../types/express/EndpointProvider.js';

export const getIp: EndpointProvider<void, string> = {
    auth: AuthScope.None,
    // eslint-disable-next-line @typescript-eslint/require-await
    async handleRequest({ req, res }) {
        res.status(200).send(req.ip);
    },
};
