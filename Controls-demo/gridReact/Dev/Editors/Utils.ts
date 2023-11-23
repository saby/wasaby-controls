export function correctValue<TValue>(value: string): TValue {
    if (value === 'default') {
        return undefined;
    }

    return value as unknown as TValue;
}
