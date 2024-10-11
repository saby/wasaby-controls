/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as React from 'react';

import {
    IRangeSelectorProps,
    Selector as RangeSelector,
    TRangeChangedHandler,
} from 'Controls/dateRange';
import { DataContext } from 'Controls-DataEnv/context';
import { date as formatDate } from 'Types/formatter';
import { Base as DateUtils, Range as RangeUtils } from 'Controls/dateUtils';
import { ArrowButton } from 'Controls/extButtons';
import { useAdaptiveMode } from 'UI/Adaptive';

import {
    DAYS_COUNT_LIMIT,
    END_DAY_HOUR,
    MONTHS_COUNT,
    START_DAY_HOUR,
} from 'Controls-Lists/_timelineGrid/constants';
import {
    getQuantum,
    getRangeSize,
    Quantum,
    shiftDate,
    IQuantum,
} from 'Controls-Lists/_timelineGrid/utils';
import { IRange } from 'Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments';
import TimelineGridSlice from 'Controls-Lists/_timelineGrid/factory/Slice';
import GoUpRangeButton from 'Controls-Lists/_timelineGrid/render/GoUpRangeButton';
import GoToTodayButton from 'Controls-Lists/_timelineGrid/render/GoToTodayButton';
import { HolidaySliceConnectedComponent } from 'Controls-Lists/_timelineGrid/render/Holidays';
import { RenderUtils } from 'Controls-Lists/dynamicGrid';

function getRangeChangedHandler(slice: TimelineGridSlice): TRangeChangedHandler {
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
        // устанавливаем новый диапазон и сбрасываем quantumScale
        slice.setRange(range, 1);
    };
}

function getCaptionFormatter(slice: TimelineGridSlice): (start: Date, end: Date) => string {
    return (start, end) => {
        const quantums = slice.state.quantums;
        const quantumScale = slice.state.quantumScale;
        const quantum = getQuantum(
            {
                start,
                end,
            },
            quantums,
            quantumScale
        );
        if (quantum === Quantum.Minute) {
            if (quantumScale !== 1) {
                return formatDate(start, "D MMMl'YY");
            }
            return formatDate(start, 'HH:mm');
        }
        if (quantum === Quantum.Second) {
            if (quantumScale !== 1) {
                return formatDate(start, 'HH:mm');
            }
            return formatDate(start, ':ss');
        }
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
    slice: TimelineGridSlice,
    direction: 'backward' | 'forward'
): () => void {
    return () => {
        const quantumScale = slice.state.quantumScale;
        const quantums = slice.state.quantums;
        const quantum = getQuantum(slice.visibleRange, quantums, quantumScale);
        let rangeSize = getRangeSize(slice.visibleRange, quantum);
        // Если с фильтром выходных выбрали неделю (две, три, и т.д), то будет на 2 дня меньше
        // Дополняем, чтобы листать по неделям
        if (slice.filterHolidays && quantum && rangeSize % 7 === 5) {
            rangeSize += 2;
        }
        const isMonthSelected =
            DateUtils.isStartOfMonth(slice.visibleRange.start) &&
            DateUtils.isEndOfMonth(slice.visibleRange.end);

        let startDate = new Date(slice.visibleRange.start);
        let endDate = new Date(slice.visibleRange.end);
        switch (quantum) {
            case Quantum.Day:
                if (isMonthSelected) {
                    const monthOffset = direction === 'backward' ? -1 : 1;
                    const result = RangeUtils.shiftPeriodByMonth(startDate, endDate, monthOffset);
                    startDate = new Date(result[0]);
                    endDate = new Date(result[1]);
                } else {
                    shiftDate(startDate, direction, quantum, rangeSize);
                    shiftDate(endDate, direction, quantum, rangeSize);
                }
                break;
            case Quantum.Hour:
                startDate.setDate(startDate.getDate() + (direction === 'backward' ? -1 : 1));
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(startDate);
                // сутки это 0 - 23 часа
                endDate.setHours(END_DAY_HOUR);
                break;
            case Quantum.Month:
                shiftDate(startDate, direction, quantum, rangeSize);
                // Нельзя просто поментять номер месяца. Если 31 янв сдвинуть на месяц, получится не 31 фев, а 2 мар
                // Поэтому сначала ставим первое число, потом, после сдвига, уже ставим последний день месяца.
                endDate.setDate(1);
                shiftDate(endDate, direction, quantum, rangeSize);
                endDate.setMonth(endDate.getMonth() + 1);
                endDate.setDate(0);
        }

        slice.setRange({
            start: startDate,
            end: endDate,
            needScroll: quantum === 'hour',
        });
    };
}

function displayGoUpRangeButton(
    range: IRange,
    availableRangesByWidth: Record<string, number[]>,
    availableRanges: Record<string, number[]>
): boolean {
    const rangeSizeInMonths = RangeUtils.getPeriodLengthInMonths(range.start, range.end);
    const rangeSizeInDays = RangeUtils.getPeriodLengthInDays(range.start, range.end);
    const canGoToMonths = availableRanges.months?.[availableRanges.months.length - 1] > 2;
    const canGoToDays = availableRanges.days?.[availableRanges.days.length - 1] > 1;

    const availableMonths = availableRangesByWidth?.months;
    const availableDays = availableRangesByWidth?.days;
    const isMaxMonths =
        !availableMonths ||
        availableMonths.length === 0 ||
        rangeSizeInMonths >= availableMonths[availableMonths.length - 1];
    const isMaxDays =
        !availableDays ||
        availableDays.length === 0 ||
        rangeSizeInDays >= availableRangesByWidth?.days[availableRangesByWidth.days.length - 1];

    return (canGoToDays && !isMaxDays) || (canGoToMonths && !isMaxMonths);
}

function displayGoToTodayButton(
    range: IRange,
    quantums: IQuantum[],
    fixedDate?: Date,
    quantumScale?: number,
    isPhone?: boolean
): boolean {
    const today = fixedDate ? new Date(fixedDate) : new Date();
    const todayTime = today.getTime();

    if (isPhone) {
        return false;
    }
    if (todayTime < range.start.getTime()) {
        return true;
    }

    const quantum = getQuantum(range, quantums, quantumScale);
    const end = new Date(range.end);
    if (quantum !== Quantum.Second && quantum !== Quantum.Minute && quantum !== Quantum.Hour) {
        // В режиме по дням и месяцу у нас време 00:00 у последнего дня диапазона,
        // поэтому если сегодня последний день диапазона, то кнопка Сегодня будет отображаться.
        end.setHours(23, 59, 59);
    } else {
        // В режиме меньше дня в текущем дне не нужно показывать кнопку Сегодня, так как уже сегодня
        return (
            today.getDate() !== range.start.getDate() ||
            today.getMonth() !== range.start.getMonth() ||
            today.getFullYear() !== range.start.getFullYear()
        );
    }
    if (quantum === Quantum.Month) {
        const lastMonthDate = DateUtils.getEndOfMonth(end);
        end.setDate(lastMonthDate.getDate());
    }
    return todayTime > end.getTime();
}

function displayHolidayComponent(
    range: IRange,
    quantums: IQuantum[],
    quantumScale?: number
): boolean {
    const quantum = getQuantum(range, quantums, quantumScale);
    return quantum === Quantum.Hour;
}

const AVAILABLE_RANGES = {
    days: Array.from({ length: DAYS_COUNT_LIMIT + 1 }, (_, i) => i).slice(1),
    months: Array.from({ length: MONTHS_COUNT + 1 }, (_, i) => i).slice(1),
    quarters: [1],
    halfyears: [1],
    years: [1],
};

function getAvailableRanges(quantums: IQuantum[]): object {
    const months = quantums?.find((q) => q.name === Quantum.Month);
    const days = quantums?.find((q) => q.name === Quantum.Day);
    const lessThanDay = quantums?.find(
        (q) => q.name === Quantum.Hour || q.name === Quantum.Minute || q.name === Quantum.Second
    );

    // Разрешены только месяца
    if (quantums?.length === 1 && months) {
        return {
            months: [MONTHS_COUNT],
            quarters: [1],
            halfyears: [1],
            years: [1],
        };
    }

    // Разрешены только дни
    if (quantums?.length === 1 && days) {
        return {
            days: Array.from({ length: DAYS_COUNT_LIMIT + 1 }, (_, i) => i).slice(2),
            months: [1, 2],
        };
    }

    // Разрешены только часы/минуты/секунды
    if (lessThanDay && !months && !days) {
        return {
            days: [1],
        };
    }

    // Разрешены только часы/минуты/секунды и дни
    if (lessThanDay && days && !months) {
        return {
            days: Array.from({ length: DAYS_COUNT_LIMIT + 1 }, (_, i) => i).slice(1),
            months: [1, 2],
        };
    }

    // Разрешены только часы/минуты/секунды и дни
    if (lessThanDay && days && !months) {
        return {
            days: Array.from({ length: DAYS_COUNT_LIMIT + 1 }, (_, i) => i).slice(1),
            months: [1, 2],
        };
    }
    // Разрешены только месяцы и дни
    if (!lessThanDay && days && months) {
        return {
            days: Array.from({ length: DAYS_COUNT_LIMIT + 1 }, (_, i) => i).slice(2),
            months: Array.from({ length: MONTHS_COUNT + 1 }, (_, i) => i).slice(1),
            quarters: [1],
            halfyears: [1],
            years: [1],
        };
    }
    // Разрешены только часы и месяцы
    if (lessThanDay && !days && months) {
        return {
            days: [1],
            months: [MONTHS_COUNT],
            quarters: [1],
            halfyears: [1],
            years: [1],
        };
    }
    return AVAILABLE_RANGES;
}

/**
 * Интерфейс параметров компонента “Выбор периода”.
 * @interface Controls-Lists/_timelineGrid/RangeSelectorConnectedComponent/IProps
 * @extends Controls/date:IBaseSelectorOptions
 * @extends Controls/interface:IResetValues
 * @extends Controls/dateRange:IDateRange
 * @extends Controls/dateRange:IDateRangeSelectable
 *
 * @ignoreOptions value
 *
 * @public
 */
export interface IProps extends Partial<Exclude<IRangeSelectorProps, 'value'>> {
    /**
     * Идентификатор загрузчика данных.
     * @cfg {string}
     */
    storeId: string;
    fixedDate?: Date;
}

export default function RangeSelectorConnectedComponent(props: IProps) {
    const slice = React.useContext(DataContext)[props.storeId] as unknown as TimelineGridSlice;
    const visibleRange = React.useMemo(() => {
        return {
            start: RenderUtils.correctServerSideDateForRender(slice.visibleRange.start),
            end: RenderUtils.correctServerSideDateForRender(slice.visibleRange.end),
        };
    }, [slice.visibleRange.start, slice.visibleRange.end]);

    const rangeChangedHandler = React.useCallback(getRangeChangedHandler(slice), [slice]);
    const captionFormatter = React.useCallback(getCaptionFormatter(slice), [slice]);
    const availableRanges = getAvailableRanges(slice.state.quantums);
    const onBackwardArrowClick = React.useCallback(getArrowClickHandler(slice, 'backward'), [
        slice,
    ]);
    const onForwardArrowClick = React.useCallback(getArrowClickHandler(slice, 'forward'), [slice]);
    const adaptiveMode = useAdaptiveMode();
    const isPhone = adaptiveMode.device.isPhone();
    const showGoUpRangeButton = React.useMemo(() => {
        return displayGoUpRangeButton(visibleRange, slice.availableRanges, availableRanges);
    }, [visibleRange, availableRanges, slice.availableRanges]);

    return (
        <div
            className={
                'Controls-Lists_timelineGrid__RangeSelector tw-flex tw-items-center tw-justify-between tw-w-full'
            }
        >
            {!isPhone && (
                <div className={'tw-flex'}>
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
            )}

            <div
                className={
                    'tw-flex tw-items-baseline controls-padding_right-xs ControlsLists-timelineGrid__RangeSelectorComponent_buttons'
                }
            >
                {isPhone || showGoUpRangeButton ? (
                    <GoUpRangeButton
                        range={visibleRange}
                        weekSize={slice.filterHolidays ? 5 : 7}
                        availableRangesByWidth={slice.availableRanges}
                        availableRanges={availableRanges}
                        setRange={slice.setRange.bind(slice)}
                        visible={isPhone ? showGoUpRangeButton : true}
                    />
                ) : null}
                {displayGoToTodayButton(
                    visibleRange,
                    slice.state.quantums,
                    props.fixedDate,
                    1,
                    isPhone
                ) && (
                    <GoToTodayButton
                        fixedDate={props.fixedDate}
                        range={visibleRange}
                        quantums={slice.state.quantums}
                        setRange={slice.setRange.bind(slice)}
                    />
                )}
                {displayHolidayComponent(visibleRange, slice.state.quantums, 1) && (
                    <HolidaySliceConnectedComponent
                        date={visibleRange.start}
                        view={'info-icon'}
                        storeId={props.storeId}
                    />
                )}
                <RangeSelector
                    {...props}
                    startValue={visibleRange.start}
                    endValue={visibleRange.end}
                    captionFormatter={captionFormatter}
                    onRangeChanged={rangeChangedHandler}
                    ranges={availableRanges}
                    selectionType="quantum"
                />
            </div>
        </div>
    );
}

/**
 * Контрол управления периодом.
 * Обеспечивает переключение периода в "Таймлайн таблице" и включает следующие элементы управления:
 * - Элемент выбора периода;
 * - Кнопки листания сетки;
 * - Кнопка увеличения размерности сетки;
 * - Кнопка подскрола сетки к текущему периоду.
 * Работает с данными через слайс, предоставляемый фабрикой {@link Controls-Lists/_timelineGrid/factory/Factory/ITimelineGridFactory}.
 * @class Controls-Lists/_timelineGrid/RangeSelectorConnectedComponent
 * @implements Controls-Lists/_timelineGrid/RangeSelectorConnectedComponent/IProps
 * @example
 * Ниже приведён пример встраивания контрола "Выбор периода" в заголовок статичной колонки таймлайн таблицы
 * <pre class="brush: js">
 *   import { RangeSelectorConnectedComponent } from 'Controls/timelineGrid';
 *
 *   // Рендер для ячеек статичного заголовка
 *   function StaticHeaderRender(): React.ReactElement {
 *       return (
 *           <RangeSelectorConnectedComponent
 *               storeId="DemoDynamicGridStore"
 *             fontColorStyle={'primary'}
 *           />
 *       );
 *   }
 *
 *   // Конфигурация ячеек статичного заголовка
 *   const staticHeaders: IHeaderConfig[] = [
 *       {
 *           key: 'staticHeader',
 *           render: <StaticHeaderRender />,
 *       },
 *   ]
 * </pre>
 * @demo Controls-Lists-demo/timelineGrid/WI/Mini/Index
 * @public
 */
