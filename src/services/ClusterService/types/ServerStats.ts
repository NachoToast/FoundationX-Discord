interface OnlineServerStats {
    online: true;

    playersOnline: number;

    playerCap: number;
}

interface OfflineServerStats {
    online: false;
}

interface ErroredServerStats {
    online: 'ERROR';

    code: string;
}

export type ServerStats =
    | OnlineServerStats
    | OfflineServerStats
    | ErroredServerStats;
