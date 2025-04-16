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
import type { IRowProps, TGetRowPropsCallback } from 'Controls/gridRender';
import { ICellProps, IColumnConfig, IHeaderConfig } from 'Controls/gridRender';
import { View as TreeGridComponent } from 'Controls/treeGrid';
import {
    CLASS_DYNAMIC_HEADER_CELL,
    DynamicGridComponent,
    DYNAMIC_GRID_CELL_FIXED_STICKIED_Z_INDEX,
    getColumnGapSize,
    IDynamicColumnConfig,
    ISelection,
    TCellsMultiSelectVisibility,
    TColumnDataDensity,
    THoverMode,
    Utils as DynamicGridUtils,
    getPositionInPeriod,
} from 'Controls-Lists/dynamicGrid';
import { DataContext } from 'Controls-DataEnv/context';
import 'css!Controls-Lists/timelineGrid';
import { Logger } from 'UICommon/Utils';

// region library exports
import {
    ITimelineGridConnectedComponentProps,
    TSeparatorMode,
    TTimelineScrollViewMode,
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
    ITimelineColumnsNavigation,
    ITimelineColumnsNavigationSourceConfig,
    TAggregationVisibility,
    ITimelineColumnsNavigation,
    ITimelineGridLoadResult,
    ITimelineColumnsNavigationSourceConfig,
} from 'Controls-Lists/_timelineGrid/factory/ITimelineGridDataFactoryArguments';
import {
    getEventsSaturation,
    getQuantum,
    getRangeSize,
    Quantum,
    shiftDate,
    TDynamicColumnMinWidths,
    IQuantum,
    TQuantumRangeAccessibility,
    IScale,
    TEventSaturation,
    Utils,
    updateRangeOnSlice,
    MonthRange,
    DayRange,
    zoom,
    getCustomRanges,
} from 'Controls-Lists/_timelineGrid/utils';
import TimelineGridSlice, {
    ITimelineGridSliceState,
    TimelineDataContext,
} from 'Controls-Lists/_timelineGrid/factory/Slice';
import { ADVANCED_DATA_COLUMN_WIDTH } from 'Controls-Lists/_timelineGrid/constants';

import {
    DateType,
    HolidaysContext,
    IHoliday,
    IHolidaysConfig,
    isWeekendDate,
    weekendFilter,
    useHolidaysContextValueProvider,
} from 'Controls-Lists/_timelineGrid/render/Holidays';
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
import { getEndDate, getStartDate } from 'Controls-Lists/_dynamicGrid/render/utils';
import { constants } from 'Env/Constants';
import { JS_START_FIXED_SELECTOR } from 'Controls-Lists/_dynamicGrid/shared/constants';
import { TimeMarker } from 'Controls-Lists/dynamicGrid';
import { TOffsetSize } from 'Controls/interface';
import DragLineLayer from 'Controls-Lists/_timelineGrid/render/DragLineLayer';
import { useDragDependency } from 'Controls-Lists/_timelineGrid/hooks/useDragDependency';

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
    TEventLineSize,
} from './_timelineGrid/render/EventLineRender';
export {
    MemoizedEventSquircleRender as EventSquircleRender,
    TFooterPosition,
} from './_timelineGrid/render/EventSquircleRender';
export { default as TimelineGridFactory } from 'Controls-Lists/_timelineGrid/factory/Factory';
export {
    useAggregationData,
    IAggregationData,
    IIndexesRange,
} from 'Controls-Lists/_timelineGrid/aggregation/hooks/useAggregationData';

export { default as ArrowsLayer } from './_timelineGrid/render/ArrowsLayer';
export { FactoryUtils } from './_timelineGrid/factory/utils';
export { RangeHistoryUtils } from 'Controls-Lists/_timelineGrid/factory/RangeHistoryUtils';
export {
    TAggregationVisibility,
    ITimelineColumnsFilter,
    ITimelineColumnsNavigation,
    ITimelineColumnsNavigationSourceConfig,
    ITimelineGridDataFactoryArguments,
    ITimelineColumnsNavigation,
    ITimelineGridLoadResult,
    ITimelineColumnsNavigationSourceConfig,
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
    TQuantumRangeAccessibility,
    IScale,
    TTimelineScrollViewMode,
    MonthRange,
    DayRange,
};

// endregion library exports

interface IDraggingProcessState {
    startEventKey: string | null;
    buttonPosition: 'left' | 'right' | null;
}

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
    let currentDate = fixedTimelineDate ? fixedTimelineDate : new Date();
    if (constants.isServerSide) {
        currentDate = correctDateFromClientToServer(currentDate);
    }

    const index = datesArray.findIndex((elem: Date) => {
        if (constants.isServerSide) {
            elem = correctDateFromClientToServer(elem);
        }
        // FIXME: Дублирование сравнения. Есть утилита уже где то.
        const isEqualYear = currentDate.getFullYear() === elem.getFullYear();
        const isEqualMonth = currentDate.getMonth() === elem.getMonth();
        const isEqualDate = currentDate.getDate() === elem.getDate();
        const isEqualHour = currentDate.getHours() === elem.getHours();
        const isEqualHalfHour =
            Math.floor(currentDate.getMinutes() / 30) === Math.floor(elem.getMinutes() / 30);

        if (quantum === 'halfHour') {
            return isEqualYear && isEqualMonth && isEqualDate && isEqualHour && isEqualHalfHour;
        }

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
function getTimeMarkerComponent(
    datesArray: unknown[],
    columnWidth: number,
    spaceSize: TOffsetSize,
    quantum: Quantum,
    fixedTimelineDate: Date,
    wrapperStyle: object,
    isAggregationVisible?: boolean
) {
    const rightOffset = getRightOffset(datesArray, quantum, fixedTimelineDate);
    const spacing = getOffsetStyle(spaceSize);
    if (rightOffset) {
        const lineStyle = {
            right: `calc((${columnWidth}px + ${spacing}) * ${rightOffset} + ${spacing}
              + ${isAggregationVisible ? `${AGGREGATION_COLUMN_WIDTH}px` : '0px'})`,
        };

        return (
            <div style={{ ...wrapperStyle, zIndex: 3 }}>
                <TimeMarker style={{ ...wrapperStyle, ...lineStyle }} />
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

    const { eventInDraggingProcess, handleDependencyButtonMouseDown, hasDragStartEventKey } =
        useDragDependency({
            onAddEventDependency: props.onAddEventDependency,
        });

    const changedLayers = React.useMemo(() => {
        const resultLayers = [...(props?.layers ?? [])];
        if (eventInDraggingProcess.startEventKey) {
            resultLayers.push(
                <DragLineLayer
                    data={[
                        {
                            startEventKey: eventInDraggingProcess.startEventKey,
                            buttonPosition: eventInDraggingProcess.buttonPosition,
                            lineColor: eventInDraggingProcess.eventColor,
                        },
                    ]}
                    key={'dragLineLayer'}
                />
            );
        }
        return resultLayers;
    }, [props.layers, eventInDraggingProcess.startEventKey]);

    const isAggregationVisible = React.useMemo(() => {
        return slice.aggregationVisibility === 'visible';
    }, [slice.aggregationVisibility]);

    const columnsEndedCallback = React.useCallback(
        DynamicGridUtils.getColumnsEndedCallback(slice),
        [slice]
    );

    const resizerVisibility = React.useMemo(() => {
        return props.resizerVisibility && !props.isAdaptive;
    }, [props.resizerVisibility, props.isAdaptive]);

    const [customWidth, setCustomWidth] = React.useState<undefined | number>();
    const resizeObserverRef = React.useRef<ResizeObserver | undefined>();
    const onResize = React.useCallback(() => {
        const columnsWidths = slice.state.collection.getColumnsWidths();
        if (columnsWidths && columnsWidths.length > 0) {
            const newStaticColumns = [];
            const newCustomWidth = slice.staticColumns.reduce((sumWidth, column, index) => {
                const width = parseInt(columnsWidths[index], 10);
                newStaticColumns.push({ ...column, width: `${width}px` });
                return sumWidth + width;
            }, 0);
            setCustomWidth(newCustomWidth);
            slice.setState({ staticColumns: newStaticColumns });
        }
    }, [slice.state.collection]);

    React.useEffect(() => {
        if (resizerVisibility) {
            resizeObserverRef.current = new ResizeObserver(onResize);
            const target = containerRef.current?.querySelector(JS_START_FIXED_SELECTOR);
            if (target) {
                resizeObserverRef.current.observe(target);
            }
        }
        return () => {
            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect();
            }
        };
    }, [resizerVisibility, onResize]);

    const columnsSpacing = props.verticalSeparatorsMode === 'gap' ? props.columnsSpacing : null;
    const columnGapSize = getColumnGapSize(columnsSpacing);

    const [staticWorkspaceSize, swipeStaticColumnsHandlers] = useSwipe(
        getStaticColumnsWidth(slice.staticColumns),
        slice,
        props.initialStaticWorkspaceSize
    );

    const viewportWidth = getViewportWidth(
        props.viewportWidth,
        slice.staticColumns,
        isAggregationVisible,
        staticWorkspaceSize,
        customWidth
    );
    const viewportWidthRef = React.useRef(viewportWidth);

    const holidaysContextValue = useHolidaysContextValueProvider(slice.items, slice.holidaysConfig);
    const quantum = getQuantum(slice.range, slice.quantsReplacementMap);

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

    const customRanges = getCustomRanges(slice.quantums);

    let rangeSize = getRangeSize(slice.range, quantum, customRanges);

    if (slice.filterHolidays && quantum === 'day') {
        rangeSize = dynamicColumnsGridData.filter(
            (date) => date >= slice.range.start && date <= slice.range.end
        ).length;
    }
    const eventsSaturation = getEventsSaturation(slice.range, slice.quantsReplacementMap);
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

    const onEventResized = React.useCallback(
        (item, event) => {
            const shouldUpdateSource = !props.onEventResized?.({ item, event });
            if (shouldUpdateSource) {
                slice.sourceController?.update(item);
            }
        },
        [slice, props.onEventResized]
    );

    React.useEffect(() => {
        if (viewportWidth && viewportWidthRef.current !== viewportWidth) {
            if (props.isAdaptive) {
                updateRangeOnSlice({
                    slice,
                    currentViewportWidth: viewportWidthRef.current,
                    nextViewportWidth: viewportWidth,
                    dynamicColumnMinWidths: props.dynamicColumnMinWidths,
                    columnGapSize,
                });
                slice.setLoadingRangeByViewportWidthChanged(true);
            }
            viewportWidthRef.current = viewportWidth;
        }
    }, [viewportWidth, columnGapSize, props.dynamicColumnMinWidths, slice, props.isAdaptive]);

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
                props.isAdaptive,
                slice.state.quantums
            ),
        [
            slice.dynamicHeader,
            quantum,
            columnDataDensity,
            slice.range,
            props.isAdaptive,
            slice.state.quantums,
        ]
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
                          fixedZIndex: DYNAMIC_GRID_CELL_FIXED_STICKIED_Z_INDEX,
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

    const isDateLineVisible = React.useMemo(() => {
        const rangeStart = getStartDate(new Date(slice.range.start), slice.quantum);
        const rangeEnd = getEndDate(new Date(slice.range.end), slice.quantum);
        const currentDate = props.fixedTimelineDate ? props.fixedTimelineDate : new Date();
        return (
            currentDate.getTime() >= rangeStart.getTime() &&
            currentDate.getTime() <= rangeEnd.getTime()
        );
    }, [slice.range, props.fixedTimelineDate, slice.quantum]);

    const dateLineWrapperStyle = React.useMemo(() => {
        let gridColumnStart = staticColumns.length + 1;
        if (slice.multiSelectVisibility !== 'hidden' && slice.multiSelectPosition !== 'custom') {
            gridColumnStart += 1;
        }
        if (isAggregationVisible) {
            gridColumnStart += 1;
        }
        return {
            gridColumnEnd: -1,
            gridColumnStart,
        };
    }, [
        staticColumns,
        slice.multiSelectVisibility,
        slice.multiSelectPosition,
        isAggregationVisible,
    ]);

    const onHeaderClick = React.useCallback(
        (event: React.MouseEvent) => {
            const targetDate = getDateByEventTarget(event.target as HTMLElement);
            if (targetDate) {
                slice.zoom(targetDate, 'increase', 'header');
            }
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
            visibleRange: slice.visibleRange,
            containerRef,
            hasDragStartEventKey,
        };
    }, [
        quantum,
        eventsSaturation,
        dynamicColumnsGridData,
        slice.visibleRange,
        slice.range,
        containerRef.current,
        hasDragStartEventKey,
        eventInDraggingProcess.startEventKey,
    ]);

    const getDynamicColumnProps = React.useCallback(
        (item: Model) => {
            const dynamicColumnProps: ICellProps = {};
            if (props.verticalSeparatorsMode === 'line') {
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

    const beforeItemsContent = React.useMemo(() => {
        return hasItems && isDateLineVisible
            ? getTimeMarkerComponent(
                  dynamicColumnsGridData,
                  columnWidth,
                  columnsSpacing,
                  quantum,
                  props.fixedTimelineDate,
                  dateLineWrapperStyle,
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
        isDateLineVisible,
        dateLineWrapperStyle,
        isAggregationVisible,
    ]);

    const onRangeChange = React.useCallback(
        (newRange: IRange) => {
            slice.setRange(newRange);
        },
        [slice]
    );
    const hoverMode = React.useMemo(() => {
        if (slice.state.cellsMultiSelectVisibility === 'onhover') {
            return 'none';
        } else {
            return props.hoverMode;
        }
    }, [props.hoverMode, slice.state.cellsMultiSelectVisibility]);
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
                            dynamicGridRef={ref}
                            columnWidth={columnWidth}
                            columnGapSize={columnGapSize}
                            rangeSize={rangeSize}
                            containerRef={containerRef}
                            needReloadGridAfterScrollStops={true}
                            onRangeChange={onRangeChange}
                            columnsSpacing={columnsSpacing}
                            keepAddingOnReload
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
                            getDynamicColumnProps={getDynamicColumnProps}
                            getDynamicColumnHeaderProps={preparedGetDynamicColumnHeaderProps}
                            staticHeaders={staticHeaders}
                            endStaticHeaders={aggregationHeaders}
                            dynamicHeader={dynamicHeader}
                            columnsEndedCallback={columnsEndedCallback}
                            dynamicColumnsGridData={dynamicColumnsGridData}
                            filtered={slice.filterHolidays && quantum === 'day'}
                            range={slice.range}
                            quantums={slice.quantums}
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
                            onHeaderClick={onHeaderClick}
                            afterItemsContent={changedLayers && changedLayers.map((layer) => layer)}
                            hoverMode={hoverMode}
                            swipeStaticColumnsHandlers={swipeStaticColumnsHandlers}
                            resizerVisibility={resizerVisibility}
                            onEventResized={onEventResized}
                            onDependencyButtonMouseDown={handleDependencyButtonMouseDown}
                            onDependencyButtonClick={props.onDependencyButtonClick}
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
            let correctDate = date;
            if (constants.isServerSide) {
                correctDate = correctDateFromClientToServer(date);
            }
            const superResult = params.dynamicColumn?.getCellProps?.(item, correctDate) || {};
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
    return staticColumns.map((staticColumn, index) => {
        const preparedStaticColumn = { ...staticColumn };
        const width =
            staticColumns.length === 1
                ? staticColumnsWidth
                : parseFloat(staticColumn.width as string);
        if (index === 0) {
            preparedStaticColumn.width = `${width}px - var(--outer_padding, 0px)`;
        }
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
                fixedZIndex: DYNAMIC_GRID_CELL_FIXED_STICKIED_Z_INDEX,
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

Object.assign(ConnectedComponent, {
    defaultProps: {
        columnScrollViewMode: 'unaccented',
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
 *    const viewportWidth = props.workspaceWidth;
 *
 *    return (
 *        <ScrollContainer className={...}>
 *            <TimelineGrid
 *                storeId={'EmployeeList'}
 *                viewportWidth={viewportWidth}
 *            />
 *        </ScrollContainer>
 *    );
 * }
 * </pre>
 * @demo Controls-Lists-demo/timelineGrid/WI/Base/Index
 * @public
 */
