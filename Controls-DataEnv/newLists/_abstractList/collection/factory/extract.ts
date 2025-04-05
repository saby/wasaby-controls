/**
 * Утилита для извлечения полей из объекта.
 * @param state
 * @param keys
 * @param mapper
 * @param initObject
 * @private
 */
export default function extract<
    T extends object,
    TKeys extends (keyof T)[] = (keyof T)[],
    TInitObject extends object = {},
>(
    state: T,
    keys: TKeys,
    mapper: TMapper<T, TKeys[number]> = (v) => v,
    initObject: TInitObject = {} as TInitObject
): Pick<T, TKeys[number]> & TInitObject {
    return keys.reduce(
        (acc, fieldName) => {
            acc[fieldName] = mapper(state[fieldName], fieldName);
            return acc;
        },
        initObject as Pick<T, TKeys[number]>
    ) as Pick<T, TKeys[number]> & TInitObject;
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
