import { useCallback, useEffect, useRef, useState } from 'react';
import { InputLabel } from 'Controls-Input/inputConnected';
import { clearProps, useConnectedValue } from '../useConnectedValue';
import { getValidators, useValidation } from 'Controls-Input/validators';
import { IControlProps, IDateMaskOptions } from 'Controls/interface';
import { Input as DateInput } from 'Controls/date';
import {
    IDateDefaultValueOptions,
    INameOptions,
    INoJumpingLabelOptions,
    IDateLimitOptions,
    IPlaceholderOptions,
    IRequiredOptions,
    IValidateOptions,
} from 'Controls-Input/interface';
import * as translate from 'i18n!Controls-Input';
import { getSizeProps } from 'Controls-Input/utils';

export interface IDateProps
    extends INameOptions,
        IDateDefaultValueOptions,
        IDateMaskOptions,
        INoJumpingLabelOptions,
        IPlaceholderOptions,
        IRequiredOptions,
        IDateLimitOptions,
        IValidateOptions {}

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
    const { value, onChange } = useConnectedValue(props.name, props.defaultValue);
    const { label, className, placeholder = translate('Начало'), mask = 'DD.MM.YY' } = props;
    const classes = `${className} ${!!value ? 'controls-Input-connected_filled' : ''}`;

    const [dateValue, setDateValue] = useState<Date>(() => {
        return getDate(value);
    });
    const ref = useRef();
    const { onFocus, validate, resetValidation, validationStatus } = useValidation(
        props.name,
        getValidators(props),
        ref
    );

    useEffect(() => {
        setDateValue(getDate(value));
    }, [value]);

    const onInputCompleted = useCallback((_, dateValue: Date) => {
        const dateTime = dateValue?.getTime();
        if (props.limit?.startDate && props.limit.startDate > dateTime) {
            onChange(new Date(props.limit.startDate));
            validate();
            return;
        }
        if (props.limit?.endDate && props.limit.endDate < dateTime) {
            onChange(new Date(props.limit.endDate));
            validate();
            return;
        }

        onChange(dateValue ? new Date(dateTime) : null);
        validate();
    }, []);

    const onValueChanged = useCallback((_, result: Date) => {
        resetValidation();
        setDateValue(result);
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
                value={dateValue}
                onValueChanged={onValueChanged}
                onInputCompleted={onInputCompleted}
                onFocus={onFocus}
                validationStatus={validationStatus}
                {...clearProps(props)}
                {...sizeProps}
            />
        </InputLabel>
    );
}

DateWidget.displayName = 'Controls-Input/dateConnected:Date';
export { DateWidget };
