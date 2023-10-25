import { User } from 'discord.js';
import { getSteamData } from '../../getSteamData';

export type IContext =
    | {
          type: 'user';
          user: User;
      }
    | {
          type: 'steam';
          user: Awaited<ReturnType<typeof getSteamData>> & { id: string };
      };
