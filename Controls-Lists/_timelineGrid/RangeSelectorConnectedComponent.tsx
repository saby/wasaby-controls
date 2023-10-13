import * as React from 'react';

import {
    IRangeSelectorProps,
    Selector as RangeSelector,
    TRangeChangedHandler,
} from 'Controls/dateRange';
import { DataContext } from 'Controls-DataEnv/context';
import { date as formatDate } from 'Types/formatter';
import { Range as RangeUtils, Base as DateUtils } from 'Controls/dateUtils';
import { ArrowButton } from 'Controls/buttons';

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
import { Base as DateUtil } from 'Controls/dateUtils';
import { RecordSet } from 'Types/collection';

function getRangeChangedHandler(slice: TimelineGridSlice): TRangeChangedHandler {
    return (_event: unknown, start: Date, end: Date) => {
        const range = {
            start: new Date(start),
            end: new Date(end),
        };

        // Ошибка в RangeSelector
        // При выборе больше 12 месяцев прилетает неправильный рейдж.
        // И он всегда инвертированный.
        // https://online.sbis.ru/opendoc.html?guid=d206b1ab-2b6f-44e8-b40a-2e01e4675d6b&client=3
        // Поправлено, т.к. блочит внедрение, удалить после выполнения ошибки.
        if (range.end < range.start) {
            // Прилетевшая в событии дата конца это на самом деле дата начала, а прилетевшая
            // дата начала - произвольная. В таком кейсе всегда выбирается год.
            range.start.setMonth(0, 1);
            range.end.setFullYear(range.start.getFullYear(), 11, 31);
        }
        // Значит выбрали один день, нужно скорректировать время.
        // Мы отображаем с 8 до 20 часов в день.
        else if (range.start.getTime() === range.end.getTime()) {
            range.start.setHours(START_DAY_HOUR);
            range.end.setHours(END_DAY_HOUR);
        }
        slice.setRange(range);
    };
}

function getCaptionFormatter(): (start: Date, end: Date) => string {
    return (start, end) => {
        const quantum = getQuantum({
            start,
            end,
        });
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

function getActivityStartHour(
    date: Date,
    items: RecordSet,
    eventsProperty: string,
    eventStartProperty: string
) {
    let minHour = END_DAY_HOUR;

    if (eventsProperty && eventStartProperty) {
        // TODO: Нужно прервать цикл, если нашли 0. forEach этого не поддерживает.
        items.forEach((record) => {
            const eventsRS = record.get(eventsProperty) as RecordSet;
            if (eventsRS) {
                eventsRS.forEach((e) => {
                    const eStartDate = e.get(eventStartProperty) as Date;
                    if (DateUtil.isDaysEqual(date, eStartDate)) {
                        minHour = Math.min(eStartDate.getHours(), minHour);
                    }
                });
            }
        });
    }

    return minHour === END_DAY_HOUR ? START_DAY_HOUR : minHour;
}

function getArrowClickHandler(
    slice: TimelineGridSlice,
    direction: 'backward' | 'forward'
): () => void {
    return () => {
        const quantum = getQuantum(slice.range);
        const rangeSize = getRangeSize(slice.range, quantum);

        const isMonthSelected =
            DateUtils.isStartOfMonth(slice.range.start) && DateUtils.isEndOfMonth(slice.range.end);

        let startDate = new Date(slice.range.start);
        let endDate = new Date(slice.range.end);

        if (isMonthSelected && quantum === Quantum.Day) {
            const monthOffset = direction === 'backward' ? -1 : 1;
            const result = RangeUtils.shiftPeriodByMonth(startDate, endDate, monthOffset);
            startDate = new Date(result[0]);
            endDate = new Date(result[1]);
        } else {
            if (quantum === 'hour') {
                startDate.setDate(startDate.getDate() + (direction === 'backward' ? -1 : 1));
                startDate.setHours(
                    getActivityStartHour(
                        startDate,
                        slice.state.items,
                        slice.state.eventsProperty,
                        slice.state.eventStartProperty
                    )
                );
                endDate = new Date(startDate);
                endDate.setHours(startDate.getHours() + rangeSize);
            } else {
                shiftDate(startDate, direction, quantum, rangeSize);
                shiftDate(endDate, direction, quantum, rangeSize);
            }
        }

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
    const today = new Date();
    const todayTime = today.getTime();
    if (todayTime < range.start.getTime()) {
        return true;
    }

    const quantum = getQuantum(range);
    const end = new Date(range.end);
    if (quantum !== Quantum.Hour) {
        // В режиме по дням и месяцу у нас време 00:00 у последнего дня диапазона,
        // поэтому если сегодня последний день диапазона, то кнопка Сегодня будет отображаться.
        end.setHours(23, 59, 59);
    }
    if (quantum === Quantum.Month) {
        const lastMonthDate = DateUtils.getEndOfMonth(end);
        end.setDate(lastMonthDate.getDate());
    }
    return todayTime > end.getTime();
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
    const onBackwardArrowClick = React.useCallback(getArrowClickHandler(slice, 'backward'), [
        slice,
    ]);
    const onForwardArrowClick = React.useCallback(getArrowClickHandler(slice, 'forward'), [slice]);

    return (
        <div className={'tw-flex tw-items-center tw-justify-between tw-h-full tw-w-full'}>
            <div>
                <ArrowButton
                    direction="left"
                    contrastBackground={true}
                    className="controls-margin_right-s"
                    onClick={onBackwardArrowClick}
                    data-qa="Controls-Lists_timelineGrid__GoBackwardButton"
                />
                <ArrowButton
                    direction="right"
                    contrastBackground={true}
                    onClick={onForwardArrowClick}
                    data-qa="Controls-Lists_timelineGrid__GoForwardButton"
                />
            </div>

            <div
                className={
                    'tw-flex tw-items-baseline controls-padding_right-xs ControlsLists-timelineGrid__RangeSelectorComponent_buttons-gap'
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
                    onRangeChanged={rangeChangedHandler}
                    ranges={AVAILABLE_RANGES}
                    selectionType="quantum"
                />
            </div>
        </div>
    );
}
