import { useCallback } from 'react';
import { IOnlyPositiveOptions } from 'Controls/baseDecorator';
import { useConnectedValue, clearProps } from '../useConnectedValue';
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
    IUseGroupingOptions
} from 'Controls-Input/interface';
import * as translate from 'i18n!Controls-Input';

export interface IMoneyProps extends INameOptions, IInputDefaultValueOptions,
    ILabelOptions, IPlaceholderOptions, IRequiredOptions, IOnlyPositiveOptions, ILimitOptions,
    IIntegersLengthOptions, IUseGroupingOptions {
}

/**
 * Редактор типа "Деньги", работающий со слайсом формы
 * @param props
 */
function Money(props: IMoneyProps & IControlProps) {
    const {value, onChange} = useConnectedValue(props.name, props.defaultValue);
    const onInputCompleted = useCallback((inputValue: number) => {
        if (props.limit?.minValue && props.limit.minValue > inputValue) {
            onChange(props.limit.minValue);
            return;
        }
        if (props.limit?.maxValue && props.limit.maxValue < inputValue) {
            onChange(props.limit.maxValue);
            return;
        }
    }, []);
    const {
        className,
        label,
        placeholder = translate('Введите сумму'),
        onlyPositive,
        integersLength,
        useGrouping = false
    } = props;

    return <InputLabel
        attrs={props.attrs}
        style={props.style}
        value={value}
        label={label}
        className={className}>
        <MoneyInput
            {...clearProps(props)}
            className="tw-w-full"
            useGrouping={useGrouping}
            placeholder={placeholder}
            placeholderVisibility='empty'
            onlyPositive={onlyPositive}
            integersLength={integersLength || undefined}
            value={value}
            onInputCompleted={onInputCompleted}
            valueChangedCallback={onChange}
            customEvents={['onInputCompleted']}
        />
    </InputLabel>;
}

Money.displayName = 'Controls-Input/inputConnected:Money';
export { Money };
