/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as React from 'react';

import { debounceCancellable } from 'Types/function';

import { TOffsetSize } from 'Controls/interface';
import { IItemsRange } from 'Controls/baseList';
import { getColumnGapSize } from 'Controls-Lists/dynamicGrid';

import TimelineGridSlice from './factory/Slice';

// FIXME: Не должно быть зашито ширины колонки под чекбокс, нужно как то переделать.
//  Опять же, контекст скролла это решает.
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
export const CHECKBOX_COLUMN_WIDTH = 20 as const;

interface IUseScrollPositionHandlerParams {
    slice: TimelineGridSlice;
    dynamicColumnsGridData: Date[];
    columnWidth: number;
    columnsCount: number;
    columnsSpacing: TOffsetSize;
    containerRef: React.MutableRefObject<HTMLDivElement>;
    positionChangedCallback?: () => void;
    visibleRangeSize: number;
}

interface IUseScrollPositionHandlerResult {
    columnsPosition: number;
    initialColumnsPosition: number;
    onColumnsPositionChanged: (position: number) => void;
    visibleRange: IItemsRange;
}

/**
 * Хук, содержащий логику работы с горизонтальным скроллом в таймлайн таблице
 * Возвращает позицию горизонтального скролла, начальную позицию скролла, обработчик смены позиции, видимый диапазон.
 */
function useColumnsScrollPositionHandler({
    slice,
    dynamicColumnsGridData,
    columnWidth,
    columnsSpacing,
    containerRef,
    visibleRangeSize,
    positionChangedCallback,
}: IUseScrollPositionHandlerParams): IUseScrollPositionHandlerResult {
    const isMountedRef = React.useRef(false);
    const scrollPositionOnCancel = React.useRef({});

    const initialScrollPosition = React.useMemo(() => {
        return getStartRangeScrollPosition(
            slice,
            dynamicColumnsGridData,
            columnWidth,
            getColumnGapSize(columnsSpacing)
        );
    }, [slice.viewMode]);

    const scrollPositionRef = React.useRef(initialScrollPosition);
    const [position, setPosition] = React.useState(initialScrollPosition);
    // О нажатии мыши нужно знать, чтобы понимать, нужно ли обновлять видимый диапазон:
    // Если мышь нажата, то изменение скролла значит, что идет драг скролл, а значит обновить диапазон нужно только
    // после его окончания (mouseUp). Если мышь не нажата, то обновляем по debounce
    const mousePressedRef = React.useRef(false);
    const scrollPositionIsChangedRef = React.useRef(false);
    const setPositionByMouseUpTimeoutIDRef = React.useRef<number>();

    const onPositionChangedDebounced = React.useMemo(
        () =>
            debounceCancellable((newPosition) => {
                positionChangedCallback?.();

                // Стейт позиции меняем только если не зажата кнопка мыши
                if (!mousePressedRef.current && !setPositionByMouseUpTimeoutIDRef.current) {
                    setPosition(newPosition);
                    scrollPositionIsChangedRef.current = false;
                }
            }, 50),
        []
    );

    const onPositionChanged = React.useCallback((newPosition) => {
        scrollPositionRef.current = newPosition;
        scrollPositionIsChangedRef.current = true;
        if (mousePressedRef.current) {
            if (slice.state.sourceController.isLoading()) {
                scrollPositionOnCancel.current = calcVisibleRange(
                    newPosition,
                    columnWidth,
                    columnsSpacing,
                    visibleRangeSize
                );

                // Если потащили скролл, отменяем загрузку, иначе перезагрузка приведет к отскоку.
                slice.state.sourceController.cancelLoading();
            }

            slice.setCanLoadColumns(false);
        }
        onPositionChangedDebounced.run(newPosition);
    }, []);

    React.useEffect(() => {
        const _onMouseUp = () => {
            mousePressedRef.current = false;
            if (!scrollPositionIsChangedRef.current) {
                return;
            }
            slice.setCanLoadColumns(true);
            // Если мы отменили загрузку и позиция скролла не поменялась,
            // то перезагрузка не начнется: вызываем сами.
            const curRange = calcVisibleRange(
                scrollPositionRef.current,
                columnWidth,
                columnsSpacing,
                visibleRangeSize
            );
            if (
                scrollPositionOnCancel.current.startIndex === curRange.startIndex &&
                scrollPositionOnCancel.current.endIndex === curRange.endIndex
            ) {
                slice.reload();
                scrollPositionOnCancel.current = { startIndex: -1, endIndex: -1 };
            }
            onPositionChangedDebounced.cancel();
            setPosition(scrollPositionRef.current);
            setPositionByMouseUpTimeoutIDRef.current = undefined;
        };

        const _onMouseDown = () => {
            mousePressedRef.current = true;

            if (setPositionByMouseUpTimeoutIDRef.current) {
                clearTimeout(setPositionByMouseUpTimeoutIDRef.current);
                setPositionByMouseUpTimeoutIDRef.current = undefined;
            }
        };

        document.addEventListener('mouseup', _onMouseUp);

        const container = containerRef.current;
        container.addEventListener('mousedown', _onMouseDown);

        return () => {
            document.removeEventListener('mouseup', _onMouseUp);
            container.removeEventListener('mousedown', _onMouseDown);
        };
    }, [containerRef.current]);

    // Ширина колонки зависит от ширины вьюпорта и размера выбранного диапазона.
    // 1. Если изменилась ширина вьюпорта, то пересчитывать не нужно, т.к. позиция скролла будет не актуальна.
    //    Нам нужно будет восстановить скролл и по изменению позиции скролла visibleRange пересчитается.
    // 2. Также при изменении диапазона и/или вьюпорта может также поменяться ширина колонки.
    //    В этом случае тоже позиция скролла будет не актуально и будет восстановление.
    const visibleRange = React.useMemo(() => {
        return calcVisibleRange(position, columnWidth, columnsSpacing, visibleRangeSize);
    }, [position, columnsSpacing]);

    React.useLayoutEffect(() => {
        isMountedRef.current = true;
    }, []);

    return {
        columnsPosition: position,
        onColumnsPositionChanged: onPositionChanged,
        initialColumnsPosition: initialScrollPosition,
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
    // FIXME 1: Чушь какая то, постоянно считать эти гэпы, писать утилиты, есть
    //  таргеты автоподскролла, хоть их заюзать.
    // Весь механизм скроллирования в таймлайне это один большой прикладной костыль над
    // платформенным скроллом.
    // Это всё должно решаться либо на стороне самого скролла событиями scrollSessionStart/End (не все проблемы
    // решает, но многие), либо доработкой, чтобы можно было проксировать контекст, определяя его выше базового,
    // над динамиком.
    // FIXME 2: Через N мест внедрений(<5), рэйнж понадобится в динамике.
    // FIXME 3: Позиция скролла это всегда целое число, ширина колонки, а тем более с учетом гэпа
    //  это дробь. В результате деления, ожидаемо появляется дробный остаток,
    //  либо нехватает немного до целого(торчит граница).
    //  Кроме как округлить round'ом, ничего не остается.
    const fullScrolledCount = Math.round(
        scrollPosition / (columnWidth + getColumnGapSize(columnsSpacing))
    );
    return {
        // Индекс первой видимой = Количество скрытых до, т.к. индекс с нуля.
        startIndex: fullScrolledCount,
        endIndex: fullScrolledCount + rangeSize - 1,
    };
}

// Метод вычисляет позицию для подскролла к началу отображаемого диапазона
function getStartRangeScrollPosition(
    slice: TimelineGridSlice,
    dynamicColumnsGridData: Date[],
    columnWidth: number,
    columnGapSize: number
): number {
    // Считаем позицию строго по данным, т.к. по ДоМ не всегда это возможно сделать:
    // 1. в заголовке есть заколспаненные ячейки
    // 2. в записях могут быть только узлы без динамических ячееек
    const columnsCountBeforeRange = dynamicColumnsGridData.findIndex(
        (it) => it.getTime() >= slice.range.start.getTime()
    );
    if (columnsCountBeforeRange === -1) {
        return 0;
    }

    return columnsCountBeforeRange * columnWidth + columnGapSize * columnsCountBeforeRange;
}

/**
 * Хук, реализующий логику восстановления скролла при смене диапазона в таймлайне
 */
function useScrollToRangeStart(
    slice: TimelineGridSlice,
    dynamicColumnsGridData: Date[],
    container: HTMLDivElement,
    scrollTo: (position: number) => void,
    isMounted: boolean,
    viewportWidth: number,
    columnWidth: number,
    columnGapSize: number
): void {
    const loadedRange = slice.getLoadedRange();
    const hasCheckboxColumn =
        slice.multiSelectVisibility !== 'hidden' && slice.multiSelectPosition !== 'custom';

    const scrollToRangeStartUtil = () => {
        scrollTo(
            getStartRangeScrollPosition(slice, dynamicColumnsGridData, columnWidth, columnGapSize)
        );
    };
    const shouldNotScroll = () => {
        // при маунт не скроллим, т.к. это будет неправильный и лишний скролл
        return !slice.items || !isMounted;
    };

    // При изменении отображаемого диапазона нужно проскроллить к началу нового диапазона или к началу активности
    React.useLayoutEffect(() => {
        // Если смена диапазона не вызывает перезагрузку, то и скроллить к началу диапазона не нужно
        if (shouldNotScroll()) {
            return;
        }
        scrollToRangeStartUtil();
    }, [loadedRange, columnWidth, viewportWidth, slice.root, hasCheckboxColumn, slice]);
}

export { useColumnsScrollPositionHandler, useScrollToRangeStart };
