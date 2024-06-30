import { readFileSync } from 'fs';
import { join } from 'path';

const allGames = readFileSync(join('data', 'games.txt'), 'utf-8')
    .split('\n')
    .filter((e) => e.trim().length > 0);
const gamesCount = allGames.length;

export function chooseRandomGame(): string {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return allGames[Math.floor(Math.random() * gamesCount)]!;
}
