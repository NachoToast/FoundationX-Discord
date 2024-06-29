import { Client } from 'discord.js';
import { Express } from 'express';
import { Db } from 'mongodb';
import { Config } from '../types/index.js';

const mockedConfig: Config = {
    production: false,
    mainBot: {
        embedColour: '#FFFFFF',
        token: '',
        loginTimeout: 0,
        deployTimeout: 0,
        reactRoles: {
            guildId: '',
            channelId: '',
            roles: {},
        },
    },
    cluster: {
        updateInterval: 1,
        loginTimeout: 0,
        bots: [],
    },
    webApi: {
        port: 0,
        clientUrls: [],
        rateLimit: 0,
        proxyCount: 0,
    },
    mongoDb: {
        uri: '',
        dbName: '',
        connectTimeout: 0,
    },
    serverStats: {
        expectedUpdateInterval: 1,
        servers: {},
    },
};

export function mockGlobals(): void {
    globalThis.AppGlobals = {
        client: {} as Client<true>,
        config: mockedConfig,
        app: {} as Express,
        db: {} as Db,
        startTime: new Date(),
        commit: null,
    };
}
