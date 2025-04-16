const MAX_COLOR_INDEX = 12;

export const getColorIndex = (passedValue: unknown, index: number, readOnly: boolean): string => {
    let result = index;
    if (readOnly) {
        result = 0;
    }
    if (!readOnly && passedValue !== undefined && passedValue !== null) {
        return 'base-' + passedValue;
    }
    return 'base-' + (result > MAX_COLOR_INDEX ? result % MAX_COLOR_INDEX : result);
};
