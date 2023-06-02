import * as React from 'react';

import {
    IRangeSelectorProps,
    Selector as RangeSelector,
    TRangeChangedHandler,
} from 'Controls/dateRange';
import { DataContext } from 'Controls-DataEnv/context';
import { date as formatDate } from 'Types/formatter';
import { Range as RangeUtils } from 'Controls/dateUtils';

import { END_DAY_HOUR, START_DAY_HOUR } from 'Controls-Lists/_timelineGrid/constants';
import { getQuantum, Quantum } from 'Controls-Lists/_timelineGrid/utils';
import { IRange } from 'Controls-Lists/_timelineGrid/factory/ITimelineGridFactory';
import GoUpRangeButton from 'Controls-Lists/_timelineGrid/render/GoUpRangeButton';

function getRangeChangedHandler(slice: unknown): TRangeChangedHandler {
    return (start: Date, end: Date) => {
        const range = {
            start: new Date(start),
            end: new Date(end),
        };
        // Значит выбрали один день, нужно скорректировать время.
        // Мы отображаем с 8 до 20 часов в день.
        if (range.start.getTime() === range.end.getTime()) {
            range.start.setHours(START_DAY_HOUR);
            range.end.setHours(END_DAY_HOUR);
        }
        slice.setRange(range);
    };
}

function getCaptionFormatter(activeDate: Date): (start: Date, end: Date) => string {
    return (start, end) => {
        const quantum = getQuantum({start, end});
        if (quantum === Quantum.Hour) {
            return formatDate(activeDate, 'D MMMl\'YY');
        }
        if (quantum === Quantum.Day) {
            return formatDate(activeDate, 'MMMM\'YY');
        }
        if (quantum === Quantum.Month) {
            return formatDate(activeDate, 'YYYY');
        }
    };
}

interface IProps extends Partial<IRangeSelectorProps> {
    storeId: string;
}

export default function RangeSelectorConnectedComponent(props: IProps) {
    const slice = React.useContext(DataContext)[props.storeId];
    // TODO нужно отслеживать активную дату
    const activeDate = slice.range.start;

    const rangeChangedHandler = React.useCallback(getRangeChangedHandler(slice), [slice]);
    const captionFormatter = React.useCallback(getCaptionFormatter(activeDate), [activeDate]);

    return (
        <div>
            {displayGoUpRangeButton(slice.range) && (
                <GoUpRangeButton range={slice.range} setRange={slice.setRange.bind(slice)} />
            )}
            <RangeSelector
                {...props}
                startValue={slice.state.range.start}
                endValue={slice.state.range.end}
                captionFormatter={captionFormatter}
                onRangeChanged={rangeChangedHandler}
            />
        </div>
    );
}

function displayGoUpRangeButton(range: IRange): boolean {
    // Выше года нет диапазона
    const rangeSizeInMonths = RangeUtils.getPeriodLengthInMonths(range.start, range.end);
    const monthsInYear = 12;
    return  rangeSizeInMonths < monthsInYear;
}
