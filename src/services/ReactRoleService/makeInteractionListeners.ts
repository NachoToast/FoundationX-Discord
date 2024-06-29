import { ComponentType, Message } from 'discord.js';
import { handleError } from '../../util/index.js';
import { handleButtonPress } from './handleButtonPress.js';
import { updateOrMakeInitialMessage } from './updateOrMakeInitialMessage.js';

/** Adds button press listeners to a message. */
export function makeInteractionListeners(message: Message<true>): void {
    message
        .createMessageComponentCollector<ComponentType.Button>()
        .on('collect', (interaction) => {
            handleButtonPress(interaction).catch((error: unknown) => {
                handleError(interaction, error);
            });
        })
        .on('end', () => {
            console.log(
                `[${new Date().toLocaleString()}] Regenerating collector`,
            );
            updateOrMakeInitialMessage().catch((error: unknown) => {
                console.error(error);
            });
        });
}
