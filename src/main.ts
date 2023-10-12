import { loadMongo, loadWebServer } from './loaders';
import { loadConfig } from './loaders/loadConfig';
import { loadMainBot } from './loaders/loadMainBot';
import { Colour } from './types/Utility';

async function main(): Promise<void> {
    const config = loadConfig();

    const models = await loadMongo(config);

    await Promise.all([
        loadWebServer(config, models),
        loadMainBot(config, models),
    ]);

    console.log(
        `${Colour.FgGreen}Setup everything successfully!${Colour.Reset}`,
    );
}

void main();
