import { removeId } from '../../../../global/util/idHelpers.js';
import { ServerStats } from '../../../../public/ServerStats.js';
import { ServerStatsService } from '../../../../services/index.js';
import { AuthScope } from '../../types/auth/AuthScope.js';
import { EndpointProvider } from '../../types/express/EndpointProvider.js';

export const getServerStats: EndpointProvider<
    void,
    Omit<ServerStats, '_id'>,
    { id: string }
> = {
    auth: AuthScope.None,
    async handleRequest({ req, res }) {
        const { id } = req.params;

        const stats = await ServerStatsService.getStatsById(id);

        res.status(200).json(removeId(stats));
    },
};
