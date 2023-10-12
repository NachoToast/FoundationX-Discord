import { ButtonStyle, ComponentEmojiResolvable } from 'discord.js';

export interface ReactRole {
    label: string;
    style: Exclude<ButtonStyle, ButtonStyle.Link>;
    emoji: ComponentEmojiResolvable;
    addMessage?: string;
    removeMessage?: string;
}
