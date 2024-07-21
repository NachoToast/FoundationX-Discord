import { Response } from 'express';
import { SiteError } from '../../../errors/SiteError.js';
import { SiteErrorObject } from '../../../public/SiteErrorObject.js';
import { MiddlewareProvider } from '../types/express/MiddlewareProvider.js';

export const siteErrorHandler: MiddlewareProvider = () => {
    const isProduction = AppGlobals.config.production;

    return (err, req, res: Response<SiteErrorObject<unknown>>, next) => {
        if (err instanceof SiteError) {
            if (!isProduction) {
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
