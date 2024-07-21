import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    OAuth2Routes,
    OAuth2Scopes,
} from 'discord.js';
import { Command } from './Command.js';

export class LinkCommand extends Command {
    private readonly oAuthLink: string;

    public constructor() {
        super(
            'link',
            'Link your Steam and Discord account for use with the bot.',
        );

        const { clientId, redirectUri } =
            AppGlobals.config.services.discordAuth;

        const linkParams = new URLSearchParams([
            ['response_type', 'code'],
            ['client_id', clientId],
            ['redirect_uri', redirectUri],
            ['prompt', 'consent'],
            [
                'scope',
                [OAuth2Scopes.Identify, OAuth2Scopes.Connections].join(' '),
            ],
        ]);

        this.oAuthLink = `${OAuth2Routes.authorizationURL}?${linkParams.toString()}`;
    }

    public override async onInvoke(
        interaction: ChatInputCommandInteraction,
    ): Promise<void> {
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setStyle(ButtonStyle.Link)
                .setLabel('Link Account')
                .setURL(this.oAuthLink),
        );

        await interaction.reply({
            content: 'Click the button below to begin the linking process.',
            components: [row],
            ephemeral: true,
        });
    }
}
