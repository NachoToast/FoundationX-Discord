import { Command } from '../../types/Command';
import { helpCommand } from '../help';
import { listCommand } from '../list';
import { statsCommand } from '../stats';

export const commandMap = new Map<string, Command>(
    [helpCommand, listCommand, statsCommand].map((e) => [e.name, e]),
);
