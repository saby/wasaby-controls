/**
 * @kaizen_zone 04c5c6f9-e41b-4370-af04-aa064a8709ac
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
import { HolidayConnectedComponent } from 'Controls-Lists/_timelineGrid/render/Holidays';
import { RenderUtils } from 'Controls-Lists/dynamicGrid';

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
        const rangeSize = getRangeSize(slice.visibleRange, quantum);

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
                endDate = new Date(startDate);
                endDate.setHours(startDate.getHours() + rangeSize);
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

function displayGoUpRangeButton(range: IRange, availableRanges: Record<string, number[]>): boolean {
    // Выше года нет диапазона
    const rangeSizeInMonths = RangeUtils.getPeriodLengthInMonths(range.start, range.end);
    return (
        rangeSizeInMonths <
        (availableRanges ? availableRanges.months[availableRanges.months.length - 1] : MONTHS_COUNT)
    );
}

function displayGoToTodayButton(
    range: IRange,
    quantums: IQuantum[],
    fixedDate?: Date,
    quantumScale?: number
): boolean {
    const today = fixedDate ? new Date(fixedDate) : new Date();
    const todayTime = today.getTime();
    if (todayTime < range.start.getTime()) {
        return true;
    }

    const quantum = getQuantum(range, quantums, quantumScale);
    const end = new Date(range.end);
    if (quantum !== Quantum.Second && quantum !== Quantum.Minute && quantum !== Quantum.Hour) {
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

// todo https://dev.saby.ru/doc/d7dd3661-7901-4b8f-b9ec-bb4f9c1b011d?client=3
function getAvailableRanges(quantums: IQuantum[]): object {
    if (quantums?.length === 1 && quantums[0].name === Quantum.Month) {
        return {
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
                    'tw-flex tw-items-baseline controls-padding_right-xs ControlsLists-timelineGrid__RangeSelectorComponent_buttons'
                }
            >
                {displayGoUpRangeButton(visibleRange, slice.availableRanges) && (
                    <GoUpRangeButton
                        range={visibleRange}
                        availableRanges={slice.availableRanges}
                        setRange={slice.setRange.bind(slice)}
                    />
                )}
                {displayGoToTodayButton(visibleRange, slice.state.quantums, props.fixedDate, 1) && (
                    <GoToTodayButton
                        fixedDate={props.fixedDate}
                        range={visibleRange}
                        quantums={slice.state.quantums}
                        setRange={slice.setRange.bind(slice)}
                    />
                )}
                {displayHolidayComponent(visibleRange, slice.state.quantums, 1) && (
                    <HolidayConnectedComponent date={visibleRange.start} view={'info-icon'} />
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
