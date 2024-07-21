import { Response } from 'supertest';

export interface ResponseData {
    status: number;

    headerValue?: string | undefined;
}

export function getResponseData(res: Response, header?: string): ResponseData {
    return {
        status: res.status,
        headerValue: header ? res.header[header] : undefined,
    };
}
