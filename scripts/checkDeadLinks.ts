import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { Colour, JSONValue } from '../src/types/index.js';

const pathToCheck = '/NachoToast/FoundationX-API/blob/';

const stats = {
    skipped: 0,
    invalid: 0,
    external: 0,
    notMain: 0,
    mismatchedDescription: 0,
    dead: 0,
    ok: 0,
};

/**
 * Validates the the file pointed to by an internally-linking URL actually
 * exists.
 */
function checkUrl(url: string, description?: string): void {
    // Don't try parse URls with variables, e.g. http://localhost:{port}
    if (url.includes('{')) {
        stats.skipped += 1;
        return;
    }

    if (!URL.canParse(url)) {
        stats.invalid += 1;
        console.log(`Invalid URL: ${Colour.FgRed}${url}${Colour.Reset}`);
        return;
    }

    const parsedUrl = new URL(url);

    // We can't validate URLs that link to external sites.
    if (!parsedUrl.pathname.startsWith(pathToCheck)) {
        stats.external += 1;
        return;
    }

    let relativePath = parsedUrl.pathname.slice(pathToCheck.length);

    if (!relativePath.startsWith('main/')) {
        stats.notMain += 1;
        console.log(
            `URL doesn't point to the main branch: ${Colour.FgRed}${url}${Colour.Reset}`,
        );
        return;
    }

    relativePath = relativePath.slice('main/'.length);

    if (description !== undefined && relativePath !== description) {
        stats.mismatchedDescription += 1;
        console.log(
            `URL description doesn't match file path:\n\t${Colour.FgRed}${url}${
                Colour.Reset
            }\n\t${' '.repeat(url.length - relativePath.length)}${
                Colour.FgCyan
            }${description}${Colour.Reset}`,
        );
        return;
    }

    if (!existsSync(resolve(relativePath))) {
        stats.dead += 1;
        console.log(
            `URL points to a non-existent file:\n\t${Colour.FgRed}${url}${Colour.Reset}\n\t${Colour.FgCyan}${relativePath}${Colour.Reset}`,
        );
        return;
    }

    stats.ok += 1;
}

function recursivelyCheckKeys(obj: JSONValue): void {
    if (typeof obj !== 'object' || obj === null) return;

    if (Array.isArray(obj)) {
        obj.forEach(recursivelyCheckKeys);
        return;
    }

    if (
        typeof obj['url'] === 'string' &&
        (typeof obj['description'] === 'string' ||
            obj['description'] === undefined)
    ) {
        checkUrl(obj['url'], obj['description']);
        return;
    }

    for (const key of Object.keys(obj)) {
        const child = obj[key];
        if (child !== undefined) {
            recursivelyCheckKeys(child);
        }
    }
}

recursivelyCheckKeys(
    JSON.parse(
        readFileSync(join('data', 'openapi.json'), 'utf-8'),
    ) as JSONValue,
);

const totalChecked = Object.values(stats).reduce((a, b) => a + b, 0);

console.log(
    `\nChecked ${Colour.Bright}${totalChecked.toString()}${Colour.Reset} URLs:\n${[
        `${stats.skipped.toString()} Skipped`,
        `${stats.invalid ? Colour.FgRed : Colour.FgGreen}${stats.invalid.toString()}${
            Colour.Reset
        } Invalid`,
        `${stats.external.toString()} External`,
        `${stats.notMain ? Colour.FgRed : Colour.FgGreen}${stats.notMain.toString()}${
            Colour.Reset
        } Not Main Branch`,
        `${stats.mismatchedDescription ? Colour.FgRed : Colour.FgGreen}${stats.mismatchedDescription.toString()}${Colour.Reset} Mismatched Description`,
        `${stats.dead ? Colour.FgRed : Colour.FgGreen}${stats.dead.toString()}${
            Colour.Reset
        } Dead Link`,
        `${Colour.FgGreen}${stats.ok.toString()}${Colour.Reset} OK`,
    ].join('\n')}`,
);

if (
    stats.invalid + stats.notMain + stats.mismatchedDescription + stats.dead >
    0
) {
    process.exit(1);
}
