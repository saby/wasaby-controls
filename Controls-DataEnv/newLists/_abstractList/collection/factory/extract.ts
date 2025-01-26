/**
 * Утилита для извлечения полей из объекта.
 * @param state
 * @param keys
 * @param mapper
 */
export default function extract<T extends object, TKeys extends (keyof T)[]>(
    state: T,
    keys: TKeys,
    mapper: TMapper<T, TKeys[number]> = (v) => v
): Pick<T, TKeys[number]> {
    return keys.reduce(
        (acc, fieldName) => {
            acc[fieldName] = mapper(state[fieldName], fieldName);
            return acc;
        },
        {} as Pick<T, TKeys[number]>
    );
}

/**
 * Тип функции-маппера полей объекта
 * @param value
 * @param key
 * */
export type TMapper<T extends object, TKey extends (keyof T)[][number]> = (
    value: T[TKey],
    key: TKey
) => T[TKey];
