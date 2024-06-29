import { ReactRoleService } from '../services/index.js';
import { logAction } from './util/index.js';

export async function setupReactRoles(): Promise<void> {
    const startTime = Date.now();

    await ReactRoleService.validateRolePositions();

    await ReactRoleService.updateOrMakeInitialMessage();

    logAction('MainBot', 'Setup react roles', startTime);
}
