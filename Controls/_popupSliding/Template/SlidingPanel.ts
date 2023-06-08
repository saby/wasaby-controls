/**
 * @kaizen_zone 5d04426f-0434-472a-b02c-eecab5eb3c36
 */
import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_popupSliding/Template/SlidingPanel/SlidingPanel';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IDragObject, Container } from 'Controls/dragnDrop';
import { ISlidingPanelTemplateOptions } from 'Controls/_popupSliding/interface/ISlidingPanelTemplate';
import { RegisterUtil, UnregisterUtil } from 'Controls/event';
import { detection } from 'Env/Env';
import { IScrollState } from 'Controls/scroll';
import { unsafe_getRootAdaptiveMode } from 'UI/Adaptive';

enum DRAG_DIRECTION {
    TOP = 'top',
    BOTTOM = 'bottom',
}

/**
 * Интерфейс для шаблона попапа-шторки.
 *
 * @interface Controls/_popupSliding/Template/SlidingPanel
 * @private
 */
export default class SlidingPanel extends Control<ISlidingPanelTemplateOptions> {
    protected _template: TemplateFunction = template;
    protected _dragStartHeightDimensions: {
        scrollHeight: number;
        contentHeight: number;
    };
    protected _touchDragOffset: IDragObject['offset'];
    protected _scrollAvailable: boolean = false;
    protected _position: string = 'bottom';
    protected _children: {
        dragNDrop: Container;
        customContent: Element;
        customContentWrapper: Element;
        controlLine: Element;
    };
    private _isPanelMounted: boolean = false;
    private _currentTouchPosition: { x: number; y: number } = null;
    private _startTouchPosition: { x: number; y: number } = null;
    private _scrollState: IScrollState = null;
    private _swipeInProcess: boolean = false;
    protected _isAdaptive: boolean = false;

    protected _beforeMount(options: ISlidingPanelTemplateOptions): void {
        this._isAdaptive = unsafe_getRootAdaptiveMode().device.isPhone();
        this._position = options.slidingPanelOptions?.position || 'bottom';
        this._scrollAvailable = this._isScrollAvailable(options);
    }

    protected _beforeUpdate(options: ISlidingPanelTemplateOptions): void {
        if (options.slidingPanelOptions !== this._options.slidingPanelOptions) {
            this._position = options.slidingPanelOptions?.position || 'bottom';
            this._scrollAvailable = this._isScrollAvailable(options);
        }
    }

    protected _afterMount(options: ISlidingPanelTemplateOptions): void {
        this._isPanelMounted = true;

        /*
            Если высотка контента максимальная, то нужно отпустить скролл,
            т.к. внутри могут быть поля со своим скроллом, а мы превентим touchmove и не даем им скроллиться.
         */
        const scrollAvailable = this._isScrollAvailable(options);
        if (scrollAvailable !== this._scrollAvailable) {
            this._scrollAvailable = scrollAvailable;
        }
        if (detection.isMobileIOS) {
            this._toggleScrollObserveForKeyboardClose(true);
        }
    }

    protected _beforeUnmount(): void {
        if (detection.isMobileIOS) {
            this._toggleScrollObserveForKeyboardClose(false);
        }
    }

    protected _getBackgroundClass(): string {
        return this._options.backgroundStyle === 'default'
            ? 'controls-SlidingPanel_backgroundStyle-default'
            : 'controls-background-' + this._options.backgroundStyle;
    }

    protected _getHeaderBackgroundClass(): string {
        return this._options.headerBackgroundStyle === 'default'
            ? 'controls-SlidingPanel_header-backgroundStyle-default'
            : 'controls-background-' + this._options.headerBackgroundStyle;
    }

    protected _isScrollAvailable(options: ISlidingPanelTemplateOptions): boolean {
        const { slidingPanelOptions } = options;
        const contentHeight = this._getHeight(options);

        const height = slidingPanelOptions.height || this._container?.clientHeight || 0;
        let maxHeight = slidingPanelOptions.maxHeight;

        if (!maxHeight) {
            maxHeight = document?.body?.clientHeight;
        }

        return (
            height > maxHeight || // см fixIosBug в контроллере
            height === maxHeight ||
            (height === contentHeight && !this._hasContentForScroll())
        );
    }

    private _hasContentForScroll(): boolean {
        return this._scrollState
            ? this._scrollState.clientHeight < this._scrollState.scrollHeight
            : false;
    }

    /**
     * Получение доступного контента шторки, включая пользовательский, который обрезан overflow
     * @param options
     * @private
     */
    private _getHeight(options: ISlidingPanelTemplateOptions): number {
        if (this._isPanelMounted) {
            const sliderHeight = options.controlButtonVisibility
                ? this._children.controlLine.clientHeight
                : 0;
            const customContentHeight = this._children.customContent.clientHeight;
            return sliderHeight + customContentHeight;
        } else {
            return 0;
        }
    }

    protected _dragEndHandler(): void {
        this._notifyDragEnd();
        this._dragStartHeightDimensions = null;
    }

    protected _dragMoveHandler(event: SyntheticEvent<Event>, dragObject: IDragObject): void {
        this._notifyDragStart(dragObject.offset);
    }

    protected _startDragNDrop(event: SyntheticEvent<MouseEvent>): void {
        this._children.dragNDrop.startDragNDrop(null, event);
    }

    protected _scrollStateChanged(
        event: SyntheticEvent<MouseEvent>,
        scrollState: IScrollState
    ): void {
        // Состояние _scrollAvailable посчитается еще до того, как придет scrollState, из-за этого может появится лишний
        // скролл. Пересчитаем после первого события scrollStateChanged.
        // Так же нужно пересчитать доступность скролла если размер контента скролла поменялся
        // (польовательский контент поменял размер)
        if (!this._scrollState || this._scrollState.scrollHeight !== scrollState.scrollHeight) {
            this._scrollState = scrollState;
            this._scrollAvailable = this._isScrollAvailable(this._options);
        }
        this._scrollState = scrollState;
    }

    protected _getCustomContentHeight(): number {
        return this._children.customContent.clientHeight;
    }

    private _touchOnController(event: SyntheticEvent<TouchEvent>): boolean {
        const target = event.target as HTMLElement;
        return !!(target && target.closest('.controls-SlidingPanel__controller-container'));
    }

    /**
     * Запоминаем начальную позицию тача, чтобы считать offset от нее
     * @param {<TouchEvent>} event
     * @private
     */
    protected _touchStartHandler(event: SyntheticEvent<TouchEvent>): void {
        // Контроллер может быть построен внутри контента, драг в нем обрабатывается через dragNDropContainer
        if (this._touchOnController(event)) {
            return;
        }
        this._startTouchPosition = {
            x: event.nativeEvent.targetTouches[0].clientX,
            y: event.nativeEvent.targetTouches[0].clientY,
        };
        this._swipeInProcess = true;
    }

    /**
     * Раворот шторки через свайп, делается аналогично, через события dragStart/dragEnd
     * @param {<TouchEvent>} event
     * @private
     */
    protected _touchMoveHandler(event: SyntheticEvent<TouchEvent>): void {
        // Контроллер может быть построен внутри контента, драг в нем обрабатывается через dragNDropContainer
        if (this._touchOnController(event)) {
            return;
        }
        if (!this._swipeInProcess) {
            return;
        }
        if (
            (this._scrollAvailable && this._isSwipeForScroll(event)) ||
            this._horizontalScrollSwipe(event)
        ) {
            // Расчет оффсета тача должен начинаться только с того момента как закончится скролл, а не со старта тача
            this._currentTouchPosition = null;
            return;
        }

        if (!detection.isMobilePlatform) {
            event.preventDefault();
        }

        const touchData = event.nativeEvent.changedTouches[0];
        const currentTouchPosition = {
            x: touchData.clientX,
            y: touchData.clientY,
        };
        const offset = this._getDragOffsetByTouchEvent(event);

        // Если тач начался со скролла, то оффсет нужно начинать с того момента, как закончился скролл
        if (!this._currentTouchPosition) {
            this._currentTouchPosition = currentTouchPosition;
        }

        this._currentTouchPosition = currentTouchPosition;
        this._touchDragOffset = offset;

        event.stopPropagation();
        this._notifyDragStart(this._touchDragOffset);
    }

    protected _touchEndHandler(event: SyntheticEvent<TouchEvent>): void {
        // Контроллер может быть построен внутри контента, драг в нем обрабатывается через dragNDropContainer
        if (this._touchOnController(event)) {
            return;
        }
        if (this._touchDragOffset) {
            this._notifyDragEnd();
            this._touchDragOffset = null;
        }
        this._currentTouchPosition = null;
        this._startTouchPosition = null;
        this._swipeInProcess = false;
    }

    /**
     * Возвращает признак того, что свайп приведет к скроллу
     * Скроллим когда:
     * 1. Скролл доступен (см. isScrollAvailable)
     * 2. Свайп внутри сролла
     * 3. Либо уже проскроллено, либо свайп в ту сторону, в которую двигается скролл
     * 4. Свайп внутри внутреннего скролл контейнера(внутренние скроллы скроллим всегда)
     * @param event
     * @private
     */
    private _isSwipeForScroll(event: SyntheticEvent<TouchEvent>): boolean {
        const scrollContainers = this._getParentScrollContainerElements(
            event.target as HTMLElement
        );
        const swipeInTopScrollContainer = scrollContainers.length === 1;
        let swipeInsideInnerScrollContainer = scrollContainers.length > 1;
        if (
            scrollContainers.length === 1 &&
            scrollContainers[0]?.closest('.controls-SlidingPanel__scrollWrapper')
        ) {
            swipeInsideInnerScrollContainer = true;
        }
        const alreadyScrolled = this._getScrollTop() !== 0;
        const swipeToScrollSide =
            this._startTouchPosition.y - event.nativeEvent.changedTouches[0].clientY > 0;

        return (
            (this._scrollAvailable &&
                swipeInTopScrollContainer &&
                (alreadyScrolled || (swipeToScrollSide && this._hasContentForScroll()))) ||
            swipeInsideInnerScrollContainer
        );
    }

    private _horizontalScrollSwipe(event: SyntheticEvent<TouchEvent>): boolean {
        const scrollContainers = this._getParentScrollContainerElements(
            event.target as HTMLElement
        );
        const swipeInsideInnerScrollContainer = scrollContainers.length > 1;
        const touchData = event.nativeEvent.changedTouches[0];
        const verticalOffset = Math.abs(this._startTouchPosition.y - touchData.clientY);
        const horizontalOffset = Math.abs(this._startTouchPosition.x - touchData.clientX);
        return swipeInsideInnerScrollContainer && verticalOffset < horizontalOffset;
    }

    private _getParentScrollContainerElements(element: HTMLElement): HTMLElement[] {
        /**
         * TODO: Нужно избавиться от связности.
         * https://online.sbis.ru/opendoc.html?guid=64510772-df48-4af8-a240-7ac2b7509cff
         */
        const scrollClassName = 'controls-Scroll';
        let currentNode: HTMLElement = element;
        const scrollContainerNodes = [];
        while (currentNode && currentNode !== this._container) {
            const isScroll = currentNode.classList.contains(scrollClassName);
            if (isScroll) {
                scrollContainerNodes.push(currentNode);
            }
            currentNode = currentNode.parentElement;
        }
        return scrollContainerNodes;
    }

    private _notifyDragStart(offset: IDragObject['offset']): void {
        /*
           Запоминаем высоту скролла, чтобы при увеличении проверять на то,
           что не увеличим шторку больше, чем есть контента
        */
        if (!this._dragStartHeightDimensions) {
            this._dragStartHeightDimensions = {
                scrollHeight: this._children.customContentWrapper.clientHeight,
                contentHeight: this._getCustomContentHeight(),
            };
        }
        const dragOffset = this._getDragOffsetWithOverflowChecking(offset);
        this._notify('popupDragStart', [dragOffset], { bubbling: true });
        this._notifyCustomDragStart(dragOffset);
    }

    /**
     * dragstart для проикладных программистов,
     * чтобы они могли как-то отреагировать на драг и изменить контент
     * @param offset
     * @private
     */
    private _notifyCustomDragStart(offset: IDragObject['offset']): void {
        const direction = offset.y > 0 ? DRAG_DIRECTION.BOTTOM : DRAG_DIRECTION.TOP;
        this._notify('customdragStart', [direction, offset]);
    }

    protected _notifyDragEnd(): void {
        this._notify('popupDragEnd', [], { bubbling: true });
        this._dragStartHeightDimensions = null;
    }

    protected _closePopup(): void {
        this._notify('close', [], { bubbling: true });
    }

    private _getDragOffsetByTouchEvent(event: SyntheticEvent<TouchEvent>): IDragObject['offset'] {
        const touchData = event.nativeEvent.changedTouches[0];
        const currentTouchPosition = {
            x: touchData.clientX,
            y: touchData.clientY,
        };
        const result = {
            x: 0,
            y: 0,
        };
        if (this._currentTouchPosition) {
            const prevTouchPosition = this._currentTouchPosition;
            result.x = currentTouchPosition.x - prevTouchPosition.x;
            result.y = currentTouchPosition.y - prevTouchPosition.y;
        }

        // Аналогичный drag'n'drop функционал. Собираем общий offset относительно начальной точки тача.
        if (this._touchDragOffset) {
            const fullDragOffset = this._touchDragOffset;
            result.x += fullDragOffset.x;
            result.y += fullDragOffset.y;
        }
        return result;
    }

    private _getDragOffsetWithOverflowChecking(
        dragOffset: IDragObject['offset']
    ): IDragObject['offset'] {
        let offsetY = dragOffset.y;
        const contentHeight = this._getCustomContentHeight();

        // В зависимости от позиции высоту шторки увеличивает либо положительный, либо отрицательный сдвиг по оси "y"
        const realHeightOffset = this._position === 'top' ? offsetY : -offsetY;
        const { scrollHeight: startScrollHeight } = this._dragStartHeightDimensions;
        const scrollContentOffset = contentHeight - startScrollHeight;
        const popupHeight = this._options.slidingPanelOptions.height;

        // Если при старте свайпа нет доступного контента для разворота, то не пытаемся что-то развернуть
        if (
            popupHeight === contentHeight &&
            popupHeight === startScrollHeight &&
            realHeightOffset > 0
        ) {
            offsetY = 0;
        } else if (
            // Если остаток доступного контента меньше сдвига, то сдвигаем на размер оставшегося контента
            realHeightOffset > scrollContentOffset
        ) {
            /*
                Если изначально контент меньше высоты шторки, и шторку пытаюстся развернуть,
                то не учитываем разницу в скролле и контенте, т.к. шторка всё равно не будет сдвигаться,
                А если пытаюся свернуть, то вызываем закрытие передавая текущий оффсет
             */
            if (contentHeight < startScrollHeight) {
                offsetY = realHeightOffset > 0 ? 0 : offsetY;
            } else {
                offsetY = this._position === 'top' ? scrollContentOffset : -scrollContentOffset;
            }
        }
        return {
            x: dragOffset.x,
            y: offsetY,
        };
    }

    /**
     * Получение текущего положения скролла
     * @return {number}
     * @private
     */
    private _getScrollTop(): number {
        return this._scrollState?.scrollTop || 0;
    }

    /**
     * Фикс для сафари, чтобы при скролле убиралась клавиатура
     * Вылезают проблемы с лишней белой полосой внизу
     * @param container
     * @param state
     * @private
     */
    private _toggleScrollObserveForKeyboardClose(state: boolean): void {
        if (state) {
            RegisterUtil(this, 'customscroll', this._scrollHandler.bind(this));
        } else {
            UnregisterUtil(this, 'customscroll');
        }
    }

    /**
     * При скролле на сафари убираем фокус, чтобы клавиатура закрылась.
     * Делаем это только если фокус в инпуте в текущей шторке(чтобы не было множественных вызовов, если шторок много)
     */
    private _scrollHandler(): void {
        const focusedElement = document.activeElement;
        const isFocusInsideCurrentPanel =
            focusedElement.closest('.controls-SlidingPanel') === this._container;
        if (
            this._swipeInProcess &&
            isFocusInsideCurrentPanel &&
            focusedElement.tagName === 'INPUT'
        ) {
            const newFocusElement = focusedElement.parentElement;
            newFocusElement.focus();
        }
    }

    static getDefaultOptions(): Partial<ISlidingPanelTemplateOptions> {
        return {
            controlButtonVisibility: true,
            slidingPanelOptions: {
                height: undefined,
                maxHeight: undefined,
                minHeight: undefined,
                position: 'bottom',
                desktopMode: 'stack',
            },
            headerBackgroundStyle: 'default',
            headingFontSize: '3xl',
            backgroundStyle: 'default',
        };
    }
}
