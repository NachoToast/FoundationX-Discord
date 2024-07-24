import { EconomyReward } from '../../../../public/EconomyReward.js';
import { EconomyService } from '../../../../services/index.js';
import { AuthScope } from '../../types/auth/AuthScope.js';
import { EndpointProvider } from '../../types/express/EndpointProvider.js';

export const getRewards: EndpointProvider<void, EconomyReward[]> = {
    auth: AuthScope.None,
    // eslint-disable-next-line @typescript-eslint/require-await
    async handleRequest({ res }) {
        const rewards = EconomyService.getAllRewards();
        res.status(200).send(rewards);
    },
};
