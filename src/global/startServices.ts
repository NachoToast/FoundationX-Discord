import { UserService } from '../services/index.js';

export async function startServices(): Promise<void> {
    await Promise.all([UserService.initialise()]);
}
