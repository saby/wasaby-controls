import { default as BaseInertialScrolling } from 'Controls/Utils/InertialScrolling';

interface IParams {
    maxScrollPosition: number;
}

export default class InertialScrolling {
    private readonly _baseInertialScrolling: BaseInertialScrolling;

    private _scrollPosition: number;
    private _minScrollPosition: number;
    private _maxScrollPosition: number;

    constructor(params: IParams) {
        this._baseInertialScrolling = new BaseInertialScrolling();

        this._scrollPosition = 0;
        this._minScrollPosition = 0;
        this._maxScrollPosition = params.maxScrollPosition;
    }

    setMaxScrollPosition(position: number) {
        this._maxScrollPosition = position;
    }

    scrollPositionChange(position: number): void {
        this._scrollPosition = position;
        this._baseInertialScrolling.scrollStarted();
    }

    endInertialScroll(): void {
        this._baseInertialScrolling.endInertialScroll();
    }

    callAfterScrollStopped(callback: Function): void {
        this._baseInertialScrolling.callAfterScrollStopped(callback);
    }

    protected _scrollingTimerEnded(): void {
        const scrollPositionOutside =
            this._scrollPosition < this._minScrollPosition ||
            this._scrollPosition > this._maxScrollPosition;
        // Если по окончанию таймера позиция скролла за пределами возможных значений,
        // то это гарантированно означает что инерционный скролл еще не закончился.
        // Поэтому начинаем таймер заново, чтобы отстрелить коллбэки гарантированно после окончания инерционного скролла.
        if (scrollPositionOutside) {
            this._baseInertialScrolling.scrollStarted();
        } else {
            this.endInertialScroll();
        }
    }
}
