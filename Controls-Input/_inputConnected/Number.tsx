import { useCallback, useState, useEffect } from 'react';
import { IOnlyPositiveOptions } from 'Controls/baseDecorator';
import { useConnectedValue, clearProps } from '../useConnectedValue';
import { useValidation, getValidators } from 'Controls-Input/validators';
import { Number as NumberInput } from 'Controls/input';
import { IControlProps } from 'Controls/interface';
import { InputLabel } from './InputLabel';
import {
    INameOptions,
    IInputDefaultValueOptions,
    ILabelOptions,
    IPlaceholderOptions,
    IRequiredOptions,
    ILimitOptions,
    IIntegersLengthOptions,
    IUseGroupingOptions,
    IPrecisionOptions,
    IValidateOptions,
} from 'Controls-Input/interface';
import * as translate from 'i18n!Controls-Input';

export interface INumberProps
    extends INameOptions,
        IInputDefaultValueOptions,
        ILabelOptions,
        IUseGroupingOptions,
        IPlaceholderOptions,
        IRequiredOptions,
        IOnlyPositiveOptions,
        IIntegersLengthOptions,
        IPrecisionOptions,
        ILimitOptions,
        IValidateOptions {}

/**
 * Редактор типа "Число", работающий со слайсом формы
 * @param props
 */
function Number(props: INumberProps & IControlProps) {
    const { value, onChange } = useConnectedValue(props.name, props.defaultValue);
    const [inputValue, setInputValue] = useState<number>(value);
    const { onFocus, resetValidation, validate, validationStatus } = useValidation(
        props.name,
        getValidators(props)
    );

    const onValueChanged = useCallback((result) => {
        resetValidation();
        setInputValue(result);
    }, []);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const onInputCompleted = useCallback((result: number) => {
        if (props.limit?.minValue && props.limit.minValue > result) {
            onChange(props.limit.minValue);
            setInputValue(props.limit.minValue);
            validate();
            return;
        }
        if (props.limit?.maxValue && props.limit.maxValue < result) {
            onChange(props.limit.maxValue);
            setInputValue(props.limit.maxValue);
            validate();
            return;
        }
        onChange(result);
        validate();
    }, []);

    const {
        className,
        label,
        placeholder = translate('Укажите число'),
        onlyPositive,
        integersLength,
        precision,
        useGrouping = false,
    } = props;
    const classes = `${className} ${!!value ? 'controls-Input-connected_filled' : ''}`;
    return (
        <InputLabel
            attrs={props.attrs}
            style={props.style}
            value={inputValue}
            label={label}
            className={classes}
        >
            <NumberInput
                {...clearProps(props)}
                useGrouping={useGrouping}
                placeholder={placeholder}
                placeholderVisibility="empty"
                onlyPositive={onlyPositive}
                integersLength={integersLength || undefined}
                precision={precision}
                value={inputValue}
                onInputCompleted={onInputCompleted}
                valueChangedCallback={onValueChanged}
                customEvents={['onInputCompleted']}
                onFocus={onFocus}
                validationStatus={validationStatus}
            />
        </InputLabel>
    );
}

Number.displayName = 'Controls-Input/inputConnected:Number';
export { Number };
