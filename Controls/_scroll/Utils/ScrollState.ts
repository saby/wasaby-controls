/**
 * @kaizen_zone 7b560386-8131-481a-b9c0-8b3ede6f29a0
 */
import {
    canScrollByState,
    getScrollPositionTypeByState,
    SCROLL_DIRECTION,
    SCROLL_POSITION,
} from 'Controls/_scroll/Utils/Scroll';

/**
 * Интерфейс для опции hasUnrenderedContent.
 * @interface Controls/_scroll/interface/IHasUnrenderedContent
 * @public
 */
export interface IHasUnrenderedContent {
    /**
     * Есть ли неотрендеренный контент сверху.
     */
    top: boolean;

    /**
     * Есть ли неотрендеренный контент снизу.
     */
    bottom: boolean;
}

/**
 * Интерфейс для события scrollStateChanged, которое генерируется скролл контейнером.
 * @interface Controls/_scroll/interface/IScrollState
 * @public
 */
export interface IScrollState {
    /**
     * Количество пикселей, прокрученных от верха элемента
     */
    scrollTop?: number;

    /**
     * Количество пикселей, прокрученных от левого края элемента
     */
    scrollLeft?: number;

    /**
     * Высота элемента внутри границ вместе с padding
     */
    clientHeight?: number;

    /**
     * Высота контента в элементе, включая содержимое, невидимое из-за прокрутки
     */
    scrollHeight?: number;

    /**
     * Ширина элемента внутри границ вместе с padding
     */
    clientWidth?: number;

    /**
     * Ширина контента в элементе, включая содержимое, невидимое из-за прокрутки
     */
    scrollWidth?: number;

    /**
     * Позиция вертикального скролла
     * @variant start - Скроллбар находится в начале.
     * @variant end - Скроллбар находится в конце.
     * @variant middle - Скроллбар находится в произвольном месте (но не в начале, не в конце).
     */
    verticalPosition?: SCROLL_POSITION;

    /**
     * Позиция горизонтального скролла
     */
    horizontalPosition?: SCROLL_POSITION;

    /**
     * Есть ли вертикальный скролл
     */
    canVerticalScroll?: boolean;

    /**
     * Есть ли горизонтальный скролл
     */
    canHorizontalScroll?: boolean;

    /**
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/DOMRect Размеры и положение} скролл контейнера.
     */
    viewPortRect?: ClientRect;

    /**
     * Есть ли неотрендеренный контент сверху/снизу.
     */
    hasUnrenderedContent?: IHasUnrenderedContent;

    contentClientHeight?: number;
}

export default class ScrollState implements IScrollState {
    private _content: HTMLElement;
    protected _scrollTop?: number;
    protected _scrollLeft?: number;
    protected _clientHeight?: number;
    protected _scrollHeight?: number;
    protected _clientWidth?: number;
    protected _scrollWidth?: number;
    private _hasUnrenderedContent: IHasUnrenderedContent;
    private _canVerticalScroll: boolean;
    private _canHorizontalScroll: boolean;
    private _verticalPosition: SCROLL_POSITION;
    private _horizontalPosition: SCROLL_POSITION;
    private _contentClientHeight?: number;

    constructor(content: HTMLElement, scrollState: IScrollState, calculatedState?: IScrollState) {
        this._content = content;
        this._scrollTop = scrollState.scrollTop;
        this._scrollLeft = scrollState.scrollLeft;
        this._clientHeight = scrollState.clientHeight;
        this._scrollHeight = scrollState.scrollHeight;
        this._clientWidth = scrollState.clientWidth;
        this._scrollWidth = scrollState.scrollWidth;
        this._contentClientHeight = scrollState.contentClientHeight;
        this._hasUnrenderedContent = {
            top: scrollState.hasUnrenderedContent?.top || false,
            bottom: scrollState.hasUnrenderedContent?.bottom || false,
        };
        if (calculatedState) {
            this._canVerticalScroll = calculatedState.canVerticalScroll;
            this._canHorizontalScroll = calculatedState.canHorizontalScroll;
            this._verticalPosition = calculatedState.verticalPosition;
            this._horizontalPosition = calculatedState.horizontalPosition;
        } else {
            this._updateCalculatedState();
        }
    }

    protected _updateCalculatedState(): void {
        this._canVerticalScroll = canScrollByState(this, SCROLL_DIRECTION.VERTICAL);
        this._canHorizontalScroll = canScrollByState(this, SCROLL_DIRECTION.HORIZONTAL);
        this._verticalPosition = getScrollPositionTypeByState(this, SCROLL_DIRECTION.VERTICAL);
        this._horizontalPosition = getScrollPositionTypeByState(this, SCROLL_DIRECTION.HORIZONTAL);
    }

    private _isUndefined(value): boolean {
        return typeof value === 'undefined';
    }

    get hasUnrenderedContent(): IHasUnrenderedContent {
        return this._hasUnrenderedContent;
    }

    get scrollTop(): number {
        return this._scrollTop;
    }

    get scrollLeft(): number {
        return this._scrollLeft;
    }

    get clientHeight(): number {
        return this._clientHeight;
    }

    get clientWidth(): number {
        return this._clientWidth;
    }

    get scrollHeight(): number {
        return this._scrollHeight;
    }

    get scrollWidth(): number {
        return this._scrollWidth;
    }

    get contentClientHeight(): number {
        return this._contentClientHeight;
    }

    get canVerticalScroll(): boolean {
        if (this._isUndefined(this._canVerticalScroll)) {
            this._canVerticalScroll = canScrollByState(this, SCROLL_DIRECTION.VERTICAL);
        }
        return this._canVerticalScroll;
    }

    get canHorizontalScroll(): boolean {
        if (this._isUndefined(this._canHorizontalScroll)) {
            this._canHorizontalScroll = canScrollByState(this, SCROLL_DIRECTION.HORIZONTAL);
        }
        return this._canHorizontalScroll;
    }

    get verticalPosition(): string {
        if (this._isUndefined(this._verticalPosition)) {
            this._verticalPosition = getScrollPositionTypeByState(this, SCROLL_DIRECTION.VERTICAL);
        }
        return this._verticalPosition;
    }

    get horizontalPosition(): string {
        if (this._isUndefined(this._horizontalPosition)) {
            this._verticalPosition = getScrollPositionTypeByState(
                this,
                SCROLL_DIRECTION.HORIZONTAL
            );
        }
        return this._horizontalPosition;
    }

    get viewPortRect(): ClientRect {
        return this._content.getBoundingClientRect();
    }

    clone(): ScrollState {
        const scrollState = {
            scrollTop: this._scrollTop,
            scrollLeft: this._scrollLeft,
            clientHeight: this._clientHeight,
            scrollHeight: this._scrollHeight,
            clientWidth: this._clientWidth,
            scrollWidth: this._scrollWidth,
            hasUnrenderedContent: this._hasUnrenderedContent,
            contentClientHeight: this._contentClientHeight,
        };
        const calculatedState = {
            canVerticalScroll: this._canVerticalScroll,
            canHorizontalScroll: this._canHorizontalScroll,
            verticalPosition: this._verticalPosition,
            horizontalPosition: this._horizontalPosition,
        };
        return new ScrollState(this._content, scrollState, calculatedState);
    }
}
