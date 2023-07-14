import { useCallback } from 'react';
import { IOnlyPositiveOptions } from 'Controls/baseDecorator';
import { useConnectedValue, clearProps } from '../useConnectedValue';
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
} from 'Controls-Input/interface';
import * as translate from 'i18n!Controls';

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
        ILimitOptions {
}

/**
 * Редактор типа "Число", работающий со слайсом формы
 * @param props
 */
function Number(props: INumberProps & IControlProps) {
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
        placeholder = translate('Укажите число'),
        onlyPositive,
        integersLength,
        precision,
        useGrouping = false,
    } = props;

    return (
        <InputLabel
            attrs={props.attrs}
            style={props.style}
            value={value}
            label={label}
            className={className}
        >
            <NumberInput
                {...clearProps(props)}
                useGrouping={useGrouping}
                placeholder={placeholder}
                placeholderVisibility='empty'
                onlyPositive={onlyPositive}
                integersLength={integersLength || undefined}
                precision={precision}
                value={value}
                onInputCompleted={onInputCompleted}
                valueChangedCallback={onChange}
                customEvents={['onInputCompleted']}
            />
        </InputLabel>
    );
}

Number.displayName = 'Controls-Input/inputConnected:Number';
export { Number };
