import { SlashCommandBuilder } from 'discord.js';
import { CommandParams } from './CommandParams';

export interface Command {
    name: string;

    description: string;

    execute: ({
        client,
        interaction,
        channel,
        member,
        models,
        config,
        commands,
    }: CommandParams) => Promise<void>;

    build?: (
        baseCommand: SlashCommandBuilder,
        {
            client,
            config,
            commands,
        }: Pick<CommandParams, 'client' | 'config' | 'commands'>,
    ) => void;
}
