import {
    PaginationParams,
    WithPagination,
} from '../../../../public/Pagination.js';
import { ServerStats } from '../../../../public/ServerStats.js';
import { ServerStatsService } from '../../../../services/index.js';
import { AuthScope } from '../../types/auth/AuthScope.js';
import { EndpointProvider } from '../../types/express/EndpointProvider.js';

export const getAllServerStats: EndpointProvider<
    void,
    WithPagination<ServerStats>,
    never,
    PaginationParams
> = {
    auth: AuthScope.None,
    async handleRequest({ req, res }) {
        const { page, perPage } = req.query;

        const stats = await ServerStatsService.getAllServerStats({
            page,
            perPage,
        });

        res.status(200).json(stats);
    },
};
