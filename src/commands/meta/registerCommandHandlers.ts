import { Client, Events, GuildMember } from 'discord.js';
import { StatsCollector } from '../../statsCollector';
import { Config } from '../../types/Config';
import { Models } from '../../types/Models';
import { Colour } from '../../types/Utility';
import { commandMap } from './commandMap';

export function registerCommandHandlers(
    client: Client<true>,
    models: Models,
    config: Config,
    statsCollector: StatsCollector,
): void {
    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isCommand()) return;

        if (!interaction.inGuild()) {
            await interaction.reply({
                content: 'This bot does not support DMs',
                ephemeral: true,
            });
            return;
        }

        if (!interaction.isChatInputCommand()) return;

        const command = commandMap.get(interaction.commandName);

        if (command === undefined) {
            await interaction.reply({
                content: 'This command does not yet exist',
                ephemeral: true,
            });
            return;
        }

        if (
            interaction.channel === null ||
            interaction.guild === null ||
            !(interaction.member instanceof GuildMember)
        ) {
            return;
        }

        try {
            await command.execute({
                client,
                interaction,
                channel: interaction.channel,
                member: interaction.member,
                models,
                config,
                commands: commandMap,
                statsCollector,
            });
        } catch (error) {
            if (!config.production) console.log(error);

            if (error instanceof Error) {
                if (interaction.replied) {
                    await interaction.editReply({ content: error.message });
                } else {
                    await interaction.reply({ content: error.message });
                }
                return;
            }

            console.log(
                `${Colour.FgMagenta}${interaction.member.user.username}${Colour.Reset} encountered an unknown error while using the ${Colour.FgMagenta}/${interaction.commandName}${Colour.Reset} command in ${Colour.FgMagenta}${interaction.guild.name}${Colour.Reset}:`,
                error,
            );

            if (interaction.replied) {
                await interaction.editReply({
                    content: 'Something went while running this command',
                });
            } else {
                await interaction.reply({
                    content: 'Something went while running this command',
                });
            }
        }
    });
}
