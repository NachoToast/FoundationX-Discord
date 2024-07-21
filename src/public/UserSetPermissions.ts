/**
 * Permissions related to specific updating of properties of the `user` object.
 *
 * "Specific" means that the operations requiring these permissions set a value
 * to a user-defined one.
 *
 * See `UserUpdatePermissions` for "non-specific" updating.
 */
export enum UserSetPermissions {
    None = 0,

    /** Set `user.economy.balance` */
    SetEconomyBalance = 1,

    /** Set `user.rank` to eligible values. */
    SetRank = 2,
}
