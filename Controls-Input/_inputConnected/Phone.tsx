import { useState, useEffect, useCallback } from 'react';
import { useConnectedValue, clearProps } from '../useConnectedValue';
import { useValidation, getValidators } from 'Controls-Input/validators';
import { Phone as PhoneInput } from 'Controls/input';
import { IControlProps } from 'Controls/interface';
import { InputLabel } from './InputLabel';
import {
    INameOptions,
    IInputDefaultValueOptions,
    ILabelOptions,
    IPlaceholderOptions,
    IRequiredOptions,
    IFlagVisibleOptions,
    IOnlyMobileOptions,
    IValidateOptions,
} from 'Controls-Input/interface';
import * as translate from 'i18n!Controls-Input';

export interface IPhoneProps
    extends INameOptions,
        IInputDefaultValueOptions,
        ILabelOptions,
        IPlaceholderOptions,
        IRequiredOptions,
        IFlagVisibleOptions,
        IOnlyMobileOptions,
        IValidateOptions {}

/**
 * Редактор типа "Телефон", работающий со слайсом формы
 * @param props
 */
function Phone(props: IPhoneProps & IControlProps) {
    const { value, onChange } = useConnectedValue(props.name, props.defaultValue);
    const [phoneValue, setPhoneValue] = useState<string>(value);
    const { onFocus, resetValidation, validate, validationStatus } = useValidation(
        props.name,
        getValidators(props)
    );

    const onValueChanged = useCallback((result) => {
        resetValidation();
        setPhoneValue(result);
    }, []);
    const onInputCompleted = useCallback((result) => {
        onChange(result);
        validate();
    }, []);

    useEffect(() => {
        setPhoneValue(value);
    }, [value]);

    const {
        label,
        className,
        flagVisible,
        flagPosition,
        onlyMobile,
        placeholder = translate('Введите номер'),
    } = props;
    const classes = `${className} ${!!value ? 'controls-Input-connected_filled' : ''}`;
    return (
        <InputLabel
            attrs={props.attrs}
            style={props.style}
            value={phoneValue}
            label={label}
            className={classes}
        >
            <PhoneInput
                placeholder={placeholder}
                placeholderVisibility="empty"
                flagVisible={flagVisible}
                flagPosition={flagPosition}
                onlyMobile={onlyMobile}
                value={phoneValue}
                onInputCompleted={onInputCompleted}
                valueChangedCallback={onValueChanged}
                onFocus={onFocus}
                customEvents={['onInputCompleted']}
                validationStatus={validationStatus}
                {...clearProps(props)}
            />
        </InputLabel>
    );
}

Phone.displayName = 'Controls-Input/inputConnected:Phone';
export { Phone };
