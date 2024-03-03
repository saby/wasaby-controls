import { useCallback, useEffect, useRef, useState } from 'react';
import { clearProps, useConnectedValue } from '../useConnectedValue';
import { getValidators, useValidation } from 'Controls-Input/validators';
import { Phone as PhoneInput } from 'Controls/input';
import { IControlProps } from 'Controls/interface';
import { InputLabel } from './InputLabel';
import {
    IFlagVisibleOptions,
    IInputDefaultValueOptions,
    ILabelOptions,
    INameOptions,
    IOnlyMobileOptions,
    IPlaceholderOptions,
    IRequiredOptions,
    IValidateOptions,
} from 'Controls-Input/interface';
import { getSizeProps } from 'Controls-Input/utils';
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
    const ref = useRef();
    const { onFocus, resetValidation, validate, validationStatus } = useValidation(
        props.name,
        getValidators(props),
        ref
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
    const sizeProps = getSizeProps(props);
    return (
        <InputLabel
            attrs={props.attrs}
            style={props.style}
            value={phoneValue}
            label={label}
            className={classes}
            fontSize={sizeProps.fontSize}
        >
            <PhoneInput
                ref={ref}
                placeholder={placeholder}
                placeholderVisibility="empty"
                flagVisible={flagVisible}
                flagPosition={flagPosition}
                onlyMobile={onlyMobile}
                value={phoneValue}
                onInputCompleted={onInputCompleted}
                onValueChanged={onValueChanged}
                onFocus={onFocus}
                validationStatus={validationStatus}
                {...clearProps(props)}
                {...sizeProps}
            />
        </InputLabel>
    );
}

Phone.displayName = 'Controls-Input/inputConnected:Phone';
export { Phone };
