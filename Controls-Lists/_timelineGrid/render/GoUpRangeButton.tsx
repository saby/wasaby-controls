import * as React from 'react';

import { Button } from 'Controls/buttons';
import { Base as BaseDateUtils, Range as RangeUtils } from 'Controls/dateUtils';

import { IRange } from 'Controls-Lists/_timelineGrid/factory/ITimelineGridFactory';

interface IGoUpRangeButtonProps {
    range: IRange;
    setRange: (range: IRange) => void;
}

type TParentRange = 'week' | 'month' | 'year';

function getParentRange(range: IRange): TParentRange {
    const rangeSizeInDays = RangeUtils.getPeriodLengthInDays(range.start, range.end);
    const weekDaysCount = 7;
    if (rangeSizeInDays < weekDaysCount) {
        return 'week';
    }

    const isSelectedMonth =
        BaseDateUtils.isStartOfMonth(range.start) && BaseDateUtils.isEndOfMonth(range.end);
    const monthDaysCount = 30;
    if (isSelectedMonth || rangeSizeInDays > monthDaysCount) {
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
    const { range, setRange } = props;

    const parentRange = getParentRange(range);
    const tooltip = getTooltip(parentRange);

    const onClick = React.useCallback(() => {
        const upRange = getUpRange(range, parentRange);
        setRange(upRange);
    }, [range, setRange, parentRange]);

    return (
        <Button
            icon="icon-Undo2"
            iconStyle="secondary"
            viewMode="link"
            onClick={onClick}
            customEvents={['onClick']}
            tooltip={tooltip}
        />
    );
}
