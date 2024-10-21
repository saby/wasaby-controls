export default function extract<T extends object, TKeys extends (keyof T)[]>(
    state: T,
    keys: TKeys
): Pick<T, TKeys[number]> {
    return keys.reduce(
        (acc, fieldName) => ({ ...acc, [fieldName]: state[fieldName] }),
        {} as Pick<T, TKeys[number]>
    );
}
