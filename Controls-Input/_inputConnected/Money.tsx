import { useCallback, useEffect, useRef, useState } from 'react';
import { IOnlyPositiveOptions } from 'Controls/baseDecorator';
import { clearProps, useConnectedValue } from '../useConnectedValue';
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
        IValidateOptions {}

/**
 * Редактор типа "Деньги", работающий со слайсом формы
 * @param props
 */
function Money(props: IMoneyProps & IControlProps) {
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
