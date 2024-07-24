import { convertId } from '../../../../global/util/idHelpers.js';
import { Payout } from '../../../../public/Payout.js';
import { EconomyService } from '../../../../services/index.js';
import { AuthScope } from '../../types/auth/AuthScope.js';
import { EndpointProvider } from '../../types/express/EndpointProvider.js';

interface PayoutsResponse {
    createdItems: Payout[];

    amountSpent: number;
}

export const postPayouts: EndpointProvider<string[], PayoutsResponse> = {
    auth: AuthScope.User,
    async handleRequest({ req, res, user }) {
        const [created, amountSpent] = await EconomyService.createPayouts(
            user,
            req.body,
        );

        res.status(200).json({
            createdItems: created.map((e) => convertId(e)),
            amountSpent,
        });
    },
};
