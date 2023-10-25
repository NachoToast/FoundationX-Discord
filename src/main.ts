import { loadCluster, loadMongo, loadWebServer } from './loaders';
import { loadConfig } from './loaders/loadConfig';
import { loadMainBot } from './loaders/loadMainBot';
import { StatsCollector } from './statsCollector';
import { Colour } from './types/Utility';

async function main(): Promise<void> {
    const config = loadConfig();

    const models = await loadMongo(config);

    const statsCollector = new StatsCollector(models.statsModel);

    await Promise.all([
        loadWebServer(config, models),
        loadMainBot(config, models, statsCollector),
        loadCluster(config),
    ]);

    console.log(
        `${Colour.FgGreen}Setup everything successfully!${Colour.Reset}`,
    );
}

void main();
