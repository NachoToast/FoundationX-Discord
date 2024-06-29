import express from 'express';
import {
    corsMiddleware,
    rateLimitingMiddleware,
    siteErrorHandler,
    validatorErrorHandler,
    validatorMiddleware,
} from '../middleware/index.js';

/**
 * Attaches pre-route middleware to the app.
 *
 * E.g. validation, authentication.
 */
export function attachPreRouteMiddleware(): void {
    const { app } = AppGlobals;

    app.use(express.json());
    app.use(corsMiddleware());
    app.use(rateLimitingMiddleware());
    app.use(validatorMiddleware());
    app.use(validatorErrorHandler());
}

/**
 * Attachs post-route middleware to the app.
 *
 * E.g. error catching.
 */
export function attachPostRouteMiddleware(): void {
    const { app } = AppGlobals;
    app.use(siteErrorHandler());
}
