import { addApiSpec } from './addApiSpec.js';
import { applyRoutes } from './applyRoutes.js';
import {
    attachPostRouteMiddleware,
    attachPreRouteMiddleware,
} from './attachMiddleware.js';
import { deploySlashCommands } from './deploySlashCommands.js';
import { doGlobalLoad } from './global/index.js';
import { registerCommandListeners } from './registerCommandListeners.js';
import { setupCluster } from './setupCluster.js';
import { setupReactRoles } from './setupReactRoles.js';
import { startServer } from './startServer.js';

export async function loadAll(): Promise<void> {
    const startTime = Date.now();

    await doGlobalLoad();

    registerCommandListeners();
    addApiSpec();
    attachPreRouteMiddleware();
    applyRoutes();
    attachPostRouteMiddleware();

    await Promise.all([
        deploySlashCommands(),
        setupCluster(),
        setupReactRoles(),
        startServer(),
    ]);

    console.log(
        `Finished all load actions in ${(Date.now() - startTime).toLocaleString()}ms`,
    );
}
