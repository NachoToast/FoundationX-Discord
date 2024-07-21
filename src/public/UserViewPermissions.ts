/** Permissions related to viewing properties of the user object. */
export enum UserViewPermissions {
    None = 0,

    /** Can see `user.discord.id` and `user.discord.lastUpdatedAt` */
    DiscordFull = 1,

    /** Can see `user.steam` */
    SteamPrimary = 2,

    /** Can see `user.otherSteamConnections` */
    SteamSecondary = 4,

    /** Can see `user.logs` */
    Logs = 8,

    /** Can see `user.meta.latestIp` */
    IpAddresses = 16,
}
