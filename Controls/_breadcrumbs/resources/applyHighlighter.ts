/**
 * @kaizen_zone 5027e156-2300-4ab3-8a3a-d927588bb443
 */
export function applyHighlighter(
    callback: Function | Function[],
    ...callbackArgs: unknown[]
): string {
    let result: string = '';
    const highlighters = Array.isArray(callback) ? callback : [callback];

    if (highlighters) {
        highlighters.forEach((highlighter) => {
            if (highlighter) {
                result += highlighter.apply(undefined, callbackArgs);
            }
        });
    }

    return result;
}
