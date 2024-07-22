import { Request, RequestHandler } from 'express';
import { AuthError } from '../../../errors/AuthError.js';
import { ForbiddenError } from '../../../errors/ForbiddenError.js';
import { UserService } from '../../../services/index.js';
import { validateSiteToken } from '../auth/validateSiteToken.js';
import { AuthScope } from '../types/auth/AuthScope.js';
import { SiteTokenPayload } from '../types/auth/SiteTokenPayload.js';
import { EndpointProvider } from '../types/express/EndpointProvider.js';

function withOptionalAuth(req: Request): SiteTokenPayload | null {
    const authHeader = req.get('Authorization');
    if (authHeader === undefined) return null;
    return validateSiteToken(authHeader);
}

/**
 * Wraps a route-execution method in auth-checking functionality based on it's
 * {@link AuthScope}.
 */
export function registerProvider(
    endpointProvider: EndpointProvider<unknown, unknown>,
): RequestHandler {
    endpointProvider.onStart?.();

    switch (endpointProvider.auth) {
        case AuthScope.None:
            return (req, res, next) => {
                endpointProvider
                    .handleRequest({ req, res })
                    .catch((error: unknown) => {
                        next(error);
                    });
            };
        case AuthScope.TokenOnly:
            return (req, res, next) => {
                endpointProvider
                    .handleRequest({
                        req,
                        res,
                        auth: validateSiteToken(req.get('Authorization')),
                    })
                    .catch((error: unknown) => {
                        next(error);
                    });
            };
        case AuthScope.OptionalUser:
            return (req, res, next) => {
                const auth = withOptionalAuth(req);
                if (auth === null) {
                    endpointProvider
                        .handleRequest({
                            req,
                            res,
                            auth,
                            user: null,
                        })
                        .catch((error: unknown) => {
                            next(error);
                        });
                } else {
                    UserService.getUserById(auth.userId)
                        .then((user) => {
                            endpointProvider
                                .handleRequest({
                                    req,
                                    res,
                                    auth,
                                    user,
                                })
                                .catch((error: unknown) => {
                                    next(error);
                                });
                        })
                        .catch((error: unknown) => {
                            next(error);
                        });
                }
            };
        case AuthScope.User:
            return (req, res, next) => {
                const auth = validateSiteToken(req.get('Authorization'));
                UserService.getUserById(auth.userId)
                    .then((user) => {
                        // TODO: required permissions checks

                        endpointProvider
                            .handleRequest({
                                req,
                                res,
                                auth,
                                user,
                            })
                            .catch((error: unknown) => {
                                next(error);
                            });
                    })
                    .catch((error: unknown) => {
                        next(error);
                    });
            };
        case AuthScope.Plugin:
            return (req, res, next) => {
                const token = req.get('Authorization');
                if (token === undefined) {
                    throw new AuthError(
                        'Missing Authorization',
                        'A value was not provided in the authorization header.',
                    );
                }

                if (!endpointProvider.isTokenValid(token)) {
                    throw new ForbiddenError(
                        'Invalid Authorization',
                        'The token provided is invalid, please contact the site developer.',
                    );
                }

                endpointProvider
                    .handleRequest({
                        req,
                        res,
                        token,
                    })
                    .catch((error: unknown) => {
                        next(error);
                    });
            };
    }
}
