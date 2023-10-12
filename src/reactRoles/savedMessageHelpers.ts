import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { Snowflake } from 'discord.js';

const fileLocation = join('data', '_previousMessage.txt');

if (!existsSync('data')) {
    mkdirSync('data');
}

export function getSavedMessageId(): string | null {
    if (!existsSync(fileLocation)) return null;
    return readFileSync(fileLocation, 'utf-8');
}

export function setSavedMessageId(id: Snowflake): void {
    writeFileSync(fileLocation, id, 'utf-8');
}
