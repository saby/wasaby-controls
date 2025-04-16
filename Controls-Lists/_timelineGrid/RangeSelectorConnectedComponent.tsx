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
    DAYS_IN_TWO_MONTHS,
    END_DAY_HOUR,
    HALF,
    MONTHS_IN_YEAR,
    QUARTER,
    START_DAY_HOUR,
    YEARS_BY_DEFAULT,
} from 'Controls-Lists/_timelineGrid/constants';
import {
    DayRange,
    getQuantum,
    getRangeSize,
    IQuantum,
    isQuantumLessThanDay,
    isRangeAvailable,
    Quantum,
    shiftDate,
} from 'Controls-Lists/_timelineGrid/utils';
import { IRange } from 'Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments';
import TimelineGridSlice from 'Controls-Lists/_timelineGrid/factory/Slice';
import GoUpRangeButton from 'Controls-Lists/_timelineGrid/render/GoUpRangeButton';
import GoToTodayButton from 'Controls-Lists/_timelineGrid/render/GoToTodayButton';
import { HolidaySliceConnectedComponent } from 'Controls-Lists/_timelineGrid/render/Holidays';
import { RenderUtils } from 'Controls-Lists/dynamicGrid';
import { TQuantsReplacementMap } from 'Controls-Lists/_timelineGrid/factory/RangeHistoryUtils';

function getRangeChangedHandler(slice: TimelineGridSlice): TRangeChangedHandler {
    return (start: Date, end: Date) => {
        const quantum = getQuantum({ start, end }, slice.state.quantsReplacementMap);
        const range: IRange = {
            start: new Date(start),
            end: new Date(end),
        };
        let needScroll: boolean = false;

        // Значит выбрали один день, нужно скорректировать время.
        // Мы отображаем с 8 до 20 часов в день.
        if (range.start.getTime() === range.end.getTime()) {
            range.start.setHours(START_DAY_HOUR);
            range.end.setHours(END_DAY_HOUR);
        }

        // Делаем подскролл к началу активности, если квант меньше дня
        if (isQuantumLessThanDay(quantum)) {
            needScroll = true;
        }

        // устанавливаем новый диапазон
        slice.setRange(range, needScroll);
    };
}

function getCaptionFormatter(slice: TimelineGridSlice): (start: Date, end: Date) => string {
    return (start, end) => {
        const quantum = getQuantum({ start, end }, slice.state.quantsReplacementMap);
        if (quantum === Quantum.Minute) {
            return formatDate(start, 'HH:mm');
        }
        if (quantum === Quantum.Second) {
            return formatDate(start, ':ss');
        }
        if (quantum === Quantum.HalfHour || quantum === Quantum.QuarterHour) {
            return formatDate(start, "D MMMl'YY");
        }
        if (quantum === Quantum.Hour) {
            return formatDate(start, "D MMMl'YY");
        }
        if (quantum === Quantum.Day || quantum === Quantum.Week) {
            return formatDate(start, "MMMM'YY");
        }
        if (
            quantum === Quantum.Month ||
            quantum === Quantum.Quarter ||
            quantum === Quantum.HalfYear ||
            quantum === Quantum.Year
        ) {
            return formatDate(start, 'YYYY');
        }
    };
}

function getArrowClickHandler(
    slice: TimelineGridSlice,
    direction: 'backward' | 'forward'
): () => void {
    return () => {
        const quantum = getQuantum(slice.visibleRange, slice.state.quantsReplacementMap);
        let rangeSize = getRangeSize(slice.visibleRange, quantum);
        // Если с фильтром выходных выбрали неделю (две, три, и т.д), то будет на 2 дня меньше
        // Дополняем, чтобы листать по неделям
        if (slice.state.filterHolidays && quantum && rangeSize % 7 === 5) {
            rangeSize += 2;
        }
        const isMonthSelected =
            DateUtils.isStartOfMonth(slice.visibleRange.start) &&
            DateUtils.isEndOfMonth(slice.visibleRange.end);

        let startDate = new Date(slice.visibleRange.start);
        let endDate = new Date(slice.visibleRange.end);
        switch (quantum) {
            case Quantum.Hour:
                startDate.setDate(startDate.getDate() + (direction === 'backward' ? -1 : 1));
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(startDate);
                // сутки это 0 - 23 часа
                endDate.setHours(END_DAY_HOUR);
                break;
            case Quantum.Day:
            case Quantum.Week:
                if (isMonthSelected) {
                    const monthOffset = direction === 'backward' ? -1 : 1;
                    const result = RangeUtils.shiftPeriodByMonth(startDate, endDate, monthOffset);
                    startDate = new Date(result[0]);
                    endDate = new Date(result[1]);
                } else {
                    shiftDate(startDate, direction, quantum, rangeSize);
                    shiftDate(endDate, direction, quantum, rangeSize);
                    if (quantum === Quantum.Week) {
                        endDate = DateUtils.getEndOfWeek(endDate);
                    }
                }
                break;
            case Quantum.Month:
                shiftDate(startDate, direction, quantum, rangeSize);
                // Нельзя просто поментять номер месяца. Если 31 янв сдвинуть на месяц, получится не 31 фев, а 2 мар
                // Поэтому сначала ставим первое число, потом, после сдвига, уже ставим последний день месяца.
                endDate.setDate(1);
                shiftDate(endDate, direction, quantum, rangeSize);
                endDate.setMonth(endDate.getMonth() + 1);
                endDate.setDate(0);
                break;
            case Quantum.Quarter:
            case Quantum.HalfYear:
            case Quantum.Year:
                shiftDate(startDate, direction, quantum, rangeSize);
                shiftDate(endDate, direction, quantum, rangeSize);
        }

        slice.setRange(
            {
                start: startDate,
                end: endDate,
            },
            quantum === 'hour',
            slice.shouldIgnoreMaxWidth
        );
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
    // Число дней в месяце. Нужно, чтобы не было проблемы с отображением кнопки в Феврале
    const daysInMonth = DateUtils.getDaysInMonth(range.start);
    // Число дней в периоде согласно расчитанной ширине.
    const daysInAvailableRange =
        availableRangesByWidth?.days[availableRangesByWidth.days.length - 1];

    const availableMonths = availableRangesByWidth?.months;
    const availableDays = availableRangesByWidth?.days;
    const isMaxMonths =
        !availableMonths ||
        availableMonths.length === 0 ||
        rangeSizeInMonths >= availableMonths[availableMonths.length - 1];
    const isMaxDays =
        !availableDays ||
        availableDays.length === 0 ||
        rangeSizeInDays >= Math.min(daysInMonth, daysInAvailableRange);

    // Если тут ырозвращается true из-за isMaxDays, но не должно, т.к. !canGoToMonths
    // то прикладнику стоит проверить dynamicColumnMinWidths
    return (canGoToDays && !isMaxDays) || (canGoToMonths && !isMaxMonths);
}

function displayGoToTodayButton(
    range: IRange,
    quantsReplacementMap: TQuantsReplacementMap,
    fixedDate?: Date,
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

    const quantum = getQuantum(range, quantsReplacementMap);
    const end = new Date(range.end);
    if (!isQuantumLessThanDay(quantum)) {
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
    quantsReplacementMap: TQuantsReplacementMap
): boolean {
    const quantum = getQuantum(range, quantsReplacementMap);
    return quantum === Quantum.Hour;
}

const AVAILABLE_RANGES = {
    days: Array.from({ length: DAYS_IN_TWO_MONTHS + 1 }, (_, i) => i).slice(1),
    months: Array.from({ length: MONTHS_IN_YEAR + 1 }, (_, i) => i).slice(1),
};

/**
 * Возвращает настройки для календаря в компоненте выбора периода
 * @param quantums
 */
function getAvailableRanges(quantums: IQuantum[]): object {
    const years = quantums?.find((q) => q.name === Quantum.Year);
    const halfYears = quantums?.find((q) => q.name === Quantum.HalfYear);
    const quarters = quantums?.find((q) => q.name === Quantum.Quarter);
    const months = quantums?.find((q) => q.name === Quantum.Month);
    const days = quantums?.find((q) => q.name === Quantum.Day);
    const lessThanDay = quantums?.find((q) => isQuantumLessThanDay(q.name));

    let resultObject: {
        days?: number[];
        months?: number[];
        quarters?: number[];
        halfyears?: number[];
        years?: number[];
    } = {
        quarters: [1],
        halfyears: [1],
        years: [1],
    };

    if (years) {
        resultObject.years = Array.from({ length: YEARS_BY_DEFAULT + 1 }, (_, i) => i).slice(1);
    }
    if (halfYears) {
        resultObject.halfyears = Array.from(
            { length: MONTHS_IN_YEAR / HALF + 1 },
            (_, i) => i
        ).slice(1);
    }
    if (quarters) {
        resultObject.quarters = Array.from(
            { length: MONTHS_IN_YEAR / QUARTER + 1 },
            (_, i) => i
        ).slice(1);
    }

    if (!lessThanDay && !days && months) {
        // Разрешены только месяца, а дней нет
        resultObject.months = [MONTHS_IN_YEAR];
    } else if (quantums?.length === 1 && days) {
        // Разрешены только дни
        // Запрещено выбирать больше одного месяца
        resultObject = {
            days: AVAILABLE_RANGES.days.slice(1),
            months: [1],
        };
    } else if (lessThanDay && days && !months) {
        // Разрешены только часы/минуты/секунды и дни
        // Запрещено выбирать больше одного месяца
        resultObject = {
            days: AVAILABLE_RANGES.days,
            months: [1],
        };
    } else if (lessThanDay && !months && !days) {
        // Разрешены только часы/минуты/секунды
        resultObject = {
            days: [1],
        };
    } else if (!lessThanDay && days && months) {
        // Разрешены только месяцы и дни
        resultObject.days = AVAILABLE_RANGES.days.slice(1);
        resultObject.months = AVAILABLE_RANGES.months;
    } else if (lessThanDay && !days && months) {
        // Разрешены только часы и месяцы
        resultObject.days = [1];
        resultObject.months = [MONTHS_IN_YEAR];
    } else {
        resultObject.days = AVAILABLE_RANGES.days;
        resultObject.months = AVAILABLE_RANGES.months;
    }

    return resultObject;
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
    const availableRanges = props.ranges || getAvailableRanges(slice.state.quantums);
    const onBackwardArrowClick = React.useCallback(getArrowClickHandler(slice, 'backward'), [
        slice,
    ]);
    const onForwardArrowClick = React.useCallback(getArrowClickHandler(slice, 'forward'), [slice]);
    const adaptiveMode = useAdaptiveMode();
    const isPhone = adaptiveMode.device.isPhone();
    const showGoUpRangeButton = React.useMemo(() => {
        return displayGoUpRangeButton(visibleRange, slice.availableRanges, availableRanges);
    }, [visibleRange, availableRanges, slice.availableRanges]);
    const isWeekRangeAvailable = isRangeAvailable(
        Quantum.Day,
        slice.state.quantums,
        DayRange.Week,
        'all'
    );

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
                        weekSize={slice.state.filterHolidays ? 5 : 7}
                        availableRangesByWidth={slice.availableRanges}
                        availableRanges={availableRanges}
                        setRange={slice.setRange.bind(slice)}
                        visible={isPhone ? showGoUpRangeButton : true}
                        weekRangeAvailable={isWeekRangeAvailable}
                    />
                ) : null}
                {displayGoToTodayButton(
                    visibleRange,
                    slice.state.quantsReplacementMap,
                    props.fixedDate,
                    isPhone
                ) && (
                    <GoToTodayButton
                        fixedDate={props.fixedDate}
                        range={visibleRange}
                        quantsReplacementMap={slice.state.quantsReplacementMap}
                        setRange={slice.setRange.bind(slice)}
                    />
                )}
                {displayHolidayComponent(visibleRange, slice.state.quantsReplacementMap) && (
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
