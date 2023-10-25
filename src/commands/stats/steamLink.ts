import { ButtonBuilder, ButtonStyle, ActionRowBuilder, User } from 'discord.js';
import { CommandParams } from '../../types/Command';
import { Config } from '../../types/Config';

export async function sendLinkSteam(
    interaction: CommandParams['interaction'],
    config: Config,
): Promise<void> {
    const button = new ButtonBuilder({
        label: 'Link Steam Account',
        style: ButtonStyle.Link,
        url: config.steamLinking.oAuthUrl,
    });

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

    await interaction.reply({
        content:
            'You have not linked your Steam account (alternatively, use your SteamID64).',
        components: [row],
    });
}

export async function sendLinkSteamOther(
    interaction: CommandParams['interaction'],
    user: User,
): Promise<void> {
    await interaction.reply({
        content: `${user.displayName} has not linked their Steam account.`,
    });
}
