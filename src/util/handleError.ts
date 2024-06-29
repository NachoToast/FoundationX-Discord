import { ButtonInteraction, CommandInteraction, userMention } from 'discord.js';

export function handleError(
    interaction: CommandInteraction | ButtonInteraction,
    error: unknown,
): void {
    const { developerUserId } = AppGlobals.config;

    console.error(error);

    const errorMessage = [];

    if (developerUserId) {
        errorMessage.push(`Notifying ${userMention(developerUserId)}`);
    }

    if (error instanceof Error) {
        errorMessage.push('```js', error.name, error.message, '```');
    } else {
        errorMessage.push('An unknown error occurred :(');
    }

    interaction
        .reply({
            content: errorMessage.join('\n'),
            allowedMentions: {
                parse: [],
                users: developerUserId ? [developerUserId] : undefined,
            },
        })
        .catch(() => null);
}
