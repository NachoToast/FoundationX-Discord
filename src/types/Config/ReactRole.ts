import { ButtonStyle } from 'discord.js';

export interface ReactRole {
    label: string;

    style: Exclude<ButtonStyle, ButtonStyle.Link>;

    emoji: string;

    addMessage?: string;

    removeMessage?: string;
}
