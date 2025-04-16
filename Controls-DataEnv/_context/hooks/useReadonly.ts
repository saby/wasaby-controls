import type { NameBindingType } from 'Controls/interface';
import { default as useSlice } from './useSlice';
import { FormSlice } from 'Controls-DataEnv/dataFactory';
import { useReadonly as useContextReadonly } from 'UI/Contexts';

function getSafeFieldType(field: unknown = []): { name: NameBindingType } {
    if (Array.isArray(field)) {
        return {
            name: field,
        };
    }
    return field as { name: NameBindingType };
}

/**
 * Хук, возвращающий свойство readOnly из FormSlice
 * @param name
 */
export function useFormReadonly(name: NameBindingType = []) {
    const [sliceName] = getSafeFieldType(name).name;
    const dataObjectSlice = useSlice(sliceName);

    return useContextReadonly({
        readOnly: (dataObjectSlice as FormSlice)?.readOnly,
    });
}
