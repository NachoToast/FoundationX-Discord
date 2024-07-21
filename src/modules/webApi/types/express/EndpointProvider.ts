import { Request, Response } from 'express';
import { UserService } from '../../../../services/index.js';
import { AuthScope } from '../auth/AuthScope.js';
import { SiteTokenPayload } from '../auth/SiteTokenPayload.js';

interface EndpointProviderBase<
    TAuth extends AuthScope,
    TRequest,
    TResponse,
    TPathParams,
    TQueryParams,
    THandlerParams,
> {
    auth: TAuth;

    /** Optional method to run once on initial app load. */
    onStart?(): void;

    /** Entry point for handling requests. */
    handleRequest({
        req,
        res,
    }: {
        req: Request<
            TPathParams,
            TResponse,
            TRequest,
            TQueryParams,
            Record<never, never>
        >;
        res: Response<TResponse, Record<never, never>>;
    } & THandlerParams): Promise<void>;
}

type EndpointProviderNoAuth<TRequest, TResponse, TPathParams, TQueryParams> =
    EndpointProviderBase<
        AuthScope.None,
        TRequest,
        TResponse,
        TPathParams,
        TQueryParams,
        object
    >;

type EndpointProviderTokenOnly<TRequest, TResponse, TPathParams, TQueryParams> =
    EndpointProviderBase<
        AuthScope.TokenOnly,
        TRequest,
        TResponse,
        TPathParams,
        TQueryParams,
        { auth: SiteTokenPayload }
    >;

type EndpointProviderOptionalUser<
    TRequest,
    TResponse,
    TPathParams,
    TQueryParams,
> = EndpointProviderBase<
    AuthScope.OptionalUser,
    TRequest,
    TResponse,
    TPathParams,
    TQueryParams,
    | { auth: SiteTokenPayload; user: UserService.User }
    | { auth: null; user: null }
>;

type EndpointProviderUser<TRequest, TResponse, TPathParams, TQueryParams> =
    EndpointProviderBase<
        AuthScope.User,
        TRequest,
        TResponse,
        TPathParams,
        TQueryParams,
        { auth: SiteTokenPayload; user: UserService.User }
    >;

interface EndpointProviderPlugin<TRequest, TResponse, TPathParams, TQueryParams>
    extends EndpointProviderBase<
        AuthScope.Plugin,
        TRequest,
        TResponse,
        TPathParams,
        TQueryParams,
        { token: string }
    > {
    isTokenValid(token: string): boolean;
}

export type EndpointProvider<
    TRequest = void,
    TResponse = void,
    TPathParams = unknown,
    TQueryParams = unknown,
> =
    | EndpointProviderNoAuth<TRequest, TResponse, TPathParams, TQueryParams>
    | EndpointProviderTokenOnly<TRequest, TResponse, TPathParams, TQueryParams>
    | EndpointProviderOptionalUser<
          TRequest,
          TResponse,
          TPathParams,
          TQueryParams
      >
    | EndpointProviderUser<TRequest, TResponse, TPathParams, TQueryParams>
    | EndpointProviderPlugin<TRequest, TResponse, TPathParams, TQueryParams>;
