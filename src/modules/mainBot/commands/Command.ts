import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export abstract class Command {
    public readonly name: string;

    public readonly description: string;

    public constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
    }

    public build(): SlashCommandBuilder {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description)
            .setDMPermission(false);
    }

    public abstract onInvoke(
        interaction: ChatInputCommandInteraction,
    ): Promise<void>;
}
