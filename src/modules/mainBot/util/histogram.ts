export function makeHistogramLine(
    num: number,
    total: number,
    width = 5,
    emptyChar = '⬛',
): string {
    const { histogramEmoji } = AppGlobals.config.modules.mainBot;

    const fillPart = Math.round((num / total) * width);
    const filled = histogramEmoji.repeat(fillPart);
    const empty = emptyChar.repeat(width - fillPart);

    return filled + empty;
}
