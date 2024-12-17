import { useCallback } from 'react';
import { IControlProps } from 'Controls/interface';
import { BaseInput as TimeInput } from 'Controls/date';
import {
    IDateDefaultValueOptions,
    IDateLimitOptions,
    INameOptions,
    INoJumpingLabelOptions,
    IPlaceholderOptions,
    IRequiredOptions,
    ITimeMaskOptions,
    IValidateOptions,
} from 'Controls-Input/interface';
import { Input } from 'Controls-Input/datetimeConnected';

export interface ITimeProps
    extends INameOptions,
        IDateDefaultValueOptions,
        ITimeMaskOptions,
        INoJumpingLabelOptions,
        IPlaceholderOptions,
        IRequiredOptions,
        IDateLimitOptions,
        IValidateOptions {}
/**
 * Редактор типа "Время", работающий со слайсом формы
 * @param props
 */
function Time(props: ITimeProps & IControlProps) {
    const { mask = 'HH:mm' } = props;
    const inputCallback = useCallback((dateValue: Date | null) => {
        if (!dateValue) {
            return null;
        }
        const startDate = new Date(props.limit?.startDate);
        const endDate = new Date(props.limit?.endDate);
        if (props.limit?.startDate && startDate.getHours() > dateValue.getHours()) {
            return startDate;
        } else if (
            startDate.getHours() === dateValue.getHours() &&
            startDate.getMinutes() > dateValue.getMinutes()
        ) {
            return startDate;
        }
        if (props.limit?.endDate && endDate.getHours() < dateValue.getHours()) {
            return endDate;
        } else if (
            endDate.getHours() === dateValue.getHours() &&
            endDate.getMinutes() < dateValue.getMinutes()
        ) {
            return endDate;
        }
        return dateValue ? new Date(dateValue.getTime()) : null;
    }, []);

    return <Input {...props} mask={mask} component={TimeInput} inputCallback={inputCallback} />;
}

Time.displayName = 'Controls-Input/dateConnected:Time';
export { Time };
