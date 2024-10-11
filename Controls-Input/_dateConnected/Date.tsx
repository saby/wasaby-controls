import { useCallback } from 'react';
import { IControlProps, IDateMaskOptions } from 'Controls/interface';
import {
    IDateDefaultValueOptions,
    IDateLimitOptions,
    INameOptions,
    INoJumpingLabelOptions,
    IPlaceholderOptions,
    IRequiredOptions,
    IValidateOptions,
} from 'Controls-Input/interface';
import { Input } from 'Controls-Input/datetimeConnected';

export interface IDateProps
    extends INameOptions,
        IDateDefaultValueOptions,
        IDateMaskOptions,
        INoJumpingLabelOptions,
        IPlaceholderOptions,
        IRequiredOptions,
        IDateLimitOptions,
        IValidateOptions {}

/**
 * Редактор типа "Дата", работающий со слайсом формы
 * @param props
 */
function DateWidget(props: IDateProps & IControlProps) {
    const { mask = 'DD.MM.YY' } = props;

    const inputCallback = useCallback((dateValue: Date | null) => {
        if (!dateValue) {
            return dateValue;
        }
        const dateTime = dateValue?.getTime();
        if (props.limit?.startDate && props.limit.startDate > dateTime) {
            return new Date(props.limit.startDate);
        }
        if (props.limit?.endDate && props.limit.endDate < dateTime) {
            return new Date(props.limit.endDate);
        }

        return dateValue ? dateValue : null;
    }, []);

    return <Input {...props} mask={mask} inputCallback={inputCallback} />;
}

DateWidget.displayName = 'Controls-Input/dateConnected:Date';
export { DateWidget };
