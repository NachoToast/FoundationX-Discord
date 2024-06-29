import { RequestHandler } from 'express';

export type Endpoint<
    TRequest = unknown,
    TResponse = unknown,
    TPathParams = object,
    TQueryParams = object,
> = RequestHandler<TPathParams, TResponse, TRequest, TQueryParams>;
