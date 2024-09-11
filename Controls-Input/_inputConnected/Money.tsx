import { useCallback, useEffect, useRef, useState } from 'react';
import { IOnlyPositiveOptions } from 'Controls/baseDecorator';
import { clearProps, useConnectedValue } from 'Controls-DataEnv/context';
import { getValidators, useValidation } from 'Controls-Input/validators';
import { Money as MoneyInput } from 'Controls/input';
import { IControlProps } from 'Controls/interface';
import { InputLabel } from './InputLabel';
import {
    IInputDefaultValueOptions,
    IIntegersLengthOptions,
    ILabelOptions,
    ILimitOptions,
    INameOptions,
    IPlaceholderOptions,
    IRequiredOptions,
    IUseGroupingOptions,
    IValidateOptions,
} from 'Controls-Input/interface';
import { getSizeProps } from 'Controls-Input/utils';
import * as translate from 'i18n!Controls-Input';

/**
 * Интерфейс, описывающий опции редактора типа "Деньги"
 * @public
 * @implements Controls-Input/interface:INameOptions
 * @implements Controls-Input/interface:IInputDefaultValueOptions
 * @implements Controls-Input/interface:ILabelOptions
 * @implements Controls-Input/interface:IPlaceholderOptions
 * @implements Controls-Input/interface:IRequiredOptions
 * @implements Controls-Input/baseDecorator:IOnlyPositive
 * @implements Controls-Input/interface:ILimitOptions
 * @implements Controls-Input/interface:IIntegersLengthOptions
 * @implements Controls-Input/interface:IUseGroupingOptions
 * @implements Controls-Input/interface:IValidateOptions
 */
export interface IMoneyProps
    extends INameOptions,
        IInputDefaultValueOptions,
        ILabelOptions,
        IPlaceholderOptions,
        IRequiredOptions,
        IOnlyPositiveOptions,
        ILimitOptions,
        IIntegersLengthOptions,
        IUseGroupingOptions,
        IValidateOptions,
        IControlProps {}

/**
 * Редактор типа "Деньги", работающий со слайсом формы
 */
function Money(props: IMoneyProps) {
    const { value, onChange } = useConnectedValue(props.name, props.defaultValue);
    const [inputValue, setInputValue] = useState<number>(value);
    const ref = useRef();
    const { onFocus, resetValidation, validate, validationStatus } = useValidation(
        props.name,
        getValidators(props),
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
        placeholder = translate('Введите сумму'),
        onlyPositive,
        integersLength,
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
            <MoneyInput
                ref={ref}
                {...clearProps(props)}
                className="tw-w-full"
                useGrouping={useGrouping}
                placeholder={placeholder}
                placeholderVisibility="empty"
                onlyPositive={onlyPositive}
                integersLength={integersLength || undefined}
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

Money.displayName = 'Controls-Input/inputConnected:Money';
export { Money };
