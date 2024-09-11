/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
/**
 * Библиотека "Таймлайн таблица". Предоставляет компоненты для отображения данных реестра на временной сетке, где каждый столбец содержит данные за конкретный временной отрезок.
 * - {@link Controls-Lists/timelineGrid:ConnectedComponent Контрол "Таймлайн таблица"}
 * - {@link Controls-Lists/timelineGrid:TimelineGridFactory Фабрика данных "Таймлайн таблицы"}
 * - {@link Controls-Lists/timelineGrid:RangeSelectorConnectedComponent Контрол управления периодом}
 * - {@link Controls-Lists/timelineGrid:EventBlockRender Контрол рендера события таймлайна в виде блока}
 * - {@link Controls-Lists/timelineGrid:EventLineRender Контрол рендера события таймлайна в виде линии}
 * - {@link Controls-Lists/timelineGrid:EventSquircleRender Контрол рендера события таймлайна в виде сквиркла}
 * - {@link Controls-Lists/timelineGrid:ScaleAction Действие "Переключение масштаба сетки таймлайн таблицы"}
 * См. также:
 * * {@link Controls-Lists/dynamicGrid Библиотека "Таблица с загружаемыми колонками".}
 * * {@link https://n.sbis.ru/article/e917f0a4-cb20-4c16-827d-b8723ad9ca8b Спецификация Таймлайн таблицы}
 * @includes ConnectedComponent Controls-Lists/timelineGrid:ConnectedComponent
 * @includes RangeSelectorConnectedComponent Controls-Lists/_timelineGrid/RangeSelectorConnectedComponent
 * @includes TimelineGridFactory Controls-Lists/_timelineGrid/factory/Factory/ITimelineGridFactory
 * @includes EventBlockRender Controls-Lists/_timelineGrid/render/EventBlockRender
 * @includes IEventBlockRenderProps Controls-Lists/_timelineGrid/render/EventBlockRender/IEventRenderProps
 * @includes EventLineRender Controls-Lists/_timelineGrid/render/EventLineRender
 * @includes IEventLineRenderProps Controls-Lists/_timelineGrid/render/EventLineRender/IEventRenderProps
 * @includes EventSquircleRender Controls-Lists/_timelineGrid/render/EventSquircleRender
 * @includes IEventSquircleRenderProps Controls-Lists/_timelineGrid/render/EventSquircleRender/IEventRenderProps
 * @includes IRangeSelectorConnectedComponentProps Controls-Lists/_timelineGrid/RangeSelectorConnectedComponent/IProps
 * @includes TimelineDataContext Controls-Lists/_timelineGrid/factory/Slice/TimelineDataContext
 * @library
 * @demo Controls-Lists-demo/timelineGrid/WI/Base/Index
 * @public
 */

import * as React from 'react';
import type { Model } from 'Types/entity';
import { IItemsRange } from 'Controls/baseList';
import type { IRowProps, TGetRowPropsCallback } from 'Controls/gridReact';
import { ICellProps, IColumnConfig, IHeaderConfig } from 'Controls/gridReact';
import { View as TreeGridComponent } from 'Controls/treeGrid';
import { TOffsetSize } from 'Controls/interface';
import {
    CLASS_DYNAMIC_HEADER_CELL,
    DynamicGridComponent,
    getColumnGapSize,
    getPositionInPeriod,
    IDynamicColumnConfig,
    ISelection,
    TCellsMultiSelectVisibility,
    TColumnDataDensity,
    THoverMode,
    Utils as DynamicGridUtils,
} from 'Controls-Lists/dynamicGrid';
import { useHandler } from 'Controls/Hooks/useHandler';
import { DataContext } from 'Controls-DataEnv/context';
import 'css!Controls-Lists/timelineGrid';
import { Logger } from 'UICommon/Utils';
import { constants } from 'Env/Env';

// region library exports
import {
    ITimelineGridConnectedComponentProps,
    TSeparatorMode,
} from './_timelineGrid/interface/ITimelineGridConnectedComponentProps';
import {
    getDynamicColumnHeaderProps,
    getPatchedDynamicHeader,
} from 'Controls-Lists/_timelineGrid/render/Header';
import RangeSelectorConnectedComponent, {
    IProps as IRangeSelectorConnectedComponentProps,
} from 'Controls-Lists/_timelineGrid/RangeSelectorConnectedComponent';
import {
    IRange,
    ITimelineColumnsFilter,
    ITimelineGridDataFactoryArguments,
    TAggregationVisibility,
} from 'Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments';
import {
    getEventsSaturation,
    getQuantum,
    getRangeSize,
    Quantum,
    shiftDate,
    TDynamicColumnMinWidths,
    IQuantum,
    TEventSaturation,
    Utils,
} from 'Controls-Lists/_timelineGrid/utils';
import { Base as BaseDateUtils } from 'Controls/dateUtils';
import TimelineGridSlice, {
    ITimelineGridSliceState,
    TimelineDataContext,
} from 'Controls-Lists/_timelineGrid/factory/Slice';
import { DateTriangle } from 'Controls-Lists/_timelineGrid/render/DateTriangle';
import { DateLine } from 'Controls-Lists/_timelineGrid/render/DateLine';
import {
    ADVANCED_DATA_COLUMN_WIDTH,
    DAYS_COUNT_LIMIT,
    DEFAULT_MIN_DYNAMIC_COLUMN_WIDTH,
    END_DAY_HOUR,
    MONTHS_COUNT,
    ONE_MONTH,
    START_DAY_HOUR,
} from 'Controls-Lists/_timelineGrid/constants';

import {
    DateType,
    HolidaysContext,
    IHoliday,
    IHolidaysConfig,
    isWeekendDate,
    weekendFilter,
    useHolidaysContextValueProvider,
} from 'Controls-Lists/_timelineGrid/render/Holidays';
import {
    CHECKBOX_COLUMN_WIDTH,
    useColumnsScrollPositionHandler,
    useScrollToRangeStart,
} from 'Controls-Lists/_timelineGrid/ColumnsScrollUtils';

import {
    correctDateFromClientToServer,
    correctDateFromServerToClient,
} from 'Controls-Lists/_timelineGrid/utils';

import AggregationContextProvider from 'Controls-Lists/_timelineGrid/aggregation/context/Provider';
import AggregationHeader from 'Controls-Lists/_timelineGrid/aggregation/render/AggregationHeader';
import AggregationColumn from 'Controls-Lists/_timelineGrid/aggregation/render/AggregationColumn';
import { default as ScaleAction } from 'Controls-Lists/_timelineGrid/actions/Scale';
import { TimeZoneChangeHandler } from 'Controls-Lists/_timelineGrid/render/TimeZoneChangeHandler';

export {
    MemoizedEventBlockRender as EventBlockRender,
    getEventFittingMode,
    TOverflow,
    TAlign,
    IIntersection,
    TEventInteractionMode,
    TBevel,
    IEventRenderProps as IEventBlockRenderProps,
} from './_timelineGrid/render/EventBlockRender';
export {
    MemoizedEventLineRender as EventLineRender,
    IInnerLineEventsProps,
    IEventRenderProps as IEventLineRenderProps,
    TLineSize,
} from './_timelineGrid/render/EventLineRender';
export {
    MemoizedEventSquircleRender as EventSquircleRender,
    TFooterPosition,
    IEventRenderProps as IEventSquircleRenderProps,
} from './_timelineGrid/render/EventSquircleRender';

export { default as TimelineGridFactory } from 'Controls-Lists/_timelineGrid/factory/Factory';
export {
    useAggregationData,
    IAggregationData,
    IIndexesRange,
} from 'Controls-Lists/_timelineGrid/aggregation/hooks/useAggregationData';

export { FactoryUtils } from './_timelineGrid/factory/utils';
export { RangeHistoryUtils } from 'Controls-Lists/_timelineGrid/factory/RangeHistoryUtils';
export {
    TAggregationVisibility,
    ITimelineColumnsFilter,
    ITimelineGridDataFactoryArguments,
    RangeSelectorConnectedComponent,
    IRangeSelectorConnectedComponentProps,
    correctDateFromClientToServer,
    correctDateFromServerToClient,
    IHolidaysConfig,
    isWeekendDate,
    DateType,
    IHoliday,
    ISelection,
    TCellsMultiSelectVisibility,
    TimelineGridSlice,
    ITimelineGridSliceState,
    ITimelineGridConnectedComponentProps,
    TSeparatorMode,
    TDynamicColumnMinWidths,
    Quantum,
    getQuantum,
    IRange,
    TEventSaturation,
    getEventsSaturation,
    shiftDate,
    TimelineDataContext,
    Utils,
    ScaleAction,
    IQuantum,
};

// endregion library exports

const AGGREGATION_COLUMN_WIDTH = 70 as const;

/**
 * Возвращает правый отступ линии текущего дня
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

// Рассчёт значения промежутка между колонками для инлайнового CSS стиля.
function getOffsetStyle(columnsGapSize: TOffsetSize | 'null'): string {
    return columnsGapSize === null
        ? '0px'
        : columnsGapSize !== 'null'
        ? `(var(--gap_${columnsGapSize}) + var(--border-thickness))`
        : 'var(--border-thickness)';
}

/**
 * Возвращает контрол - треугольник линии текущего дня
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
    const spacing = getOffsetStyle(spaceSize);
    if (rightOffset) {
        const lineStyle = {
            right: `calc((${columnWidth}px + ${spacing}) * ${rightOffset} + ${spacing}
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
    const spacing = getOffsetStyle(spaceSize);

    if (rightOffset) {
        const lineStyle = {
            right: `calc((${columnWidth}px + ${spacing}) * ${rightOffset} + ${spacing}
            + ${isAggregationVisible ? `${AGGREGATION_COLUMN_WIDTH}px` : '0px'}`,
        };
        return (
            <div className="ControlsLists-dateLine__wrapper ControlsLists-dateLine__variables">
                <DateLine style={lineStyle} className={'ControlsLists-dateLine__height'} />
            </div>
        );
    }
}

function ConnectedComponentRef(
    props: ITimelineGridConnectedComponentProps,
    ref?: React.ForwardedRef<typeof TreeGridComponent>
): React.ReactElement {
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

    const holidaysContextValue = useHolidaysContextValueProvider(slice.items, slice.holidaysConfig);
    const quantum = getQuantum(slice.range, slice.quantums, slice.quantumScale);

    const dynamicColumnsGridData = React.useMemo(() => {
        const filteredData =
            slice.filterHolidays && quantum === 'day'
                ? slice.dynamicColumnsGridData.filter(weekendFilter)
                : slice.dynamicColumnsGridData;
        // Если выбран диапазон только с выходными, то не фильтруем, иначе будет нечего показывать.
        // Меньше двух дней показывать не можем
        if (
            filteredData.filter((date) => date >= slice.range.start && date <= slice.range.end)
                .length >= 2
        ) {
            return filteredData;
        } else {
            return slice.dynamicColumnsGridData;
        }
    }, [slice.dynamicColumnsGridData, slice.filterHolidays, quantum]);

    let rangeSize = getRangeSize(slice.range, quantum);

    if (slice.filterHolidays && quantum === 'day') {
        rangeSize = dynamicColumnsGridData.filter(
            (date) => date >= slice.range.start && date <= slice.range.end
        ).length;
    }
    const eventsSaturation = getEventsSaturation(slice.range, slice.quantums, slice.quantumScale);
    const columnsSpacing = props.verticalSeparatorsMode === 'gap' ? props.columnsSpacing : null;
    const columnGapSize = getColumnGapSize(columnsSpacing);
    const { width: columnWidth, rangeSize: newRangeSize } = getDynamicColumnWidth(
        viewportWidth,
        rangeSize,
        columnGapSize,
        slice.dynamicColumn,
        slice.multiSelectVisibility !== 'hidden' && slice.multiSelectPosition !== 'custom',
        props.dynamicColumnMinWidths,
        quantum,
        dynamicColumnsGridData
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

    const { visibleRange, initialColumnsPosition, onColumnsPositionChanged } =
        useColumnsScrollPositionHandler({
            slice,
            dynamicColumnsGridData,
            columnWidth,
            columnsCount: dynamicColumnsGridData.length,
            columnsSpacing,
            containerRef,
            visibleRangeSize: rangeSize,
        });

    React.useEffect(() => {
        const newRange = getRangeByVisibleRange(visibleRange, dynamicColumnsGridData, quantum);
        if (newRange.start && newRange.end) {
            slice.setRange(newRange);
        }
    }, [visibleRange]);

    React.useEffect(() => {
        const availableRanges = getAvailableRanges(
            viewportWidth,
            slice.dynamicColumn,
            columnGapSize,
            slice.multiSelectVisibility !== 'hidden' && slice.multiSelectPosition !== 'custom',
            props.dynamicColumnMinWidths
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
        dynamicColumnsGridData,
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
        () =>
            getPatchedDynamicHeader(
                slice.dynamicHeader,
                quantum,
                columnDataDensity,
                props.isAdaptive
            ),
        [slice.dynamicHeader, quantum, columnDataDensity, slice.range, props.isAdaptive]
    );

    const aggregationHeaders = React.useMemo<IHeaderConfig[]>(() => {
        return isAggregationVisible
            ? [
                  {
                      key: '$FIXED_RIGHT_COLUMN_HEADER',
                      render: <AggregationHeader />,
                      getCellProps: () => ({
                          valign: 'center',
                          halign: 'right',
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
                          halign: 'right',
                          className:
                              'ControlsLists-dynamicGrid__cross-horizontal-part tw-overflow-hidden',
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
                isAdaptive: props.isAdaptive,
            });
        },
        [props.getRowProps, props.hoverMode, props.horizontalSeparatorsMode, props.isAdaptive]
    );

    const hasItems = !!slice.items?.getCount();

    const beforeItemsContent = React.useMemo(() => {
        return hasItems
            ? getDateTriangleComponent(
                  dynamicColumnsGridData,
                  columnWidth,
                  columnsSpacing,
                  quantum,
                  props.fixedTimelineDate,
                  isAggregationVisible
              )
            : null;
    }, [
        dynamicColumnsGridData,
        columnWidth,
        columnsSpacing,
        quantum,
        props.fixedTimelineDate,
        hasItems,
    ]);

    const afterItemsContent = React.useMemo(() => {
        return hasItems
            ? getDateLineComponent(
                  dynamicColumnsGridData,
                  columnWidth,
                  columnsSpacing,
                  quantum,
                  props.fixedTimelineDate,
                  isAggregationVisible
              )
            : null;
    }, [
        dynamicColumnsGridData,
        columnWidth,
        columnsSpacing,
        quantum,
        props.fixedTimelineDate,
        hasItems,
    ]);

    const onHeaderClick = React.useCallback(
        (event: React.MouseEvent) => {
            const date = getDateByEventTarget(event.target as HTMLElement);
            goToInternalRange(slice, date, slice.quantums);
        },
        [slice, slice.quantums]
    );

    const onSelectedCellsChanged = React.useCallback(
        (selectedCells) => {
            slice.setState({
                selectedCells,
            });
        },
        [slice]
    );

    const expanderClickCallback = React.useCallback(
        (key) => {
            if (props.isAdaptive) {
                slice.setRoot(key);
                return false;
            }
        },
        [props.isAdaptive]
    );

    const timelineDataContextValue = React.useMemo(() => {
        return {
            quantum,
            eventsSaturation,
            columnDataDensity,
            columnWidth,
            dynamicColumnsGridData,
            range: slice.range,
            visibleRange,
        };
    }, [quantum, eventsSaturation, dynamicColumnsGridData, visibleRange]);

    const getDynamicColumnProps = React.useCallback(
        (item: Model) => {
            const dynamicColumnProps: ICellProps = {};
            if (props.verticalSeparatorsMode === 'line' && !item.get(slice.nodeProperty)) {
                dynamicColumnProps.className +=
                    ' ControlsLists-timelineGrid__verticalSeparatorsMode_lines';
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
                    dynamicColumnsGridData={dynamicColumnsGridData}
                >
                    <div
                        ref={(el) => {
                            containerRef.current = el;
                        }}
                        className={'tw-contents'}
                        style={{
                            '--viewport-width': `${props.viewportWidth}px`,
                        }}
                    >
                        <DynamicGridComponent
                            {...props}
                            columnsSpacing={columnsSpacing}
                            gridComponentRef={(el) => {
                                dynamicGridRef.current = el;
                                if (typeof ref === 'function') {
                                    ref(el);
                                } else if (ref) {
                                    ref.current = el;
                                }
                            }}
                            viewMode={slice.viewMode}
                            staticColumns={staticColumns}
                            endStaticColumns={aggregationColumns}
                            eventRender={props.eventRender}
                            eventsProperty={slice.eventsProperty || props.eventsProperty}
                            eventStartProperty={
                                slice.eventStartProperty || props.eventStartProperty
                            }
                            eventEndProperty={slice.eventEndProperty || props.eventEndProperty}
                            dynamicDataProperty={slice.columnsNavigation.sourceConfig.field}
                            dynamicColumn={dynamicColumn}
                            dynamicColumnsCount={dynamicColumnsGridData.length}
                            getDynamicColumnProps={getDynamicColumnProps}
                            getDynamicColumnHeaderProps={getDynamicColumnHeaderProps}
                            staticHeaders={slice.staticHeaders}
                            endStaticHeaders={aggregationHeaders}
                            dynamicHeader={dynamicHeader}
                            columnsEndedCallback={columnsEndedCallback}
                            dynamicColumnsGridData={dynamicColumnsGridData}
                            filtered={slice.filterHolidays && quantum === 'day'}
                            range={slice.range}
                            visibleRange={visibleRange}
                            quantums={slice.quantums}
                            initialColumnScrollPosition={initialColumnsPosition}
                            columnsDataVersion={slice.columnsDataVersion}
                            multiSelectVisibility={slice.multiSelectVisibility}
                            getRowProps={getRowProps}
                            quantum={quantum}
                            columnDataDensity={columnDataDensity}
                            multiSelectAccessibilityProperty={
                                props.multiSelectAccessibilityProperty
                            }
                            cellsMultiSelectVisibility={slice.cellsMultiSelectVisibility}
                            cellsMultiSelectAccessibilityCallback={
                                slice.cellsMultiSelectAccessibilityCallback
                            }
                            selectedCells={slice.selectedCells}
                            onSelectedCellsChanged={onSelectedCellsChanged}
                            onBeforeSelectedCellsChanged={undefined}
                            expanderClickCallback={expanderClickCallback}
                            beforeItemsContent={beforeItemsContent}
                            afterItemsContent={afterItemsContent}
                            onPositionChanged={onColumnsPositionChanged}
                            onHeaderClick={onHeaderClick}
                            hoverMode={props.hoverMode}
                            expanderPosition={props.isAdaptive ? 'right' : 'default'}
                        />
                    </div>
                    <TimeZoneChangeHandler slice={slice} />
                </AggregationContextProvider>
            </TimelineDataContext.Provider>
        </HolidaysContext.Provider>
    );
}

const ConnectedComponent = React.forwardRef(ConnectedComponentRef);

export { ConnectedComponent, ConnectedComponent as TimelineGridConnectedComponent };

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
    dynamicColumn: IDynamicColumnConfig<Date>,
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
    dynamicColumn: IDynamicColumnConfig<Date>,
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
        if (maxRangeSize > 1) {
            availableWidth = viewportWidth - columnGapSize * (maxRangeSize + 1) - checkboxWidth;
            return {
                width: availableWidth / maxRangeSize,
                rangeSize: maxRangeSize,
            };
        } else {
            Logger.warn(
                'TimelineGrid: Доступная ширина слишком мала. Корректная работа контрола невозможна.'
            );
            return { width: minWidth };
        }
    } else {
        return { width };
    }
}

export function getAvailableRanges(
    viewportWidth: number,
    dynamicColumn: IDynamicColumnConfig<Date>,
    columnGapSize: number,
    hasMultiSelectColumn: boolean,
    dynamicColumnMinWidths: TDynamicColumnMinWidths
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
        days: Array.from({ length: maxDays + 1 }, (_, i) => i).slice(1),
        months,
        quarters: [1],
        halfyears: [1],
        years: [1],
    };
}

function getDynamicColumnDataDensity(
    columnWidth: number,
    quantum: Quantum,
    dynamicColumn: IDynamicColumnConfig<Date>,
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
            const borderRadius = params.hoverMode === 'cell' ? 's' : null;
            const borderVisibility = params.hoverMode === 'cell' ? 'onhover' : 'hidden';
            return {
                topLeftBorderRadius: superResult.topLeftBorderRadius || borderRadius,
                topRightBorderRadius: superResult.topRightBorderRadius || borderRadius,
                bottomRightBorderRadius: superResult.bottomRightBorderRadius || borderRadius,
                bottomLeftBorderRadius: superResult.bottomLeftBorderRadius || borderRadius,
                borderVisibility: superResult.borderVisibility || borderVisibility,
                halign: params.dataDensity === 'advanced' ? 'right' : 'center',
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
    isAdaptive: boolean;
}

// Обогащает конфигурацию строк значениями по умолчанию.
export function getDynamicGridRowProps(params: IGetDynamicGridRowPropsParams): IRowProps {
    let userRowProps: IRowProps = {};

    if (params.getRowProps) {
        userRowProps = params.getRowProps(params.item);
    }

    if (userRowProps.borderVisibility) {
        Logger.warn(
            "Timeline table doesn't support borderVisibility. Option won't affect anything. " +
                'Please use timelineGrid.horizontalSeparatorsMode property instead.'
        );
    }

    const padding = {
        top: params.horizontalSeparatorsMode === 'gap' ? '3xs' : 'null',
        bottom: 'null',
        ...userRowProps?.padding,
    };

    // Записи TimelineGrid не бывают без ховера.
    // Вне зависимости от hoverMode всегда есть горизонтальные полоски для выделения записи,
    // Про top/bottom см. подробнее комментарий "Горизонтальные линии по ховеру. Мемуары" в dynamicGrid.less
    padding.top = padding.top !== 'null' ? 'dynamicGrid_' + padding.top : 'null';
    padding.bottom = padding.bottom !== 'null' ? 'dynamicGrid_' + padding.bottom : 'null';

    const propsForMobile = {};
    if (params.isAdaptive) {
        propsForMobile.expanderIcon = 'hiddenNode';
    }

    return {
        hoverBackgroundStyle: 'none',
        ...propsForMobile,
        ...userRowProps,
        padding,
        className:
            (userRowProps.className ? `${userRowProps.className} ` : '') +
            'ControlsLists-dynamicGrid__item',
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

function goToInternalRange(slice: TimelineGridSlice, targetDate: Date, quantums: IQuantum[]): void {
    if (!targetDate) {
        return;
    }

    const quantum = getQuantum(slice.range, slice.state.quantums, slice.state.quantumScale);
    const rangeSize = getRangeSize(slice.range, quantum);
    const days = quantums?.find((q) => q.name === Quantum.Day);
    const lessThanDay = quantums?.find(
        (q) => q.name === Quantum.Hour || q.name === Quantum.Minute || q.name === Quantum.Second
    );

    switch (quantum) {
        case Quantum.Second:
        case Quantum.Minute:
        case Quantum.Hour:
            return;
        case Quantum.Day:
            const daysInTwoWeeks = 14;

            if (rangeSize < daysInTwoWeeks) {
                if (lessThanDay) {
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
                }
            } else {
                slice.setRange({
                    start: BaseDateUtils.getStartOfWeek(targetDate),
                    end: BaseDateUtils.getEndOfWeek(targetDate),
                });
            }

            return;
        case Quantum.Month:
            if (days) {
                slice.setRange({
                    start: BaseDateUtils.getStartOfMonth(targetDate),
                    end: BaseDateUtils.getEndOfMonth(targetDate),
                });
                return;
            }
    }
}

Object.assign(ConnectedComponent, {
    defaultProps: {
        columnsSpacing: '3xs',
        horizontalSeparatorsMode: 'gap',
        verticalSeparatorsMode: 'gap',
        hoverMode: 'cross',
    } as Partial<ITimelineGridConnectedComponentProps>,
});

/**
 * Контрол "Таймлайн таблица"
 *
 * Контрол, отображающий данные реестра на временной сетке, где каждый столбец содержит данные за конкретный временной отрезок.
 * Сетку можно скроллировать, данные подгружаются по ходу прокрутки.
 * По горизонтальной оси в строках могут выводиться события, позиционирующиеся в пределах своей продолжительности (например, отпуска в графике работ).
 * Пользователь может менять размерность (режим) контрола, меняя тем самым временные отрезки внутри сетки. Например, в режиме "День" отрезками будут часы, в режиме "Год" - месяцы.
 * Подробное описание смотрите в {@link https://n.sbis.ru/article/e917f0a4-cb20-4c16-827d-b8723ad9ca8b спецификации}.
 *
 * Контрол работает с данными через слайс, предоставляемый фабрикой {@link Controls-Lists/_timelineGrid/factory/Factory/ITimelineGridFactory}.
 * См. также {@link Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments Список аргументов фабрики}
 * @class Controls-Lists/timelineGrid:ConnectedComponent
 * @implements Controls-Lists/_timelineGrid/interface/ITimelineGridConnectedComponentProps
 * @example
 * <pre class="brush: js">
 * import { Container as ScrollContainer } from 'Controls/scroll';
 * import { ConnectedComponent as TimelineGrid } from 'Controls-Lists/timelineGrid';
 *
 * interface IProps {
 *     workspaceWidth: number;
 * }
 *
 * export default function MyComponent(props: IProps): React.ReactComponent {
 * 	const viewportWidth = props.workspaceWidth;
 *
 * 	return (
 * 		<ScrollContainer className={...}>
 * 		    <TimelineGrid
 *         		storeId={'EmployeeList'}
 * 	        	viewportWidth={viewportWidth}
 * 		    />
 * 		</ScrollContainer>
 * 	);
 * }
 * </pre>
 * @demo Controls-Lists-demo/timelineGrid/WI/Base/Index
 * @public
 */
