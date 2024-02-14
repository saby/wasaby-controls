import * as React from 'react';

import { debounce } from 'Types/function';

import { TOffsetSize } from 'Controls/interface';
import { IItemsRange } from 'Controls/baseList';
import { getColumnGapSize, getInitialColumnsScrollPosition } from 'Controls-Lists/dynamicGrid';

import TimelineGridSlice from './factory/Slice';
import { RecordSet } from 'Types/collection';
import { END_DAY_HOUR, START_DAY_HOUR } from 'Controls-Lists/_timelineGrid/constants';
import { Base as DateUtil } from 'Controls/dateUtils';

// FIXME: Не должно быть зашито ширины колонки под чекбокс, нужно как то переделать.
//  Опять же, контекст скролла это решает.
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
export const CHECKBOX_COLUMN_WIDTH = 20 as const;

interface IUseScrollPositionHandlerParams {
    slice: TimelineGridSlice;
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

function useColumnsScrollPositionHandler({
    slice,
    columnWidth,
    columnsCount,
    columnsSpacing,
    containerRef,
    visibleRangeSize,
    positionChangedCallback,
}: IUseScrollPositionHandlerParams): IUseScrollPositionHandlerResult {
    const isMountedRef = React.useRef(false);
    const initialColumnScrollPositionRef = React.useRef<number | undefined>();

    React.useMemo(() => {
        if (isMountedRef.current) {
            initialColumnScrollPositionRef.current = getStartRangeScrollPosition(
                slice,
                columnWidth,
                getColumnGapSize(columnsSpacing)
            );
        }
    }, [slice.viewMode]);

    React.useMemo(() => {
        initialColumnScrollPositionRef.current = getInitialColumnsScrollPosition(
            columnWidth,
            columnsCount,
            columnsSpacing
        );
    }, []);

    const scrollPositionRef = React.useRef(initialColumnScrollPositionRef.current);
    const [position, setPosition] = React.useState(initialColumnScrollPositionRef.current);
    // О нажатии мыши нужно знать, чтобы понимать, нужно ли обновлять видимый диапазон:
    // Если мышь нажата, то изменение скролла значит, что идет драг скролл, а значит обновить диапазон нужно только
    // после его окончания (mouseUp). Если мышь не нажата, то обновляем по debounce
    const mousePressedRef = React.useRef(false);

    const setPositionByMouseUpTimeoutIDRef = React.useRef<number>();

    const onPositionChangedDebounced = React.useMemo(
        () =>
            debounce((newPosition) => {
                positionChangedCallback?.();

                // Стейт позиции меняем только если не зажата кнопка мыши
                if (!mousePressedRef.current && !setPositionByMouseUpTimeoutIDRef.current) {
                    setPosition(newPosition);
                }
            }, 400),
        []
    );

    const onPositionChanged = React.useCallback((newPosition) => {
        scrollPositionRef.current = newPosition;
        onPositionChangedDebounced(newPosition);
    }, []);

    React.useEffect(() => {
        const _onMouseUp = () => {
            mousePressedRef.current = false;

            setPositionByMouseUpTimeoutIDRef.current = setTimeout(() => {
                setPosition(scrollPositionRef.current);
                setPositionByMouseUpTimeoutIDRef.current = undefined;
            }, 300);
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
        initialColumnsPosition: initialColumnScrollPositionRef.current,
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

function getStartRangeScrollPosition(
    slice: TimelineGridSlice,
    columnWidth: number,
    columnGapSize: number
): number {
    // Считаем позицию строго по данным, т.к. по ДоМ не всегда это возможно сделать:
    // 1. в заголовке есть заколспаненные ячейки
    // 2. в записях могут быть только узлы без динамических ячееек
    const columnsCountBeforeRange = slice.dynamicColumnsGridData.findIndex(
        (it) => it.getTime() === slice.range.start.getTime()
    );
    if (columnsCountBeforeRange === -1) {
        return 0;
    }

    return columnsCountBeforeRange * columnWidth + columnGapSize * columnsCountBeforeRange;
}

function getActivityScrollPosition(
    slice: TimelineGridSlice,
    columnWidth: number,
    columnGapSize: number
): number {
    const startDate = new Date(slice.range.start);
    const hours = getActivityStartHour(
        startDate,
        slice.state.items,
        slice.state.eventsProperty,
        slice.state.eventStartProperty
    );

    const columnsCountBeforeActivity = slice.dynamicColumnsGridData.findIndex(
        (it) => it.getHours() === hours
    );
    if (columnsCountBeforeActivity === -1) {
        return 0;
    }

    return columnsCountBeforeActivity * (columnWidth + columnGapSize);
}

function getActivityStartHour(
    date: Date,
    items: RecordSet,
    eventsProperty: string,
    eventStartProperty: string
) {
    let minHour = END_DAY_HOUR;

    if (eventsProperty && eventStartProperty) {
        // TODO: Нужно прервать цикл, если нашли 0. forEach этого не поддерживает.
        items.forEach((record) => {
            const eventsRS = record.get(eventsProperty) as RecordSet;
            if (eventsRS) {
                eventsRS.forEach((e) => {
                    const eStartDate = e.get(eventStartProperty) as Date;
                    if (DateUtil.isDaysEqual(date, eStartDate)) {
                        minHour = Math.min(eStartDate.getHours(), minHour);
                    }
                });
            }
        });
    }

    return minHour === END_DAY_HOUR ? START_DAY_HOUR : minHour;
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
    const hasCheckboxColumn =
        slice.multiSelectVisibility !== 'hidden' && slice.multiSelectPosition !== 'custom';

    const scrollToRangeStartUtil = () => {
        scrollTo(getStartRangeScrollPosition(slice, columnWidth, columnGapSize));
    };
    const scrollToActivityStart = () => {
        scrollTo(getActivityScrollPosition(slice, columnWidth, columnGapSize));
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
        if (slice.range.needScroll) {
            scrollToActivityStart();
        } else {
            scrollToRangeStartUtil();
        }
    }, [slice.range, columnWidth]);

    // При изменении ширины вьюпорта и смене рута нужно сохранить позицию скролла
    React.useLayoutEffect(() => {
        if (shouldNotScroll()) {
            return;
        }

        scrollToRangeStartUtil();
    }, [viewportWidth, slice.root, hasCheckboxColumn]);
}

export { useColumnsScrollPositionHandler, useScrollToRangeStart };
