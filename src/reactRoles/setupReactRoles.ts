import { Client, ChannelType, Message } from 'discord.js';
import { Config } from '../types/Config';
import { Colour } from '../types/Utility';
import { makeMessageContent } from './makeMessageContent';
import { makeMessageListeners } from './makeMessageListeners';
import { getSavedMessageId, setSavedMessageId } from './savedMessageHelpers';

export async function setupReactRoles(
    client: Client<true>,
    reactRoleConfig: Config['mainBot']['reactRoles'],
): Promise<void> {
    const { guildId, channelId, roles } = reactRoleConfig;

    // 1. Fetch guild.
    const guild = await client.guilds.fetch(guildId);

    // 2. Fetch channel in guild.
    const channel = await guild.channels.fetch(channelId);
    if (channel === null) {
        console.log(
            `Cannot find channel with ID ${Colour.FgRed}${channelId}${Colour.Reset} to setup react roles!`,
        );
        process.exit(1);
    }
    if (channel.type !== ChannelType.GuildText) {
        console.log(
            `Channel ${Colour.FgRed}${channel.name}${Colour.Reset} is not a text channel!`,
        );
        process.exit(1);
    }

    // 3. Check for previous message.
    const previousMessageId = getSavedMessageId();
    let message: Message<true> | null = null;

    if (previousMessageId !== null) {
        // Previous message should exist, so try to fetch it.
        try {
            message = await channel.messages.fetch(previousMessageId);
            message = await message.edit(makeMessageContent(channel, roles));
        } catch (error) {
            // Fetch will throw if message doesn't exist (i.e. was deleted).
        }
    }

    if (message === null) {
        // Previous message doesn't exist, or was deleted, so make a new one.
        message = await channel.send(makeMessageContent(channel, roles));
        setSavedMessageId(message.id);
    }

    // 4. Make listeners on message.
    makeMessageListeners(message, reactRoleConfig);
}
