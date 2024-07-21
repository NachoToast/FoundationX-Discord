import express, { Express } from 'express';
import { Module, ModuleStartReturn, ModuleStartupResponse } from '../Module.js';
import {
    applyPostRouteMiddleware,
    applyPreRouteMiddleware,
} from './middleware/applyMiddleware.js';
import { applyRoutes, applyStaticRoutes } from './routes/applyRoutes.js';

export class WebApiModule extends Module {
    private readonly app: Express;

    public constructor() {
        super();

        this.app = express();

        const { production } = AppGlobals.config;

        this.app.set('env', production ? 'production' : 'development');

        const { proxyCount } = AppGlobals.config.modules.webApi;

        if (proxyCount > 0) {
            this.app.set('trust proxy', proxyCount);
        }

        applyStaticRoutes(this.app);

        applyPreRouteMiddleware(this.app);

        applyRoutes(this.app);

        applyPostRouteMiddleware(this.app);
    }

    public override async *start(): ModuleStartReturn {
        yield await this.startApp();
    }

    private startApp(): Promise<ModuleStartupResponse> {
        const { port } = AppGlobals.config.modules.webApi;

        return new Promise((resolve) => {
            const server = this.app.listen(port, () => {
                const addressData = server.address();

                let reportedLocation: string;

                if (addressData === null) {
                    reportedLocation = 'an unknown address';
                } else if (typeof addressData === 'string') {
                    reportedLocation = addressData;
                } else {
                    const { address, port } = addressData;
                    reportedLocation = `http://${address.replace('::', 'localhost')}:${port.toString()}`;
                }

                resolve({
                    message: `Listening on`,
                    variables: reportedLocation,
                    finishedAt: Date.now(),
                });
            });
        });
    }
}
