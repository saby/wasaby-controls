import { useCallback, useState, useEffect } from 'react';
import { IControlProps } from 'Controls/interface';
import { BaseInput as TimeInput } from 'Controls/date';
import { useConnectedValue, clearProps } from '../useConnectedValue';
import { useValidation, getValidators } from 'Controls-Input/validators';
import { InputLabel } from 'Controls-Input/inputConnected';
import {
    INameOptions,
    IDateDefaultValueOptions,
    INoJumpingLabelOptions,
    IPlaceholderOptions,
    IRequiredOptions,
    IPeriodLimitOptions,
    ITimeMaskOptions,
    IValidateOptions,
} from 'Controls-Input/interface';
import * as translate from 'i18n!Controls-Input';

export interface ITimeProps
    extends INameOptions,
        IDateDefaultValueOptions,
        ITimeMaskOptions,
        INoJumpingLabelOptions,
        IPlaceholderOptions,
        IRequiredOptions,
        IPeriodLimitOptions,
        IValidateOptions {}

function getDate(value: string): Date {
    if (value) {
        return new Date(value);
    }
    return undefined;
}

/**
 * Редактор типа "Время", работающий со слайсом формы
 * @param props
 */
function Time(props: ITimeProps & IControlProps) {
    const { value, onChange } = useConnectedValue(props.name, props.defaultValue);
    const { placeholder = translate('Начало'), mask = 'HH:mm' } = props;
    const [dateValue, setDateValue] = useState<Date>(() => {
        return getDate(value);
    });
    const { onFocus, validate, resetValidation, validationStatus } = useValidation(
        props.name,
        getValidators(props)
    );

    useEffect(() => {
        setDateValue(getDate(value));
    }, [value]);

    const onInputCompleted = useCallback((_, dateValue: Date) => {
        if (!dateValue) {
            onChange(null);
            validate();
            return;
        }
        const startDate = new Date(props.periodLimit?.startDate);
        const endDate = new Date(props.periodLimit?.endDate);
        if (props.periodLimit?.startDate && startDate.getHours() > dateValue.getHours()) {
            onChange(startDate);
            validate();
            return;
        } else if (
            startDate.getHours() === dateValue.getHours() &&
            startDate.getMinutes() > dateValue.getMinutes()
        ) {
            onChange(startDate);
            validate();
            return;
        }
        if (props.periodLimit?.endDate && endDate.getHours() < dateValue.getHours()) {
            onChange(endDate);
            validate();
            return;
        } else if (
            endDate.getHours() === dateValue.getHours() &&
            endDate.getMinutes() < dateValue.getMinutes()
        ) {
            onChange(endDate);
            validate();
            return;
        }
        onChange(dateValue ? (new Date(dateValue.getTime())) : null);
        validate();
    }, []);

    const onValueChanged = useCallback((_, result: Date) => {
        resetValidation();
        setDateValue(result);
    }, []);
    const classes = `${props.className} ${!!value ? 'controls-Input-connected_filled' : ''}`;

    return (
        <InputLabel
            attrs={props.attrs}
            style={props.style}
            value={value}
            label={props.label}
            className={classes}
        >
            <TimeInput
                mask={mask}
                placeholder={placeholder}
                placeholderVisibility="empty"
                value={dateValue}
                onValueChanged={onValueChanged}
                onInputCompleted={onInputCompleted}
                onFocus={onFocus}
                validationStatus={validationStatus}
                {...clearProps(props)}
            />
        </InputLabel>
    );
}

Time.displayName = 'Controls-Input/dateConnected:Time';
export { Time };
