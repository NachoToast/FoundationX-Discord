import {
    ButtonInteraction,
    ComponentType,
    Message,
    Snowflake,
} from 'discord.js';
import { Config, ReactRole } from '../types/Config';

/**
 * Creates and sends feedback message to show the
 * user when they have a role added or removed.
 */
async function sendFeedbackMessage(
    interaction: ButtonInteraction<'cached'>,
    action: 'add' | 'remove',
    role: ReactRole,
): Promise<void> {
    const { addMessage, removeMessage, label } = role;

    let feedbackMessage: string;

    if (action === 'add') {
        // The role was added.
        if (addMessage === undefined) {
            // Default add message.
            feedbackMessage = `You now have the **${label}** role`;
        } else {
            // Custom add message.
            feedbackMessage = addMessage.replaceAll('%s', label);
        }
    } else {
        // The role was removed.
        if (removeMessage === undefined) {
            // Default remove message.
            feedbackMessage = `You no longer have the **${label}** role`;
        } else {
            // Custom remove message.
            feedbackMessage = removeMessage.replaceAll('%s', label);
        }
    }

    await interaction.reply({ content: feedbackMessage, ephemeral: true });
}

/** Handles button clicks. */
async function handleInteraction(
    interaction: ButtonInteraction<'cached'>,
    roleMap: Map<Snowflake, ReactRole>,
): Promise<void> {
    const roleId = interaction.customId.split('-')[1];
    const role = roleMap.get(roleId);

    if (role === undefined) {
        await interaction.reply({
            content: 'Unrecognised role, I may not be configured correctly :P',
        });
        return;
    }

    const myRolePosition =
        interaction.guild.members.me?.roles.botRole?.position ?? -1;

    const targetRolePosition =
        interaction.guild.roles.cache.get(roleId)?.position ?? -1;

    if (
        myRolePosition !== -1 &&
        targetRolePosition !== -1 &&
        myRolePosition <= targetRolePosition
    ) {
        await interaction.reply({
            content: `I can't give you the **${role.label}** role because it's higher than me`,
        });
        return;
    }

    const member = await interaction.guild.members.fetch(interaction.user.id);

    if (member.roles.cache.has(roleId)) {
        // Member already has the role, so remove it.
        try {
            await member.roles.remove(roleId);
            await sendFeedbackMessage(interaction, 'remove', role);
        } catch (error) {
            await interaction.reply({
                content: `Failed to remove the role **${role.label}** - ${
                    error instanceof Error ? error.message : 'Unknown Error'
                }`,
            });
        }
    } else {
        // Member does not have the role, so add it.
        try {
            await member.roles.add(roleId);
            await sendFeedbackMessage(interaction, 'add', role);
        } catch (error) {
            await interaction.reply({
                content: `Failed to add the role **${role.label}** - ${
                    error instanceof Error ? error.message : 'Unknown Error'
                }`,
            });
        }
    }
}

/** Adds button click listeners to a message. */
export function makeMessageListeners(
    message: Message<true>,
    reactRoleConfig: Config['mainBot']['reactRoles'],
): void {
    const { roles } = reactRoleConfig;

    const validIds = new Set(
        Object.keys(roles).map((id) => `${message.guildId}-${id}`),
    );

    const roleMap = new Map<Snowflake, ReactRole>(
        Object.entries(roles).map(([key, value]) => [key, value]),
    );

    const collector =
        message.createMessageComponentCollector<ComponentType.Button>({
            filter: (interaction) => validIds.has(interaction.customId),
        });

    collector.on('collect', async (interaction) => {
        await handleInteraction(interaction, roleMap);
    });

    collector.on('end', () => {
        console.log(`[${new Date().toLocaleString()}] Regenerating collector`);
        makeMessageListeners(message, reactRoleConfig);
    });
}
