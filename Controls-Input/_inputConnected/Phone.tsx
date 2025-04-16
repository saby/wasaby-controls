import { useCallback, useEffect, useRef, useState } from 'react';
import { clearProps, useConnectedValue, useFormReadonly } from 'Controls-DataEnv/context';
import { getValidators, useValidation } from 'Controls-Input/validators';
import { Phone as PhoneInput } from 'Controls/input';
import { IComponentProps } from 'Controls/interface';
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
import { getDefaultPlaceholder, getStyleProps } from 'Controls-Input/utils';

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
        IComponentProps {}

/**
 * Редактор типа "Телефон", работающий со слайсом формы
 * @param {Controls-Input/inputConnected:IPhoneProps} props Пропсы компонента
 * @public
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
        placeholder = getDefaultPlaceholder(),
    } = props;
    const classes = `${className} ${!!value ? 'controls-Input-connected_filled' : ''}`;
    const styleProps = getStyleProps(props);
    const readOnly = useFormReadonly(props.name);
    return (
        <InputLabel
            attrs={props.attrs}
            style={props.style}
            value={phoneValue}
            label={label}
            className={classes}
            fontSize={styleProps.fontSize}
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
                {...styleProps}
                readOnly={readOnly}
            />
        </InputLabel>
    );
}

Phone.displayName = 'Controls-Input/inputConnected:Phone';
export { Phone };
