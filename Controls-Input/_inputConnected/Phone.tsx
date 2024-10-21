import { useCallback, useEffect, useRef, useState } from 'react';
import { clearProps, useConnectedValue } from 'Controls-DataEnv/context';
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

/**
 * Интерфейс, описывающий опции редактора типа "Телефон"
 * @public
 * @implements Controls-Input/interface:INameOptions
 * @implements Controls-Input/interface:IInputDefaultValueOptions
 * @implements Controls-Input/interface:ILabelOptions
 * @implements Controls-Input/interface:IPlaceholderOptions
 * @implements Controls-Input/interface:IRequiredOptions
 * @implements Controls-Input/interface:IFlagVisibleOptions
 * @implements Controls-Input/interface:IOnlyMobileOptions
 * @implements Controls-Input/interface:IValidateOptions
 */
export interface IPhoneProps
    extends INameOptions,
        IInputDefaultValueOptions,
        ILabelOptions,
        IPlaceholderOptions,
        IRequiredOptions,
        IFlagVisibleOptions,
        IOnlyMobileOptions,
        IValidateOptions,
        IControlProps {}

/**
 * Редактор типа "Телефон", работающий со слайсом формы
 */
function Phone(props: IPhoneProps) {
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
