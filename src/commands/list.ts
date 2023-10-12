import { Command } from '../types/Command';

export const listCommand: Command = {
    name: 'list',

    description: 'Lists all commands',

    async execute({ interaction, commands }) {
        const commandList = Array.from(commands.values())
            .map((e) => `\`${e.name}\` - ${e.description}`)
            .join('\n');

        await interaction.reply({
            content: `${commands.size} Commands:\n${commandList}`,
        });
    },
};
