import { FormSlice } from 'Controls-DataEnv/dataFactory';
import * as React from 'react';
import { useSlice } from 'Controls-DataEnv/context';
import type { NameBindingType } from 'Controls/interface';

/**
 * Хук для работы с валидацией слайса формы
 * @param name
 */
export const useConnectedValidate = (name: NameBindingType = []) => {
    const [sliceName, ...fields] = getSafeFieldType(name).name;

    const formDataSlice = useSlice('FormData');
    const dataObjectSlice = useSlice(sliceName);

    const slice = (dataObjectSlice || formDataSlice) as FormSlice;
    const binding = dataObjectSlice ? fields : name;

    const registerValidators = React.useCallback(
        (fns: Function[], ref?: React.MutableRefObject<any>) => {
            return slice?.registerValidators?.(binding, fns, ref);
        },
        [binding, slice]
    );
    const unRegisterValidators = React.useCallback(() => {
        return slice?.unRegisterValidators?.(binding);
    }, [binding, slice]);

    const validate = React.useCallback(() => {
        return slice?.validate?.(binding);
    }, [binding, slice]);

    const resetValidation = React.useCallback(() => {
        return slice?.resetValidation?.(binding);
    }, [binding, slice]);
    const focus = React.useCallback(() => {
        slice?.focus?.(binding);
    }, [binding, slice]);

    return {
        registerValidators,
        unRegisterValidators,
        resetValidation,
        validate,
        focus,
        validationState: slice?.validationState?.[binding],
    };
};

export function getSafeFieldType(field: unknown = []): { name: NameBindingType } {
    if (Array.isArray(field)) {
        return {
            name: field,
        };
    }
    return field as { name: NameBindingType };
}
