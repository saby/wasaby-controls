/**
 * Библиотека "Таймлайн-таблица с загружаемыми колонками"
 * @includes Quantum Controls-Lists/_timelineGrid/utils/Quantum
 * @library
 * @public
 */

import * as React from 'react';
import type { Model } from 'Types/entity';
import type { IRowProps, TGetRowPropsCallback } from 'Controls/gridReact';
import { TOffsetSize } from 'Controls/interface';
import {
    DynamicGridComponent,
    Utils as DynamicGridUtils,
    getColumnGapSize,
    getPositionInPeriod,
    TColumnDataDensity,
    CLASS_DYNAMIC_HEADER_CELL,
    datesEqualByQuantum,
    ISelection,
    TCellsMultiSelectVisibility,
    IDynamicColumnConfig,
} from 'Controls-Lists/dynamicGrid';
import { useHandler } from 'Controls/Hooks/useHandler';
import { DataContext } from 'Controls-DataEnv/context';
import 'css!Controls-Lists/timelineGrid';
import { ICellProps, IColumnConfig, IHeaderConfig } from 'Controls/gridReact';
import { Logger } from 'UICommon/Utils';

// region library exports
import {
    ITimelineGridConnectedComponentProps,
    TSeparatorMode,
} from './_timelineGrid/interface/ITimelineGridConnectedComponentProps';

export { default as EventRender } from './_timelineGrid/render/EventBlockRender';
export {
    default as EventBlockRender,
    getFittingMode as getEventFittingMode,
    TOverflow,
    TAlign,
    IIntersection,
    TEventInteractionMode,
    TBevel,
    IEventRenderProps as IEventBlockRenderProps,
} from './_timelineGrid/render/EventBlockRender';
export {
    default as EventLineRender,
    IEventRenderProps as IEventLineRenderProps,
} from './_timelineGrid/render/EventLineRender';
export {
    default as EventSquircleRender,
    TFooterPosition,
    IEventSquircleProps as IEventSquircleRenderProps,
} from './_timelineGrid/render/EventSquircleRender';

export * as FactoryUtils from './_timelineGrid/factory/utils';

import {
    getDynamicColumnHeaderProps,
    getPatchedDynamicHeader,
} from 'Controls-Lists/_timelineGrid/render/Header';
import RangeSelectorConnectedComponent from 'Controls-Lists/_timelineGrid/RangeSelectorConnectedComponent';
import {
    IRange,
    ITimelineColumnsFilter,
    TAggregationVisibility,
    ITimelineGridDataFactoryArguments,
} from 'Controls-Lists/_timelineGrid/factory/ITimelineGridFactory';

import {
    getRangeSize,
    getQuantum,
    Quantum,
    TDynamicColumnMinWidths,
    getEventsSaturation,
    shiftDate,
} from 'Controls-Lists/_timelineGrid/utils';

export const Utils = {
    getQuantum,
    shiftDate,
    getEventsSaturation,
};

import { IItemsRange } from 'Controls/baseList';
import { Base as BaseDateUtils } from 'Controls/dateUtils';

export { TAggregationVisibility, ITimelineColumnsFilter, ITimelineGridDataFactoryArguments };
export { default as TimelineGridFactory } from 'Controls-Lists/_timelineGrid/factory/Factory';
export { RangeSelectorConnectedComponent };
import { DateTriangle } from 'Controls-Lists/_timelineGrid/render/DateTriangle';
import { DateLine } from 'Controls-Lists/_timelineGrid/render/DateLine';
import TimelineGridSlice, {
    ITimelineGridSliceState,
} from 'Controls-Lists/_timelineGrid/factory/Slice';
import { TimelineDataContext } from 'Controls-Lists/_timelineGrid/factory/Slice';
import {
    ADVANCED_DATA_COLUMN_WIDTH,
    END_DAY_HOUR,
    START_DAY_HOUR,
    DEFAULT_MIN_DYNAMIC_COLUMN_WIDTH,
    DAYS_COUNT_LIMIT,
    MONTHS_COUNT,
    ONE_MONTH,
} from 'Controls-Lists/_timelineGrid/constants';

import {
    IHolidaysConfig,
    HolidaysContext,
    useHolidaysContextValueProvider,
    isWeekendDate,
    DateType,
    IHoliday,
} from 'Controls-Lists/_timelineGrid/render/Holidays';
import {
    useColumnsScrollPositionHandler,
    useScrollToRangeStart,
    CHECKBOX_COLUMN_WIDTH,
} from 'Controls-Lists/_timelineGrid/ColumnsScrollUtils';

import AggregationContextProvider from 'Controls-Lists/_timelineGrid/aggregation/context/Provider';
import AggregationHeader from 'Controls-Lists/_timelineGrid/aggregation/render/AggregationHeader';
import AggregationColumn from 'Controls-Lists/_timelineGrid/aggregation/render/AggregationColumn';
import { THoverMode } from 'Controls-Lists/_dynamicGrid/interfaces/IDynamicGridComponent';

export { useAggregationData } from 'Controls-Lists/_timelineGrid/aggregation/hooks/useAggregationData';

export {
    IHolidaysConfig,
    isWeekendDate,
    DateType,
    IHoliday,
    ISelection,
    TCellsMultiSelectVisibility,
    ITimelineGridSliceState,
    ITimelineGridConnectedComponentProps,
    TSeparatorMode,
};
export { Quantum, getQuantum, IRange, getEventsSaturation, TimelineDataContext };
export { RangeHistoryUtils } from 'Controls-Lists/_timelineGrid/factory/RangeHistoryUtils';

// endregion library exports

const AGGREGATION_COLUMN_WIDTH = 70 as const;

/**
 * Получить правый отступ линии текущего дня
 * @param datesArray
 * @param quantum {Quantum} Режим отображения
 * @param fixedTimelineDate {Date} Фиксированная дата для линии дня
 */
function getRightOffset(
    datesArray: unknown[],
    quantum: Quantum,
    fixedTimelineDate?: Date
): number | undefined {
    const currentDate = fixedTimelineDate ? fixedTimelineDate : new Date();
    const index = datesArray.findIndex((elem: Date) => {
        // FIXME: Дублирование сравнения. Есть утилита уже где то.
        const isEqualYear = currentDate.getFullYear() === elem.getFullYear();
        const isEqualMonth = currentDate.getMonth() === elem.getMonth();
        const isEqualDate = currentDate.getDate() === elem.getDate();
        const isEqualHour = currentDate.getHours() === elem.getHours();

        if (quantum === 'hour') {
            return isEqualYear && isEqualMonth && isEqualDate && isEqualHour;
        }

        if (quantum === 'day') {
            return isEqualYear && isEqualMonth && isEqualDate;
        }

        return isEqualYear && isEqualMonth;
    });
    if (index !== -1) {
        const positionInDay = getPositionInPeriod(currentDate, quantum);
        const rightOffset = datesArray.length - index;
        return rightOffset - positionInDay;
    } else {
        return undefined;
    }
}

/**
 * Получить контрол - треугольник линии текущего дня
 * @param datesArray
 * @param columnWidth {number} Ширина колонки
 * @param spaceSize {TOffsetSize} Отступ между ячейками
 * @param quantum {Quantum} Режим отображения
 * @param fixedTimelineDate {Date} Фиксированная дата для линии дня
 * @param isAggregationVisible {Boolean} Видимость колонки итогов
 */
function getDateTriangleComponent(
    datesArray: unknown[],
    columnWidth: number,
    spaceSize: TOffsetSize,
    quantum: Quantum,
    fixedTimelineDate: Date,
    isAggregationVisible?: boolean
) {
    const rightOffset = getRightOffset(datesArray, quantum, fixedTimelineDate);
    if (rightOffset) {
        const lineStyle = {
            right: `calc((${columnWidth}px + (var(--offset_${spaceSize}) - var(--border-thickness))) * ${rightOffset}
             - var(--date-triangle_border_width) + ${
                 isAggregationVisible ? `${AGGREGATION_COLUMN_WIDTH}px` : '0px'
             })`,
        };
        return (
            <div className="ControlsLists-dateLine__wrapper ControlsLists-dateLine__variables">
                <DateTriangle style={lineStyle} />
            </div>
        );
    }
}

/**
 * Получить контрол - линия текущего дня
 * @param datesArray
 * @param columnWidth Ширина колонки
 * @param spaceSize {TOffsetSize} Отступ между ячейками
 * @param quantum {Quantum} Режим отображения
 * @param fixedTimelineDate {Date} Фиксированная дата для линии дня
 * @param isAggregationVisible {Boolean} Видимость колонки итогов
 */
function getDateLineComponent(
    datesArray: unknown[],
    columnWidth: number,
    spaceSize: TOffsetSize,
    quantum: Quantum,
    fixedTimelineDate?: Date,
    isAggregationVisible?: boolean
) {
    const rightOffset = getRightOffset(datesArray, quantum, fixedTimelineDate);
    if (rightOffset) {
        const lineStyle = {
            right: `calc((${columnWidth}px + (var(--offset_${spaceSize}) - var(--border-thickness))) * ${rightOffset}
            + ${isAggregationVisible ? `${AGGREGATION_COLUMN_WIDTH}px` : '0px'}`,
        };
        return (
            <div className="ControlsLists-dateLine__wrapper ControlsLists-dateLine__variables">
                <DateLine style={lineStyle} className={'ControlsLists-dateLine__height'} />
            </div>
        );
    }
}

/**
 * Контрол "Таймлайн таблица"
 * Позволяет загружать и отображать временной период и события этого периода.
 * Следующий функционал работает "из коробки":
 * * обеспечивает загрузку следующих/предыдущих периодов (по мере горизонтальной прокрутки столбцов таблицы);
 * * генерирует заголовки для динамических колонок, основываясь на текущем временном периоде;
 * * выводит вертикальную линию текущего дня;отображает “прицел” для подсветки ячеек по ховеру;
 * * позволяет выводить события временного периода.
 * @demo Controls-Lists-demo/timelineGrid/WI/Base/Index
 * @param {Controls-Lists/_timelineGrid/interface/ITimelineGridConnectedComponentProps} props Свойства контрола
 */
export const ConnectedComponent = React.forwardRef(
    (props: ITimelineGridConnectedComponentProps, ref): React.ReactElement => {
        const slice = React.useContext(DataContext)[props.storeId] as unknown as TimelineGridSlice &
            ITimelineGridSliceState;
        const containerRef = React.useRef<HTMLDivElement>();
        const dynamicGridRef = React.useRef<DynamicGridComponent>();
        const isMountedRef = React.useRef(false);

        const isAggregationVisible = React.useMemo(() => {
            return slice.aggregationVisibility === 'visible';
        }, [slice.aggregationVisibility]);

        const columnsEndedCallback = React.useCallback(
            DynamicGridUtils.getColumnsEndedCallback(slice),
            [slice]
        );
        const viewportWidth = getViewportWidth(
            props.viewportWidth,
            slice.staticColumns,
            isAggregationVisible
        );
        const quantum = getQuantum(slice.range);
        let rangeSize = getRangeSize(slice.range, quantum);
        const eventsSaturation = getEventsSaturation(slice.range);
        const columnsSpacing = props.verticalSeparatorsMode === 'gap' ? props.columnsSpacing : null;
        const columnGapSize = getColumnGapSize(columnsSpacing);
        const { width: columnWidth, rangeSize: newRangeSize } = getDynamicColumnWidth(
            viewportWidth,
            rangeSize,
            columnGapSize,
            slice.dynamicColumn,
            slice.multiSelectVisibility !== 'hidden' && slice.multiSelectPosition !== 'custom',
            props.dynamicColumnMinWidths,
            quantum
        );
        if (newRangeSize) {
            rangeSize = newRangeSize;
        }
        const columnDataDensity = getDynamicColumnDataDensity(
            columnWidth,
            quantum,
            slice.dynamicColumn,
            props.dynamicColumnMinWidths
        );
        const holidaysContextValue = useHolidaysContextValueProvider(
            slice.items,
            slice.holidaysConfig
        );

        const { visibleRange, initialColumnsPosition, onColumnsPositionChanged } =
            useColumnsScrollPositionHandler({
                slice,
                columnWidth,
                columnsCount: slice.dynamicColumnsGridData.length,
                columnsSpacing,
                containerRef,
                visibleRangeSize: rangeSize,
            });

        React.useEffect(() => {
            const newRange = getRangeByVisibleRange(
                visibleRange,
                slice.dynamicColumnsGridData,
                quantum
            );
            slice.setRange(newRange);
        }, [visibleRange]);

        React.useEffect(() => {
            const availableRanges = getAvailableRanges(
                viewportWidth,
                slice.dynamicColumn,
                columnGapSize,
                slice.multiSelectVisibility !== 'hidden' && slice.multiSelectPosition !== 'custom',
                props.allowHourQuantum,
                props.dynamicColumnMinWidths,
                quantum
            );
            slice.setAvailableRanges(availableRanges);
        }, [
            viewportWidth,
            rangeSize,
            columnGapSize,
            slice.dynamicColumn,
            slice.multiSelectVisibility !== 'hidden' && slice.multiSelectPosition !== 'custom',
        ]);

        const horizontalScrollTo = useHandler((position: number) => {
            dynamicGridRef.current?.horizontalScrollTo(position);
        });
        useScrollToRangeStart(
            slice,
            containerRef.current,
            horizontalScrollTo,
            isMountedRef.current,
            viewportWidth,
            columnWidth,
            columnGapSize
        );

        React.useEffect(() => {
            isMountedRef.current = true;
        }, []);

        const dynamicColumn = React.useMemo(
            () =>
                prepareDynamicColumn({
                    dynamicColumn: slice.dynamicColumn,
                    columnWidth,
                    dataDensity: columnDataDensity,
                    hoverMode: props.hoverMode,
                }),
            [slice.dynamicColumn, columnWidth, columnDataDensity, props.hoverMode]
        );

        const staticColumns = React.useMemo(
            () =>
                prepareStaticColumns(
                    slice.staticColumns,
                    props.hoverMode,
                    getStaticColumnsWidth(slice.staticColumns)
                ),
            [slice.staticColumns, props.hoverMode]
        );

        const dynamicHeader = React.useMemo(
            () => getPatchedDynamicHeader(slice.dynamicHeader, quantum, columnDataDensity),
            [slice.dynamicHeader, quantum, columnDataDensity, slice.range]
        );

        const aggregationHeaders = React.useMemo<IHeaderConfig[]>(() => {
            return isAggregationVisible
                ? [
                      {
                          key: '$FIXED_RIGHT_COLUMN_HEADER',
                          render: <AggregationHeader />,
                          getCellProps: () => ({
                              valign: 'center',
                              halign: 'end',
                          }),
                      },
                  ]
                : undefined;
        }, [isAggregationVisible]);

        const aggregationColumns = React.useMemo<IColumnConfig[]>(() => {
            return isAggregationVisible
                ? [
                      {
                          key: '$FIXED_RIGHT_COLUMN',
                          width: `${AGGREGATION_COLUMN_WIDTH}px`,
                          render: <AggregationColumn />,
                          getCellProps: () => ({
                              valign: 'start',
                              halign: 'end',
                          }),
                      },
                  ]
                : undefined;
        }, [isAggregationVisible]);

        const getRowProps = React.useCallback(
            (item: Model): IRowProps => {
                return getDynamicGridRowProps({
                    getRowProps: props.getRowProps,
                    item,
                    horizontalSeparatorsMode: props.horizontalSeparatorsMode,
                    hoverMode: props.hoverMode,
                });
            },
            [props.getRowProps, props.hoverMode, props.horizontalSeparatorsMode]
        );

        const hasItems = !!slice.items?.getCount();

        const beforeItemsContent = React.useMemo(() => {
            return hasItems
                ? getDateTriangleComponent(
                      slice.dynamicColumnsGridData,
                      columnWidth,
                      props.columnsSpacing,
                      quantum,
                      props.fixedTimelineDate,
                      isAggregationVisible
                  )
                : null;
        }, [
            slice.dynamicColumnsGridData,
            columnWidth,
            props.columnsSpacing,
            quantum,
            props.fixedTimelineDate,
            hasItems,
        ]);

        const afterItemsContent = React.useMemo(() => {
            return hasItems
                ? getDateLineComponent(
                      slice.dynamicColumnsGridData,
                      columnWidth,
                      props.columnsSpacing,
                      quantum,
                      props.fixedTimelineDate,
                      isAggregationVisible
                  )
                : null;
        }, [
            slice.dynamicColumnsGridData,
            columnWidth,
            props.columnsSpacing,
            quantum,
            props.fixedTimelineDate,
            hasItems,
        ]);

        const onHeaderClick = React.useCallback(
            (event: React.MouseEvent) => {
                const date = getDateByEventTarget(event.target as HTMLElement);
                goToInternalRange(slice, date, props.allowHourQuantum);
            },
            [slice]
        );

        const onSelectedCellsChanged = React.useCallback(
            (selectedCells) => {
                slice.setState({
                    selectedCells,
                });
            },
            [slice]
        );

        const timelineDataContextValue = React.useMemo(() => {
            return {
                quantum,
                eventsSaturation,
                columnDataDensity,
                columnWidth,
                dynamicColumnsGridData: slice.dynamicColumnsGridData,
                range: slice.range,
                visibleRange,
            };
        }, [quantum, eventsSaturation, slice.dynamicColumnsGridData, visibleRange]);

        const getDynamicColumnProps = React.useCallback(
            (item: Model) => {
                const dynamicColumnProps: ICellProps = {};
                dynamicColumnProps.className = 'ControlsLists-dynamicGrid__cross-horizontal-part';
                if (props.verticalSeparatorsMode === 'line' && !item.get(slice.nodeProperty)) {
                    dynamicColumnProps.className +=
                        'ControlsLists-timelineGrid__verticalSeparatorsMode_lines';
                }
                return dynamicColumnProps;
            },
            [props.verticalSeparatorsMode, slice.nodeProperty]
        );

        return (
            <HolidaysContext.Provider value={holidaysContextValue}>
                <TimelineDataContext.Provider value={timelineDataContextValue}>
                    <AggregationContextProvider
                        isShown={isAggregationVisible}
                        columnRender={props.aggregationRender}
                        range={slice.range}
                        dynamicColumnsGridData={slice.dynamicColumnsGridData}
                    >
                        <div
                            ref={(el) => {
                                containerRef.current = el;
                                if (ref) {
                                    if (typeof ref === 'function') {
                                        ref(el);
                                    } else {
                                        ref.current = el;
                                    }
                                }
                            }}
                            className={'tw-contents'}
                            style={{
                                '--viewport-width': `${props.viewportWidth}px`,
                            }}
                        >
                            <DynamicGridComponent
                                {...props}
                                columnsSpacing={columnsSpacing}
                                gridComponentRef={dynamicGridRef}
                                viewMode={slice.viewMode}
                                staticColumns={staticColumns}
                                endStaticColumns={aggregationColumns}
                                eventRender={props.eventRender}
                                eventsProperty={slice.eventsProperty || props.eventsProperty}
                                eventStartProperty={
                                    slice.eventStartProperty || props.eventStartProperty
                                }
                                eventEndProperty={slice.eventEndProperty || props.eventEndProperty}
                                dynamicColumn={dynamicColumn}
                                dynamicColumnsCount={slice.dynamicColumnsGridData.length}
                                getDynamicColumnProps={getDynamicColumnProps}
                                getDynamicColumnHeaderProps={getDynamicColumnHeaderProps}
                                staticHeaders={slice.staticHeaders}
                                endStaticHeaders={aggregationHeaders}
                                dynamicHeader={dynamicHeader}
                                columnsEndedCallback={columnsEndedCallback}
                                dynamicColumnsGridData={slice.dynamicColumnsGridData}
                                range={slice.range}
                                visibleRange={visibleRange}
                                initialColumnScrollPosition={initialColumnsPosition}
                                columnsDataVersion={slice.columnsDataVersion}
                                multiSelectVisibility={slice.multiSelectVisibility}
                                getRowProps={getRowProps}
                                quantum={quantum}
                                columnDataDensity={columnDataDensity}
                                cellsMultiSelectVisibility={slice.cellsMultiSelectVisibility}
                                cellsMultiSelectAccessibilityCallback={
                                    slice.cellsMultiSelectAccessibilityCallback
                                }
                                selectedCells={slice.selectedCells}
                                onSelectedCellsChanged={onSelectedCellsChanged}
                                onBeforeSelectedCellsChanged={undefined}
                                beforeItemsContent={beforeItemsContent}
                                afterItemsContent={afterItemsContent}
                                onPositionChanged={onColumnsPositionChanged}
                                onHeaderClick={onHeaderClick}
                                hoverMode={props.hoverMode}
                            />
                        </div>
                    </AggregationContextProvider>
                </TimelineDataContext.Provider>
            </HolidaysContext.Provider>
        );
    }
);

// Алиас для поддержвнимя  текущего API
export const TimelineGridConnectedComponent = ConnectedComponent;

function getRangeByVisibleRange(
    visibleRange: IItemsRange,
    dynamicColumnsGridData: Date[],
    quantum: Quantum
): IRange {
    const start = dynamicColumnsGridData[visibleRange.startIndex];
    let end = dynamicColumnsGridData[visibleRange.endIndex];

    if (quantum === Quantum.Month) {
        end = BaseDateUtils.getEndOfMonth(end);
    }

    return {
        start,
        end,
    };
}

// Возвращает ширину рабочей области динамической сетки
function getViewportWidth(
    viewportWidth: number,
    staticColumns: IColumnConfig[],
    isAggregationVisible: boolean
): number | null {
    if (!viewportWidth) {
        Logger.error(
            'Should set viewportWidth. Pass workspaceWidth into it https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/workspace-config/'
        );
        return null;
    }

    const staticColumnsWidth = getStaticColumnsWidth(staticColumns);
    return (
        viewportWidth - staticColumnsWidth - (isAggregationVisible ? AGGREGATION_COLUMN_WIDTH : 0)
    );
}

// Возвращает ширину статических колонок.
function getStaticColumnsWidth(staticColumns: IColumnConfig[]): number {
    if (!staticColumns || !staticColumns.length) {
        return 0;
    }

    return staticColumns.reduce((sumWidth, column) => {
        const width = parseInt(column.width, 10);
        return sumWidth + width;
    }, 0);
}

// Возвращает минимальную ширину динамических колонок.
function getMinColumnWidth(
    dynamicColumn: IColumnConfig,
    dynamicColumnMinWidths: TDynamicColumnMinWidths,
    quantum: Quantum
): number {
    const minWidthProp = dynamicColumnMinWidths?.[quantum] || dynamicColumn.minWidth;
    return minWidthProp ? parseInt(minWidthProp, 10) : DEFAULT_MIN_DYNAMIC_COLUMN_WIDTH;
}

// Расчитывает ширину динамических колонок
function getDynamicColumnWidth(
    viewportWidth: number,
    rangeSize: number,
    columnGapSize: number,
    dynamicColumn: IColumnConfig,
    hasMultiSelectColumn: boolean,
    dynamicColumnMinWidths: TDynamicColumnMinWidths,
    quantum: Quantum
): { width: number; rangeSize?: number } {
    const minWidth = getMinColumnWidth(dynamicColumn, dynamicColumnMinWidths, quantum);
    if (!viewportWidth) {
        return { width: minWidth };
    }

    // FIXME: Не должно быть зашито ширины колонки под чекбокс, нужно как то переделать.
    //  Опять же, контекст скролла это решает.
    const checkboxWidth = hasMultiSelectColumn ? CHECKBOX_COLUMN_WIDTH : 0;
    let availableWidth = viewportWidth - columnGapSize * (rangeSize + 1) - checkboxWidth;
    const width = availableWidth / rangeSize;
    if (width < minWidth) {
        const maxRangeSize = Math.floor(
            (viewportWidth - columnGapSize - checkboxWidth) / (minWidth + columnGapSize)
        );
        availableWidth = viewportWidth - columnGapSize * (maxRangeSize + 1) - checkboxWidth;
        return {
            width: availableWidth / maxRangeSize,
            rangeSize: maxRangeSize,
        };
    } else {
        return { width };
    }
}

function getAvailableRanges(
    viewportWidth: number,
    dynamicColumn: IColumnConfig,
    columnGapSize: number,
    hasMultiSelectColumn: boolean,
    allowHourQuantum: boolean,
    dynamicColumnMinWidths: TDynamicColumnMinWidths,
    quantum: Quantum
): Record<string, number[]> {
    const minDayWidth = getMinColumnWidth(dynamicColumn, dynamicColumnMinWidths, Quantum.Day);
    const minMonthWidth = getMinColumnWidth(dynamicColumn, dynamicColumnMinWidths, Quantum.Month);
    const checkboxWidth = hasMultiSelectColumn ? CHECKBOX_COLUMN_WIDTH : 0;
    const maxDayRangeSize = Math.floor(
        (viewportWidth - columnGapSize - checkboxWidth) / (minDayWidth + columnGapSize)
    );
    const maxMonthRangeSize = Math.floor(
        (viewportWidth - columnGapSize - checkboxWidth) / (minMonthWidth + columnGapSize)
    );
    const maxDays = Math.min(maxDayRangeSize, DAYS_COUNT_LIMIT);
    const maxMonth = Math.min(maxMonthRangeSize, MONTHS_COUNT);
    // Если нельзя выбрать дней на 1 или 2 месяца, то нет смысла давать выбрать 1 или 2 месяца целиком.
    // Следующий масштаб - 3 месяца по месяцам.
    const canSelectOneMonth = maxDays >= ONE_MONTH;
    const canSelectTwoMonths = maxDays >= DAYS_COUNT_LIMIT;
    let months = Array.from({ length: maxMonth + 1 }, (_, i) => i).slice(3);
    if (canSelectTwoMonths && maxMonth >= 2) {
        months = [2, ...months];
    }
    if (canSelectOneMonth) {
        months = [1, ...months];
    }
    return {
        days: Array.from({ length: maxDays + 1 }, (_, i) => i).slice(1 + !allowHourQuantum),
        months,
        quarters: [1],
        halfyears: [1],
        years: [1],
    };
}

function getDynamicColumnDataDensity(
    columnWidth: number,
    quantum: Quantum,
    dynamicColumn: IColumnConfig,
    dynamicColumnMinWidths: TDynamicColumnMinWidths
): TColumnDataDensity {
    if (quantum !== Quantum.Day) {
        return 'default';
    }

    const minWidthForColumnWithData = getMinColumnWidth(
        dynamicColumn,
        dynamicColumnMinWidths,
        quantum
    );
    if (columnWidth < minWidthForColumnWithData) {
        return 'empty';
    }

    if (columnWidth < ADVANCED_DATA_COLUMN_WIDTH) {
        return 'default';
    }

    return 'advanced';
}

interface IPrepareDynamicColumnParams {
    dynamicColumn: IDynamicColumnConfig<Date>;
    columnWidth: number;
    dataDensity: TColumnDataDensity;
    hoverMode: THoverMode;
}

// Обогащает конфигурацию динамической колонки значениями по умолчанию.
export function prepareDynamicColumn(
    params: IPrepareDynamicColumnParams
): IDynamicColumnConfig<Date> {
    return {
        ...params.dynamicColumn,
        width: `${params.columnWidth}px`,
        getCellProps: (item, date) => {
            const superResult = params.dynamicColumn?.getCellProps?.(item, date) || {};
            // умолчания для поячеечного ховера
            const borderRadius = params.hoverMode === 'cell' ? 'xs' : null;
            const borderVisibility = params.hoverMode === 'cell' ? 'onhover' : 'hidden';
            return {
                topLeftBorderRadius: superResult.topLeftBorderRadius || borderRadius,
                topRightBorderRadius: superResult.topRightBorderRadius || borderRadius,
                bottomRightBorderRadius: superResult.bottomRightBorderRadius || borderRadius,
                bottomLeftBorderRadius: superResult.bottomLeftBorderRadius || borderRadius,
                borderVisibility: superResult.borderVisibility || borderVisibility,
                halign: params.dataDensity === 'advanced' ? 'end' : 'center',
                ...superResult,
            };
        },
    };
}

interface IGetDynamicGridRowPropsParams {
    getRowProps: TGetRowPropsCallback;
    item: Model;
    horizontalSeparatorsMode: TSeparatorMode;
    hoverMode: THoverMode;
}

// Обогащает конфигурацию строк значениями по умолчанию.
export function getDynamicGridRowProps(params: IGetDynamicGridRowPropsParams): IRowProps {
    let userRowProps: {
        borderVisibility?: string;
    } = {};

    if (params.getRowProps) {
        userRowProps = params.getRowProps(params.item);
    }

    if (userRowProps.borderVisibility) {
        Logger.warn(
            "Timeline table doesn't support borderVisibility. Option won't affect anything. " +
                'Please use timelineGrid.horizontalSeparatorsMode property instead.'
        );
    }

    return {
        hoverBackgroundStyle: 'none',
        padding: {
            top: params.horizontalSeparatorsMode === 'gap' ? 'timeline_xs' : null,
            bottom: params.horizontalSeparatorsMode === 'gap' ? 'null' : null,
        },
        ...userRowProps,
        borderVisibility: 'hidden',
    };
}

function prepareStaticColumns(
    staticColumns: IColumnConfig[],
    hoverMode: THoverMode,
    staticColumnsWidth: number
): IColumnConfig[] {
    return staticColumns.map((staticColumn) => {
        return {
            ...staticColumn,
            width: `calc(${staticColumnsWidth}px - var(--outer_padding, 0px))`,
            getCellProps: (item) => {
                const superResult = staticColumn?.getCellProps?.(item) || {};
                return {
                    className:
                        'ControlsLists-dynamicGrid__cross-horizontal-part ' +
                        `${superResult?.className ? superResult.className : ''}`,
                    ...superResult,
                };
            },
        };
    });
}

function getDateByEventTarget(target: HTMLElement): Date {
    const cellElement = target.closest(`.js-${CLASS_DYNAMIC_HEADER_CELL}`);
    if (!cellElement) {
        return null;
    }

    const dateParams = cellElement.className.match(/\d+/g);
    return new Date(Number(dateParams[2]), Number(dateParams[1]), Number(dateParams[0]));
}

function goToInternalRange(
    slice: TimelineGridSlice,
    targetDate: Date,
    allowHourQuantum: boolean
): void {
    if (!targetDate) {
        return;
    }

    const quantum = getQuantum(slice.range);
    const rangeSize = getRangeSize(slice.range, quantum);

    switch (quantum) {
        case Quantum.Hour:
            return;
        case Quantum.Day:
            const daysInTwoWeeks = 14;

            if (rangeSize < daysInTwoWeeks && allowHourQuantum) {
                const startDate = new Date(targetDate);
                startDate.setHours(START_DAY_HOUR);
                const endDate = new Date(targetDate);
                endDate.setHours(END_DAY_HOUR);

                // TODO: ВАДИМ.
                // needScroll здесь для того, чтобы после смены диапазона, был подскролл к началу активности.
                // подскролл вызывается, но происходит еще setRange и происходит подскролл к началу диапазона
                slice.setRange({
                    needScroll: true,
                    start: startDate,
                    end: endDate,
                });
            } else {
                slice.setRange({
                    start: BaseDateUtils.getStartOfWeek(targetDate),
                    end: BaseDateUtils.getEndOfWeek(targetDate),
                });
            }

            return;
        case Quantum.Month:
            slice.setRange({
                start: BaseDateUtils.getStartOfMonth(targetDate),
                end: BaseDateUtils.getEndOfMonth(targetDate),
            });
            return;
    }
}

Object.assign(TimelineGridConnectedComponent, {
    defaultProps: {
        columnsSpacing: '2xs',
        horizontalSeparatorsMode: 'gap',
        verticalSeparatorsMode: 'gap',
        hoverMode: 'cross',
        allowHourQuantum: true,
    },
});
