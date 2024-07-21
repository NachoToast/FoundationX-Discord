/* Generates a secure random token for use in config. */

import { randomBytes } from 'crypto';

console.log(
    Array.from({ length: 5 })
        .map(() => randomBytes(8).toString('hex'))
        .join('\n\n'),
);
