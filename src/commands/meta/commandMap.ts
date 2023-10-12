import { Command } from '../../types/Command';
import { helpCommand } from '../help';
import { listCommand } from '../list';
import { statsCommand } from '../stats';
import { statusCommand } from '../status';

export const commandMap = new Map<string, Command>(
    [helpCommand, listCommand, statsCommand, statusCommand].map((e) => [
        e.name,
        e,
    ]),
);
