import { useCallback, useEffect, useRef, useState } from 'react';
import { IOnlyPositiveOptions } from 'Controls/baseDecorator';
import { clearProps, useConnectedValue } from 'Controls-DataEnv/context';
import { getValidators, useValidation, SafeIntegerValidator } from 'Controls-Input/validators';
import { Number as NumberInput } from 'Controls/input';
import { IControlProps } from 'Controls/interface';
import { InputLabel } from './InputLabel';
import {
    IInputDefaultValueOptions,
    IIntegersLengthOptions,
    ILabelOptions,
    ILimitOptions,
    INameOptions,
    IPlaceholderOptions,
    IPrecisionOptions,
    IRequiredOptions,
    IUseGroupingOptions,
    IValidateOptions,
} from 'Controls-Input/interface';
import { getSizeProps } from 'Controls-Input/utils';
import * as translate from 'i18n!Controls-Input';

/**
 * Интерфейс, описывающий опции редактора типа "Число"
 * @public
 * @implements Controls-Input/interface:INameOptions
 * @implements Controls-Input/interface:IInputDefaultValueOptions
 * @implements Controls-Input/interface:ILabelOptions
 * @implements Controls-Input/interface:IUseGroupingOptions
 * @implements Controls-Input/interface:IPlaceholderOptions
 * @implements Controls-Input/interface:IRequiredOptions
 * @implements Controls-Input/interface:IIntegersLengthOptions
 * @implements Controls-Input/baseDecorator:IOnlyPositive
 * @implements Controls-Input/interface:IPrecisionOptions
 * @implements Controls-Input/interface:ILimitOptions
 * @implements Controls-Input/interface:IValidateOptions
 */
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
        IValidateOptions,
        IControlProps {}

const DEFAULT_INTEGER_LENGTH = 17;

/**
 * Редактор типа "Число", работающий со слайсом формы
 */
function Number(props: INumberProps) {
    const { value, onChange } = useConnectedValue(props.name, props.defaultValue);
    const [inputValue, setInputValue] = useState<number>(value);
    const ref = useRef();
    const { onFocus, resetValidation, validate, validationStatus } = useValidation(
        props.name,
        getValidators(props, [SafeIntegerValidator]),
        ref
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
    const sizeProps = getSizeProps(props);
    return (
        <InputLabel
            attrs={props.attrs}
            style={props.style}
            value={inputValue}
            label={label}
            className={classes}
            fontSize={sizeProps.fontSize}
        >
            <NumberInput
                ref={ref}
                {...clearProps(props)}
                useGrouping={useGrouping}
                placeholder={placeholder}
                placeholderVisibility="empty"
                onlyPositive={onlyPositive}
                integersLength={integersLength || DEFAULT_INTEGER_LENGTH}
                precision={precision}
                value={inputValue}
                onInputCompleted={onInputCompleted}
                valueChangedCallback={onValueChanged}
                onFocus={onFocus}
                validationStatus={validationStatus}
                {...sizeProps}
            />
        </InputLabel>
    );
}

Number.displayName = 'Controls-Input/inputConnected:Number';
export { Number };
