import { useMemo, useCallback } from 'react';
import { IControlProps } from 'Controls/interface';
import { BaseInput as TimeInput } from 'Controls/date';
import { useConnectedValue, clearProps } from '../useConnectedValue';
import { InputLabel } from 'Controls-Input/inputConnected';
import {
    INameOptions,
    IDateDefaultValueOptions,
    INoJumpingLabelOptions,
    IPlaceholderOptions,
    IRequiredOptions,
    IPeriodLimitOptions,
    ITimeMaskOptions
} from 'Controls-Input/interface';
import * as translate from 'i18n!Controls';

export interface ITimeProps extends INameOptions, IDateDefaultValueOptions, ITimeMaskOptions, INoJumpingLabelOptions,
    IPlaceholderOptions, IRequiredOptions, IPeriodLimitOptions {
}

/**
 * Редактор типа "Время", работающий со слайсом формы
 * @param props
 */
function Time(props: ITimeProps & IControlProps) {
    const {value, onChange} = useConnectedValue(props.name, props.defaultValue);
    const {placeholder = translate('Начало'), mask = 'HH:mm'} = props;
    const dateValue = useMemo(() => {
        if (value) {
            return new Date(value);
        }
        return undefined;
    }, [value]);
    const onInputCompleted = useCallback((_, dateValue: Date) => {
        const startDate = new Date(props.periodLimit?.startDate);
        const endDate = new Date(props.periodLimit?.endDate);
        if (props.periodLimit?.startDate &&
            startDate.getHours() > dateValue.getHours()
        ) {
            onChange(props.periodLimit.startDate);
            return;
        } else if (startDate.getHours() === dateValue.getHours() && startDate.getMinutes() > dateValue.getMinutes()) {
            onChange(props.periodLimit.startDate);
            return;
        }
        if (props.periodLimit?.endDate &&
            endDate.getHours() < dateValue.getHours()) {
            onChange(props.periodLimit.endDate);
            return;
        } else if (endDate.getHours() === dateValue.getHours() && endDate.getMinutes() < dateValue.getMinutes()) {
            onChange(props.periodLimit.endDate);
            return;
        }
    }, []);

    return <InputLabel
        attrs={props.attrs}
        style={props.style}
        value={value}
        label={props.label}
        className={props.className}>
        <TimeInput
            mask={mask}
            placeholder={placeholder}
            placeholderVisibility='empty'
            value={dateValue}
            onValueChanged={(event, dateValue: Date) => onChange(dateValue?.getTime() || null)}
            onInputCompleted={onInputCompleted}
            customEvents={['onValueChanged', 'onInputCompleted']}
            {...clearProps(props)}/>
    </InputLabel>;
}

Time.displayName = 'Controls-Input/dateConnected:Time';
export { Time };
