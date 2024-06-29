import { execSync } from 'child_process';

export function loadCommit(): string | null {
    try {
        return execSync('git rev-parse HEAD').toString().trim() || null;
    } catch (error) {
        return null;
    }
}
