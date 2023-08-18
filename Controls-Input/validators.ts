import { useEffect, useMemo } from 'react';
import { isRequired } from 'Controls/validate';
import { useConnectedValidate } from './useConnectedValidate';
import type { NameBindingType } from 'Controls/interface';
import { loadSync } from 'WasabyLoader/ModulesLoader';

type IValidatorCallback = ({ value: unknown }) => boolean | string | Promise<boolean | string>;

export function getValidators(props) {
    return useMemo(() => {
        let res = [];

        if (props.required) {
            res.push(isRequired);
        }
        if (props.validators) {
            const loadedValidators = props.validators.map((validator) => {
                if (typeof validator === 'string') {
                    try {
                        return loadSync(validator);
                    } catch (err) {
                        return undefined;
                    }
                }
                return validator;
            });
            res = [...loadedValidators, ...res];
        }
        return res;
    }, [props.required, props.validators]);
}

export function useValidation(name: NameBindingType = [], validators: IValidatorCallback[]) {
    const {
        registerValidators,
        unRegisterValidators,
        resetValidation,
        validate,
        validationState,
        focus,
    } = useConnectedValidate(name);

    useEffect(() => {
        if (validators.length && name?.length) {
            registerValidators(validators);
        }
        return () => {
            unRegisterValidators();
        };
    }, []);

    return {
        onFocus: focus,
        resetValidation,
        validate,
        validationStatus: validationState,
    };
}
