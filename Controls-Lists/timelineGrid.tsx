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
import { StickyBlock } from 'Controls/stickyBlock';

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
    updateRangeOnSlice,
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
    END_DAY_HOUR,
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
    useColumnsScrollPositionHandler,
    useScrollToRangeStart,
} from 'Controls-Lists/_timelineGrid/ColumnsScrollUtils';
import { AGGREGATION_COLUMN_WIDTH } from 'Controls-Lists/dynamicGrid';

import {
    correctDateFromClientToServer,
    correctDateFromServerToClient,
    getAvailableRanges,
    getMinColumnWidth,
} from 'Controls-Lists/_timelineGrid/utils';
import {
    getViewportWidth,
    getStaticColumnsWidth,
    getDynamicColumnWidth,
} from 'Controls-Lists/dynamicGrid';

import AggregationContextProvider from 'Controls-Lists/_timelineGrid/aggregation/context/Provider';
import AggregationHeader from 'Controls-Lists/_timelineGrid/aggregation/render/AggregationHeader';
import AggregationColumn from 'Controls-Lists/_timelineGrid/aggregation/render/AggregationColumn';
import { default as ScaleAction } from 'Controls-Lists/_timelineGrid/actions/Scale';
import { TimeZoneChangeHandler } from 'Controls-Lists/_timelineGrid/render/TimeZoneChangeHandler';
import { useSwipe } from 'Controls-Lists/_timelineGrid/hooks/useSwipe';
import { useOrientation } from 'Controls-Lists/_timelineGrid/hooks/useOrientation';

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
            <StickyBlock className="ControlsLists-dateLine__wrapper ControlsLists-dateLine__variables">
                <div>
                    <DateTriangle style={lineStyle} />
                </div>
            </StickyBlock>
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
            <div className="ControlsLists-dateLine__wrapper tw-relative ControlsLists-dateLine__variables">
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

    const columnsSpacing = props.verticalSeparatorsMode === 'gap' ? props.columnsSpacing : null;
    const columnGapSize = getColumnGapSize(columnsSpacing);

    const [staticWorkspaceSize, swipeStaticColumnsHandlers] = useSwipe(
        getStaticColumnsWidth(slice.staticColumns),
        slice,
        props.viewportWidth,
        props.dynamicColumnMinWidths,
        columnGapSize
    );

    const viewportWidth = getViewportWidth(
        props.viewportWidth,
        slice.staticColumns,
        isAggregationVisible,
        staticWorkspaceSize
    );
    const viewportWidthRef = React.useRef(viewportWidth);

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
    const minWidth = getMinColumnWidth(slice.dynamicColumn, props.dynamicColumnMinWidths, quantum);
    const { width: columnWidth, rangeSize: newRangeSize } = getDynamicColumnWidth(
        viewportWidth,
        rangeSize,
        slice.dynamicColumn,
        columnGapSize,
        slice.multiSelectVisibility !== 'hidden' && slice.multiSelectPosition !== 'custom',
        minWidth
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

    const orientation = useOrientation();
    const orientationRef = React.useRef(orientation);
    React.useEffect(() => {
        if (!orientation) {
            orientationRef.current = screen.orientation?.type;
        }
    });

    React.useEffect(() => {
        if (viewportWidthRef.current !== viewportWidth) {
            if (orientation && orientation !== orientationRef.current) {
                updateRangeOnSlice({
                    slice,
                    currentViewportWidth: viewportWidthRef.current,
                    nextViewportWidth: viewportWidth,
                    dynamicColumnMinWidths: props.dynamicColumnMinWidths,
                    columnGapSize,
                });
                orientationRef.current = orientation;
            }
            viewportWidthRef.current = viewportWidth;
        }
    }, [orientation, viewportWidth, columnGapSize, props.dynamicColumnMinWidths, slice]);

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
                getStaticColumnsWidth(slice.staticColumns, staticWorkspaceSize),
                staticWorkspaceSize
            ),
        [slice.staticColumns, props.hoverMode, staticWorkspaceSize]
    );

    const staticHeaders = React.useMemo(
        () =>
            prepareStaticHeaders(
                slice.staticHeaders,
                staticWorkspaceSize,
                props.horizontalHeaderSeparatorsVisible
            ),
        [slice.staticHeaders, staticWorkspaceSize]
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
                          className: props.horizontalHeaderSeparatorsVisible
                              ? ' ControlsLists-timelineGrid__horizontalHeaderSeparatorsVisible'
                              : '',
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
            });
        },
        [props.getRowProps, props.hoverMode, props.horizontalSeparatorsMode]
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

    const preparedGetDynamicColumnHeaderProps = React.useCallback(() => {
        const dynamicColumnHeaderProps = { ...getDynamicColumnHeaderProps() };
        if (props.columnsSpacing === 'null') {
            const backgroundStyle = slice.dynamicHeader.getCellProps?.()?.backgroundStyle;
            if (backgroundStyle) {
                dynamicColumnHeaderProps.backgroundStyle = backgroundStyle;
            }
        }
        if (props.horizontalHeaderSeparatorsVisible) {
            dynamicColumnHeaderProps.className +=
                ' ControlsLists-timelineGrid__horizontalHeaderSeparatorsVisible';
        }
        return dynamicColumnHeaderProps;
    }, [props.horizontalHeaderSeparatorsVisible, getDynamicColumnHeaderProps]);

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
                            className={getClassName(props.className)}
                            dynamicColumnsCount={dynamicColumnsGridData.length}
                            getDynamicColumnProps={getDynamicColumnProps}
                            getDynamicColumnHeaderProps={preparedGetDynamicColumnHeaderProps}
                            staticHeaders={staticHeaders}
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
                            swipeStaticColumnsHandlers={swipeStaticColumnsHandlers}
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

function getClassName(className: string | undefined) {
    let classes = 'ControlsLists-timelineGrid__swipeStaticColumnTransition ';

    if (className) {
        classes += className;
    }

    return classes;
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
    padding.top = padding.top !== 'null' ? 'dynamic-grid_' + padding.top : 'null';
    padding.bottom = padding.bottom !== 'null' ? 'dynamic-grid_' + padding.bottom : 'null';

    return {
        hoverBackgroundStyle: 'none',
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
    staticColumnsWidth: number,
    staticWorkspaceSize: 'min' | 'default'
): IColumnConfig[] {
    return staticColumns.map((staticColumn) => {
        const preparedStaticColumn = { ...staticColumn };
        preparedStaticColumn.width = `calc(${staticColumnsWidth}px - var(--outer_padding, 0px))`;
        preparedStaticColumn.getCellProps = (item) => {
            const superResult = staticColumn?.getCellProps?.(item) || {};
            return {
                className:
                    'ControlsLists-dynamicGrid__cross-horizontal-part js-ControlsLists-timelineGrid__staticCell' +
                    `${superResult?.className ? superResult.className : ''}`,
                ...superResult,
            };
        };
        if (staticColumn.render) {
            preparedStaticColumn.render = React.cloneElement(staticColumn.render, {
                staticWorkspaceSize,
            });
        }
        return preparedStaticColumn;
    });
}

function prepareStaticHeaders(
    staticHeaders: IHeaderConfig[],
    staticWorkspaceSize: 'min' | 'default',
    horizontalHeaderSeparatorsVisible: boolean
): IColumnConfig[] {
    return staticHeaders.map((staticHeader) => {
        const preparedStaticHeader = { ...staticHeader };
        preparedStaticHeader.getCellProps = (item) => {
            const prevGetCellProps = staticHeader.getCellProps?.(item) || {};
            if (horizontalHeaderSeparatorsVisible) {
                prevGetCellProps.className =
                    (prevGetCellProps.className || '') +
                    ' ControlsLists-timelineGrid__horizontalHeaderSeparatorsVisible';
            }
            return {
                beforeContentRender: null,
                ...prevGetCellProps,
            };
        };
        if (staticHeader.render) {
            preparedStaticHeader.render = React.cloneElement(staticHeader.render, {
                staticWorkspaceSize,
            });
        }

        return preparedStaticHeader;
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
        horizontalHeaderSeparatorsVisible: false,
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
