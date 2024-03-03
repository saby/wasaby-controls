import { OBJECT_TYPE_DEFAULT_VALUE, ObjectMeta } from 'Meta/types';

/**
 * Удаляет из списка свойств-значений(value) те свойства, которые равны значению по умолчанию в метатипе
 * @param value
 * @param metaType
 * @public
 */
export function extractAttrsWithoutDefaults(value: object, metaType: ObjectMeta<object>) {
    const metaAttrs = metaType.getAttributes();

    return value
        ? Object.keys(value)
            .filter((attrKey) => {
                const defaultValue = metaAttrs[attrKey]?.getDefaultValue();

                return defaultValue === undefined || defaultValue === OBJECT_TYPE_DEFAULT_VALUE;
            })
            .reduce((accum, attrKey) => ({...accum, [attrKey]: value[attrKey]}), {})
        : {};
}