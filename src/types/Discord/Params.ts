import {
    BaseInteraction,
    ChatInputCommandInteraction,
    GuildMember,
    GuildTextBasedChannel,
} from 'discord.js';

interface BaseParams<T extends BaseInteraction> {
    interaction: T;

    member: GuildMember;
}

export interface SlashCommandParams
    extends BaseParams<ChatInputCommandInteraction> {
    channel: GuildTextBasedChannel;
}
