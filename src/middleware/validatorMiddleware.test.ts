import * as OpenApiValidator from 'express-openapi-validator';
import { describe, expect, it, vi } from 'vitest';
import { mockGlobals } from '../tests/index.js';
import { validatorMiddleware } from './validatorMiddleware.js';

mockGlobals();

vi.mock('express-openapi-validator');

const mockedValidator = vi.mocked(OpenApiValidator);

describe('validatorMiddleware', () => {
    it('invokes the underlying openAPI validator middleware', () => {
        validatorMiddleware();

        expect(mockedValidator.middleware).toBeCalledTimes(1);
    });
});
