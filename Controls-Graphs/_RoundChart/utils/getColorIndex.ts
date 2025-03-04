export const getColorIndex = (passedValue: number, index: number, readOnly: boolean): string => {
    let result = index;
    if (readOnly) {
        result = 0;
    }
    if (!readOnly && passedValue !== undefined && passedValue !== null) {
        return 'base-' + passedValue;
    }
    return 'base-' + (result > 12 ? result % 12 : result);
};
