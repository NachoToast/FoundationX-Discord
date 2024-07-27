export function* medalGenerator(): Generator<string, string, string> {
    yield '🥇';
    yield '🥈';
    yield '🥉';

    let i = 4;

    while (i > 0) {
        yield `**#${(i++).toString()}**`.toString();
    }

    return '';
}
