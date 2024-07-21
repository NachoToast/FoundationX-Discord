import { Config } from '../global/types/Config.js';

export interface ModuleStartupResponse {
    message: string;

    variables?: string;

    finishedAt: number;
}

type ModuleKey = keyof Config['modules'];

export type ModuleConfig<T extends ModuleKey> = Exclude<
    Config['modules'][T],
    undefined
>;

export type ModuleStartReturn = AsyncGenerator<
    ModuleStartupResponse | (ModuleStartupResponse | null)[]
>;

export abstract class Module {
    public abstract start(): ModuleStartReturn;
}
