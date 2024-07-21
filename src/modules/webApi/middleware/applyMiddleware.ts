import express, { Express } from 'express';
import { corsMiddleware } from './corsMiddleware.js';
import { rateLimitingMiddleware } from './rateLimitingMiddleware.js';
import { siteErrorHandler } from './siteErrorHandler.js';
import { validatorErrorHandler } from './validatorErrorHandler.js';
import { validatorMiddleware } from './validatorMiddleware.js';

/**
 * Attaches pre-route middleware to the app.
 *
 * E.g. validation, authentication.
 */
export function applyPreRouteMiddleware(app: Express): void {
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
export function applyPostRouteMiddleware(app: Express): void {
    app.use(siteErrorHandler());
}
