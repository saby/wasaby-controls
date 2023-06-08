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
    GAP_SIZES_MAP,
    getInitialColumnsScrollPosition,
    getPositionInPeriod,
    TDynamicHeaderCellsColspanCallback,
    TColumnDataDensity,
    getHeaderCellUniqueClass,
    CLASS_DYNAMIC_HEADER_CELL,
} from 'Controls-Lists/dynamicGrid';
import { DataContext } from 'Controls-DataEnv/context';
import 'css!Controls-Lists/timelineGrid';
import { IColumnConfig } from 'Controls/gridReact';
import { Logger } from 'UICommon/Utils';

export { default as EventRender } from './_timelineGrid/render/EventBlockRender';
export { default as EventBlockRender } from './_timelineGrid/render/EventBlockRender';
export { default as EventLineRender } from './_timelineGrid/render/EventLineRender';
import {
    getPatchedDynamicHeader,
    TIsHolidayCallback,
    IHolidayData
} from 'Controls-Lists/_timelineGrid/render/Header';
import RangeSelectorConnectedComponent from 'Controls-Lists/_timelineGrid/RangeSelectorConnectedComponent';
import {
    IRange,
    ITimelineColumnsFilter,
} from 'Controls-Lists/_timelineGrid/factory/ITimelineGridFactory';
import { getRangeSize, getQuantum, Quantum } from 'Controls-Lists/_timelineGrid/utils';
import { IItemsRange } from 'Controls/baseList';
import { debounce } from 'Types/function';
import { Base as BaseDateUtils } from 'Controls/dateUtils';

export { ITimelineColumnsFilter, Quantum, IHolidayData };
export { default as TimelineGridFactory } from 'Controls-Lists/_timelineGrid/factory/Factory';
export { RangeSelectorConnectedComponent };
import { DateTriangle } from 'Controls-Lists/_timelineGrid/render/DateTriangle';
import { DateLine } from 'Controls-Lists/_timelineGrid/render/DateLine';
import TimelineGridSlice from 'Controls-Lists/_timelineGrid/factory/Slice';
import {
    ADVANCED_DATA_COLUMN_WIDTH_RATIO,
    END_DAY_HOUR,
    START_DAY_HOUR,
} from 'Controls-Lists/_timelineGrid/constants';
import { datesEqualByQuantum, TQuantumType } from './_dynamicGrid/render/utils';

/**
 * Получить правый отступ линии текущего дня
 * @param datesArray
 * @param quantum {Quantum} Режим отображения
 */
function getRightOffset(datesArray: unknown[], quantum: Quantum): number | undefined {
    const currentDate = new Date();
    const index = datesArray.findIndex(
        (elem) =>
            (quantum !== 'hour' || currentDate.getHours() === elem.getHours()) &&
            (quantum !== 'day' || currentDate.getDate() === elem.getDate()) &&
            currentDate.getMonth() === elem.getMonth() &&
            currentDate.getFullYear() === elem.getFullYear()
    );
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
            right: `calc((${columnWidth}px + var(--grid_gap_offset_${spaceSize})) * ${rightOffset}
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
            right: `calc((${columnWidth}px + var(--grid_gap_offset_${spaceSize})) * ${rightOffset}`,
        };
        return (
            <div className="ControlsLists-dateLine__wrapper ControlsLists-dateLine__variables">
                <DateLine style={lineStyle} className={'ControlsLists-dateLine__height'} />
            </div>
        );
    }
}

export interface ITimelineGridConnectedComponentProps extends IDynamicGridConnectedComponentProps {
    isHolidayCallback: TIsHolidayCallback;
}

export function TimelineGridConnectedComponent(
    props: ITimelineGridConnectedComponentProps
): React.ReactElement {
    const slice = React.useContext(DataContext)[props.storeId] as unknown as TimelineGridSlice;
    const containerRef = React.useRef<HTMLDivElement>();
    const dynamicGridRef = React.useRef<DynamicGridComponent>();
    const scrollPositionRef = React.useRef(0);

    // Храним range, чтобы отличать обновление диапазона сверху - тогда надо делать подскролл.
    const rangeRef = React.useRef(slice.range);

    // О нажатии мыши нужно знать, чтобы понимать, нужно ли обновлять видимый диапазон:
    // Если мышь нажата, то изменение скролла значит, что идет драг скролл, а значит обновить диапазон нужно только
    // после его окончания (mouseUp). Если мышь не нажата, то обновляем по debounce
    const mousePressedRef = React.useRef(false);
    const firstUpdate = React.useRef(true);
    const dynamicColumnsGridDataRef = React.useRef(slice.dynamicColumnsGridData);

    const columnsEndedCallback = React.useCallback(Utils.getColumnsEndedCallback(slice), [slice]);

    const viewportWidth = getViewportWidth(props.viewportWidth, slice.staticColumns);
    const quantum = getQuantum(slice.range);
    const rangeSize = getRangeSize(slice.range, quantum);
    const columnWidth = getDynamicColumnWidth(
        viewportWidth,
        rangeSize,
        props.columnsSpacing,
        slice.dynamicColumn
    );
    const columnDataDensity = getDynamicColumnDataDensity(
        columnWidth,
        quantum,
        slice.dynamicColumn
    );

    // При смене dynamicColumnsGridData произойдет восстановление скролла.
    // Скролл поменяется только после отрисовки.
    // Чтобы не было скачка, рассчитываем разницу между предыдущим и новым dynamicColumnsGridData для корректировки видимого диапазона.
    const rangeCorrection = React.useMemo(() => {
        if (dynamicColumnsGridDataRef.current === slice.dynamicColumnsGridData) {
            return 0;
        }
        if (dynamicColumnsGridDataRef.current) {
            const indexOfPrevFirst = slice.dynamicColumnsGridData.findIndex((d) => {
                return datesEqualByQuantum(
                    dynamicColumnsGridDataRef.current?.[0],
                    d as Date,
                    quantum
                );
            });
            if (indexOfPrevFirst !== -1) {
                return indexOfPrevFirst;
            }
            const indexOfNewFirst = dynamicColumnsGridDataRef.current.findIndex((d) => {
                return datesEqualByQuantum(slice.dynamicColumnsGridData[0], d as Date, quantum);
            });
            if (indexOfNewFirst !== -1) {
                return -indexOfNewFirst;
            }
        }
        return 0;
    }, [dynamicColumnsGridDataRef.current, slice.dynamicColumnsGridData]);

    const initialColumnScrollPosition = React.useMemo(
        () =>
            getInitialColumnsScrollPosition(
                columnWidth,
                slice.dynamicColumnsGridData.length,
                props.columnsSpacing
            ),
        []
    );

    const [position, setPosition] = React.useState(initialColumnScrollPosition);

    const visibleRange = React.useMemo(() => {
        return calcVisibleRange(position, columnWidth, props.columnsSpacing, rangeSize);
    }, [viewportWidth, position, columnWidth, props.columnsSpacing, rangeSize]);

    React.useEffect(() => {
        const newRange = getRangeByVisibleRange(
            visibleRange,
            slice.dynamicColumnsGridData,
            quantum
        );
        rangeRef.current = newRange;
        slice.setRange(newRange);
    }, [visibleRange]);

    const onPositionChanged = React.useMemo(() => {
        return debounce((newPosition) => {
            scrollPositionRef.current = newPosition;

            // Стейт позиции меняем только если не зажата кнопка мыши
            if (!mousePressedRef.current) {
                setPosition(newPosition);
            }
        }, 100);
    }, []);

    React.useEffect(() => {
        const _onMouseUp = () => {
            mousePressedRef.current = false;
            setPosition(scrollPositionRef.current);
        };

        const _onMouseDown = () => {
            mousePressedRef.current = true;
        };

        document.addEventListener('mouseup', _onMouseUp);
        containerRef.current.addEventListener('mousedown', _onMouseDown);
        return () => {
            document.removeEventListener('mouseup', _onMouseUp);
            containerRef.current.removeEventListener('mousedown', _onMouseDown);
        };
    }, [containerRef.current]);

    React.useLayoutEffect(() => {
        // при маунт не скроллим, т.к. это будет неправильный и лишний скролл
        if (!slice.items || !slice.items.getCount() || firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        if (slice.range !== rangeRef.current) {
            scrollToRangeStart(
                slice.range,
                slice.dynamicColumnsGridData,
                containerRef.current,
                dynamicGridRef.current.horizontalScrollTo.bind(dynamicGridRef.current)
            );
        }
    }, [slice.range]);

    React.useEffect(() => {
        dynamicColumnsGridDataRef.current = slice.dynamicColumnsGridData;
    }, [slice.dynamicColumnsGridData]);

    const dynamicColumn = React.useMemo(
        () => prepareDynamicColumn(slice.dynamicColumn, columnWidth),
        [slice.dynamicColumn, columnWidth]
    );
    const dynamicHeader = React.useMemo(
        () =>
            getPatchedDynamicHeader(
                slice.dynamicHeader,
                quantum,
                props.isHolidayCallback,
                columnDataDensity
            ),
        [slice.dynamicHeader, quantum, props.isHolidayCallback, columnDataDensity]
    );

    const getRowProps = React.useCallback((item: Model): IRowProps => {
        return {
            hoverBackgroundStyle: 'none',
        };
    }, []);

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

    const dynamicHeaderCellsColspanCallback = React.useCallback<
        TDynamicHeaderCellsColspanCallback<Date>
    >(getDynamicHeaderCellsColspanCallback(columnDataDensity, visibleRange), [
        columnDataDensity,
        visibleRange,
    ]);

    return (
        <div ref={containerRef} className={'tw-contents'}>
            <DynamicGridComponent
                {...props}
                ref={dynamicGridRef}
                parentProperty={slice.parentProperty}
                nodeProperty={slice.nodeProperty}
                staticColumns={slice.staticColumns}
                eventRender={slice.eventRender}
                eventsProperty={slice.eventsProperty}
                eventStartProperty={slice.eventStartProperty}
                eventEndProperty={slice.eventEndProperty}
                dynamicColumn={dynamicColumn}
                dynamicColumnsCount={slice.dynamicColumnsGridData.length}
                staticHeaders={slice.staticHeaders}
                dynamicHeader={dynamicHeader}
                columnsEndedCallback={columnsEndedCallback}
                dynamicColumnsGridData={slice.dynamicColumnsGridData}
                visibleRange={visibleRange}
                rangeCorrection={rangeCorrection}
                initialColumnScrollPosition={initialColumnScrollPosition}
                columnsDataVersion={slice.columnsDataVersion}
                multiSelectVisibility={slice.multiSelectVisibility}
                getRowProps={getRowProps}
                quantum={quantum}
                columnDataDensity={columnDataDensity}
                selectedCells={slice.selectedCells}
                onSelectedCellsChanged={onSelectedCellsChanged}
                afterItemsContent={getDateLineComponent(
                    slice.dynamicColumnsGridData,
                    columnWidth,
                    props.itemsSpacing,
                    quantum
                )}
                beforeItemsContent={getDateTriangleComponent(
                    slice.dynamicColumnsGridData,
                    columnWidth,
                    props.itemsSpacing,
                    quantum
                )}
                onPositionChanged={onPositionChanged}
                onHeaderClick={onHeaderClick}
                dynamicHeaderCellsColspanCallback={dynamicHeaderCellsColspanCallback}
            />
        </div>
    );
}

// Считаем видимый диапазон по позиции скролла, шинине вьюпорта и ширине колонки.
// По этому диапазону будет определяться видимая часть событий на таймлайне.
function calcVisibleRange(
    scrollPosition: number,
    columnWidth: number,
    columnsSpacing: TOffsetSize,
    rangeSize: number
): IItemsRange {
    const firstVisibleIndex = Math.round(
        scrollPosition / (columnWidth + GAP_SIZES_MAP[columnsSpacing])
    );
    return {
        startIndex: firstVisibleIndex,
        endIndex: firstVisibleIndex + rangeSize - 1,
    };
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

function getViewportWidth(viewportWidth: number, staticColumns: IColumnConfig[]): number | null {
    if (!viewportWidth) {
        Logger.error(
            'Should set viewportWidth. Pass workspaceWidth into it https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/workspace-config/'
        );
        return null;
    }

    const staticColumnsWidth = getStaticColumnsWidth(staticColumns);
    return viewportWidth - staticColumnsWidth;
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
    columnsSpacing: TOffsetSize,
    dynamicColumn: IColumnConfig
): number {
    if (!viewportWidth) {
        return parseInt(dynamicColumn.minWidth, 10);
    }

    const gapSize = GAP_SIZES_MAP[columnsSpacing];
    const availableWidth = viewportWidth - gapSize * (rangeSize - 1);
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
    columnDataDensity: TColumnDataDensity,
    visibleRange: IItemsRange
): TDynamicHeaderCellsColspanCallback<Date> {
    return (date, index) => {
        if (columnDataDensity !== 'empty') {
            return 1;
        }
        // Нельзя объединять дни из разных месяцев
        if (BaseDateUtils.isEndOfMonth(date)) {
            return 1;
        }
        // Если следующая ячейка начало видимого диапазона, то не нужно с ней объединяться.
        // Она должна стать началом колспана, чтобы часть ячейки не обрубалась вьюпортом
        if (index + 1 === visibleRange.startIndex) {
            return 1;
        }
        // Чтобы часть ячейки не уходила за пределы вьюпорта
        if (index === visibleRange.endIndex) {
            return 1;
        }
        return 2;
    };
}

function prepareDynamicColumn(dynamicColumn: IColumnConfig, columnWidth: number): IColumnConfig {
    return {
        ...dynamicColumn,
        width: `${columnWidth}px`,
    };
}

function scrollToRangeStart(
    range: IRange,
    dynamicColumnsGridData: Date[],
    container: HTMLDivElement,
    horizontalScrollTo: (position: number) => void
): void {
    const dynamicColumnsElement = container.querySelector(
        '.js-ControlsLists-dynamicGrid__dynamicCellsWrapper'
    );
    const uniqueClassName = getHeaderCellUniqueClass(range.start);
    const cellToScroll = dynamicColumnsElement.querySelector(`.${uniqueClassName}`) as HTMLElement;
    if (!cellToScroll) {
        Logger.error("Can't scroll to range start");
        return;
    }

    horizontalScrollTo(cellToScroll.offsetLeft);
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
        itemsSpacing: 'timeline_s',
        itemsSpacingVisibility: 'all',
    },
});
