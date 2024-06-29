import {
    Collection,
    CommandInteraction,
    Events,
    GuildMember,
} from 'discord.js';
import { allCommands } from '../commands/index.js';
import { handleError } from '../util/index.js';

const commandsCollection = new Collection(allCommands.map((e) => [e.name, e]));

async function handleInvoke(interaction: CommandInteraction): Promise<void> {
    if (!interaction.isChatInputCommand()) {
        await interaction.reply('Not a chat input command');
        return;
    }

    if (!interaction.inGuild()) {
        await interaction.reply('Not in a guild');
        return;
    }

    if (!(interaction.member instanceof GuildMember)) {
        await interaction.reply('No member');
        return;
    }

    if (interaction.channel === null) {
        await interaction.reply('No channel');
        return;
    }

    const command = commandsCollection.get(interaction.commandName);

    if (command === undefined) {
        await interaction.reply('Command not found');
        return;
    }

    await command.onInvoke({
        interaction,
        channel: interaction.channel,
        member: interaction.member,
    });
}

/** Adds an event listener to the client for slash command interactions. */
export function registerCommandListeners(): void {
    AppGlobals.client.on(Events.InteractionCreate, (interaction) => {
        if (!interaction.isCommand()) return;

        handleInvoke(interaction).catch((error: unknown) => {
            handleError(interaction, error);
        });
    });
}
