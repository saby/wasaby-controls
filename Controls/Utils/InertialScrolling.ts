/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
const INERTIAL_SCROLLING_DURATION = 100;

/**
 * Утилита слежения за инерционным скролом.
 * Позволяет совершать какие-то действия после завершения инерционного скролла.
 * Используется в списочном скролле и скролле колонок.
 *
 * @private
 * @example
 *
 * MyControlWithScroll.tsx
 * function(props: IProps): React.FunctionComponentElement<IProps> {
 *     const [inertialScrolling] = React.useState(new InertialScrolling());
 *
 *     const onScroll = React.useCallback(() => {
 *         inertialScrolling.scrollStarted();
 *     }, []);
 *
 *     const showInfo = React.useCallback(() => {
 *         const action = () => {...};
 *
 *         if (inertialScrolling.getScrollStopPromise()) {
 *             inertialScrolling.callAfterScrollStopped(action);
 *             // или inertialScrolling.getScrollStopPromise().then(action);
 *         } else {
 *             action();
 *         }
 *     }, []);
 *
 *     return <div onScroll={onScroll} onClick={showInfo}>...</div>;
 * }
 */
class InertialScrolling {
    private _isScrolling: boolean = false;
    private _scrollingTimer: number = null;
    private _scrollStopWaitingCallbacks: Function[] = null;
    private _scrollStopPromise: Promise<void>;
    private _scrollStopPromiseCallback: Function;
    private _inertialScrollingDuration: number;

    constructor(inertialScrollingDuration: number = INERTIAL_SCROLLING_DURATION) {
        this._scrollStopWaitingCallbacks = [];
        this._inertialScrollingDuration = inertialScrollingDuration;
    }

    scrollStarted(): void {
        this._isScrolling = true;

        if (!this._scrollStopPromise) {
            this._scrollStopPromise = new Promise((resolve) => {
                this._scrollStopPromiseCallback = resolve;
            });
        }

        if (this._scrollingTimer) {
            clearTimeout(this._scrollingTimer);
        }

        // The content continues to scroll for a while
        // after finishing the scroll gesture and removing your finger from the touchscreen.
        // The speed and duration of the continued scrolling is proportional to how vigorous the scroll gesture was.
        // 100ms is the average value (can be more or less) of the scrolling duration.

        this._scrollingTimer = setTimeout(() => {
            this._scrollingTimerEnded();
        }, this._inertialScrollingDuration);
    }

    endInertialScroll(): void {
        if (!this._isScrolling) {
            return;
        }

        this._scrollingTimer = null;
        this._isScrolling = false;

        if (this._scrollStopWaitingCallbacks) {
            this._scrollStopWaitingCallbacks.forEach((func) => {
                func();
            });
            this._scrollStopWaitingCallbacks = [];
        }
        this._scrollStopPromise = null;
        this._scrollStopPromiseCallback();
    }

    callAfterScrollStopped(callback: Function): void {
        if (this._isScrolling) {
            this._scrollStopWaitingCallbacks.push(callback);
        } else {
            callback();
        }
    }

    getScrollStopPromise(): void | Promise<void> {
        return this._scrollStopPromise;
    }

    protected _scrollingTimerEnded(): void {
        this.endInertialScroll();
    }
}

export default InertialScrolling;
