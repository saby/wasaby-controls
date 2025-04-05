import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { InputLabel } from 'Controls-Input/inputConnected';
import { useConnectedValue } from 'Controls-DataEnv/context';
import { getValidators, useValidation } from 'Controls-Input/validators';
import { Input as DateInput } from 'Controls/dateRange';
import { IComponentProps, IDateMaskOptions } from 'Controls/interface';
import {
    IDateRangeDefaultValueOptions,
    IDateRangeLimitOptions,
    INameOptions,
    INoJumpingLabelOptions,
    IPlaceholderOptions,
    IRequiredOptions,
    IValidateOptions,
} from 'Controls-Input/interface';
import { getDefaultPlaceholder, getStyleProps } from 'Controls-Input/utils';

/**
 * Интерфейс для редактора "Период"
 * @public
 */
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
 * @param {IDateRangeProps} props
 * @public
 */
function Input(props: IDateRangeProps & IComponentProps) {
    const { value, onChange } = useConnectedValue(props.name, props.defaultValue);
    const { label, className, placeholder = getDefaultPlaceholder(), mask = 'DD.MM.YY' } = props;
    const classes = `${className} ${!!value ? 'controls-Input-connected_filled' : ''}`;

    const ref = useRef();
    const { onFocus, resetValidation, validate, validationStatus } = useValidation(
        props.name,
        getValidators(props),
        ref
    );

    const isModel = useMemo(() => typeof value?.set === 'function', [value]);

    const startDateName = useMemo(() => {
        if (value && (value.hasOwnProperty('DateBegin') || isModel)) {
            return 'DateBegin';
        }
        return 'startDate';
    }, [value]);
    const endDateName = useMemo(() => {
        if (value && (value.hasOwnProperty('DateEnd') || isModel)) {
            return 'DateEnd';
        }
        return 'endDate';
    }, [value]);

    const startValue = isModel ? value.get(startDateName) : value?.[startDateName];
    const endValue = isModel ? value.get(endDateName) : value?.[endDateName];

    const [startDate, setStartDate] = useState<Date>(() => {
        return getDate(isModel ? value.get(startDateName) : value?.[startDateName]);
    });
    const [endDate, setEndDate] = useState<Date>(() => {
        return getDate(isModel ? value.get(endDateName) : value?.[endDateName]);
    });

    useEffect(() => {
        setStartDate(getDate(startValue));
    }, [startValue]);
    useEffect(() => {
        setEndDate(getDate(endValue));
    }, [endValue]);

    const onInputCompleted = useCallback(
        (startDate: Date, endDate: Date) => {
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
            if (isModel) {
                value.set(startDateName, correctValue.startDate);
                value.set(endDateName, correctValue.endDate);
                onChange(value);
            } else {
                onChange({
                    [startDateName]: correctValue.startDate,
                    [endDateName]: correctValue.endDate,
                });
            }
            validate();
        },
        [isModel]
    );

    const onStartValueChanged = useCallback((startValue: Date) => {
        setStartDate(startValue);
        resetValidation();
    }, []);

    const onEndValueChanged = useCallback((endValue: Date) => {
        setEndDate(endValue);
        resetValidation();
    }, []);
    const styleProps = getStyleProps(props);

    return (
        <InputLabel
            attrs={props.attrs}
            style={props.style}
            value={value}
            label={label}
            className={classes}
            fontSize={styleProps.fontSize}
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
                {...styleProps}
            />
        </InputLabel>
    );
}

Input.displayName = 'Controls-Input/dateRangeConnected:Input';
export { Input };
