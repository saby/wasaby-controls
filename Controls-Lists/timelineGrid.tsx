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
} from 'Controls-Lists/dynamicGrid';
import { DataContext } from 'Controls-DataEnv/context';
import 'css!Controls-Lists/timelineGrid';
import { IColumnConfig } from 'Controls/gridReact';
import { getDimensions } from 'Controls/sizeUtils';
import { Logger } from 'UICommon/Utils';
export {default as EventRender} from './_timelineGrid/render/Event';
import { getPatchedDynamicHeader } from 'Controls-Lists/_timelineGrid/render/Header';
import RangeSelectorConnectedComponent from 'Controls-Lists/_timelineGrid/RangeSelectorConnectedComponent';
import {
    IRange,
    ITimelineColumnsFilter,
} from 'Controls-Lists/_timelineGrid/factory/ITimelineGridFactory';
import { getRangeSize, getQuantum, Quantum } from 'Controls-Lists/_timelineGrid/utils';
import {IItemsRange} from 'Controls/baseList';
import { debounce } from 'Types/function';
import {isEqual} from 'Types/object';

export { ITimelineColumnsFilter, Quantum };
export { default as TimelineGridFactory } from 'Controls-Lists/_timelineGrid/factory/Factory';
export { RangeSelectorConnectedComponent };
import {DateTriangle} from './_timelineGrid/render/TriangleComponent';
import {DateLine} from './_timelineGrid/render/Component';
import { getPositionInPeriod } from './_dynamicGrid/render/utils';
import { TOffsetSize } from '../Controls/interface';

/**
 * Получить правый отступ линии текущего дня
 * @param datesArray
 */
function getRightOffset(datesArray: unknown[]): number | undefined {
    const currentDate = new Date();
    const index = datesArray.findIndex(
        (elem) =>
            currentDate.getDate() === elem.getDate() &&
            currentDate.getMonth() === elem.getMonth() &&
            currentDate.getFullYear() === elem.getFullYear()
    );
    if (index !== -1) {
        const positionInDay = getPositionInPeriod(currentDate, 'day');
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
 */
function getDateTriangleComponent(
    datesArray: unknown[],
    columnWidth: number,
    spaceSize: TOffsetSize
) {
    const rightOffset = getRightOffset(datesArray);
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
 */
function getDateLineComponent(datesArray: unknown[], columnWidth: number, spaceSize: TOffsetSize) {
    const rightOffset = getRightOffset(datesArray);
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

export function TimelineGridConnectedComponent(
    props: IDynamicGridConnectedComponentProps
): React.ReactElement {
    const slice = React.useContext(DataContext)[props.storeId];
    const containerRef = React.useRef<HTMLDivElement>();
    const dynamicGridRef = React.useRef<DynamicGridComponent>();
    const columnsEndedCallback = React.useCallback(Utils.getColumnsEndedCallback(slice), [slice]);
    const [position, setPosition] = React.useState({position: 0});

    // О нажатии мыши нужно знать, чтобы понимать, нужно ли обновлять видимый диапазон:
    // Если мышь нажата, то изменение скролла значит, что идет драг скролл, а значит обновить диапазон нужно только
    // после его окончания (mouseUp). Если мышь не нажата, то обновляем по debounce
    const [mousePressed, setMousePressed] = React.useState(false);
    const [viewportWidth, setViewportWidth] = React.useState(null);
    const quantum = getQuantum(slice.state.range);
    const columnWidth = getDynamicColumnWidth(viewportWidth, slice.state.range, quantum);

    const debouncedSetPosition = debounce((newPosition) => {
        setPosition({ position: newPosition });
    }, 100);

    const onPositionChanged = React.useMemo(
        () => (newPosition) => {
            position.position = newPosition;
            debouncedSetPosition(newPosition);
        },
        []
    );
    React.useEffect(() => {
        const newViewportWidth = getViewportWidth(containerRef.current, slice.staticColumns);
        if (newViewportWidth !== viewportWidth) {
            setViewportWidth(newViewportWidth);
        }
    });

    React.useEffect(() => {
        const _onMouseUp = () => {
            setMousePressed(false);
            const newRange = calcVisibleRange(viewportWidth, position.position, columnWidth, props.columnsSpacing);
            if (!isEqual(newRange, visibleRange)) {
                setVisibleRange(newRange);
            }
        };

        const _onMouseDown = () => {
            setMousePressed(true);
        };

        if (mousePressed) {
            document.addEventListener('mouseup', _onMouseUp);
        } else {
            containerRef.current.addEventListener('mousedown', _onMouseDown);
        }
        return () => {
            document.removeEventListener('mouseup', _onMouseUp);
            containerRef.current.removeEventListener('mousedown', _onMouseDown);
        };
    }, [containerRef.current, mousePressed, position]);

    React.useLayoutEffect(() => {
        scrollToRangeStart(
            slice.range,
            slice.dynamicColumnsGridData,
            containerRef.current,
            dynamicGridRef.current.horizontalScrollTo.bind(dynamicGridRef.current)
        );
    }, [slice.state.range]);

    React.useEffect(() => {
        if (!mousePressed) {
            const newRange = calcVisibleRange(viewportWidth, position.position, columnWidth, props.columnsSpacing);
            if (!isEqual(newRange, visibleRange)) {
                setVisibleRange(newRange);
            }
        }
    }, [viewportWidth, position]);

    const range = calcVisibleRange(viewportWidth, position.position, columnWidth, props.columnsSpacing);
    const [visibleRange, setVisibleRange] = React.useState(range);
    const dynamicColumn = React.useMemo(
        () => prepareDynamicColumn(slice.dynamicColumn, columnWidth),
        [slice.dynamicColumn, columnWidth]
    );
    const dynamicHeader = React.useMemo(
        () => getPatchedDynamicHeader(slice.dynamicHeader, quantum),
        [slice.dynamicHeader, quantum]
    );

    // Убираем лишний вертикальный padding между элементами
    const getRowProps = React.useCallback((item: Model): IRowProps => {
        return {
            hoverBackgroundStyle: 'none',
            padding: {
                top: null,
                bottom: null,
            },
        };
    }, []);

    return (
        <div ref={containerRef} className={'tw-contents'}>
            <DynamicGridComponent
                {...props}
                ref={dynamicGridRef}
                parentProperty={slice.parentProperty}
                nodeProperty={slice.nodeProperty}
                staticColumns={slice.staticColumns}
                eventsConfig={slice.eventsConfig}
                dynamicColumn={dynamicColumn}
                dynamicColumnsCount={slice.dynamicColumnsGridData.length}
                staticHeaders={slice.staticHeaders}
                dynamicHeader={dynamicHeader}
                columnsEndedCallback={columnsEndedCallback}
                dynamicColumnsGridData={slice.dynamicColumnsGridData}
                visibleRange={visibleRange}
                columnsDataVersion={slice.columnsDataVersion}
                multiSelectVisibility={slice.multiSelectVisibility}
                getRowProps={getRowProps}
                quantum={quantum}
                afterItemsContent={getDateLineComponent(
                    slice.dynamicColumnsGridData,
                    columnWidth,
                    props.itemsSpacing
                )}
                beforeItemsContent={getDateTriangleComponent(
                    slice.dynamicColumnsGridData,
                    columnWidth,
                    props.itemsSpacing
                )}
                onPositionChanged={onPositionChanged}
            />
        </div>
    );
}

const GAP = {
    null: 0,
    '3xs': 2,
    '2xs': 4,
    xs: 6,
    s: 8,
    m: 12,
    l: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 28
};
// Считаем видимый диапазон по позиции скролла, шинине вьюпорта и ширине колонки.
// По этому диапазону будет определяться видимая часть событий на таймлайне.
function calcVisibleRange(
    viewportWidth: number,
    scrollPosition: number,
    columnWidth: number,
    columnsSpacing: TOffsetSize): IItemsRange {
    const firstVisibleIndex = Math.round(scrollPosition / (columnWidth + GAP[columnsSpacing]));
    const lastVisibleIndex = Math.round((scrollPosition + viewportWidth) / (columnWidth + GAP[columnsSpacing]));
    return { startIndex: firstVisibleIndex, endIndex: lastVisibleIndex - 1};
}

function getViewportWidth(
    container: HTMLDivElement,
    staticColumns: IColumnConfig[]
): number | null {
    if (!container) {
        return null;
    }

    const staticColumnsWidth = getStaticColumnsWidth(staticColumns);
    const viewportWidth = getDimensions(container).width;
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

function getDynamicColumnWidth(viewportWidth: number, range: IRange, quantum: Quantum): number {
    const minWidth = 30;
    if (!viewportWidth) {
        return minWidth;
    }

    const rangeSize = getRangeSize(range, quantum);
    return Math.max(minWidth, Math.trunc(viewportWidth / rangeSize));
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
    const startRangeColumnIndex = dynamicColumnsGridData.findIndex(
        (it) => it.getTime() === range.start.getTime()
    );
    if (startRangeColumnIndex === -1) {
        Logger.error('Can\'t scroll to range start');
        return;
    }
    const dynamicColumnsElement = container.querySelector(
        '.js-ControlsLists-dynamicGrid__dynamicCellsWrapper'
    );
    const dynamicCells = Array.from(
        dynamicColumnsElement.querySelectorAll('.js-controls-Grid__row-cell')
    );
    const cellToScroll = dynamicCells[startRangeColumnIndex] as HTMLElement;
    horizontalScrollTo(cellToScroll.offsetLeft);
}

Object.assign(TimelineGridConnectedComponent, {
    defaultProps: {
        columnsSpacing: '2xs',
        itemsSpacing: '2xs',
    },
});
