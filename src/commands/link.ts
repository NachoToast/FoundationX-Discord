import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import { Command } from '../types/Command';

export const linkCommand: Command = {
    name: 'link',

    description: "Checks whether you're linked to a Steam account",

    async execute({ interaction, models, config }) {
        const steamData = await models.steamModel.findOne({
            _id: interaction.user.id,
        });

        if (steamData === null) {
            const button = new ButtonBuilder({
                label: 'Link Steam Account',
                style: ButtonStyle.Link,
                url: config.steamLinking.oAuthUrl,
            });

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                button,
            );

            await interaction.reply({
                content: 'You have not linked your Steam account.',
                components: [row],
            });
            return;
        }

        const button = new ButtonBuilder({
            label: 'Update Steam Account',
            style: ButtonStyle.Link,
            url: config.steamLinking.oAuthUrl,
        });

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

        await interaction.reply({
            content: `Your Discord account is associated with https://steamcommunity.com/profiles/${steamData.steamId64}\nLink a new one using the button below.\n`,
            ephemeral: true,
            components: [row],
        });
    },
};
