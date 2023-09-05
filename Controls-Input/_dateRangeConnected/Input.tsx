import { useMemo, useCallback } from 'react';
import { InputLabel } from 'Controls-Input/inputConnected';
import { useConnectedValue } from '../useConnectedValue';
import { Input as DateInput } from 'Controls/dateRange';
import { IDateMaskOptions } from 'Controls/interface';
import { IControlProps } from 'Controls/interface';
import {
    INameOptions,
    IDateRangeDefaultValueOptions,
    INoJumpingLabelOptions,
    IPlaceholderOptions,
    IRequiredOptions,
    IDateRangeLimitOptions,
} from 'Controls-Input/interface';

export interface IDateRangeProps extends INameOptions, IDateRangeDefaultValueOptions, IDateMaskOptions,
    INoJumpingLabelOptions, IPlaceholderOptions, IRequiredOptions, IDateRangeLimitOptions {
}

/**
 * Редактор типа "Период", работающий со слайсом формы
 * @param props
 */
function Input(props: IDateRangeProps & IControlProps) {
    const {value, onChange} = useConnectedValue(props.name, props.defaultValue);
    const {label, className, placeholder = '12.12.12', mask = 'DD.MM.YY'} = props;
    const startDate = useMemo(() => {
        if (value?.startDate) {
            return new Date(value.startDate);
        }
        return undefined;
    }, [value?.startDate]);
    const endDate = useMemo(() => {
        if (value?.endDate) {
            return new Date(value.endDate);
        }
        return undefined;
    }, [value?.endDate]);

    const onInputCompleted = useCallback((_, startDate: Date, endDate: Date) => {
        const startValue = startDate?.getTime();
        const endValue = endDate?.getTime();
        let isEdit = false;
        const correctValue = {
            startDate: startValue,
            endDate: endValue
        };
        if (props.limit?.startDate) {
            if (props.limit.startDate > startValue) {
                correctValue.startDate = props.limit.startDate;
                isEdit = true;
            }
            if (props.limit.startDate > endValue) {
                correctValue.endDate = props.limit.startDate;
                isEdit = true;
            }
        }
        if (props.limit?.endDate) {
            if (props.limit.endDate < startValue) {
                correctValue.startDate = props.limit.endDate;
                isEdit = true;
            }
            if (props.limit.endDate < endValue) {
                correctValue.endDate = props.limit.endDate;
                isEdit = true;
            }
        }

        if (isEdit) {
            onChange(correctValue);
        }
    }, []);

    return (
        <InputLabel
            attrs={props.attrs}
            style={props.style}
            value={value}
            label={label}
            className={className}>
            <DateInput
                mask={mask}
                placeholder={placeholder}
                placeholderVisibility='empty'
                startValue={startDate}
                endValue={endDate}
                onStartvaluechanged={
                    (event, startDate: Date) => onChange({...value, startDate: (startDate.getTime() || null)})
                }
                onEndvaluechanged={
                    (event, endDate: Date) => onChange({...value, endDate: (endDate.getTime() || null)})
                }
                onInputcompleted={onInputCompleted}
                customEvents={['onStartvaluechanged', 'onEndvaluechanged']}
            />
        </InputLabel>
    );
}

Input.displayName = 'Controls-Input/dateRangeConnected:Input';
export { Input };
