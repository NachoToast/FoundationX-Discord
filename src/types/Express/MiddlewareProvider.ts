import { ErrorRequestHandler, RequestHandler } from 'express';

export type MiddlewareProvider = () =>
    | RequestHandler
    | ErrorRequestHandler
    | RequestHandler[]
    | ErrorRequestHandler[];
