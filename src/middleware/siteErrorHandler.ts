import { Response } from 'express';
import { SiteError } from '../classes/index.js';
import { MiddlewareProvider, SiteErrorObject } from '../types/index.js';

export const siteErrorHandler: MiddlewareProvider = () => {
    return (err, req, res: Response<SiteErrorObject<unknown>>, next) => {
        if (err instanceof SiteError) {
            if (!AppGlobals.config.production) {
                console.log(`${req.method} ${req.url}`, err);
            }

            res.status(err.statusCode).json({
                title: err.title,
                description: err.description,
                additionalData: err.additionalData,
            });
        } else {
            next(err);
        }
    };
};
