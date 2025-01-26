/**
 * Утилита для извлечения полей из объекта.
 * @param state
 * @param keys
 * @param mapper
 */
export default function extract<T extends object, TKeys extends (keyof T)[]>(
    state: T,
    keys: TKeys,
    mapper: (value: T[TKeys[number]]) => T[TKeys[number]] = (v) => v
): Pick<T, TKeys[number]> {
    return keys.reduce(
        (acc, fieldName) => {
            acc[fieldName] = mapper(state[fieldName]);
            return acc;
        },
        {} as Pick<T, TKeys[number]>
    );
}
