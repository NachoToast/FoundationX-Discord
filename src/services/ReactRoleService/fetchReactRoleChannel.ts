import { ChannelType, Collection, TextChannel } from 'discord.js';

/**
 * Fetches the channel that the react-role message should be sent in.
 * @throws Throws an error if fetching the guild or channel fails, or if the
 * fetched channel is an invalid type.
 */
export async function fetchReactRoleChannel(): Promise<TextChannel> {
    const { client, config } = AppGlobals;
    const { guildId, channelId } = config.mainBot.reactRoles;

    // 1. Fetch the guild.

    const guild = await client.guilds.fetch(guildId);

    if (guild instanceof Collection) {
        throw new Error(`Received a collection when fetching guild ${guildId}`);
    }

    // 2. Fetch the channel from the guild.

    const channel = await guild.channels.fetch(channelId);

    if (channel instanceof Collection) {
        throw new Error(
            `Received a collection when fetching channel ${channelId} from guild ${guild.name}`,
        );
    }

    if (channel === null) {
        throw new Error(
            `Channel with ID ${channelId} not found in guild ${guild.name}`,
        );
    }

    // 3. Ensure channel is the right type.
    // (the bot can't send messages in a non-text channel after all)

    if (channel.type !== ChannelType.GuildText) {
        throw new Error(
            `Channel ${channel.name} in guild ${guild.name} is not a text channel (got ${ChannelType[channel.type]})`,
        );
    }

    return channel;
}
