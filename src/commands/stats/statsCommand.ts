import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { sendStats } from './makeEmbed';
import { sendNoStats } from './noStats';
import { sendLinkSteam, sendLinkSteamOther } from './steamLink';

export const statsCommand: Command = {
    name: 'stats',

    description: 'Gets in-game stats for SCP:SL',

    async execute({ interaction, models, config }) {
        const check = !!interaction.options.getBoolean('check', false);

        if (check) {
            const steamData = await models.steamModel.findOne({
                _id: interaction.user.id,
            });
            if (steamData === null) {
                await sendLinkSteam(interaction, config);
                return;
            }

            const button = new ButtonBuilder({
                label: 'Update Steam Account',
                style: ButtonStyle.Link,
                url: config.steamLinking.oAuthUrl,
            });

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                button,
            );

            await interaction.reply({
                content: `Your Discord account is associated with https://steamcommunity.com/profiles/${steamData.steamId64}\nLink a new one using the button below.\n`,
                ephemeral: true,
                components: [row],
            });

            return;
        }

        const steamId64 = interaction.options.getString('steam', false);

        if (steamId64 !== null) {
            const stats = await models.statsModel.findOne({ _id: steamId64 });
            if (stats === null) {
                await sendNoStats(
                    interaction,
                    steamId64,
                    false,
                    config.embedColour,
                );
            } else {
                await sendStats(
                    interaction,
                    stats,
                    steamId64,
                    config.embedColour,
                );
            }
            return;
        }

        const targetUser =
            interaction.options.getUser('user', false) ?? interaction.user;

        const isSelf = targetUser.id === interaction.user.id;

        const fetchedSteamData = await models.steamModel.findOne({
            _id: targetUser.id,
        });

        if (fetchedSteamData === null) {
            if (isSelf) {
                await sendLinkSteam(interaction, config);
            } else {
                await sendLinkSteamOther(interaction, targetUser);
            }
            return;
        }

        const stats = await models.statsModel.findOne({
            _id: fetchedSteamData.steamId64,
        });

        if (stats === null) {
            await sendNoStats(
                interaction,
                targetUser,
                false,
                config.embedColour,
            );
        } else {
            await sendStats(interaction, stats, targetUser, config.embedColour);
        }
    },

    build(baseCommand) {
        baseCommand.addUserOption((option) =>
            option.setName('user').setDescription('The user to get stats for'),
        );

        baseCommand.addStringOption((option) =>
            option.setName('steam').setDescription('The Steam ID 64 to lookup'),
        );

        baseCommand.addBooleanOption((option) =>
            option
                .setName('check')
                .setDescription(
                    'Check the Steam account linked to your Discord',
                ),
        );
    },
};
