/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as React from 'react';

import { Button } from 'Controls/buttons';
import { Base as BaseDateUtils, Range as RangeUtils } from 'Controls/dateUtils';

import { IRange } from 'Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments';

interface IGoUpRangeButtonProps {
    range: IRange;
    weekSize: number;
    availableRanges: Record<string, number[]>;
    setRange: (range: IRange, quantumScale?: number) => void;
}

type TParentRange = 'week' | 'month' | 'year';

function getParentRange(
    range: IRange,
    availableRangesByWidth?: Record<string, number[]>,
    availableRanges?: Record<string, number[]>,
    weekSize?: number
): TParentRange {
    const rangeSizeInDays = RangeUtils.getPeriodLengthInDays(range.start, range.end);
    const canGoToDays = availableRanges?.days?.[availableRanges?.days.length - 1] > 1;
    let weekDaysCount = weekSize || 7;

    const isSelectedMonth =
        BaseDateUtils.isStartOfMonth(range.start) && BaseDateUtils.isEndOfMonth(range.end);
    let monthDaysCount = new Date(
        range.start.getFullYear(),
        range.start.getMonth() + 1,
        0
    ).getDate();
    if (weekDaysCount !== 7) {
        monthDaysCount -= 4;
    }
    if (availableRangesByWidth) {
        // При маленькой ширине, в выбранном месяце будет отображаться меньше дней, чем в полном месяце.
        // Следующим более крупным масштабом будет уже год.
        const maxDaysCount = availableRangesByWidth.days?.[availableRangesByWidth.days.length - 1];
        monthDaysCount = Math.min(maxDaysCount, monthDaysCount);
        weekDaysCount = Math.min(maxDaysCount, weekDaysCount);
    }
    if (rangeSizeInDays < weekDaysCount) {
        return 'week';
    }
    if (isSelectedMonth || rangeSizeInDays >= monthDaysCount || !canGoToDays) {
        return 'year';
    }

    return 'month';
}

function getTooltip(parentRange: TParentRange): string {
    let parentRangeName;
    switch (parentRange) {
        case 'week':
            parentRangeName = 'Неделя';
            break;
        case 'month':
            parentRangeName = 'Месяц';
            break;
        case 'year':
            parentRangeName = 'Год';
            break;
    }
    return `В режим "${parentRangeName}"`;
}

function getUpRange(currentRange: IRange, parentRange: TParentRange): IRange {
    let upRange: IRange;
    switch (parentRange) {
        case 'week':
            upRange = {
                start: BaseDateUtils.getStartOfWeek(currentRange.start),
                end: BaseDateUtils.getEndOfWeek(currentRange.start),
            };
            upRange.start.setHours(0, 0, 0);
            upRange.end.setHours(0, 0, 0);
            break;
        case 'month':
            upRange = {
                start: BaseDateUtils.getStartOfMonth(currentRange.start),
                end: BaseDateUtils.getEndOfMonth(currentRange.start),
            };
            break;
        case 'year':
            upRange = {
                start: BaseDateUtils.getStartOfYear(currentRange.start),
                end: BaseDateUtils.getEndOfYear(currentRange.start),
            };
            break;
    }
    return upRange;
}

export default function GoUpRangeButton(props: IGoUpRangeButtonProps) {
    const { range, availableRangesByWidth, availableRanges, setRange, weekSize } = props;

    const parentRange = getParentRange(range, availableRangesByWidth, availableRanges, weekSize);
    const tooltip = getTooltip(parentRange);

    const onClick = React.useCallback(() => {
        const upRange = getUpRange(range, parentRange);
        // устанавливаем новый диапазон и сбрасываем quantumScale
        setRange(upRange, 1);
    }, [range, setRange, parentRange]);

    return (
        <Button
            icon="icon-Undo2"
            iconStyle="secondary"
            viewMode="link"
            onClick={onClick}
            customEvents={['onClick']}
            tooltip={tooltip}
            fontSize={'m'}
            inlineHeight={'mt'}
            data-qa="Controls-Lists_timelineGrid__GoUpRangeButton"
        />
    );
}
