import { AuthService } from '../../services/index.js';
import { Endpoint, LoginOrSignupResponse } from '../../types/index.js';

interface LoginRequest {
    code: string;
    redirectUri: string;
}

export const postLogin: Endpoint<LoginRequest, LoginOrSignupResponse> = (
    req,
    res,
    next,
) => {
    const { code, redirectUri } = req.body;

    AuthService.loginOrSignup(code, redirectUri, req.ip)
        .then((LoginOrSignupResponse) => {
            res.status(200).json(LoginOrSignupResponse);
        })
        .catch((error: unknown) => {
            next(error);
        });
};
