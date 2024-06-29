import { SlashCommandBuilder } from 'discord.js';
import { SlashCommandParams } from './Params.js';

export interface SlashCommand {
    name: string;

    description: string;

    /** Method run when this slash command is called. */
    onInvoke: (params: SlashCommandParams) => Promise<void>;

    /** Additional build steps for this slash command, if needed. */
    build?: (baseCommand: SlashCommandBuilder) => void;
}
