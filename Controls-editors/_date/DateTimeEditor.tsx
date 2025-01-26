import { Fragment, memo, useCallback, useState, useMemo } from 'react';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { Input as DateInputControl, BaseInput as TimeInputControl } from 'Controls/date';

/**
 * @public
 */
export interface IDateTimeEditorProps extends IPropertyGridPropertyEditorProps<Date> {
    /**
     * Маска для даты и времени, разделяется через пробел
     */
    mask?: string;
}

/**
 * Реакт компонент, редактор времени
 * @class Controls-editors/_date/TimeEditor
 * @implements Controls-editors/date:ITimeEditorProps
 * @public
 */
export const DateTimeEditor = memo((props: IDateTimeEditorProps) => {
    const { type, value, onChange, LayoutComponent = Fragment, mask = 'DD.MM.YY HH:mm:ss' } = props;
    const [dateValue, setDateValue] = useState<Date | undefined>(value);
    const [timeValue, setTimeValue] = useState<Date | undefined>(value);

    const readOnly = type.isDisabled();
    const [dateMask, timeMask] = mask.split(' ');

    const dateCompleteHandler = useCallback(
        (newDateValue: Date) => {
            const newDate = new Date(newDateValue?.getTime());
            if (timeValue) {
                newDate.setHours(
                    timeValue.getHours(),
                    timeValue.getMinutes(),
                    timeValue.getSeconds()
                );
            }
            onChange?.(newDate);
        },
        [onChange, timeValue]
    );

    const timeCompletedHandler = useCallback(
        (time: Date) => {
            const newValue = new Date(dateValue?.getTime() || new Date());
            newValue.setHours(time.getHours(), time.getMinutes(), time.getSeconds());
            onChange?.(newValue);
        },
        [onChange, dateValue]
    );

    const timeEditTemplate = useCallback(() => {
        return (
            <TimeInputControl
                className="controls-padding_left-m"
                value={timeValue}
                mask={timeMask}
                onValueChanged={setTimeValue}
                onInputCompleted={timeCompletedHandler}
                readOnly={readOnly}
            />
        );
    }, [readOnly, timeCompletedHandler, timeMask, timeValue]);

    return (
        <LayoutComponent>
            <DateInputControl
                calendarButtonVisible={true}
                mask={dateMask}
                value={dateValue}
                onValueChanged={setDateValue}
                onInputCompleted={dateCompleteHandler}
                rightFieldTemplate={timeEditTemplate}
                readOnly={readOnly}
            />
        </LayoutComponent>
    );
});
