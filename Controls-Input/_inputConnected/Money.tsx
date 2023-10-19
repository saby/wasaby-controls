import { useCallback, useState, useEffect } from 'react';
import { IOnlyPositiveOptions } from 'Controls/baseDecorator';
import { useConnectedValue, clearProps } from '../useConnectedValue';
import { useValidation, getValidators } from 'Controls-Input/validators';
import { Money as MoneyInput } from 'Controls/input';
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
    IValidateOptions,
} from 'Controls-Input/interface';
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
            validate();
            return;
        }
        if (props.limit?.maxValue && props.limit.maxValue < result) {
            onChange(props.limit.maxValue);
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

    return (
        <InputLabel
            attrs={props.attrs}
            style={props.style}
            value={inputValue}
            label={label}
            className={classes}
        >
            <MoneyInput
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
                customEvents={['onInputCompleted']}
                onFocus={onFocus}
                validationStatus={validationStatus}
            />
        </InputLabel>
    );
}

Money.displayName = 'Controls-Input/inputConnected:Money';
export { Money };
