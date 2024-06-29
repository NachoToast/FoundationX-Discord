import { fetchReactRoleChannel } from './fetchReactRoleChannel.js';

export async function validateRolePositions(): Promise<void> {
    const { roles } = AppGlobals.config.mainBot.reactRoles;

    const { guild } = await fetchReactRoleChannel();

    const selfRolePosition = guild.members.me?.roles.botRole?.position;

    if (selfRolePosition === undefined) {
        throw new Error(`Bot role not found in ${guild.name}`);
    }

    await Promise.all([
        Object.entriesT(roles).map(async ([id, role]) => {
            const roleInGuild = await guild.roles.fetch(id);

            if (roleInGuild === null) {
                throw new Error(
                    `Role for ${role.label} (${id}) not found in ${guild.name}`,
                );
            }

            const rolePosition = roleInGuild.position;

            if (rolePosition >= selfRolePosition) {
                throw new Error(
                    `Role for ${role.label} (${roleInGuild.name}) is higher than the bot role in ${guild.name}`,
                );
            }
        }),
    ]);
}
