type ServerStats =
    | {
          online: true;
          playersOnline: number;
          playerCap: number;
      }
    | { online: false }
    | { online: 'ERROR'; code?: number };

export async function fetchServerStats(serverId: string): Promise<ServerStats> {
    try {
        const response = await fetch(
            `https://api.scplist.kr/api/servers/${serverId}`,
            { headers: { Accept: 'application/json;charset=UTF-8' } },
        );

        if (!response.ok) {
            return {
                online: 'ERROR',
                code: response.status,
            };
        }

        const data = (await response.json()) as {
            online: boolean;
            players: string;
        } | null;

        if (data === null) {
            return { online: false };
        }

        if (!data.online) {
            return { online: false };
        }

        const [playersOnline, playerCap] = data.players
            .split('/')
            .map((e) => parseInt(e));

        return {
            online: true,
            playersOnline,
            playerCap,
        };
    } catch (error) {
        console.log(error);
        return {
            online: 'ERROR',
        };
    }
}
