import * as OpenApiValidator from 'express-openapi-validator';
import { join } from 'path';
import { MiddlewareProvider } from '../types/index.js';

export const validatorMiddleware: MiddlewareProvider = () => {
    return OpenApiValidator.middleware({
        apiSpec: join('data', 'openapi.json'),
        validateRequests: true,
        validateResponses: true,
    });
};
