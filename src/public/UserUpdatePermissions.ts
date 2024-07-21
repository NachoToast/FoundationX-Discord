/**
 * Permissions related to non-specific updating of properties of the `user`
 * object.
 *
 * "Non-specific" means that the operations requiring these permissions do not
 * set a value to a user-defined one, but rather compute a new value
 * themselves.
 *
 * See `UserSetPermissions` for "specific" updating.
 */
export enum UserUpdatePermissions {
    None = 0,

    /** Manually trigger a refresh of `user.discord` */
    RefreshDiscord = 1,

    /** Empty `user.logs` */
    ClearLogs = 2,
}
