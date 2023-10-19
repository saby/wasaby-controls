/**
 * Компонент "Таймлайн-таблица с загружаемыми колонками"
 * @class Controls-Lists/timelineGrid
 * @public
 * @demo Controls-Lists-demo/timelineGrid/base/Index
 */

import * as React from 'react';
import type { Model } from 'Types/entity';
import type { IRowProps } from 'Controls/gridReact';
import { TOffsetSize } from 'Controls/interface';
import {
    DynamicGridComponent,
    IDynamicGridConnectedComponentProps,
    Utils,
    getColumnGapSize,
    getPositionInPeriod,
    TDynamicHeaderCellsColspanCallback,
    TColumnDataDensity,
    CLASS_DYNAMIC_HEADER_CELL,
    datesEqualByQuantum,
    ISelection,
    TCellsMultiSelectVisibility,
} from 'Controls-Lists/dynamicGrid';
import { useHandler } from 'Controls/Hooks/useHandler';
import { DataContext } from 'Controls-DataEnv/context';
import 'css!Controls-Lists/timelineGrid';
import { IColumnConfig, IHeaderConfig } from 'Controls/gridReact';
import { Logger } from 'UICommon/Utils';

export { default as EventRender } from './_timelineGrid/render/EventBlockRender';
export {
    default as EventBlockRender,
    getFittingMode as getEventFittingMode,
} from './_timelineGrid/render/EventBlockRender';
export { default as EventLineRender } from './_timelineGrid/render/EventLineRender';
import { getPatchedDynamicHeader } from 'Controls-Lists/_timelineGrid/render/Header';
import RangeSelectorConnectedComponent from 'Controls-Lists/_timelineGrid/RangeSelectorConnectedComponent';
import {
    IRange,
    ITimelineColumnsFilter,
    TAggregationVisibility,
} from 'Controls-Lists/_timelineGrid/factory/ITimelineGridFactory';
import {
    getRangeSize,
    getQuantum,
    Quantum,
    getEventsSaturation,
} from 'Controls-Lists/_timelineGrid/utils';
import { IItemsRange } from 'Controls/baseList';
import { Base as BaseDateUtils } from 'Controls/dateUtils';

export { TAggregationVisibility };
export { ITimelineColumnsFilter };
export { default as TimelineGridFactory } from 'Controls-Lists/_timelineGrid/factory/Factory';
export { RangeSelectorConnectedComponent };
import { DateTriangle } from 'Controls-Lists/_timelineGrid/render/DateTriangle';
import { DateLine } from 'Controls-Lists/_timelineGrid/render/DateLine';
import TimelineGridSlice from 'Controls-Lists/_timelineGrid/factory/Slice';
import { TimelineDataContext } from 'Controls-Lists/_timelineGrid/factory/Slice';
import {
    ADVANCED_DATA_COLUMN_WIDTH_RATIO,
    COLLAPSED_HEADER_CELLS_COLUMN_WIDTH_RATIO,
    END_DAY_HOUR,
    START_DAY_HOUR,
} from 'Controls-Lists/_timelineGrid/constants';

import {
    IHolidaysConfig,
    HolidaysContext,
    useHolidaysContextValueProvider,
    isWeekendDate,
} from 'Controls-Lists/_timelineGrid/render/Holidays';
import {
    useColumnsScrollPositionHandler,
    useScrollToRangeStart,
} from 'Controls-Lists/_timelineGrid/ColumnsScrollUtils';

import AggregationContextProvider from 'Controls-Lists/_timelineGrid/aggregation/context/Provider';
import AggregationHeader from 'Controls-Lists/_timelineGrid/aggregation/render/AggregationHeader';
import AggregationColumn from 'Controls-Lists/_timelineGrid/aggregation/render/AggregationColumn';

export { useAggregationData } from 'Controls-Lists/_timelineGrid/aggregation/hooks/useAggregationData';

export { IHolidaysConfig, isWeekendDate, ISelection, TCellsMultiSelectVisibility };
export { Quantum, getQuantum, IRange, getEventsSaturation, TimelineDataContext };
export { RangeHistoryUtils } from 'Controls-Lists/_timelineGrid/factory/RangeHistoryUtils';

const AGGREGATION_COLUMN_WIDTH = 70 as const;

/**
 * Получить правый отступ линии текущего дня
 * @param datesArray
 * @param quantum {Quantum} Режим отображения
 */
function getRightOffset(datesArray: unknown[], quantum: Quantum): number | undefined {
    const currentDate = new Date();
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
 */
function getDateTriangleComponent(
    datesArray: unknown[],
    columnWidth: number,
    spaceSize: TOffsetSize,
    quantum: Quantum
) {
    const rightOffset = getRightOffset(datesArray, quantum);
    if (rightOffset) {
        const lineStyle = {
            right: `calc((${columnWidth}px + (var(--offset_${spaceSize}) - var(--border-thickness))) * ${rightOffset}
             - var(--date-triangle_border_width))`,
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
 */
function getDateLineComponent(
    datesArray: unknown[],
    columnWidth: number,
    spaceSize: TOffsetSize,
    quantum: Quantum
) {
    const rightOffset = getRightOffset(datesArray, quantum);
    if (rightOffset) {
        const lineStyle = {
            right: `calc((${columnWidth}px + (var(--offset_${spaceSize}) - var(--border-thickness))) * ${rightOffset}`,
        };
        return (
            <div className="ControlsLists-dateLine__wrapper ControlsLists-dateLine__variables">
                <DateLine style={lineStyle} className={'ControlsLists-dateLine__height'} />
            </div>
        );
    }
}

export interface ITimelineGridConnectedComponentProps extends IDynamicGridConnectedComponentProps {
    aggregationRender?: JSX.Element;
    autoColspanHeaders?: boolean;
}

export function TimelineGridConnectedComponent(
    props: ITimelineGridConnectedComponentProps
): React.ReactElement {
    const slice = React.useContext(DataContext)[props.storeId] as unknown as TimelineGridSlice;
    const containerRef = React.useRef<HTMLDivElement>();
    const dynamicGridRef = React.useRef<DynamicGridComponent>();
    const isMountedRef = React.useRef(false);
    const dynamicColumnsGridDataRef = React.useRef(slice.dynamicColumnsGridData);

    const isAggregationVisible = React.useMemo(() => {
        return slice.aggregationVisibility === 'visible';
    }, [slice.aggregationVisibility]);

    const columnsEndedCallback = React.useCallback(Utils.getColumnsEndedCallback(slice), [slice]);

    const viewportWidth = getViewportWidth(
        props.viewportWidth,
        slice.staticColumns,
        isAggregationVisible
    );
    const quantum = getQuantum(slice.range);
    const rangeSize = getRangeSize(slice.range, quantum);
    const eventsSaturation = getEventsSaturation(slice.range);
    const columnGapSize = getColumnGapSize(props.columnsSpacing);
    const columnWidth = getDynamicColumnWidth(
        viewportWidth,
        rangeSize,
        columnGapSize,
        slice.dynamicColumn
    );
    const columnDataDensity = getDynamicColumnDataDensity(
        columnWidth,
        quantum,
        slice.dynamicColumn
    );
    const holidaysContextValue = useHolidaysContextValueProvider(slice.items, slice.holidaysConfig);

    // При смене dynamicColumnsGridData произойдет восстановление скролла.
    // Скролл поменяется только после отрисовки.
    // Чтобы не было скачка, рассчитываем разницу между предыдущим и новым dynamicColumnsGridData для корректировки видимого диапазона.
    const calcRangeCorrection = React.useCallback((oldData, newData) => {
        if (oldData === newData) {
            return 0;
        }
        if (oldData) {
            const indexOfPrevFirst = newData.findIndex((d) => {
                return datesEqualByQuantum(oldData?.[0], d as Date, quantum);
            });
            if (indexOfPrevFirst !== -1) {
                return indexOfPrevFirst;
            }
            const indexOfNewFirst = oldData.findIndex((d) => {
                return datesEqualByQuantum(newData[0], d as Date, quantum);
            });
            if (indexOfNewFirst !== -1) {
                return -indexOfNewFirst;
            }
        }
        return 0;
    }, []);
    const [rangeCorrection, setRangeCorrection] = React.useState(0);
    const resetRangeCorrection = React.useCallback(() => setRangeCorrection(0), []);

    const { visibleRange, initialColumnsPosition, onColumnsPositionChanged } =
        useColumnsScrollPositionHandler({
            columnWidth,
            columnsCount: slice.dynamicColumnsGridData.length,
            columnsSpacing: props.columnsSpacing,
            containerRef,
            visibleRangeSize: rangeSize,
            positionChangedCallback: resetRangeCorrection,
        });

    React.useEffect(() => {
        const newRange = getRangeByVisibleRange(
            visibleRange,
            slice.dynamicColumnsGridData,
            quantum
        );
        slice.setRange(newRange);
    }, [visibleRange]);

    const horizontalScrollTo = useHandler(
        dynamicGridRef.current?.horizontalScrollTo?.bind(dynamicGridRef.current)
    );
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
        dynamicColumnsGridDataRef.current = slice.dynamicColumnsGridData;
    }, [slice.dynamicColumnsGridData]);

    React.useEffect(() => {
        isMountedRef.current = true;
    }, []);

    const dynamicColumn = React.useMemo(
        () => prepareDynamicColumn(slice.dynamicColumn, columnWidth, columnDataDensity),
        [slice.dynamicColumn, columnWidth, columnDataDensity]
    );
    const dynamicHeader = React.useMemo(
        () => getPatchedDynamicHeader(slice.dynamicHeader, quantum, columnDataDensity),
        [slice.dynamicHeader, quantum, columnDataDensity]
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
            let userRowProps = {};

            if (props.getRowProps) {
                userRowProps = props.getRowProps(item);
            }

            const hoverStyle = props.hoverMode === 'filled-cross' ? 'default' : 'none';

            return {
                hoverBackgroundStyle: hoverStyle,
                borderVisibility: 'onhover',
                padding: {
                    top: '2xs',
                    bottom: '2xs',
                },
                ...userRowProps,
            };
        },
        [props.getRowProps]
    );

    const onHeaderClick = React.useCallback(
        (event: React.MouseEvent) => {
            const date = getDateByEventTarget(event.target as HTMLElement);
            goToInternalRange(slice, date);
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
        };
    }, [quantum, eventsSaturation]);

    const dynamicHeaderCellsColspanCallback = React.useCallback<
        TDynamicHeaderCellsColspanCallback<Date>
    >(props.autoColspanHeaders ? getDynamicHeaderCellsColspanCallback(columnWidth, dynamicColumn) : () => 1, [
        columnWidth,
        dynamicColumn,
        props.autoColspanHeaders
    ]);

    if (dynamicColumnsGridDataRef.current !== slice.dynamicColumnsGridData) {
        setRangeCorrection(
            calcRangeCorrection(dynamicColumnsGridDataRef.current, slice.dynamicColumnsGridData)
        );
        dynamicColumnsGridDataRef.current = slice.dynamicColumnsGridData;
    } else if (rangeCorrection !== 0) {
        setRangeCorrection(0);
    }

    return (
        <HolidaysContext.Provider value={holidaysContextValue}>
            <TimelineDataContext.Provider value={timelineDataContextValue}>
                <AggregationContextProvider
                    isShown={isAggregationVisible}
                    columnRender={props.aggregationRender}
                    range={slice.range}
                    dynamicColumnsGridData={slice.dynamicColumnsGridData}
                >
                    <div ref={containerRef} className={'tw-contents'}>
                        <DynamicGridComponent
                            {...props}
                            ref={dynamicGridRef}
                            viewMode={slice.viewMode}
                            staticColumns={slice.staticColumns}
                            endStaticColumns={aggregationColumns}
                            eventRender={props.eventRender}
                            eventsProperty={slice.eventsProperty || props.eventsProperty}
                            eventStartProperty={slice.eventStartProperty || props.eventStartProperty}
                            eventEndProperty={slice.eventEndProperty || props.eventEndProperty}
                            dynamicColumn={dynamicColumn}
                            dynamicColumnsCount={slice.dynamicColumnsGridData.length}
                            staticHeaders={slice.staticHeaders}
                            endStaticHeaders={aggregationHeaders}
                            dynamicHeader={dynamicHeader}
                            columnsEndedCallback={columnsEndedCallback}
                            dynamicColumnsGridData={slice.dynamicColumnsGridData}
                            visibleRange={visibleRange}
                            rangeCorrection={rangeCorrection}
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
                            afterItemsContent={getDateLineComponent(
                                slice.dynamicColumnsGridData,
                                columnWidth,
                                props.columnsSpacing,
                                quantum
                            )}
                            beforeItemsContent={getDateTriangleComponent(
                                slice.dynamicColumnsGridData,
                                columnWidth,
                                props.columnsSpacing,
                                quantum
                            )}
                            onPositionChanged={onColumnsPositionChanged}
                            onHeaderClick={onHeaderClick}
                            dynamicHeaderCellsColspanCallback={dynamicHeaderCellsColspanCallback}
                            hoverMode={props.hoverMode}
                        />
                    </div>
                </AggregationContextProvider>
            </TimelineDataContext.Provider>
        </HolidaysContext.Provider>
    );
}

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
        shouldReload: false,
    };
}

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

function getStaticColumnsWidth(staticColumns: IColumnConfig[]): number {
    if (!staticColumns || !staticColumns.length) {
        return 0;
    }

    return staticColumns.reduce((sumWidth, column) => {
        const width = parseInt(column.width, 10);
        return sumWidth + width;
    }, 0);
}

function getDynamicColumnWidth(
    viewportWidth: number,
    rangeSize: number,
    columnGapSize: number,
    dynamicColumn: IColumnConfig
): number {
    if (!viewportWidth) {
        return parseInt(dynamicColumn.minWidth, 10);
    }

    const availableWidth = viewportWidth - columnGapSize * (rangeSize + 1);
    return availableWidth / rangeSize;
}

function getDynamicColumnDataDensity(
    columnWidth: number,
    quantum: Quantum,
    dynamicColumn: IColumnConfig
): TColumnDataDensity {
    if (quantum !== Quantum.Day) {
        return 'default';
    }

    const minWidthForColumnWithData = parseInt(dynamicColumn.minWidth, 10);
    if (columnWidth < minWidthForColumnWithData) {
        return 'empty';
    }

    const minWidthForAdvancedData = minWidthForColumnWithData * ADVANCED_DATA_COLUMN_WIDTH_RATIO;
    if (columnWidth < minWidthForAdvancedData) {
        return 'default';
    }

    return 'advanced';
}

function getDynamicHeaderCellsColspanCallback(
    columnWidth: number,
    dynamicColumn: IColumnConfig
): TDynamicHeaderCellsColspanCallback<Date> {
    return (date) => {
        const minWidthForColumnWithData = parseInt(dynamicColumn.minWidth, 10);
        const minWidthForHeaderWithoutColspan =
            minWidthForColumnWithData * COLLAPSED_HEADER_CELLS_COLUMN_WIDTH_RATIO;
        if (columnWidth >= minWidthForHeaderWithoutColspan) {
            return 1;
        }
        // Нельзя объединять дни из разных месяцев
        if (BaseDateUtils.isEndOfMonth(date)) {
            return 1;
        }
        return 2;
    };
}

function prepareDynamicColumn(
    dynamicColumn: IColumnConfig,
    columnWidth: number,
    dataDensity: TColumnDataDensity
): IColumnConfig {
    return {
        ...dynamicColumn,
        width: `${columnWidth}px`,
        getCellProps: (item, date) => {
            const superResult = dynamicColumn?.getCellProps?.(item, date) || {};
            return {
                halign: dataDensity === 'advanced' ? 'end' : 'center',
                ...superResult,
            };
        },
    };
}

function getDateByEventTarget(target: HTMLElement): Date {
    const cellElement = target.closest(`.js-${CLASS_DYNAMIC_HEADER_CELL}`);
    if (!cellElement) {
        return null;
    }

    const dateParams = cellElement.className.match(/\d+/g);
    return new Date(Number(dateParams[2]), Number(dateParams[1]), Number(dateParams[0]));
}

function goToInternalRange(slice: TimelineGridSlice, targetDate: Date): void {
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

            if (rangeSize < daysInTwoWeeks) {
                const startDate = new Date(targetDate);
                startDate.setHours(START_DAY_HOUR);
                const endDate = new Date(targetDate);
                endDate.setHours(END_DAY_HOUR);

                slice.setRange({
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
        autoColspanHeaders: true
    },
});
