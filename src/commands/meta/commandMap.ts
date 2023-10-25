import { Command } from '../../types/Command';
import { helpCommand } from '../help';
import { listCommand } from '../list';
import { statsCommand } from '../stats';
import { statusCommand } from '../status';
import { topCommand } from '../top';

export const commandMap = new Map<string, Command>(
    [helpCommand, listCommand, statsCommand, statusCommand, topCommand].map(
        (e) => [e.name, e],
    ),
);
