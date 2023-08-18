import * as React from 'react';

import { debounce } from 'Types/function';

import { TOffsetSize } from 'Controls/interface';
import { IItemsRange } from 'Controls/baseList';
import { getColumnGapSize, getInitialColumnsScrollPosition } from 'Controls-Lists/dynamicGrid';

import TimelineGridSlice from './factory/Slice';

interface IUseScrollPositionHandlerParams {
    columnWidth: number;
    columnsCount: number;
    columnsSpacing: TOffsetSize;
    containerRef: React.MutableRefObject<HTMLDivElement>;
    positionChangedCallback: () => void;
    visibleRangeSize: number;
}

interface IUseScrollPositionHandlerResult {
    columnsPosition: number;
    initialColumnsPosition: number;
    onColumnsPositionChanged: (position: number) => void;
    visibleRange: IItemsRange;
}

function useColumnsScrollPositionHandler({
    columnWidth,
    columnsCount,
    columnsSpacing,
    containerRef,
    visibleRangeSize,
    positionChangedCallback,
}: IUseScrollPositionHandlerParams): IUseScrollPositionHandlerResult {
    const initialColumnScrollPosition = React.useMemo(
        () => getInitialColumnsScrollPosition(columnWidth, columnsCount, columnsSpacing),
        []
    );
    const scrollPositionRef = React.useRef(initialColumnScrollPosition);
    const [position, setPosition] = React.useState(initialColumnScrollPosition);
    // О нажатии мыши нужно знать, чтобы понимать, нужно ли обновлять видимый диапазон:
    // Если мышь нажата, то изменение скролла значит, что идет драг скролл, а значит обновить диапазон нужно только
    // после его окончания (mouseUp). Если мышь не нажата, то обновляем по debounce
    const mousePressedRef = React.useRef(false);

    const onPositionChanged = React.useMemo(() => {
        return debounce((newPosition) => {
            scrollPositionRef.current = newPosition;
            positionChangedCallback();

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

    // Ширина колонки зависит от ширины вьюпорта и размера выбранного диапазона.
    // 1. Если изменилась ширина вьюпорта, то пересчитывать не нужно, т.к. позиция скролла будет не актуальна.
    //    Нам нужно будет восстановить скролл и по изменению позиции скролла visibleRange пересчитается.
    // 2. Если изменился выбранный диапазон, то ширина колонки будет меняться только от rangeSize
    //    и visibleRange мы пересчитаем тоже по rangeSize.
    const visibleRange = React.useMemo(() => {
        return calcVisibleRange(position, columnWidth, columnsSpacing, visibleRangeSize);
    }, [position, columnsSpacing, visibleRangeSize]);

    return {
        columnsPosition: position,
        onColumnsPositionChanged: onPositionChanged,
        initialColumnsPosition: initialColumnScrollPosition,
        visibleRange,
    };
}

// Считаем видимый диапазон по позиции скролла, шинине вьюпорта и ширине колонки.
// По этому диапазону будет определяться видимая часть событий на таймлайне.
function calcVisibleRange(
    scrollPosition: number,
    columnWidth: number,
    columnsSpacing: TOffsetSize,
    rangeSize: number
): IItemsRange {
    const firstVisibleIndex = Math.ceil(
        scrollPosition / (columnWidth + getColumnGapSize(columnsSpacing))
    );
    return {
        startIndex: firstVisibleIndex,
        endIndex: firstVisibleIndex + rangeSize - 1,
    };
}

function useScrollToRangeStart(
    slice: TimelineGridSlice,
    container: HTMLDivElement,
    scrollTo: (position: number) => void,
    isMounted: boolean,
    viewportWidth: number,
    columnWidth: number,
    columnGapSize: number
): void {
    const scrollToRangeStartUtil = () => {
        // Считаем позицию строго по данным, т.к. по ДоМ не всегда это возможно сделать:
        // 1. в заголовке есть заколспаненные ячейки
        // 2. в записях могут быть только узлы без динамических ячееек
        const columnsCountBeforeRange = slice.dynamicColumnsGridData.findIndex(
            (it) => it.getTime() === slice.range.start.getTime()
        );
        if (columnsCountBeforeRange === -1) {
            return;
        }

        const position =
            columnsCountBeforeRange * columnWidth + columnGapSize * columnsCountBeforeRange;
        scrollTo(position);
    };
    const shouldNotScroll = () => {
        // при маунт не скроллим, т.к. это будет неправильный и лишний скролл
        return !slice.items?.getCount() || !isMounted;
    };

    // При изменении отображаемого диапазона нужно проскроллить к началу нового диапазона
    React.useLayoutEffect(() => {
        // Если смена диапазона не вызывает перезагрузку, то и скроллить к началу диапазона не нужно
        if (shouldNotScroll() || slice.range.shouldReload === false) {
            return;
        }

        scrollToRangeStartUtil();
    }, [slice.range]);

    // При изменении ширины вьюпорта и смене рута нужно сохранить позицию скролла
    React.useLayoutEffect(() => {
        if (shouldNotScroll()) {
            return;
        }

        scrollToRangeStartUtil();
    }, [viewportWidth, slice.root]);
}

export { useColumnsScrollPositionHandler, useScrollToRangeStart };
