import { useCallback, useState, useEffect } from 'react';
import { InputLabel } from 'Controls-Input/inputConnected';
import { useConnectedValue, clearProps } from '../useConnectedValue';
import { useValidation, getValidators } from 'Controls-Input/validators';
import { IDateMaskOptions } from 'Controls/interface';
import { IControlProps } from 'Controls/interface';
import { Input as DateInput } from 'Controls/date';
import {
    INameOptions,
    IDateDefaultValueOptions,
    INoJumpingLabelOptions,
    IPlaceholderOptions,
    IRequiredOptions,
    IPeriodLimitOptions,
    IValidateOptions,
} from 'Controls-Input/interface';
import * as translate from 'i18n!Controls-Input';

export interface IDateProps
    extends INameOptions,
        IDateDefaultValueOptions,
        IDateMaskOptions,
        INoJumpingLabelOptions,
        IPlaceholderOptions,
        IRequiredOptions,
        IPeriodLimitOptions,
        IValidateOptions {
}

function getDate(value: string): Date {
    if (value) {
        return new Date(value);
    }
    return null;
}

/**
 * Редактор типа "Дата", работающий со слайсом формы
 * @param props
 */
function DateWidget(props: IDateProps & IControlProps) {
    const {value, onChange} = useConnectedValue(props.name, props.defaultValue);
    const {label, className, placeholder = translate('Начало'), mask = 'DD.MM.YY'} = props;
    const classes = `${className} ${!!value ? 'controls-Input-connected_filled' : ''}`;

    const [dateValue, setDateValue] = useState<Date>(() => {
        return getDate(value);
    });
    const {onFocus, validate, resetValidation, validationStatus} = useValidation(
        props.name,
        getValidators(props)
    );

    useEffect(() => {
        setDateValue(getDate(value));
    }, [value]);

    const onInputCompleted = useCallback((_, dateValue: Date) => {
        const dateTime = dateValue?.getTime();
        if (props.periodLimit?.startDate && props.periodLimit.startDate > dateTime) {
            onChange((new Date(props.periodLimit.startDate)));
            validate();
            return;
        }
        if (props.periodLimit?.endDate && props.periodLimit.endDate < dateTime) {
            onChange((new Date(props.periodLimit.endDate)));
            validate();
            return;
        }

        onChange(dateValue ? (new Date(dateTime)) : null);
        validate();
    }, []);

    const onValueChanged = useCallback((_, result: Date) => {
        resetValidation();
        setDateValue(result);
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

DateWidget.displayName = 'Controls-Input/dateConnected:Date';
export { DateWidget };
