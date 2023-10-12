import { ServerResponse } from 'http';
import { APIConnection, APIUser, ConnectionService } from 'discord.js';
import { SteamModel } from '../types/Models';

/**
 * Updates a user's Steam account in the database,
 * given their Discord connections and user data.
 */
export async function handleConnections(
    connections: APIConnection[],
    userData: APIUser,
    res: ServerResponse,
    steamModel: SteamModel,
): Promise<void> {
    const steamConnection = connections.find(
        (e) => e.type === ConnectionService.Steam,
    );

    if (steamConnection === undefined) {
        res.writeHead(400);
        res.end(
            `No Steam connection found for Discord user ${userData.username}`,
        );
        return;
    }

    const updateResult = await steamModel.updateOne(
        { _id: userData.id },
        { $set: { steamId64: steamConnection.id } },
        { upsert: true },
    );

    const endMessage = 'You can close this tab now.';

    if (updateResult.modifiedCount === 1) {
        res.writeHead(200);
        res.end(
            `Updated Steam account of ${userData.username} to ${steamConnection.name}.\n${endMessage}`,
        );
    } else if (updateResult.upsertedCount === 1) {
        res.writeHead(200);
        res.end(
            `Set Steam account of ${userData.username} to ${steamConnection.name}.\n${endMessage}`,
        );
    } else if (updateResult.matchedCount === 1) {
        res.writeHead(200);
        res.end(
            `Steam account of ${userData.username} was already set to ${steamConnection.name}.\n${endMessage}`,
        );
    } else {
        res.writeHead(500);
        res.end(
            `Database error occurred when setting Steam account of ${
                userData.username
            } to ${steamConnection.name}.\n${JSON.stringify(
                updateResult,
                undefined,
                4,
            )}`,
        );
    }
}
