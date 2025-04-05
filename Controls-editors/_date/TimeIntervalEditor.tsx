import { Fragment, memo, useState } from 'react';
import { IPropertyGridPropertyEditorProps } from 'Controls-editors/propertyGrid';
import { Mask } from 'Controls/input';
import { applied } from 'Types/entity';

/**
 * @public
 */
export interface ITimeIntervalEditorProps extends IPropertyGridPropertyEditorProps<string> {
    value: string | undefined;
}

// TODO: переписать после того как Controls\input:TimeInterval сможет поддерживать маску с днями

const parseData = (value: string | undefined) => {
    if (!value) {
        return;
    }
    const hoursPos = 3;
    const minutesPos = 4;
    const secPos = 5;
    const daysCount = 5;
    const timeCount = 2;
    let days = value.substring(1, value.indexOf('D'));
    let hours = value.substring(days.length + hoursPos, value.indexOf('H'));
    let minutes = value.substring(hours.length + days.length + minutesPos, value.indexOf('M'));
    let sec = value.substring(
        minutes.length + hours.length + days.length + secPos,
        value.indexOf('S')
    );
    days = '0'.repeat(daysCount - days.length) + days;
    hours = '0'.repeat(timeCount - hours.length) + hours;
    minutes = '0'.repeat(timeCount - minutes.length) + minutes;
    sec = '0'.repeat(timeCount - sec.length) + sec;
    return days + hours + minutes + sec;
};

const formatMaskChars = {
    h: '[0-2]',
    d: '[0-9]',
    s: '[0-5]',
};

/**
 * Реакт компонент, редактор времени
 * @class Controls-editors/_date/TimeIntervalEditor
 * @implements Controls-editors/date:ITimeEditorProps
 * @public
 */
export const TimeIntervalEditor = memo((props: ITimeIntervalEditorProps) => {
    const {
        type,
        value: valueOrigin,
        onChange: onChangeOrigin,
        LayoutComponent = Fragment,
        mask = 'D:ddddd H:hd M:sd S:sd',
    } = props;

    const [value, setValue] = useState<string>(parseData(valueOrigin) || '');

    const getValue = (newValue: string): string => {
        const interval = new applied.TimeInterval();
        const secStart = 9;
        const minStart = 7;
        const hourStart = 5;
        const timeLength = 2;
        const dayLength = 5;
        interval.addSeconds(+newValue.substr(secStart));
        interval.addMinutes(+newValue.substr(minStart, timeLength));
        interval.addHours(+newValue.substr(hourStart, timeLength));
        interval.addDays(+newValue.substr(0, dayLength));
        return interval.toString();
    };

    const readOnly = type.isDisabled();

    const completeHandler = (newValue: string) => {
        // если кол-во часов больше 23, сбрасываем до 23
        let resultValue = newValue;
        const firstHourDigit = 5;
        const secondHourDigit = 6;
        const lstSecondDigitValue = 3;
        if (+newValue[firstHourDigit] > 1 && +newValue[secondHourDigit] > lstSecondDigitValue) {
            const valueArr = newValue.split('');
            valueArr[secondHourDigit] = '3';
            resultValue = valueArr.join('');
        }

        setValue(resultValue);
        onChangeOrigin?.(getValue(resultValue));
    };

    const changeHandler = (newValue: string) => {
        setValue(newValue);
    };

    return (
        <LayoutComponent>
            <Mask
                replacer={' '}
                value={value}
                readOnly={readOnly}
                mask={mask}
                formatMaskChars={formatMaskChars}
                onValueChanged={changeHandler}
                onInputCompleted={completeHandler}
            />
        </LayoutComponent>
    );
});
