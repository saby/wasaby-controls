export const getColorIndex = (passedValue: number, index: number, readOnly: boolean): string => {
    let result = index;
    if (readOnly) {
        result = 0;
    }
    if (!readOnly && passedValue !== undefined && passedValue !== null) {
        result = passedValue;
    }
    return 'base-' + result;
};
