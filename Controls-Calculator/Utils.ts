export default {
    prepareStringToNumber(value: string): string | null {
        const hasCarriageReturn = value.includes('\n');
        if (hasCarriageReturn) {
            return null;
        }
        const replacedValue = value.replace(/\s+/g, '');
        const parsedValue = parseFloat(replacedValue);
        return isNaN(parsedValue) ? null : parsedValue + '';
    },
};
