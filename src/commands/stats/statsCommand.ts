import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';
import { Command } from '../../types/Command';
import { sendStats } from './makeEmbed';
import { sendNoStats } from './noStats';
import { sendLinkSteam, sendLinkSteamOther } from './steamLink';

export const statsCommand: Command = {
    name: 'stats',

    description: 'Gets in-game stats for SCP:SL',

    async execute({ interaction, models, config, statsCollector }) {
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
            if (!/^[0-9]{1,}$/.test(steamId64)) {
                const button = new ButtonBuilder({
                    label: 'Find your SteamID64',
                    style: ButtonStyle.Link,
                    url: 'https://steamid.io/lookup/',
                });
                const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                    button,
                );
                await interaction.reply({
                    content: 'Steam ID64 please.',
                    components: [row],
                });
                return;
            }

            const [stats, levelData] = await Promise.all([
                models.statsModel.findOne({ _id: steamId64 }),
                models.levelsModel.findOne({ _id: `${steamId64}@steam` }),
            ]);
            if (stats === null) {
                await sendNoStats(
                    interaction,
                    steamId64,
                    false,
                    config.embedColour,
                );
            } else {
                const statsInsights = statsCollector.getRankingFor(
                    steamId64,
                    stats,
                );

                await sendStats(
                    interaction,
                    stats,
                    steamId64,
                    levelData,
                    config.embedColour,
                    statsInsights,
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

        const [stats, levelData] = await Promise.all([
            models.statsModel.findOne({
                _id: fetchedSteamData.steamId64,
            }),
            models.levelsModel.findOne({
                _id: `${fetchedSteamData.steamId64}@steam`,
            }),
        ]);

        if (stats === null) {
            await sendNoStats(
                interaction,
                targetUser,
                false,
                config.embedColour,
            );
        } else {
            const statsInsights = statsCollector.getRankingFor(
                fetchedSteamData.steamId64,
                stats,
            );

            await sendStats(
                interaction,
                stats,
                targetUser,
                levelData,
                config.embedColour,
                statsInsights,
            );
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
