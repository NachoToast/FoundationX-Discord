import { ButtonStyle } from 'discord.js';
import { readFileSync } from 'fs';
import { Validator } from '../../classes/index.js';
import { Colour, Config } from '../../types/index.js';

const FILE_NAME = Colour.FgRed + 'config.json' + Colour.Reset + ' file';

/** Loads and validates config from the root `config.json` file. */
export function loadConfig(): Config {
    // MARK: Parsing

    // First try to read file contents.
    let fileContents: string;

    try {
        fileContents = readFileSync('config.json', 'utf-8');
    } catch (error) {
        if (!(error instanceof Error)) {
            throw error;
        }

        if (error.code === 'ENOENT') {
            console.error(`Missing ${FILE_NAME}`);
        } else {
            console.error(
                `An unknown error occurred when attempting to read the ${FILE_NAME}:\n`,
                error,
            );
        }

        process.exit(1);
    }

    // Now try to parse the contents.
    let parsedConfig: Config;

    try {
        parsedConfig = JSON.parse(fileContents) as Config;
    } catch (error) {
        if (!(error instanceof Error)) {
            throw error;
        }

        if (error instanceof SyntaxError) {
            console.error(`Invalid syntax in ${FILE_NAME}: ${error.message}`);
        } else {
            console.error(
                `An unknown error occurred when attempting to parse the ${FILE_NAME}:\n`,
                error,
            );
        }

        process.exit(1);
    }

    // MARK: Validation

    const validate = Validator.for(parsedConfig, FILE_NAME);

    validate('production', ['boolean']);

    validate('developerUserId', ['string', 'undefined']);

    validate('mainBot', ['object'])
        .child('embedColour', ['string'], (embedColour) => {
            embedColour.custom((x) => {
                if (!/^#[0-9a-fA-F]{6}$/.test(x)) {
                    throw new Error('should be a valid hex colour code');
                }
            });
        })
        .child('token', ['string'])
        .child('loginTimeout', ['number'], (loginTimeout) => {
            loginTimeout.integer().min(0);
        })
        .child('deployTimeout', ['number'], (deployTimeout) => {
            deployTimeout.integer().min(0);
        })
        .child('reactRoles', ['object'], (reactRoles) => {
            reactRoles
                .child('guildId', ['string'])
                .child('channelId', ['string'])
                .child('roles', ['object'], (roles) => {
                    roles.values(['object'], (reactRole) => {
                        reactRole
                            .child('label', ['string'])
                            .child('style', ['number'], (style) => {
                                style
                                    .integer()
                                    .min(ButtonStyle.Primary)
                                    .max(ButtonStyle.Danger);
                            })
                            .child('emoji', ['string'])
                            .child('addMessage', ['string', 'undefined'])
                            .child('removeMessage', ['string', 'undefined']);
                    });
                });
        });

    validate('webApi', ['object'])
        .child('port', ['number'], (port) => port.integer().min(0).max(65535))
        .child('clientUrls', ['array'], (clientUrls) => {
            clientUrls
                .min(1)
                .custom((x) => {
                    if (x.includes('*') && x.length > 1) {
                        throw new Error(
                            'cannot have other origins when using the wildcard',
                        );
                    }
                })
                .forEach(['string'], (clientUrl) => {
                    clientUrl.custom((x) => {
                        if (x === '*') return;

                        new URL(x); // Throws if invalid.
                    });
                });
        })
        .child('rateLimit', ['number'], (rateLimit) => {
            rateLimit.integer().min(0);
        })
        .child('proxyCount', ['number'], (proxyCount) => {
            proxyCount.integer().min(0);
        });

    validate('mongoDb', ['object'])
        .child('uri', ['string'])
        .child('dbName', ['string'], (dbName) => dbName.min(1).max(38))
        .child('connectTimeout', ['number'], (connectTimeout) => {
            connectTimeout.integer().min(0);
        });

    validate('serverStats', ['object'])
        .child('expectedUpdateInterval', ['number'], (updateInterval) => {
            updateInterval.min(1).finite();
        })
        .child('loginTimeout', ['number'], (loginTimeout) => {
            loginTimeout.integer().min(0);
        })
        .child('servers', ['object'], (servers) =>
            servers.values(['object'], (server) => {
                server
                    .child('authToken', ['string'])
                    .child('discordToken', ['string']);
            }),
        );

    validate('discordOAuth', ['object'])
        .child('clientId', ['string'], (clientId) => clientId.min(1))
        .child('clientSecret', ['string'], (clientSecret) => {
            clientSecret.min(1);
        });

    return parsedConfig;
}
