import {
    Client,
    ChatInputCommandInteraction,
    GuildTextBasedChannel,
    GuildMember,
} from 'discord.js';
import { Config } from '../Config';
import { Models } from '../Models';
import { Command } from './Command';

export interface CommandParams {
    client: Client<true>;

    interaction: ChatInputCommandInteraction<'cached' | 'raw'>;

    channel: GuildTextBasedChannel;

    member: GuildMember;

    models: Models;

    config: Config;

    commands: Map<string, Command>;
}
