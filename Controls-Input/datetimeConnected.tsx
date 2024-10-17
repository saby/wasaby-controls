import { Component, useCallback, useEffect, useRef, useState } from 'react';
import { InputLabel } from 'Controls-Input/inputConnected';
import {
    IDateDefaultValueOptions,
    IDateLimitOptions,
    INameOptions,
    INoJumpingLabelOptions,
    IPlaceholderOptions,
    IRequiredOptions,
    IValidateOptions,
} from 'Controls-Input/interface';
import { clearProps, useConnectedValue } from 'Controls-DataEnv/context';
import { getValidators, useValidation } from 'Controls-Input/validators';
import { getSizeProps } from 'Controls-Input/utils';
import { Input as DateInput, IBaseInputMaskOptions,} from 'Controls/date';
import * as translate from 'i18n!Controls-Input';

export interface IDateTimeConnectedProps
    extends INameOptions,
        IDateDefaultValueOptions,
        INoJumpingLabelOptions,
        IPlaceholderOptions,
        IRequiredOptions,
        IDateLimitOptions,
        IBaseInputMaskOptions,
        IValidateOptions {
    component: typeof Component;
    className?: string;
    inputCallback?: (value: Date | null) => Date | null;
}

function getDate(value: string | Date): Date | null {
    if (value) {
        return new Date(value);
    }
    return null;
}

/**
 * Редактор типа "ДатаВремя", работающий со слайсом формы
 * @param props
 * @demo Controls-Input-demo/DateConnected/DateTime/Index
 */
function DateTimeConnected(props: IDateTimeConnectedProps) {
    const { value, onChange } = useConnectedValue(props.name, props.defaultValue);
    const {
        className,
        label,
        placeholder = translate('Начало'),
        mask = 'DD.MM.YY HH:mm',
        component: Component = DateInput,
    } = props;
    const classes = `${className} ${!!value ? 'controls-Input-connected_filled' : ''}`;

    const ref = useRef();
    const { onFocus, resetValidation, validate, validationStatus } = useValidation(
        props.name,
        getValidators(props),
        ref
    );

    const [dateValue, setDateValue] = useState<Date | null>(() => {
        return getDate(value as Date);
    });

    useEffect(() => {
        setDateValue(getDate(value as Date));
    }, [value]);

    const onValueChanged = useCallback((result: Date) => {
        resetValidation();
        setDateValue(result);
    }, []);
    const sizeProps = getSizeProps(props);

    const onInputCompleted = useCallback((dateResult: Date) => {
        const result = props.inputCallback?.(dateResult) || dateResult;
        onChange(result);
        validate();
    }, []);

    return (
        <InputLabel
            attrs={props.attrs}
            style={props.style}
            value={value}
            label={label}
            className={classes}
            fontSize={sizeProps.fontSize}
        >
            <Component
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

DateTimeConnected.displayName = 'Controls-Input/datetimeConnected:Input';

export { DateTimeConnected as Input };
