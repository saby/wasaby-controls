import { useCallback, useState, useEffect } from 'react';
import { InputLabel } from 'Controls-Input/inputConnected';
import { useConnectedValue } from '../useConnectedValue';
import { useValidation, getValidators } from 'Controls-Input/validators';
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
    IValidateOptions,
} from 'Controls-Input/interface';

export interface IDateRangeProps
    extends INameOptions,
        IDateRangeDefaultValueOptions,
        IDateMaskOptions,
        INoJumpingLabelOptions,
        IPlaceholderOptions,
        IRequiredOptions,
        IDateRangeLimitOptions,
        IValidateOptions {}

function getDate(value: string): Date {
    if (value) {
        return new Date(value);
    }
    return undefined;
}

/**
 * Редактор типа "Период", работающий со слайсом формы
 * @param props
 */
function Input(props: IDateRangeProps & IControlProps) {
    const { value, onChange } = useConnectedValue(props.name, props.defaultValue);
    const { label, className, placeholder = '12.12.12', mask = 'DD.MM.YY' } = props;
    const classes = `${className} ${!!value ? 'controls-Input-connected_filled' : ''}`;

    const { onFocus, resetValidation, validate, validationStatus } = useValidation(
        props.name,
        getValidators(props)
    );

    const [startDate, setStartDate] = useState<Date>(() => {
        return getDate(value?.startDate);
    });
    const [endDate, setEndDate] = useState<Date>(() => {
        return getDate(value?.endDate);
    });

    useEffect(() => {
        setStartDate(getDate(value?.startDate));
    }, [value?.startDate]);
    useEffect(() => {
        setEndDate(getDate(value?.endDate));
    }, [value?.endDate]);

    const onInputCompleted = useCallback((_, startDate: Date, endDate: Date) => {
        const startValue = startDate?.getTime();
        const endValue = endDate?.getTime();
        const correctValue = {
            startDate: startValue || null,
            endDate: endValue || null,
        };
        if (props.limit?.startDate) {
            if (props.limit.startDate > startValue) {
                correctValue.startDate = props.limit.startDate;
            }
            if (props.limit.startDate > endValue) {
                correctValue.endDate = props.limit.startDate;
            }
        }
        if (props.limit?.endDate) {
            if (props.limit.endDate < startValue) {
                correctValue.startDate = props.limit.endDate;
            }
            if (props.limit.endDate < endValue) {
                correctValue.endDate = props.limit.endDate;
            }
        }
        onChange(correctValue);
        validate();
    }, []);

    const onStartValueChanged = useCallback((_, startValue: Date) => {
        setStartDate(startValue);
        resetValidation();
    }, []);

    const onEndValueChanged = useCallback((_, endValue: Date) => {
        setEndDate(endValue);
        resetValidation();
    }, []);

    return (
        <InputLabel
            attrs={props.attrs}
            style={props.style}
            value={value}
            label={label}
            className={classes}
        >
            <DateInput
                mask={mask}
                placeholder={placeholder}
                placeholderVisibility="empty"
                startValue={startDate}
                endValue={endDate}
                onStartValueChanged={onStartValueChanged}
                onEndValueChanged={onEndValueChanged}
                onInputCompleted={onInputCompleted}
                onFocus={onFocus}
                validationStatus={validationStatus}
            />
        </InputLabel>
    );
}

Input.displayName = 'Controls-Input/dateRangeConnected:Input';
export { Input };
