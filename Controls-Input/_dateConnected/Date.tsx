import { useMemo, useCallback } from 'react';
import { InputLabel } from 'Controls-Input/inputConnected';
import { useConnectedValue, clearProps } from '../useConnectedValue';
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
} from 'Controls-Input/interface';
import * as translate from 'i18n!Controls-Input';

export interface IDateProps extends INameOptions, IDateDefaultValueOptions, IDateMaskOptions, INoJumpingLabelOptions,
    IPlaceholderOptions, IRequiredOptions, IPeriodLimitOptions {
}

/**
 * Редактор типа "Дата", работающий со слайсом формы
 * @param props
 */
function DateWidget(props: IDateProps & IControlProps) {
    const {value, onChange} = useConnectedValue(props.name, props.defaultValue);
    const {label, className, placeholder = translate('Начало'), mask = 'DD.MM.YY'} = props;
    const dateValue = useMemo(() => {
        if (value) {
            return new Date(value);
        }
        return undefined;
    }, [value]);
    const onInputCompleted = useCallback((_, dateValue: Date) => {
        const dateTime = dateValue?.getTime();
        if (props.periodLimit?.startDate && props.periodLimit.startDate > dateTime) {
            onChange(props.periodLimit.startDate);
            return;
        }
        if (props.periodLimit?.endDate && props.periodLimit.endDate < dateTime) {
            onChange(props.periodLimit.endDate);
            return;
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
                value={dateValue}
                onValueChanged={(event, dateValue: Date) => onChange(dateValue?.getTime() || null)}
                onInputCompleted={onInputCompleted}
                customEvents={['onValueChanged', 'onInputCompleted']}
                {...clearProps(props)}
            />
        </InputLabel>
    );
}

DateWidget.displayName = 'Controls-Input/dateConnected:Date';
export { DateWidget };
