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
    content: React.FunctionComponent<IScrollEventsManagerContentProps>;
}

function clearDelayedStopScrollingNotifyTimeout(
    ref: React.MutableRefObject<number>
): void {
    if (ref.current) {
        clearTimeout(ref.current);
        ref.current = undefined;
    }
}

export function ScrollEventsManager(
    props: IScrollEventsManagerProps
): React.FunctionComponentElement<IScrollEventsManagerProps> {
    const [inertialScrolling] = React.useState(
        new InertialScrolling(INERTIAL_SCROLLING_CHECK_TIMEOUT)
    );

    const [isTouched, setIsTouched] = React.useState(false);
    const [isScrolling, setIsScrolling] = React.useState(false);

    const [wasScrollingWhileTouch, setWasScrollingWhileTouch] =
        React.useState(false);

    const stopTimeoutIdRef = React.useRef<number>(undefined);
    const initDelayedStopScrollingNotify = React.useCallback(() => {
        clearDelayedStopScrollingNotifyTimeout(stopTimeoutIdRef);

        stopTimeoutIdRef.current = setTimeout(() => {
            props.onScrollStopped?.();
            stopTimeoutIdRef.current = undefined;
            setWasScrollingWhileTouch(false);
        }, COMPLETELY_STOP_SCROLLING_CHECK_TIMEOUT);
    }, [props.onScrollStopped]);

    // Реф для завершения инерционного скролирования.
    // Инерционное скролирование обрабатывается через чистый асинхронный контроллер.
    // При старте редактирования нужно позвать метод с актуальным состоянием, оно хранится в рефе.
    const isTouchedRef = React.useRef(isTouched);
    const wasScrollingWhileTouchRef = React.useRef(wasScrollingWhileTouch);
    React.useEffect(() => {
        isTouchedRef.current = isTouched;
        wasScrollingWhileTouchRef.current = wasScrollingWhileTouch;
    }, [isTouched, wasScrollingWhileTouch]);

    const startScrolling = React.useCallback(() => {
        setIsScrolling(true);
        setWasScrollingWhileTouch(true);
        clearDelayedStopScrollingNotifyTimeout(stopTimeoutIdRef);
        props.onScrollStarted?.();
    }, [props.onScrollStarted]);

    const stopScrollingByScroll = React.useCallback(() => {
        setIsScrolling(false);
        if (!isTouchedRef.current && wasScrollingWhileTouchRef.current) {
            initDelayedStopScrollingNotify();
        }
    }, [initDelayedStopScrollingNotify, wasScrollingWhileTouch]);

    const stopScrollingByTouch = React.useCallback(() => {
        setIsTouched(false);
        if (!isScrolling) {
            initDelayedStopScrollingNotify();
        }
    }, [isScrolling, initDelayedStopScrollingNotify]);

    const onScroll = React.useCallback(
        (e: React.UIEvent) => {
            const isFirstMoveOfScroll =
                !inertialScrolling.getScrollStopPromise();
            inertialScrolling.scrollStarted();

            if (isFirstMoveOfScroll) {
                startScrolling();
                (
                    inertialScrolling.getScrollStopPromise() as Promise<void>
                ).then(() => {
                    stopScrollingByScroll();
                });
            }

            props.onScroll?.((e.target as HTMLDivElement).scrollLeft);
        },
        [startScrolling, stopScrollingByScroll, props.onScroll]
    );

    const onTouchStart = React.useCallback(() => {
        setIsTouched(true);
    }, []);

    return (
        <props.content
            onTouchStart={onTouchStart}
            onScroll={onScroll}
            onTouchEnd={stopScrollingByTouch}
        />
    );
}

export default React.memo(ScrollEventsManager);
