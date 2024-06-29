import { Colour } from '../../types/index.js';

type ModuleName = 'MainBot' | 'Cluster' | 'MongoDB' | 'ReactRole' | 'App';

const moduleColours: Record<ModuleName, string> = {
    MainBot: Colour.FgMagenta,
    Cluster: Colour.FgBlue,
    MongoDB: Colour.FgGreen,
    ReactRole: Colour.FgCyan,
    App: Colour.FgYellow,
};

export function logAction(
    moduleName: ModuleName,
    message: string,
    timestamp?: number,
): void {
    const prefix = `[${moduleColours[moduleName]}${moduleName}${Colour.Reset}]`;

    if (timestamp === undefined) {
        console.log(`${prefix} ${message}`);
        return;
    }

    const timePassed = (Date.now() - timestamp).toLocaleString();

    console.log(
        `${prefix} ${message} (${Colour.FgYellow}${timePassed}ms${Colour.Reset})`,
    );
}
