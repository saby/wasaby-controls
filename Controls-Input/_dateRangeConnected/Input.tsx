import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { InputLabel } from 'Controls-Input/inputConnected';
import { useConnectedValue } from 'Controls-DataEnv/context';
import { getValidators, useValidation } from 'Controls-Input/validators';
import { Input as DateInput } from 'Controls/dateRange';
import { IControlProps, IDateMaskOptions } from 'Controls/interface';
import {
    IDateRangeDefaultValueOptions,
    IDateRangeLimitOptions,
    INameOptions,
    INoJumpingLabelOptions,
    IPlaceholderOptions,
    IRequiredOptions,
    IValidateOptions,
} from 'Controls-Input/interface';
import { getSizeProps } from 'Controls-Input/utils';

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
    return null;
}

/**
 * Редактор типа "Период", работающий со слайсом формы
 * @param props
 */
function Input(props: IDateRangeProps & IControlProps) {
    const { value, onChange } = useConnectedValue(props.name, props.defaultValue);
    const { label, className, placeholder = '12.12.12', mask = 'DD.MM.YY' } = props;
    const classes = `${className} ${!!value ? 'controls-Input-connected_filled' : ''}`;

    const ref = useRef();
    const { onFocus, resetValidation, validate, validationStatus } = useValidation(
        props.name,
        getValidators(props),
        ref
    );

    const startDateName = useMemo(()=>{
        if (value && value.hasOwnProperty('BeginDate')) {
            return 'BeginDate';
        }
        return 'startDate';
    }, [value]);
    const endDateName = useMemo(()=>{
        if (value && value.hasOwnProperty('BeginDate')) {
            return 'EndDate';
        }
        return 'endDate';
    }, [value]);

    const [startDate, setStartDate] = useState<Date>(() => {
        return getDate(value?.[startDateName]);
    });
    const [endDate, setEndDate] = useState<Date>(() => {
        return getDate(value?.[endDateName]);
    });

    useEffect(() => {
        setStartDate(getDate(value?.[startDateName]));
    }, [value?.startDate]);
    useEffect(() => {
        setEndDate(getDate(value?.[endDateName]));
    }, [value?.endDate]);

    const onInputCompleted = useCallback((startDate: Date, endDate: Date) => {
        const startValue = startDate?.getTime();
        const endValue = endDate?.getTime();
        const correctValue = {
            startDate: startValue ? new Date(startValue) : null,
            endDate: endValue ? new Date(endValue) : null,
        };
        if (props.limit?.startDate) {
            if (props.limit.startDate > startValue) {
                correctValue.startDate = new Date(props.limit.startDate);
            }
            if (props.limit.startDate > endValue) {
                correctValue.endDate = new Date(props.limit.startDate);
            }
        }
        if (props.limit?.endDate) {
            if (props.limit.endDate < startValue) {
                correctValue.startDate = new Date(props.limit.endDate);
            }
            if (props.limit.endDate < endValue) {
                correctValue.endDate = new Date(props.limit.endDate);
            }
        }
        onChange({
            [startDateName]: correctValue.startDate,
            [endDateName]: correctValue.endDate
        });
        validate();
    }, []);

    const onStartValueChanged = useCallback((startValue: Date) => {
        setStartDate(startValue);
        resetValidation();
    }, []);

    const onEndValueChanged = useCallback((endValue: Date) => {
        setEndDate(endValue);
        resetValidation();
    }, []);
    const sizeProps = getSizeProps(props);

    return (
        <InputLabel
            attrs={props.attrs}
            style={props.style}
            value={value}
            label={label}
            className={classes}
            fontSize={sizeProps.fontSize}
        >
            <DateInput
                ref={ref}
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
                data-qa={props['data-qa']}
                {...sizeProps}
            />
        </InputLabel>
    );
}

Input.displayName = 'Controls-Input/dateRangeConnected:Input';
export { Input };
