/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import * as React from 'react';
import InertialScrolling from 'Controls/Utils/InertialScrolling';

const INERTIAL_SCROLLING_CHECK_TIMEOUT = 200;
const COMPLETELY_STOP_SCROLLING_CHECK_TIMEOUT = 800;

export interface IScrollEventsManagerContentProps {
    onTouchStart?: () => void;
    onTouchEnd?: () => void;
    onScroll?: (e: React.UIEvent) => void;
}

export interface IScrollEventsManagerProps {
    onScrollStarted?: () => void;
    onScroll?: (scrollPosition: number) => void;
    onScrollStopped?: () => void;
    children?: JSX.Element;
}

function clearDelayedStopScrollingNotifyTimeout(ref: React.MutableRefObject<number>): void {
    if (ref.current) {
        clearTimeout(ref.current);
        ref.current = undefined;
    }
}

export function ScrollEventsManager(
    props: IScrollEventsManagerProps
): React.FunctionComponentElement<IScrollEventsManagerProps> {
    const inertialScrolling = React.useMemo(
        () => new InertialScrolling(INERTIAL_SCROLLING_CHECK_TIMEOUT),
        []
    );

    // Реф для завершения инерционного скролирования.
    // Инерционное скролирование обрабатывается через чистый асинхронный контроллер.
    // При старте редактирования нужно позвать метод с актуальным состоянием, оно хранится в рефе.
    const isTouchedRef = React.useRef(false);
    const isScrollingRef = React.useRef(false);

    const stopTimeoutIdRef = React.useRef<number>(undefined);

    const initDelayedStopScrollingNotify = React.useCallback(() => {
        clearDelayedStopScrollingNotifyTimeout(stopTimeoutIdRef);

        stopTimeoutIdRef.current = setTimeout(() => {
            props.onScrollStopped?.();
            stopTimeoutIdRef.current = undefined;
        }, COMPLETELY_STOP_SCROLLING_CHECK_TIMEOUT);
    }, [props.onScrollStopped]);

    const stopScrollingByScroll = React.useCallback(() => {
        // При завершении инерции сбрасываем состояние, что сейчас происходит скроллинг,
        // но не нотифицируем об этом до тех пор, пока не отпустят палец.
        // initDelayedStopScrollingNotify вызывается из onTouchEnd по зеркальному условию.
        isScrollingRef.current = false;
        if (!isTouchedRef.current) {
            initDelayedStopScrollingNotify();
        }
    }, [initDelayedStopScrollingNotify]);

    const onTouchStart = React.useCallback(() => {
        // Запоминаем состояние тача.
        // Тач и скролл разные вещи, тач не означает что был или будет скролл.
        isTouchedRef.current = true;
    }, []);

    const onScroll = React.useCallback(
        (e: React.UIEvent) => {
            // Срабатывает всегда после тача (isTouchedRef.current === true), даже
            // при повторном подскроле во время инерции.
            // Соответственное, отличить первый скролл можем по инерции.
            // Если ее нет, то это первый. Запоминаем необходимые состояния и
            // включаем отслеживание инерции.
            // На завершение инерции повесим колбек stopScrollingByScroll.
            const isFirstMoveOfScroll = !inertialScrolling.getScrollStopPromise();
            inertialScrolling.scrollStarted();

            if (isFirstMoveOfScroll) {
                isScrollingRef.current = true;
                clearDelayedStopScrollingNotifyTimeout(stopTimeoutIdRef);
                props.onScrollStarted?.();

                (inertialScrolling.getScrollStopPromise() as Promise<void>).then(() => {
                    stopScrollingByScroll();
                });
            }

            props.onScroll?.((e.target as HTMLDivElement).scrollLeft);
        },
        [props.onScrollStarted, stopScrollingByScroll, props.onScroll]
    );

    const onTouchEnd = React.useCallback(() => {
        // Сбрасываем состояние тача и если не продолжается инерция, то инициируем
        // отложенное завершение скролла.
        isTouchedRef.current = false;
        if (!isScrollingRef.current) {
            initDelayedStopScrollingNotify();
        }
    }, [initDelayedStopScrollingNotify]);

    return React.cloneElement(props.children, {
        onTouchStart,
        onScroll,
        onTouchEnd,
    });
}

export default React.memo(ScrollEventsManager);
