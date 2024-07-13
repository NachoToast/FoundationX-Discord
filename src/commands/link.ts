import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    OAuth2Routes,
    OAuth2Scopes,
} from 'discord.js';
import { SlashCommand } from '../types/index.js';

export const linkCommand: SlashCommand = {
    name: 'link',
    description: 'Link your Steam and Discord account for use with the bot.',
    async onInvoke({ interaction }) {
        const jwtSecret = AppGlobals.config.webApi.jwtSecret;
        const { clientId, redirectUri } = AppGlobals.config.discordAuth;

        const state =
            parseInt(interaction.user.id) ^ (parseInt(jwtSecret, 36) || 0);

        const linkParams = new URLSearchParams([
            ['response_type', 'code'],
            ['client_id', clientId],
            ['state', state.toString()],
            ['redirect_uri', redirectUri],
            ['prompt', 'consent'],
            [
                'scope',
                [OAuth2Scopes.Identify, OAuth2Scopes.Connections].join(' '),
            ],
        ]);

        const oAuthLink = `${OAuth2Routes.authorizationURL}?${linkParams.toString()}`;

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel('Link Account')
                .setURL(oAuthLink),
        );

        await interaction.reply({
            content: 'Click the button below to begin the linking process.',
            components: [row],
            ephemeral: true,
        });
    },
};
