import { Command } from '../types/Command';

export const helpCommand: Command = {
    name: 'help',

    description: 'Gets help for the bot or a specific command',

    async execute({ interaction, commands }) {
        const specificCommandName = interaction.options.getString(
            'command',
            false,
        );

        if (specificCommandName === null) {
            await interaction.reply({
                content:
                    'Use my commands by doing `/<command name>`, e.g `/help`\nYou can get a list of commands via `/list`',
            });
            return;
        }

        const specificCommand = commands.get(specificCommandName);

        if (specificCommand === undefined) {
            await interaction.reply({
                content: `Command \`${specificCommandName}\` not found.`,
            });
            return;
        }

        await interaction.reply({
            content: `\`/${specificCommand.name}\` - ${specificCommand.description}`,
        });
    },

    build(baseCommand, { commands }) {
        baseCommand.addStringOption((option) =>
            option
                .setName('command')
                .setDescription('The command to get help for')
                .setChoices(
                    ...Array.from(commands.keys()).map((e) => ({
                        name: e,
                        value: e,
                    })),
                ),
        );
    },
};
