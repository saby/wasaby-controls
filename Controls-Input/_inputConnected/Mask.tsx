import { useCallback, useEffect, useRef, useState } from 'react';
import { InputLabel } from './InputLabel';
import { IControlProps } from 'Controls/interface';
import { Mask as MaskInput } from 'Controls/input';
import { clearProps, useConnectedValue } from 'Controls-DataEnv/context';
import { getValidators, useValidation } from 'Controls-Input/validators';
import {
    IInputDefaultValueOptions,
    ILabelOptions,
    IMaskOptions,
    INameOptions,
    IPlaceholderOptions,
    IRequiredOptions,
    IValidateOptions,
} from 'Controls-Input/interface';
import { getSizeProps } from 'Controls-Input/utils';
import * as translate from 'i18n!Controls-Input';

/**
 * Интерфейс, описывающий опции редактора типа "Маска"
 * @public
 * @implements Controls-Input/interface:INameOptions
 * @implements Controls-Input/interface:IInputDefaultValueOptions
 * @implements Controls-Input/interface:ILabelOptions
 * @implements Controls-Input/interface:IMaskOptions
 * @implements Controls-Input/interface:IPlaceholderOptions
 * @implements Controls-Input/interface:IRequiredOptions
 * @implements Controls-Input/interface:IValidateOptions
 */
export interface IMaskProps
    extends INameOptions,
        IInputDefaultValueOptions,
        ILabelOptions,
        IMaskOptions,
        IPlaceholderOptions,
        IRequiredOptions,
        IValidateOptions,
        IControlProps {}

/**
 * Редактор типа "Маска", работающий со слайсом формы
 */
function Mask(props: IMaskProps) {
    const { placeholder = translate('Введите текст'), mask = '' } = props;
    const { value, onChange } = useConnectedValue(props.name, props.defaultValue);
    const [maskValue, setMaskValue] = useState<string>(value);
    const ref = useRef();
    const { onFocus, resetValidation, validate, validationStatus } = useValidation(
        props.name,
        getValidators(props),
        ref
    );

    const onValueChanged = useCallback((result) => {
        resetValidation();
        setMaskValue(result);
    }, []);
    const onInputCompleted = useCallback((result) => {
        onChange(result);
        validate();
    }, []);

    useEffect(() => {
        setMaskValue(value);
    }, [value]);
    const classes = `${props.className} ${!!value ? 'controls-Input-connected_filled' : ''}`;
    const sizeProps = getSizeProps(props);

    return (
        <InputLabel
            attrs={props.attrs}
            style={props.style}
            value={maskValue}
            label={props.label}
            className={classes}
            fontSize={sizeProps.fontSize}
        >
            <MaskInput
                ref={ref}
                mask={mask}
                placeholder={placeholder}
                placeholderVisibility="empty"
                value={maskValue}
                valueChangedCallback={onValueChanged}
                onInputCompleted={onInputCompleted}
                onFocus={onFocus}
                validationStatus={validationStatus}
                {...clearProps(props)}
                {...sizeProps}
            />
        </InputLabel>
    );
}

Mask.displayName = 'Controls-Input/inputConnected:Mask';
export { Mask };
