import { useState, useEffect, useCallback } from 'react';
import { InputLabel } from './InputLabel';
import { IControlProps } from 'Controls/interface';
import { Mask as MaskInput } from 'Controls/input';
import { useConnectedValue, clearProps } from '../useConnectedValue';
import { useValidation, getValidators } from 'Controls-Input/validators';
import {
    INameOptions,
    IInputDefaultValueOptions,
    ILabelOptions,
    IPlaceholderOptions,
    IRequiredOptions,
    IMaskOptions,
    IValidateOptions,
} from 'Controls-Input/interface';
import * as translate from 'i18n!Controls-Input';

export interface IMaskProps
    extends INameOptions,
        IInputDefaultValueOptions,
        ILabelOptions,
        IMaskOptions,
        IPlaceholderOptions,
        IRequiredOptions,
        IValidateOptions {}

/**
 * Редактор типа "Маска", работающий со слайсом формы
 * @param props
 */
function Mask(props: IMaskProps & IControlProps) {
    const { placeholder = translate('Введите текст'), mask = '' } = props;
    const { value, onChange } = useConnectedValue(props.name, props.defaultValue);
    const [maskValue, setMaskValue] = useState<string>(value);
    const { onFocus, resetValidation, validate, validationStatus } = useValidation(
        props.name,
        getValidators(props)
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

    return (
        <InputLabel
            attrs={props.attrs}
            style={props.style}
            value={maskValue}
            label={props.label}
            className={classes}
        >
            <MaskInput
                mask={mask}
                placeholder={placeholder}
                placeholderVisibility="empty"
                value={maskValue}
                valueChangedCallback={onValueChanged}
                onInputCompleted={onInputCompleted}
                customEvents={['onInputCompleted']}
                onFocus={onFocus}
                validationStatus={validationStatus}
                {...clearProps(props)}
            />
        </InputLabel>
    );
}

Mask.displayName = 'Controls-Input/inputConnected:Mask';
export { Mask };
