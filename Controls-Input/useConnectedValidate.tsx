import * as React from 'react';
import { useSlice, DataContext } from 'Controls-DataEnv/context';
import type { NameBindingType } from 'Controls/interface';
import { parseConnectedBinding } from './useConnectedValue';

/**
 * Хук для работы с валидацией слайса формы
 * @param name
 */
export const useConnectedValidate = (name: NameBindingType = []) => {
    const context = React.useContext(DataContext);
    const bindings = React.useMemo(() => {
        return parseConnectedBinding(name, context);
    }, [name]);
    const slice = useSlice(bindings.slice);
    const correctName = bindings.field;

    const registerValidators = React.useCallback(
        (fns: Function[], ref?: React.MutableRefObject<any>) => {
            return slice?.registerValidators?.(bindings.field, fns, ref);
        },
        [bindings.field, slice]
    );
    const unRegisterValidators = React.useCallback(() => {
        return slice?.unRegisterValidators?.(bindings.field);
    }, [bindings.field, slice]);

    const validate = React.useCallback(() => {
        return slice?.validate?.(bindings.field);
    }, [bindings.field, slice]);

    const resetValidation = React.useCallback(() => {
        return slice?.resetValidation?.(bindings.field);
    }, [bindings.field, slice]);
    const focus = React.useCallback(() => {
        slice?.focus?.(bindings.field);
    }, [bindings.field, slice]);

    return {
        registerValidators,
        unRegisterValidators,
        resetValidation,
        validate,
        focus,
        validationState: slice?.validationState?.[correctName],
    };
};
