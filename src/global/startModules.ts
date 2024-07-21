import { MainBotModule } from '../modules/mainBot/MainBotModule.js';
import { Module, ModuleStartupResponse } from '../modules/Module.js';
import { ServerStatsBotsModule } from '../modules/serverStatsBots/ServerStatsBotsModule.js';
import { WebApiModule } from '../modules/webApi/WebApiModule.js';
import { Colour } from './types/Colour.js';

interface ModuleWithMeta {
    module: Module;

    name: string;

    colour: string;
}

async function start({ module, name, colour }: ModuleWithMeta): Promise<void> {
    let lastTime = Date.now();

    const prefix = `[${colour}${name}${Colour.Reset}]`;

    for await (const startReturn of module.start()) {
        const responses = Array.isArray(startReturn)
            ? startReturn.filter((e): e is ModuleStartupResponse => !!e)
            : [startReturn];

        for (const { message, variables, finishedAt } of responses) {
            const timeTaken =
                Colour.FgYellow +
                (finishedAt - lastTime).toLocaleString() +
                'ms' +
                Colour.Reset;

            const vars = variables
                ? ` ${Colour.FgCyan}${variables}${Colour.Reset}`
                : '';

            console.log(`${prefix} ${message}${vars} (${timeTaken})`);
        }

        lastTime = Date.now();
    }
}

/** Does startup actions for all enabled modules. */
export async function startModules(): Promise<void> {
    const { modules } = AppGlobals.config;

    const enabledModules = new Array<ModuleWithMeta>();

    if (modules.mainBot.enabled) {
        enabledModules.push({
            module: new MainBotModule(),
            name: 'MainBot',
            colour: Colour.FgMagenta,
        });
    }

    if (modules.serverStatsBots.enabled) {
        enabledModules.push({
            module: new ServerStatsBotsModule(),
            name: 'ServerStatsBots',
            colour: Colour.FgBlue,
        });
    }

    if (modules.webApi.enabled) {
        enabledModules.push({
            module: new WebApiModule(),
            name: 'WebAPI',
            colour: Colour.FgYellow,
        });
    }

    await Promise.all(enabledModules.map((module) => start(module)));
}
