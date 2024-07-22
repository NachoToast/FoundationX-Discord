import { Module, ModuleStartReturn, ModuleStartupResponse } from '../Module.js';
import { StatsBot } from './StatsBot.js';

export class ServerStatsBotsModule extends Module {
    private readonly instances: StatsBot[];

    public constructor() {
        super();

        this.instances = AppGlobals.config.modules.serverStatsBots.bots.map(
            ({ token, serverId }, index) => {
                return new StatsBot(token, serverId, index);
            },
        );
    }

    public override async *start(): ModuleStartReturn {
        yield await this.loginAll();

        this.scheduleUpdates();
    }

    private async loginAll(): Promise<ModuleStartupResponse[]> {
        return await Promise.all(
            this.instances.map((instance) => instance.start()),
        );
    }

    private scheduleUpdates(): void {
        const { updateInterval } = AppGlobals.config.modules.serverStatsBots;

        setInterval(() => {
            for (const instance of this.instances) {
                instance.update().catch((error: unknown) => {
                    console.log(error);
                });
            }
        }, updateInterval * 1_000);
    }
}
