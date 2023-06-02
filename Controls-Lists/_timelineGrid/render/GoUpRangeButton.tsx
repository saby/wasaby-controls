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
    const monthDaysCount = 30;
    if (rangeSizeInDays < monthDaysCount) {
        return 'month';
    }

    return 'year';
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

export default function GoUpRangeButton(props: IGoUpRangeButtonProps) {
    const { range, setRange } = props;

    const parentRange = getParentRange(range);
    const tooltip = getTooltip(parentRange);

    const onClick = React.useCallback(
        () => {
            let newRange: IRange;
            switch (parentRange) {
                case 'week':
                    newRange = {
                        start: BaseDateUtils.getStartOfWeek(range.start),
                        end: BaseDateUtils.getEndOfWeek(range.start),
                    };
                    break;
                case 'month':
                    newRange = {
                        start: BaseDateUtils.getStartOfMonth(range.start),
                        end: BaseDateUtils.getEndOfMonth(range.start),
                    };
                    break;
                case 'year':
                    newRange = {
                        start: BaseDateUtils.getStartOfYear(range.start),
                        end: BaseDateUtils.getEndOfYear(range.start),
                    };
                    break;
            }
            setRange(newRange);
        },
        [range, setRange, parentRange]
    );

    return (
        <Button
            icon="icon-Undo2"
            iconStyle="secondary"
            viewMode="link"
            onClick={onClick}
            tooltip={tooltip}
        />
    );
}
