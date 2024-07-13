import { AuthService } from '../../services/index.js';
import { Endpoint, LoginOrSignupResponse } from '../../types/index.js';

export const postRefresh: Endpoint<void, LoginOrSignupResponse> = (
    req,
    res,
    next,
) => {
    const siteToken = req.get('Authorization');

    AuthService.refresh(siteToken, req.ip)
        .then((loginOrSignupResponse) => {
            res.status(200).json(loginOrSignupResponse);
        })
        .catch((error: unknown) => {
            next(error);
        });
};
