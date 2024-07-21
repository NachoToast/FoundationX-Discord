import { readFileSync } from 'fs';
import { Colour } from './types/Colour.js';
import { Config } from './types/Config.js';
import { validateConfig } from './validateConfig.js';

/** Loads and validates config from the root `config.json` file. */
export function loadConfig(): Config {
    const fileName = Colour.FgRed + 'config.json' + Colour.Reset + ' file';

    let fileContents;
    let config;

    try {
        fileContents = readFileSync('config.json', 'utf-8');
    } catch (error) {
        if (!(error instanceof Error)) {
            throw error;
        }

        if (error.code === 'ENOENT') {
            console.error(`Missing ${fileName}`);
        } else {
            console.error(
                `An unknown error occurred when attempting to read the ${fileName}:\n`,
                error,
            );
        }

        process.exit(1);
    }

    try {
        config = JSON.parse(fileContents) as Config;
    } catch (error) {
        if (!(error instanceof Error)) {
            throw error;
        }

        if (error instanceof SyntaxError) {
            console.error(`Invalid syntax in ${fileName}: ${error.message}`);
        } else {
            console.error(
                `An unknown error occurred when attempting to parse the ${fileName}:\n`,
                error,
            );
        }

        process.exit(1);
    }

    validateConfig(config);

    return config;
}
