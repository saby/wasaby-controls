import * as React from 'react';

import {
    IRangeSelectorProps,
    Selector as RangeSelector,
    TRangeChangedHandler,
} from 'Controls/dateRange';
import { DataContext } from 'Controls-DataEnv/context';
import { date as formatDate } from 'Types/formatter';
import { Range as RangeUtils } from 'Controls/dateUtils';
import { ArrowButtonsComponent } from 'Controls/columnScrollReact';

import {
    END_DAY_HOUR,
    START_DAY_HOUR,
    DAYS_COUNT_LIMIT,
    MONTHS_COUNT,
} from 'Controls-Lists/_timelineGrid/constants';
import { getQuantum, Quantum, shiftDate, getRangeSize } from 'Controls-Lists/_timelineGrid/utils';
import { IRange } from 'Controls-Lists/_timelineGrid/factory/ITimelineGridFactory';
import TimelineGridSlice from 'Controls-Lists/_timelineGrid/factory/Slice';
import GoUpRangeButton from 'Controls-Lists/_timelineGrid/render/GoUpRangeButton';
import GoToTodayButton from 'Controls-Lists/_timelineGrid/render/GoToTodayButton';
import { HolidayConnectedComponent } from 'Controls-Lists/_timelineGrid/render/Holidays';

function getRangeChangedHandler(slice: TimelineGridSlice): TRangeChangedHandler {
    return (_event: unknown, start: Date, end: Date) => {
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

function getCaptionFormatter(): (start: Date, end: Date) => string {
    return (start, end) => {
        const quantum = getQuantum({ start, end });
        if (quantum === Quantum.Hour) {
            return formatDate(start, "D MMMl'YY");
        }
        if (quantum === Quantum.Day) {
            return formatDate(start, "MMMM'YY");
        }
        if (quantum === Quantum.Month) {
            return formatDate(start, 'YYYY');
        }
    };
}

function getArrowClickHandler(
    slice: TimelineGridSlice
): (direction: 'backward' | 'forward') => void {
    return (direction) => {
        const quantum = getQuantum(slice.range);
        const rangeSize = getRangeSize(slice.range, quantum);

        const startDate = new Date(slice.range.start);
        const endDate = new Date(slice.range.end);
        shiftDate(startDate, direction, quantum, rangeSize);
        shiftDate(endDate, direction, quantum, rangeSize);
        slice.setRange({
            start: startDate,
            end: endDate,
        });
    };
}

function displayGoUpRangeButton(range: IRange): boolean {
    // Выше года нет диапазона
    const rangeSizeInMonths = RangeUtils.getPeriodLengthInMonths(range.start, range.end);
    return rangeSizeInMonths < MONTHS_COUNT;
}

function displayGoToTodayButton(range: IRange): boolean {
    const todayTime = new Date().getTime();
    return todayTime < range.start.getTime() || todayTime > range.end.getTime();
}

function displayHolidayComponent(range: IRange): boolean {
    const quantum = getQuantum(range);
    return quantum === Quantum.Hour;
}

const AVAILABLE_RANGES = {
    days: Array.from({ length: DAYS_COUNT_LIMIT + 1 }, (_, i) => i).slice(1),
    months: Array.from({ length: MONTHS_COUNT + 1 }, (_, i) => i).slice(1),
    quarters: [1],
    halfyears: [1],
    years: [1],
};

interface IProps extends Partial<Exclude<IRangeSelectorProps, 'value'>> {
    storeId: string;
}

export default function RangeSelectorConnectedComponent(props: IProps) {
    const slice = React.useContext(DataContext)[props.storeId] as unknown as TimelineGridSlice;

    const rangeChangedHandler = React.useCallback(getRangeChangedHandler(slice), [slice]);
    const captionFormatter = React.useCallback(getCaptionFormatter(), []);
    const onArrowClick = React.useCallback(getArrowClickHandler(slice), [slice]);

    return (
        <div className={'tw-flex tw-items-center tw-justify-between tw-h-full tw-w-full'}>
            <ArrowButtonsComponent
                isLeftEnabled={true}
                isRightEnabled={true}
                onArrowClick={onArrowClick}
            />

            <div
                className={
                    'tw-flex tw-items-baseline ControlsLists-timelineGrid__RangeSelectorComponent_buttons-gap'
                }
            >
                {displayGoUpRangeButton(slice.range) && (
                    <GoUpRangeButton range={slice.range} setRange={slice.setRange.bind(slice)} />
                )}
                {displayGoToTodayButton(slice.range) && (
                    <GoToTodayButton range={slice.range} setRange={slice.setRange.bind(slice)} />
                )}
                {displayHolidayComponent(slice.range) && (
                    <HolidayConnectedComponent date={slice.range.start} view={'info-icon'} />
                )}
                <RangeSelector
                    {...props}
                    startValue={slice.range.start}
                    endValue={slice.range.end}
                    captionFormatter={captionFormatter}
                    onRangechanged={rangeChangedHandler}
                    ranges={AVAILABLE_RANGES}
                    selectionType="quantum"
                />
            </div>
        </div>
    );
}
