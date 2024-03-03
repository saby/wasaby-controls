import { useCallback, useEffect, useRef, useState } from 'react';
import { IControlProps } from 'Controls/interface';
import { BaseInput as TimeInput } from 'Controls/date';
import { clearProps, useConnectedValue } from '../useConnectedValue';
import { getValidators, useValidation } from 'Controls-Input/validators';
import { InputLabel } from 'Controls-Input/inputConnected';
import {
    IDateDefaultValueOptions,
    INameOptions,
    INoJumpingLabelOptions,
    IPeriodLimitOptions,
    IPlaceholderOptions,
    IRequiredOptions,
    ITimeMaskOptions,
    IValidateOptions,
} from 'Controls-Input/interface';
import * as translate from 'i18n!Controls-Input';
import { getSizeProps } from 'Controls-Input/utils';

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
    return null;
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
    const ref = useRef();
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
        onChange(dateValue ? new Date(dateValue.getTime()) : null);
        validate();
    }, []);

    const onValueChanged = useCallback((_, result: Date) => {
        resetValidation();
        setDateValue(result);
    }, []);
    const classes = `${props.className} ${!!value ? 'controls-Input-connected_filled' : ''}`;
    const sizeProps = getSizeProps(props);

    return (
        <div {...(props.attrs || {})} className={classes}>
            <InputLabel
                style={props.style}
                value={value}
                label={props.label}
                fontSize={sizeProps.fontSize}
            >
                <TimeInput
                    ref={ref}
                    mask={mask}
                    placeholder={placeholder}
                    placeholderVisibility="empty"
                    value={dateValue}
                    onValueChanged={onValueChanged}
                    onInputCompleted={onInputCompleted}
                    onFocus={onFocus}
                    validationStatus={validationStatus}
                    {...clearProps(props)}
                    {...sizeProps}
                />
            </InputLabel>
        </div>
    );
}

Time.displayName = 'Controls-Input/dateConnected:Time';
export { Time };
