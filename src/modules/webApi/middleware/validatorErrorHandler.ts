import { Response } from 'express';
import {
    HttpError,
    ValidationErrorItem,
} from 'express-openapi-validator/dist/framework/types.js';
import { SiteErrorObject } from '../../../public/SiteErrorObject.js';
import { MiddlewareProvider } from '../types/express/MiddlewareProvider.js';

/** Custom error messages for OpenAPI validation errors. */
export const validatorErrorHandler: MiddlewareProvider = () => {
    return (
        err,
        _req,
        res: Response<SiteErrorObject<ValidationErrorItem[]>>,
        next,
    ) => {
        if (err instanceof HttpError) {
            res.status(400).json({
                title: 'Bad Request',
                description: 'Your client made an invalid request to the API.',
                additionalData: err.errors,
            });
        } else {
            next(err);
        }
    };
};
