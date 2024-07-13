import { AuthService } from '../../services/index.js';
import { Endpoint } from '../../types/index.js';

export const postLogout: Endpoint<void, void> = (req, res, next) => {
    const siteToken = req.get('Authorization');

    AuthService.logout(siteToken)
        .then(() => {
            res.sendStatus(200);
        })
        .catch((error: unknown) => {
            next(error);
        });
};
