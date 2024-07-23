import { convertId } from '../../../../global/util/idHelpers.js';
import { User } from '../../../../public/User.js';
import { AuthScope } from '../../types/auth/AuthScope.js';
import { EndpointProvider } from '../../types/express/EndpointProvider.js';

export const getMe: EndpointProvider<void, User> = {
    auth: AuthScope.User,
    // eslint-disable-next-line @typescript-eslint/require-await
    async handleRequest({ res, user }) {
        res.status(200).json(convertId(user));
    },
};
