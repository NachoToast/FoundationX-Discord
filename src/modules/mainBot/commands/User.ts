import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { NotFoundError } from '../../../errors/NotFoundError.js';
import { UserService } from '../../../services/index.js';
import { Command } from './Command.js';
import { LinkCommand } from './Link.js';

export class UserCommand extends Command {
    public constructor() {
        super('user', 'Check the Steam user linked to your Discord account');
    }

    public override async onInvoke(
        interaction: ChatInputCommandInteraction,
    ): Promise<void> {
        try {
            const ephemeral =
                interaction.options.get('ephemeral')?.value !== false;

            const user = await UserService.getUserByDiscordId(
                interaction.user.id,
            );

            if (user.steam !== null) {
                await interaction.reply({
                    content: `Your Steam account is [${user.steam.username}](https://steamcommunity.com/profiles/${user.steam.id})`,
                    ephemeral,
                });
            } else {
                await interaction.reply({
                    content:
                        'You have not linked a Steam account to your Discord account',
                    ephemeral,
                });
            }
        } catch (error) {
            if (error instanceof NotFoundError) {
                await new LinkCommand().onInvoke(interaction);
            } else {
                throw error;
            }
        }
    }

    public override build(): SlashCommandBuilder {
        const base = super.build();

        base.addBooleanOption((option) => {
            return option
                .setName('ephemeral')
                .setDescription(
                    'If `false`, response will be visible to everyone, default is `true`',
                );
        });

        return base;
    }
}
