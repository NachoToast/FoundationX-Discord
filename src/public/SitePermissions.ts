import { UserRank } from './UserRank.js';
import { UserSetPermissions } from './UserSetPermissions.js';
import { UserUpdatePermissions } from './UserUpdatePermissions.js';
import { UserViewPermissions } from './UserViewPermissions.js';

export interface SitePermissions {
    /** Computed permissions for every rank. */
    byRank: Record<
        UserRank,
        {
            user: {
                set: UserSetPermissions;

                update: UserUpdatePermissions;

                view: UserViewPermissions;
            };
        }
    >;

    /**
     * Rank hierarchy, determines when rank modifications are allowed. Ranks
     * with higher hierarchies can modify the rank of users with lower ones.
     */
    hierarchy: Record<UserRank, number>;
}
