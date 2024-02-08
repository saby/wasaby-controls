/**
 * @kaizen_zone 7b560386-8131-481a-b9c0-8b3ede6f29a0
 */
import { detection } from 'Env/Env';
import { Bus } from 'Env/Event';
import { descriptor } from 'Types/entity';
import { SyntheticEvent } from 'Vdom/Vdom';
import { RegisterClass, RegisterUtil, UnregisterUtil } from 'Controls/event';
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { RESIZE_OBSERVER_BOX, ResizeObserverUtil } from 'Controls/sizeUtils';
import { canScrollByState, SCROLL_DIRECTION, SCROLL_POSITION } from './Utils/Scroll';
import {
    horizontalScrollToElement,
    scrollToElement,
    TScrollPosition,
} from './Utils/scrollToElement';
import { ListCompatible } from './Utils/ListCompatible';
import ScrollState, { IScrollState } from './Utils/ScrollState';
import ScrollModel from './Utils/ScrollModel';
import { SCROLL_MODE, OverscrollBehavior } from './Container/Type';
import { EventUtils } from 'UI/Events';
import { isStickyHidden as isHidden } from 'Controls/stickyBlock';
import {
    getStickyHeadersHeight as getHeadersHeight,
    getStickyHeadersWidth as getHeadersWidth,
} from 'Controls/stickyBlock';
import { location, getStore } from 'Application/Env';
import { Entity } from 'Controls/dragnDrop';
import { Logger } from 'UICommon/Utils';
import DnDAutoScroll from 'Controls/_scroll/ContainerBase/DnDAutoScroll';
import AutoScroll from 'Controls/_scroll/ContainerBase/AutoScroll';
import { TypeFixedBlocks, StickyPosition } from 'Controls/stickyBlock';
import { TouchDetect } from 'EnvTouch/EnvTouch';
import template = require('wml!Controls/_scroll/ContainerBase/ContainerBase');
import 'css!Controls/scroll';

export interface IInitialScrollPosition {
    vertical: SCROLL_POSITION.START | SCROLL_POSITION.END | number;
    horizontal: SCROLL_POSITION.START | SCROLL_POSITION.END | number;
}
export interface IContainerBaseOptions extends IControlOptions {
    _notScrollableContent?: boolean; // Для HintWrapper, который сверстан максмально неудобно для скроллКонтейнера.
    scrollOrientation?: SCROLL_MODE;
    scrollbarVisible?: boolean | { vertical?: boolean; horizontal?: boolean };
    canScrollByWheel?: boolean | Partial<Record<SCROLL_DIRECTION, boolean>>;
    initialScrollPosition?: IInitialScrollPosition;
    smoothScrolling?: boolean;
    _horizontalScrollMode?: string;
    horizontalContentFit?: string;
    disableScrollReaction?: boolean;
}

const KEYBOARD_SHOWING_DURATION: number = 500;
const USER_CONTENT_CLASS = 'controls-Scroll-containerBase_userContent';
const DIFF_CONTAINER_SIZE: number = 10;

enum CONTENT_TYPE {
    regular = 'regular',
    notScrollable = 'notScrollable',
    // Размеры корня контента равны размерам скролл контейнера, а размер детей на каком то уровне вложенности больше.
    restricted = 'restricted',
}

enum SCROLL_POSITION_CSS {
    verticalEnd = 'controls-Scroll-ContainerBase__scrollPosition-vertical-end',
    horizontalEnd = 'controls-Scroll-ContainerBase__scrollPosition-horizontal-end',
    regular = 'controls-Scroll-ContainerBase__scrollPosition-regular',
}

/**
 * Контейнер со скроллом.
 *
 * @remark
 * Контрол работает как нативный скролл: нативные скроллбары появляются, когда размеры контента больше размеров контрола. Для корректной работы контрола необходимо ограничить его высоту.
 *
 * @private
 * @demo Controls-demo/Scroll/ContainerBase/Index
 *
 */
export default class ContainerBase<
    T extends IContainerBaseOptions
> extends Control<IContainerBaseOptions> {
    protected _template: TemplateFunction = template;
    protected _container: HTMLElement = null;
    protected _options: IContainerBaseOptions;

    private _registrars: {
        [key: string]: RegisterClass;
    } = {};
    private _resizeObserver: ResizeObserverUtil;
    private _observedElements: HTMLElement[] = [];

    private _resizeObserverSupported: boolean;

    private _scrollLockedPosition: number = null;
    protected _scrollCssClass: string;
    protected _contentWrapperCssClass: string = '';
    protected _oldScrollState: ScrollState;
    protected _scrollModel: ScrollModel;
    protected _overscrollBehavior: OverscrollBehavior = OverscrollBehavior.Auto;
    protected _isCustomScroll: boolean = false;

    protected _tmplNotify: Function = EventUtils.tmplNotify;

    // Виртуальный скролл
    private _topPlaceholderSize: number = 0;
    private _bottomPlaceholderSize: number = 0;
    private _leftPlaceholderSize: number = 0;
    private _rightPlaceholderSize: number = 0;

    private _listCompatible: ListCompatible;

    private _virtualNavigationRegistrar: RegisterClass;
    private _virtualNavigationState: { top: boolean; bottom: boolean } = {
        top: false,
        bottom: false,
    };

    private _contentType: CONTENT_TYPE = CONTENT_TYPE.regular;

    protected _initialScrollPositionCssClass: string;
    private _isFirstUpdateState: boolean = true;
    private _scrollToElementCalled: boolean = false;
    private _dnDAutoScroll: DnDAutoScroll;
    private _autoScroll: AutoScroll;
    private _hasOuterContainer: boolean;

    // Состояние для логирования сохраняем отдельно, т.к. состояние положения скрола в некоторых сценариях
    // обновляется синхронно, и невозможно узнать старое состояние в обработчике.
    private _lastLogState: { top: number; left: number } = { top: 0, left: 0 };

    constructor(...args: [IContainerBaseOptions]) {
        super(...args);

        this._listCompatible = new ListCompatible({
            notifyUtil: (...notifyArgs: [string]) => {
                this._notify(...notifyArgs);
            },
        });
    }

    _beforeMount(options: IContainerBaseOptions): void {
        this._virtualNavigationRegistrar = new RegisterClass({
            register: 'virtualNavigation',
        });
        if (!this._isHorizontalScroll(options.scrollOrientation)) {
            this._resizeObserver = new ResizeObserverUtil(
                this,
                this._resizeObserverCallback,
                this._resizeHandler
            );
        }
        this._resizeObserverSupported = this._resizeObserver?.isResizeObserverSupported();
        this._registrars.scrollStateChanged = new RegisterClass({
            register: 'scrollStateChanged',
        });
        // событие viewportResize используется только в списках.
        this._registrars.viewportResize = new RegisterClass({
            register: 'viewportResize',
        });
        this._registrars.scrollResize = new RegisterClass({
            register: 'scrollResize',
        });
        this._registrars.scrollMove = new RegisterClass({
            register: 'scrollMove',
        });
        this._registrars.virtualScrollMove = new RegisterClass({
            register: 'virtualScrollMove',
        });
        this._scrollCssClass = this._getScrollContainerCssClass(options);
        this._updateContentWrapperCssClass();
        this._registrars.listScroll = new RegisterClass({
            register: 'listScroll',
        });
        // Регистрар не из watcher а лежал на уровне самомго скролл контейнера. Дублирует подобное событие для списков.
        // Используется как минимум в попапах.
        this._registrars.customscroll = new RegisterClass({
            register: 'customscroll',
        });

        // Не восстанавливаем скролл на то место, на котором он был перед релоадом страницы
        if (window && window.history && 'scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        if (options._notScrollableContent) {
            this._updateContentType(CONTENT_TYPE.restricted);
        }
        this._initialScrollPositionInit(options);
    }

    protected _componentDidMount(): void {
        const isInitialScrollPositionStart: boolean =
            !this._options.initialScrollPosition ||
            !this._options.initialScrollPosition?.vertical ||
            this._options.initialScrollPosition?.vertical === SCROLL_POSITION.START;
        // Если одна область заменяется на другую с однотипной версткой и встроенным скролл контейнером,
        // то ядро не пересоздает dom контейнеры, и может так полуится, что вновь созданный скролл контейнер
        // может быть сразу проскролен. Исправляем эту ситуацию.
        // Не будем скроллить в случае, если на странице есть нативные якоря для скролла,
        // т.е. в ссылке присутсвует хэш
        if (
            isInitialScrollPositionStart &&
            !location.hash &&
            this._container.dataset?.scrollContainerNode &&
            !this._scrollToElementCalled
        ) {
            this._children.content.scrollTop = 0;
        }
        this._initialScrollPositionResetAfterInitialization();
        // переносим события на window, если включен скролл на боди и сколл конейнер обернули в BodyScrollHOC
        this._notify(
            'createChildrenScroll',
            [
                {
                    'on:scroll': this._scrollHandler,
                    'on:customscroll': this._scrollHandler,
                    'on:wheel': this._wheelHandler,
                    'on:doScroll': this._doScrollHandler,
                    'on:doHorizontalScroll': this._doHorizontalScrollHandler,
                    'on:registerScroll': this._registerIt,
                    'on:unregisterScroll': this._unRegisterIt,
                    'on:scrollToElement': this._scrollToElement,
                    'on:horizontalScrollToElement': this._horizontalScrollToElement,
                    'on:updatePlaceholdersSize': this._updatePlaceholdersSize,
                    'on:controlResize': this._controlResizeHandler,
                    'on:enableVirtualNavigation': this._enableVirtualNavigationHandler,
                    'on:disableVirtualNavigation': this._disableVirtualNavigationHandler,
                },
            ],
            {
                bubbling: true,
            }
        );
    }

    _afterMount(): void {
        const scrollOrientation = this._options.scrollOrientation;
        if (!this._scrollModel) {
            this._createScrollModel();
        }
        if (
            !this._resizeObserver?.isResizeObserverSupported() ||
            this._isHorizontalScroll(scrollOrientation)
        ) {
            RegisterUtil(this, 'controlResize', this._controlResizeHandler, {
                listenAll: true,
            });
        } else if (scrollOrientation === SCROLL_MODE.VERTICAL_HORIZONTAL) {
            // Из-за особенности верстки, контейнер, с которого мы считываем размеры скролла, растягивается только
            // по высоте. По ширине он совпадает с размерами своего родителя. Из-за этого невозможно определить ширину
            // скролла. Будем считать ширину скролла с дочернего элемента.
            this._observeElementSize(this._children.userContent.children[0]);
        }
        this._controlResizeHandler();
        this._observeElementSize(this._children.content);

        this._updateContentType();
        if (this._contentType === CONTENT_TYPE.regular) {
            this._observeElementSize(this._children.userContent);
        } else {
            this._observeContentSize();
        }

        // this._createEdgeIntersectionObserver();

        if (detection.isMobileIOS) {
            this._lockScrollPositionUntilKeyboardShown =
                this._lockScrollPositionUntilKeyboardShown.bind(this);
            Bus.globalChannel().subscribe(
                'MobileInputFocus',
                this._lockScrollPositionUntilKeyboardShown
            );
        }

        this._autoScroll = new AutoScroll(
            this._container,
            this._setScrollTop.bind(this),
            this.horizontalScrollTo.bind(this)
        );

        this._dnDAutoScroll = new DnDAutoScroll(this._autoScroll);

        // Регистрируем события о начале и окончании перетаскивания, что бы включать/выключать
        // режим автоскролла при приближении мышки верхнему/нижнему краю скролл контейнера
        this._notify('register', ['documentDragStart', this, this._onDragStart], {
            bubbling: true,
        });
        this._notify('register', ['documentDragEnd', this, this._onDragEnd], {
            bubbling: true,
        });
        this._hasOuterContainer = !!this._container.closest('.controls-Scroll-Container');
    }

    _beforeUpdate(options: IContainerBaseOptions): void {
        if (options.scrollOrientation !== this._options.scrollOrientation) {
            this._scrollCssClass = this._getScrollContainerCssClass(options);
        }
        this._dnDAutoScroll.updateOptions({
            scrollOrientation: options.scrollOrientation,
            topPlaceholderSize: this._topPlaceholderSize,
            scrollTop: this._scrollModel.scrollTop,
            scrollLeft: this._scrollModel.scrollLeft,
        });
    }

    protected _afterUpdate(oldOptions?: IContainerBaseOptions): void {
        this._updateContentType();
        if (this._contentType !== CONTENT_TYPE.regular) {
            this._observeContentSize();
            this._unobserveDeleted();
        }
        if (!this._resizeObserverSupported) {
            this._updateStateAndGenerateEvents(this._getFullStateFromDOM());
        }
    }

    _beforeUnmount(): void {
        this._listCompatible.destroy();
        // Установим дата аттрибут, чтобы в будущем была возможность определить, был ли в этой ноде скролл контейнер.
        // Подробности в комментарии в _componentDidMount.
        this._container.dataset.scrollContainerNode = 'true';
        if (!this._resizeObserver?.isResizeObserverSupported()) {
            UnregisterUtil(this, 'controlResize', { listenAll: true });
        }
        this._resizeObserver?.terminate();
        for (const registrar in this._registrars) {
            if (this._registrars.hasOwnProperty(registrar)) {
                this._registrars[registrar].destroy();
            }
        }

        if (detection.isMobileIOS) {
            Bus.globalChannel().unsubscribe(
                'MobileInputFocus',
                this._lockScrollPositionUntilKeyboardShown
            );
        }

        this._scrollModel = null;
        this._oldScrollState = null;

        this._notify('unregister', ['documentDragStart', this], {
            bubbling: true,
        });
        this._notify('unregister', ['documentDragEnd', this], {
            bubbling: true,
        });
        this._dnDAutoScroll.destroy();
        this._notify('destroyChildrenScroll', [], {
            bubbling: true,
        });
    }

    private _isHorizontalScroll(scrollOrientationOption: string): boolean {
        const scrollOrientation = scrollOrientationOption.toLowerCase();
        // При горизонтальном скролле будет работать с событием controlResize
        return scrollOrientation.indexOf('horizontal') !== -1;
    }

    private _initialScrollPositionInit(options: IContainerBaseOptions): void {
        if (options.initialScrollPosition?.vertical === SCROLL_POSITION.END) {
            this._initialScrollPositionCssClass = SCROLL_POSITION_CSS.verticalEnd;
        } else if (options.initialScrollPosition?.horizontal === SCROLL_POSITION.END) {
            this._initialScrollPositionCssClass = SCROLL_POSITION_CSS.horizontalEnd;
        } else {
            this._initialScrollPositionCssClass = SCROLL_POSITION_CSS.regular;
        }
    }

    private _initialScrollPositionResetAfterInitialization(): void {
        if (
            this._options.initialScrollPosition?.vertical === SCROLL_POSITION.END ||
            this._options.initialScrollPosition?.horizontal === SCROLL_POSITION.END
        ) {
            const container = this._children.content;

            this._initialScrollPositionCssClass = SCROLL_POSITION_CSS.regular;

            container.classList.add(SCROLL_POSITION_CSS.regular);

            if (this._options.initialScrollPosition?.vertical === SCROLL_POSITION.END) {
                container.classList.remove(SCROLL_POSITION_CSS.verticalEnd);
                // В режиме "flex-direction: column-reverse" контенейнер прокручен к концу,
                // и scrollTop считается с конца. Т.е. scrollTop в этот сосент равен 0. А когда скролируют
                // в обратную сторону он становтися отрицательным. После того как мы меняем flex-direction,
                // скролл прокручивается в начало, его необходимо вернуть в конец.
                container.scrollTop = container.scrollHeight;
            } else if (this._options.initialScrollPosition?.horizontal === SCROLL_POSITION.END) {
                container.classList.remove(SCROLL_POSITION_CSS.horizontalEnd);
                container.scrollLeft = container.scrollWidth;
            }
        }
    }

    _controlResizeHandler(): void {
        if (this._resizeObserver) {
            this._resizeObserver.controlResizeHandler();
        } else {
            this._resizeHandler();
        }
    }

    _observeContentSize(): void {
        for (const element of this._getElementsForHeightCalculation()) {
            if (!this._observedElements.includes(element)) {
                this._observeElementSize(element);
                this._observedElements.push(element);
            }
        }
    }
    _unobserveDeleted(): void {
        const contentElements: HTMLElement[] = this._getElementsForHeightCalculation();
        this._observedElements = this._observedElements.filter((element: HTMLElement) => {
            if (!contentElements.includes(element)) {
                this._resizeObserver?.unobserve(element);
                return false;
            }
            return true;
        });
    }

    _observeElementSize(element: HTMLElement): void {
        this._resizeObserver?.observe(element, {
            box: RESIZE_OBSERVER_BOX.borderBox,
        });
    }

    _isObserved(element: HTMLElement): boolean {
        return this._observedElements.includes(element);
    }

    protected _getScrollNotifyConfig(): number[] {
        return [this._scrollModel.scrollTop, this._scrollModel.scrollLeft];
    }

    _resizeHandler(): void {
        this._onResizeContainer(this._getFullStateFromDOM());
    }

    private _canScrollByWheel(
        direction: SCROLL_DIRECTION,
        options: IContainerBaseOptions = this._options
    ): boolean {
        switch (typeof options.canScrollByWheel) {
            case 'boolean':
                return options.canScrollByWheel as boolean;
            case 'object':
                return typeof options.canScrollByWheel[direction] === 'boolean'
                    ? options.canScrollByWheel[direction]
                    : true;
            default:
                return true;
        }
    }

    protected _wheelHandler(e: SyntheticEvent<WheelEvent>): void {
        const direction = e.nativeEvent.shiftKey
            ? SCROLL_DIRECTION.HORIZONTAL
            : SCROLL_DIRECTION.VERTICAL;
        if (!this._canScrollByWheel(direction)) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    protected _scrollHandler(e: SyntheticEvent, isWheel: boolean): void {
        if (this._options.disableScrollReaction) {
            return;
        }

        let scrollTop: number = e.currentTarget.scrollTop;
        let scrollLeft: number = e.currentTarget.scrollLeft;

        if (getStore('AdaptiveInitializer').get('isScrollOnBody')) {
            const isWindowScroll = e.currentTarget === document;
            scrollTop = isWindowScroll ? document.scrollingElement.scrollTop : scrollTop;
            scrollLeft = isWindowScroll ? document.scrollingElement.scrollLeft : scrollLeft;
        }

        this._logScrollPosition(scrollTop, scrollLeft);

        if (this._scrollLockedPosition !== null) {
            this._children.content.scrollTop = this._scrollLockedPosition;
            return;
        }
        this.onScrollContainer({
            scrollTop,
            scrollLeft,
        });
        this._dnDAutoScroll.updateOptions({
            scrollOrientation: this._options.scrollOrientation,
            topPlaceholderSize: this._topPlaceholderSize,
            scrollTop: this._scrollModel.scrollTop,
            scrollLeft: this._scrollModel.scrollLeft,
        });
        this._isCustomScroll = false;
    }

    _registerIt(
        event: SyntheticEvent,
        registerType: string,
        component: Control,
        callback: Function
    ): void {
        switch (registerType) {
            case 'scrollStateChanged':
                this._registrars.scrollStateChanged.register(
                    event,
                    registerType,
                    component,
                    callback
                );
                this._onRegisterNewComponent(component);
                break;
            case 'listScroll':
                // совместимость со списками
                this._registrars.listScroll.register(event, registerType, component, callback);
                // Списку нужны события canScroll и cantScroll в момент инициализации до того,
                // как у нас отработают обработчики и инициализируются состояние.
                if (!this._scrollModel) {
                    this._createScrollModel();
                }
                this._listCompatible.onRegisterNewListScrollComponent(
                    this._registrars.listScroll,
                    this._scrollModel,
                    component
                );
                break;
            case 'virtualScrollMove':
                this._registrars.virtualScrollMove.register(
                    event,
                    registerType,
                    component,
                    callback
                );
                break;
            case 'customscroll':
                this._registrars.customscroll.register(event, registerType, component, callback, {
                    listenAll: true,
                });
                break;
            case 'virtualNavigation':
                this._virtualNavigationRegistrar.register(event, registerType, component, callback);

                // Список на afterMount сообщает о том, нужно ли показывать контент сверху и снизу.
                // Но контент ниже списка строится после списка, и на момент события еще не построен.
                // Сообщаем нижнему VirtualScrollContainer'у состояние виртуальной навигации при его регистрации.
                callback('bottom', this._virtualNavigationState.bottom);
                break;
            case 'viewportResize':
                this._registrars.viewportResize.register(event, registerType, component, callback);
                break;
        }
    }

    _unRegisterIt(event: SyntheticEvent, registerType: string, component: Control): void {
        switch (registerType) {
            case 'scrollStateChanged':
                this._registrars.scrollStateChanged.unregister(event, registerType, component);
                break;
            case 'listScroll':
                this._registrars.listScroll.unregister(event, registerType, component);
                break;
            case 'virtualScrollMove':
                this._registrars.virtualScrollMove.unregister(event, registerType, component);
                break;
            case 'customscroll':
                this._registrars.customscroll.unregister(event, registerType, component, {
                    listenAll: true,
                });
                break;
            case 'virtualNavigation':
                this._virtualNavigationRegistrar.unregister(event, registerType, component);
                break;
            case 'viewportResize':
                this._registrars.viewportResize.unregister(event, registerType, component);
                break;
        }
    }

    protected _enableVirtualNavigationHandler(
        event: SyntheticEvent,
        position: 'top' | 'bottom'
    ): void {
        event.stopImmediatePropagation();
        this._virtualNavigationState[position] = true;
        this._virtualNavigationRegistrar.start(position, true);
        this._updateOverscrollBehavior();
    }

    protected _disableVirtualNavigationHandler(
        event: SyntheticEvent,
        position: 'top' | 'bottom'
    ): void {
        event.stopImmediatePropagation();
        this._virtualNavigationState[position] = false;
        this._virtualNavigationRegistrar.start(position, false);
        this._updateOverscrollBehavior();
    }

    /**
     * Прокручивает до указанных координат контейнера.
     * @name Controls/_scroll/Container#scrollTo
     * @param {String} direction - направление (vertical - по вертикали, horizontal - по горизонтали).
     * @param {Boolean} smooth - плавная прокрутка, по умолчанию false (необязательный).
     * @example
     * <pre class="brush: js">
     * _scrollTo(): void {
     *    this._children.scrollContainer.scrollTo(50, 'vertical');
     * }
     * </pre>
     */
    scrollTo(
        scrollPosition: number,
        direction: SCROLL_DIRECTION = SCROLL_DIRECTION.VERTICAL,
        smooth: boolean = false
    ): void {
        // Есть проблема с работой скролла на мобильных устройствах:
        // Если вызвать scrollTo с флагом smooth после другого подскролла
        // то плавный скролл отработает от предыдущей позиции и недоскроллит до нужного места
        if (detection.isMobileIOS) {
            this._setOverflowScrolling('hidden');
        }
        this._scrollTo(scrollPosition, direction, smooth);
        if (detection.isMobileIOS) {
            this._setOverflowScrolling('');
        }
    }

    /**
     * Возвращает true, если можно прокрутить к позиции offset.
     * @name Controls/_scroll/Container#canScrollTo
     * @param {Number} offset Позиция в пикселях
     * @see scrollToTop
     * @see scrollToBottom
     * @see scrollToLeft
     * @see scrollToRight
     * @see horizontalScrollTo
     */
    canScrollTo(offset: number): boolean {
        return offset <= this._scrollModel.scrollHeight - this._scrollModel.clientHeight;
    }

    /**
     * Прокручивает к выбранной позиции по горизонтали. Позиция определяется в пикселях от левого края контейнера.
     * @name Controls/_scroll/Container#horizontalScrollTo
     * @param {Number} offset Позиция в пикселях.
     * @see scrollToTop
     * @see scrollToBottom
     * @see scrollToLeft
     * @see scrollToRight
     * @see canScrollTo
     */

    /*
     * Scrolls to the given position from the top of the container.
     * @function Controls/_scroll/Container#scrollTo
     * @param {Number} Offset
     */
    horizontalScrollTo(offset: number): void {
        this.scrollTo(offset, SCROLL_DIRECTION.HORIZONTAL);
    }

    /**
     * Прокручивает к верху контейнера.
     * @name Controls/_scroll/Container#scrollToTop
     * @param {Boolean} smooth - плавная прокрутка, по умолчанию false.
     * @example
     * <pre class="brush: js">
     * _scrollToTop(): void {
     *    this._children.scrollContainer.scrollToTop(true);
     * }
     * </pre>
     * @see scrollToBottom
     * @see scrollToLeft
     * @see scrollToRight
     * @see horizontalScrollTo
     * @see canScrollTo
     */

    /*
     * Scrolls to the top of the container.
     * @name Controls/_scroll/Container#scrollToTop
     * @function
     */
    scrollToTop(smooth: boolean = false): void {
        // Есть проблема с работой скролла на мобильных устройствах:
        // Если вызвать scrollTo с флагом smooth после другого подскролла
        // то плавный скролл отработает от предыдущей позиции и недоскроллит до нужного места
        if (detection.isMobileIOS) {
            this._setOverflowScrolling('hidden');
        }
        this._setScrollTop(0, smooth);
        if (detection.isMobileIOS) {
            this._setOverflowScrolling('');
        }
    }

    /**
     * Прокручивает к левому краю контейнера.
     * @name Controls/_scroll/Container#scrollToLeft
     * @see scrollToTop
     * @see scrollToBottom
     * @see scrollToRight
     * @see horizontalScrollTo
     * @see canScrollTo
     */

    /*
     * Scrolls to the lefе of the container.
     * @name Controls/_scroll/Container#scrollToLeft
     * @function
     */
    scrollToLeft() {
        this.scrollTo(0, SCROLL_DIRECTION.HORIZONTAL);
    }

    /**
     * Прокручивает к низу контейнера.
     * @name Controls/_scroll/Container#scrollToBottom
     * @see scrollToTop
     * @see scrollToLeft
     * @see scrollToRight
     * @see horizontalScrollTo
     * @see canScrollTo
     */

    /*
     * Scrolls to the bottom of the container.
     * @name Controls/_scroll/Container#scrollToBottom
     * @function
     */
    scrollToBottom(): void {
        this._setScrollTop(
            this._children.content.scrollHeight -
                this._children.content.clientHeight +
                this._topPlaceholderSize
        );
    }

    /**
     * Прокручивает к правому краю контейнера.
     * @name Controls/_scroll/Container#scrollToRight
     * @see scrollToTop
     * @see scrollToBottom
     * @see scrollToLeft
     * @see horizontalScrollTo
     * @see canScrollTo
     */

    /*
     * Scrolls to the right of the container.
     * @name Controls/_scroll/Container#scrollToRight
     * @function
     */
    scrollToRight(): void {
        this.scrollTo(
            this._scrollModel.scrollWidth - this._scrollModel.clientWidth,
            SCROLL_DIRECTION.HORIZONTAL
        );
    }

    onScrollContainer(newState: IScrollState): void {
        this._updateStateAndGenerateEvents(newState);
    }

    _onRegisterNewComponent(component: Control): void {
        // Списку нужны события canScroll и cantScroll в момент инициализации до того,
        // как у нас отработают обработчики и инициализируются состояние.
        if (!this._scrollModel) {
            this._createScrollModel();
        }
        const scrollState = this._scrollModel.clone();
        const oldScrollState = this._oldScrollState.clone();
        this._registrars.scrollStateChanged.startOnceTarget(component, scrollState, oldScrollState);
    }

    _onResizeContainer(newState: IScrollState): void {
        if (this._resizeObserverSupported) {
            this._updateStateAndGenerateEvents(newState);
        } else {
            this._updateStateAndGenerateEvents(this._getFullStateFromDOM());
        }
    }

    protected _updateStateAndGenerateEvents(newState: IScrollState): void {
        const isStateUpdated = this._updateState(newState);
        const scrollState = this._scrollModel.clone();
        const oldScrollState = this._oldScrollState.clone();
        if (isStateUpdated) {
            this._logSizes(scrollState, oldScrollState);
            // Новое событие
            this._generateEvent('scrollStateChanged', [scrollState, oldScrollState]);

            if (scrollState.scrollHeight !== oldScrollState.scrollHeight) {
                this._generateEvent('scrollResize', [
                    {
                        scrollHeight: scrollState.scrollHeight,
                        clientHeight: scrollState.clientHeight,
                    },
                ]);
            }

            if (
                oldScrollState.clientHeight !== scrollState.clientHeight ||
                oldScrollState.clientWidth !== scrollState.clientWidth
            ) {
                this._generateEvent('viewportResize', [
                    {
                        scrollHeight: scrollState.scrollHeight,
                        scrollWidth: scrollState.scrollWidth,
                        scrollTop: scrollState.scrollTop,
                        scrollLeft: scrollState.scrollLeft,
                        clientHeight: scrollState.clientHeight,
                        clientWidth: scrollState.clientWidth,
                        rect: scrollState.viewPortRect,
                    },
                ]);
            }

            if (oldScrollState.scrollTop !== scrollState.scrollTop) {
                this._generateEvent('scrollMove', [
                    {
                        scrollTop: scrollState.scrollTop,
                        position: scrollState.verticalPosition,
                        clientHeight: scrollState.clientHeight,
                        scrollHeight: scrollState.scrollHeight,
                    },
                ]);
            }

            if (oldScrollState.scrollTop !== scrollState.scrollTop ||
                oldScrollState.scrollLeft !== scrollState.scrollLeft) {
                // Используем разные аргументы в событии для совместимости со старым скроллом
                this._generateEvent(
                    'customscroll',
                    [
                        new SyntheticEvent(null, {
                            type: 'customscroll',
                            target: this._children.content,
                            currentTarget: this._children.content,
                            _bubbling: false,
                        }),
                        scrollState.scrollTop,
                        scrollState.scrollLeft
                    ],
                    this._getScrollNotifyConfig()
                );
            }

            this._listCompatible.generateCompatibleEvents(
                this._registrars.listScroll,
                this._scrollModel,
                this._oldScrollState
            );
            this._updateOverscrollBehavior();
        } else if (this._isFirstUpdateState) {
            // При первом обновлении scrollState кидаем scrollStateChanged, чтобы можно было знать, с какими размерами
            // построился скролл контейнер.
            this._generateEvent('scrollStateChanged', [scrollState, oldScrollState]);
            this._isFirstUpdateState = false;
        }
    }

    _generateEvent(eventType: string, params: object[], notifyParams: object[] = params): void {
        this._registrars[eventType].start(...params);
        this._notify(eventType, notifyParams);
    }

    protected _generateCompatibleEvent(eventType: string): void {
        this._listCompatible.sendByListScrollRegistrar(this._registrars.listScroll, eventType, {});
    }

    _resizeObserverCallback(entries: object[]): void {
        if (isHidden(this._container) || this._container.closest('.controls-Popup__hidden')) {
            return;
        }
        const newState: IScrollState = {};
        for (const entry of entries) {
            if (entry.target === this._children.content) {
                newState.clientHeight = entry.contentRect.height;
                newState.clientWidth = entry.contentRect.width;
            } else {
                this._updateContentType();
                // Свойство borderBoxSize учитывает размеры отступов при расчете. Поддерживается не во всех браузерах.
                if (entry.borderBoxSize) {
                    const scrollStateProperties = {
                        scrollHeight: 'blockSize',
                    };
                    for (const property of Object.keys(scrollStateProperties)) {
                        const borderBoxSizeProperty = scrollStateProperties[property];
                        newState[property] =
                            entry.borderBoxSize[borderBoxSizeProperty] === undefined
                                ? entry.borderBoxSize[0][borderBoxSizeProperty]
                                : entry.borderBoxSize[borderBoxSizeProperty];
                    }
                } else {
                    newState.scrollHeight = entry.contentRect.height;
                }

                if (this._contentType === CONTENT_TYPE.restricted) {
                    newState.scrollHeight = this._getContentHeightByChildren();
                }
            }
        }

        // Списки имеют ширину равную ширине скролл контейнера, но в данном сценарии используется дерево
        // и контент вылазит по горизонтали за пределы корня списка и соответсвенно скролл контейнера.
        // Иконки должны прижиматься к правому краю и, в том числе по этой причине, мы не можем растянуть
        // корневой контейнер списка шире скролл контейнера. Поэтому берем ширину с помощью scrollWidth.
        // В данном сценарии мы не можем отследить изменение ширины потому что она не меняется,
        // меняется высота. Но этого триггера достаточно, т.к. добавление людого контента в списках приводят
        // к изменению высоты.
        newState.scrollWidth = this._children.content.scrollWidth;

        if (newState.scrollHeight < newState.clientHeight) {
            newState.scrollHeight = newState.clientHeight;
        }
        if (newState.scrollWidth < newState.clientWidth) {
            newState.scrollWidth = newState.clientWidth;
        }
        if (newState.clientHeight) {
            newState.clientHeight = this._getMobileClientHeight(newState.clientHeight);
        }
        this._updateStateAndGenerateEvents(newState);
    }

    _updateContentType(newValue?: CONTENT_TYPE): void {
        const contentType: CONTENT_TYPE = newValue || this._getContentType();
        if (this._contentType !== contentType) {
            this._contentType = contentType;
            this._updateContentWrapperCssClass();
        }
    }

    _getContentType(): CONTENT_TYPE {
        let contentType: CONTENT_TYPE = CONTENT_TYPE.regular;
        const firstContentChild: HTMLElement = this._children.userContent.children?.[0];
        if (firstContentChild) {
            const classList = firstContentChild.classList;
            if (classList.contains('controls-Scroll-Container__notScrollable')) {
                contentType = CONTENT_TYPE.notScrollable;
            } else if (classList.contains('Hint-ListWrapper')) {
                contentType = CONTENT_TYPE.restricted;
            }
        }
        return contentType;
    }

    _getContentHeightByChildren(): number {
        // Если контент был меньше скролируемой области, то его размер может не поменяться, когда меняется размер
        // скролл контейнера.
        // Плюс мы не можем брать размеры из события, т.к. на размеры скроллируемого контента могут влиять
        // маргины на вложенных контейнерах. Плюс в корне скрол контейнера может лежать несколько контейнеров.
        // Раньше scrollHeight считался следующим образом.
        // newState.scrollHeight = entry.contentRect.height;
        // newState.scrollWidth = entry.contentRect.width;
        let heigth = 0;

        for (const child of this._getElementsForHeightCalculation()) {
            heigth += this._calculateScrollHeight(child);
        }
        return heigth;
    }

    _getElementsForHeightCalculation(container?: HTMLElement): HTMLElement[] {
        const elements: HTMLElement[] = [];
        const _container: HTMLElement = container || this._children.userContent;

        for (const containerChild of _container.children) {
            const ignoredChild = this._getIgnoredChild(containerChild);
            if (ignoredChild) {
                for (const child of ignoredChild) {
                    elements.push(child);
                }
            } else {
                elements.push(containerChild);
            }
        }

        return elements;
    }

    _getIgnoredChild(container: HTMLElement): HTMLCollection {
        // В контроле Hint/Template:ListWrapper на корневую ноду навешивается стиль height: 100% из-за чего
        // неправильно рассчитывается scrollHeight. Будем рассчитывать высоту через дочерние элементы.
        // Должно удалиться, когда перейдем на замеры по div скроллконтейнера
        if (container.classList.contains('Hint-ListWrapper')) {
            return container.children;
        }
        return null;
    }

    _calculateScrollHeight(element: HTMLElement): number {
        return (
            element.offsetHeight +
            parseFloat(window.getComputedStyle(element).marginTop) +
            parseFloat(window.getComputedStyle(element).marginBottom)
        );
    }

    _getFullStateFromDOM(): IScrollState {
        // Используем getBoundingClientRect а не clientHeight и clientWidth потому что, clientHeight и clientWidth
        // возвращают округленные целые значения. В событиях ресайза приходят дробные значения соответсвующие
        // getBoundingClientRect. Если использовать clientHeight и clientWidth, то будут генериоваться лишние
        // события сообщающие что изменился размер скорлл контейнера на значения меньше одного пикселя.
        let containerRect: DOMRect = this._children.content.getBoundingClientRect();
        // Есть проблема, когда скрол находится внутри transform: scale(), из-за чего значения получаются не корректными.
        // Поэтому если разница большая, то используем clientHeight/clientWidth
        if (containerRect.width + DIFF_CONTAINER_SIZE < this._children.content.clientWidth) {
            containerRect.width = this._children.content.clientWidth;
        }
        if (containerRect.height + DIFF_CONTAINER_SIZE < this._children.content.clientHeight) {
            containerRect.height = this._children.content.clientHeight;
        }
        // Если размеры контента равны размеру контейнера, то может оказаться, что контейнер растянули на 100%, а
        // контента внутри по высоте меньше. Посчитаем отдельно размеры контент нод.
        let contentClientHeight = containerRect.height;
        if (this._children.content.scrollHeight === containerRect.height) {
            contentClientHeight = this._getContentHeight();
        }
        let _scrollTop = this._children.content.scrollTop;
        let _scrollLeft = this._children.content.scrollLeft;
        let _scrollHeight = this._children.content.scrollHeight;
        if (
            getStore('AdaptiveInitializer').get('isScrollOnBody') &&
            contentClientHeight > window.screen.height
        ) {
            containerRect = document.scrollingElement.getBoundingClientRect();
            _scrollTop = document.scrollingElement.scrollTop;
            _scrollLeft = document.scrollingElement.scrollLeft;
            _scrollHeight = document.scrollingElement.scrollHeight;
        }
        return {
            contentClientHeight,
            scrollTop: _scrollTop,
            scrollLeft: _scrollLeft,
            clientHeight: this._getMobileClientHeight(containerRect.height),
            // В observer берем с content, иначе значения будут отличаться
            scrollHeight: _scrollHeight,
            clientWidth: containerRect.width,
            scrollWidth: this._children.content.scrollWidth,
            canVerticalScroll: canScrollByState(
                {
                    clientHeight: containerRect.height,
                    scrollHeight: _scrollHeight,
                },
                SCROLL_DIRECTION.VERTICAL
            ),
            canHorizontalScroll: canScrollByState(
                {
                    clientWidth: containerRect.width,
                    scrollWidth: this._children.content.scrollWidth,
                },
                SCROLL_DIRECTION.HORIZONTAL
            ),
            verticalPosition: this._children.content.scrollTop === 0 ? 'start' : 'middle',
            horizontalPosition: this._children.content.scrollLeft === 0 ? 'start' : 'middle',
        };
    }

    /**
     * Рассчитываем высоту контента с учетом адаптива
     * на телефонах скролл переводится на body поэтому надо предотвратить бесконечную загрузку данных в списке
     * для этого ограничим максимальную высоту высотой экрана
     */
    private _getMobileClientHeight(currentHeight: number): number {
        // @ts-ignore
        if (this.props.isAdaptive && currentHeight > window.screen.height) {
            return window.screen.height;
        }
        return currentHeight;
    }

    private _getContentHeight(): number {
        const contentNodes = Array.from(
            this._children.userContent.querySelectorAll<HTMLElement[]>(`.${USER_CONTENT_CLASS}`)
        ).filter((node: HTMLElement) => {
            return node.parentNode === this._children.userContent;
        });
        let contentRect;
        let contentHeight = 0;
        for (let i = 0; i < contentNodes.length; i++) {
            let contentNode = contentNodes[i];
            // В контроле Hint/Template:ListWrapper на корневую ноду навешивается стиль height: 100% из-за чего
            // неправильно рассчитывается clientHeight. Будем читать размеры через дочерний элемент.
            if (contentNodes[i].classList.contains('Hint-ListWrapper')) {
                contentNode = contentNodes[i].children[0];
            }
            contentRect = contentNode.getBoundingClientRect();
            contentHeight += contentRect.height;
        }
        return contentHeight;
    }

    private _createScrollModel(): void {
        const scrollState = this._getFullStateFromDOM();
        const { content } = this._children;
        this._scrollModel = new ScrollModel(content, scrollState);
        this._oldScrollState = new ScrollModel(content, {});
    }

    _updateState(newState: IScrollState): boolean {
        if (!this._scrollModel) {
            this._createScrollModel();
        } else {
            this._oldScrollState = this._scrollModel.clone();
        }
        return this._scrollModel.updateState(newState);
    }

    /* При получении фокуса input'ами на IOS13, может вызывается подскролл у ближайшего контейнера со скролом,
       IPAD пытается переместить input к верху страницы. Проблема не повторяется,
       если input будет выше клавиатуры после открытия. */
    _lockScrollPositionUntilKeyboardShown(): void {
        // Если модель не инициализирована, значить точно не было скролирования и scrollTop равен 0.
        this._scrollLockedPosition = this._scrollModel?.scrollTop || 0;
        setTimeout(() => {
            this._scrollLockedPosition = null;
        }, KEYBOARD_SHOWING_DURATION);
    }

    protected _doScrollHandler(
        e: SyntheticEvent<null>,
        scrollParam: number | string,
        isVirtual: boolean
    ): void {
        this._doScrollBaseHandler(e, SCROLL_DIRECTION.VERTICAL, scrollParam, isVirtual);
    }

    protected _doHorizontalScrollHandler(
        e: SyntheticEvent<null>,
        scrollParam: number | 'pageUp' | 'pageDown'
    ): void {
        if (this._options.disableScrollReaction) {
            return;
        }

        let position;
        if (typeof scrollParam === 'string') {
            const scrollLeft = this._scrollModel.scrollLeft;
            const clientWidth = this._scrollModel.clientWidth;
            const fixedHeadersWidth = getHeadersWidth(
                this._container,
                StickyPosition.Left,
                TypeFixedBlocks.AllFixed
            );
            const getInRange = (value: number) => {
                return Math.max(Math.min(value, this._scrollModel.scrollWidth), 0);
            };

            position =
                scrollParam === 'pageUp'
                    ? getInRange(scrollLeft - clientWidth + fixedHeadersWidth)
                    : getInRange(scrollLeft + clientWidth - fixedHeadersWidth);
        } else {
            position = scrollParam;
        }
        this._doScrollBaseHandler(e, SCROLL_DIRECTION.HORIZONTAL, position);
    }

    private _doScrollBaseHandler(
        e: SyntheticEvent<null>,
        direction: SCROLL_DIRECTION,
        scrollParam: number | string,
        isVirtual?: boolean
    ): void {
        // overflow scrolling на ipad мешает восстановлению скролла. Поэтому перед восстановлением его выключаем.
        if (detection.isMobileIOS) {
            this._setOverflowScrolling('hidden');
        }
        if (direction === SCROLL_DIRECTION.VERTICAL) {
            this._doScroll(scrollParam as string, isVirtual);
        } else {
            this._scrollTo(
                scrollParam as number,
                SCROLL_DIRECTION.HORIZONTAL,
                this._options.smoothScrolling
            );
        }
        if (detection.isMobileIOS) {
            this._setOverflowScrolling('');
        }
        e.stopPropagation();
    }

    protected _doScroll(scrollParam: string, isVirtualNavigation: boolean): void {
        if (scrollParam === 'top') {
            this._setScrollTop(0);
        } else {
            const headersHeight =
                getHeadersHeight(this._container, StickyPosition.Top, TypeFixedBlocks.AllFixed) ||
                0;
            const clientHeight = this._scrollModel.clientHeight - headersHeight;
            const scrollHeight =
                this._scrollModel.scrollHeight +
                (this._isVirtualPlaceholderMode() ? this._topPlaceholderSize : 0);
            const currentScrollTop =
                this._scrollModel.scrollTop +
                (this._isVirtualPlaceholderMode() ? this._topPlaceholderSize : 0);
            if (scrollParam === 'bottom') {
                this._setScrollTop(scrollHeight - clientHeight);
            } else if (scrollParam === 'pageUp') {
                this._setScrollTop(currentScrollTop - clientHeight);
            } else if (scrollParam === 'pageDown') {
                this._setScrollTop(currentScrollTop + clientHeight);
            } else if (typeof scrollParam === 'number') {
                this._setScrollTop(scrollParam, false, isVirtualNavigation);
            }
        }
    }

    protected _getScrollContainerCssClass(options: IContainerBaseOptions): string {
        switch (options.scrollOrientation) {
            case SCROLL_MODE.VERTICAL:
                return 'controls-Scroll-ContainerBase__scroll_vertical';
            case SCROLL_MODE.HORIZONTAL:
                return 'controls-Scroll-ContainerBase__scroll_horizontal';
            case SCROLL_MODE.NONE:
                return 'controls-Scroll-ContainerBase__scroll_none';
            default:
                return 'controls-Scroll-ContainerBase__scroll_verticalHorizontal';
        }
    }

    protected _updateContentWrapperCssClass(): void {
        const cssClass: string = this._getContentWrapperCssClass();
        if (cssClass !== this._contentWrapperCssClass) {
            this._contentWrapperCssClass = this._getContentWrapperCssClass();
        }
    }

    protected _getContentWrapperCssClass(): string {
        return this._contentType !== CONTENT_TYPE.regular
            ? 'controls-Scroll-ContainerBase__contentNotScrollable'
            : '';
    }

    // Слой совместимости с таблицами

    _scrollToElement(
        event: SyntheticEvent<Event>,
        { itemContainer, position, force, offset, smooth, onlyFirstScrollableParent }
    ): Promise<void> {
        this._isCustomScroll = true;
        return this._scrollToElementByOrientation(
            event,
            SCROLL_DIRECTION.VERTICAL,
            itemContainer,
            position,
            force,
            offset,
            smooth,
            onlyFirstScrollableParent
        );
    }

    _horizontalScrollToElement(
        event: SyntheticEvent<Event>,
        { itemContainer, position, force, offset, smooth, onlyFirstScrollableParent }
    ): Promise<void> {
        return this._scrollToElementByOrientation(
            event,
            SCROLL_DIRECTION.HORIZONTAL,
            itemContainer,
            position,
            force,
            offset,
            smooth,
            onlyFirstScrollableParent
        );
    }

    _scrollToElementByOrientation(
        event: SyntheticEvent<Event>,
        orientation: SCROLL_DIRECTION,
        itemContainer: HTMLElement,
        position: TScrollPosition,
        force: boolean,
        offset: number,
        smooth: boolean,
        onlyFirstScrollableParent: boolean
    ): Promise<void> {
        // Есть кейсы, когда scrollToElement вызывается до componentDidMount. По этому флагу не будем сбрасывать
        // scrollTop в componentDidMount.
        this._scrollToElementCalled = true;
        event.stopPropagation();
        const scrollMethod =
            orientation === SCROLL_DIRECTION.VERTICAL ? scrollToElement : horizontalScrollToElement;
        const promise = scrollMethod(
            itemContainer,
            position,
            force,
            true,
            offset,
            smooth,
            onlyFirstScrollableParent
        );
        // Если скроллим к какому-то элементу, и работает автоскрол, то отключаем автоскролл
        this._autoScroll?.stopAutoScroll();
        /*
         * Синхронно обновляем состояние скрол контейнера, что бы корректно работали другие синхронные вызовы api скролл контейнера которое зависят от текущего состояния.
         */
        this.onScrollContainer({
            scrollTop: this._children.content.scrollTop,
            scrollLeft: this._children.content.scrollLeft,
        });
        return promise;
    }

    //# region Autoscroll (Скролл при DnD)

    private _onDragStart(dragObject: { entity: Entity; domEvent: MouseEvent }): void {
        this._dnDAutoScroll.onDragStart(dragObject);
        if (TouchDetect.getInstance().isTouch()) {
            // Выключаем проскролл от тача в момент начала драга. Вешаем overflow: hidden напрямую на ноду,
            // чтобы не было дерганий.
            this._children.content.style.overflow = 'hidden';
        }
    }

    private _onDragEnd(): void {
        this._dnDAutoScroll.onDragEnd();
        if (TouchDetect.getInstance().isTouch()) {
            this._children.content.style.overflow = '';
        }
    }

    /**
     * Обрабатываем движение курсором мыши для того, что бы инициировать автоскролл когда курсор
     * подходит к верхней или нижней границе контейнера
     */
    protected _onMouseMove(event: SyntheticEvent): void {
        const horizontalScrollAvailable =
            this._options.horizontalScrollMode === 'buttonsArea' &&
            this._options.scrollOrientation !== 'verticalHorizontal';
        const verticalScrollAvailable =
            this._options.verticalScrollMode === 'buttonsArea' &&
            this._options.scrollOrientation !== 'verticalHorizontal';
        this._dnDAutoScroll.onMouseMove(event, verticalScrollAvailable, horizontalScrollAvailable);
    }

    protected _onMouseLeave(): void {
        this._dnDAutoScroll.onMouseLeave();
    }

    //# endregion Autoscroll

    // Виртуальный скролл

    private _isVirtualPlaceholderMode(): boolean {
        return (
            !!this._topPlaceholderSize ||
            !!this._bottomPlaceholderSize ||
            !!this._leftPlaceholderSize ||
            !!this._rightPlaceholderSize
        );
    }

    updatePlaceholdersSize(placeholdersSizes: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    }): void {
        const getValue = (newValue, oldValue) => {
            return typeof newValue !== 'undefined' ? newValue : oldValue;
        };

        this._topPlaceholderSize = getValue(placeholdersSizes.top, this._topPlaceholderSize);
        this._bottomPlaceholderSize = getValue(
            placeholdersSizes.bottom,
            this._bottomPlaceholderSize
        );
        this._leftPlaceholderSize = getValue(placeholdersSizes.left, this._leftPlaceholderSize);
        this._rightPlaceholderSize = getValue(placeholdersSizes.right, this._rightPlaceholderSize);
    }

    private _scrollTo(
        scrollPosition: number,
        direction: SCROLL_DIRECTION = SCROLL_DIRECTION.VERTICAL,
        smooth: boolean
    ): number {
        this._isCustomScroll = true;
        const scrollContainer: HTMLElement = this._children.content;
        let scrollOrientation;

        if (smooth) {
            scrollOrientation = direction === SCROLL_DIRECTION.VERTICAL ? 'top' : 'left';
            scrollContainer.scrollTo({
                [scrollOrientation]: scrollPosition,
                behavior: 'smooth',
            });
            return scrollPosition;
        } else {
            scrollOrientation =
                direction === SCROLL_DIRECTION.VERTICAL ? 'scrollTop' : 'scrollLeft';
            if (
                getStore('AdaptiveInitializer').get('isScrollOnBody') &&
                scrollContainer.offsetHeight > window.screen.height
            ) {
                document.scrollingElement.scrollTop = scrollPosition;
                return document.scrollingElement.scrollTop;
            }
            scrollContainer[scrollOrientation] = scrollPosition;
            return scrollContainer[scrollOrientation];
        }
    }

    protected _setScrollTop(
        scrollTop: number,
        smooth: boolean = false,
        withoutPlaceholder?: boolean
    ): void {
        this._isCustomScroll = true;
        if (this._options.scrollOrientation === SCROLL_MODE.NONE) {
            return;
        }

        if (this._isVirtualPlaceholderMode() && !withoutPlaceholder) {
            const scrollState: ScrollModel = this._scrollModel;
            const cachedScrollTop = scrollTop;
            const realScrollTop = scrollTop - this._topPlaceholderSize;
            const scrollTopOverflow =
                scrollState.scrollHeight - realScrollTop - scrollState.clientHeight < 0;
            const applyScrollTop = () => {
                // нужный scrollTop будет отличным от realScrollTop, если изменился _topPlaceholderSize.
                // Вычисляем его по месту
                return this._scrollTo(
                    cachedScrollTop - this._topPlaceholderSize,
                    SCROLL_DIRECTION.VERTICAL,
                    smooth
                );
            };
            if (realScrollTop >= 0 && !scrollTopOverflow) {
                this._scrollTo(realScrollTop, SCROLL_DIRECTION.VERTICAL, smooth);
            } else if (
                (this._topPlaceholderSize === 0 && realScrollTop < 0) ||
                (scrollTopOverflow && this._bottomPlaceholderSize === 0)
            ) {
                applyScrollTop();
            } else {
                const scrollStateClone = this._scrollModel.clone();
                this._generateEvent('virtualScrollMove', [
                    {
                        scrollTop,
                        scrollState: scrollStateClone,
                        applyScrollTopCallback: applyScrollTop,
                    },
                ]);
                // TODO: Удалить после перехода списков на новые события
                //  https://online.sbis.ru/opendoc.html?guid=ca70827b-ee39-4d20-bf8c-32b10d286682
                this._listCompatible.sendByListScrollRegistrar(
                    this._registrars.listScroll,
                    'virtualScrollMove',
                    {
                        scrollTop,
                        scrollHeight: scrollStateClone.scrollHeight,
                        clientHeight: scrollStateClone.clientHeight,
                        applyScrollTopCallback: applyScrollTop,
                    }
                );
            }
        } else {
            const newScrollTop = this._scrollTo(scrollTop, SCROLL_DIRECTION.VERTICAL, smooth);
            this._updateStateAndGenerateEvents({
                scrollTop: newScrollTop,
            });
        }
    }

    _updatePlaceholdersSize(e: SyntheticEvent<Event>, placeholdersSizes: object): void {
        this.updatePlaceholdersSize(placeholdersSizes);
    }

    private _setOverflowScrolling(value: string): void {
        this._children.content.style.overflow = value;
    }

    private _updateOverscrollBehavior(): void {
        if (!this._hasOuterContainer || this._options.scrollOrientation !== SCROLL_MODE.VERTICAL) {
            this._overscrollBehavior = OverscrollBehavior.Auto;
            return;
        }

        if (
            (this._virtualNavigationState.top && this._virtualNavigationState.bottom) ||
            (this._scrollModel.verticalPosition === SCROLL_POSITION.START &&
                this._virtualNavigationState.top) ||
            (this._scrollModel.verticalPosition === SCROLL_POSITION.END &&
                this._virtualNavigationState.bottom)
        ) {
            this._overscrollBehavior = OverscrollBehavior.Contain;
        } else {
            this._overscrollBehavior = OverscrollBehavior.Auto;
        }
    }

    protected _getContentDirectionClass(): string {
        if (this._horizontalScrollMode === 'custom') {
            return '';
        }
        if (this._options.scrollOrientation === SCROLL_MODE.HORIZONTAL) {
            return this._options.horizontalContentFit === 'contain'
                ? 'controls-Scroll-ContainerBase__content-direction_column'
                : '';
        }
        return 'controls-Scroll-ContainerBase__content-direction_column';
    }

    // TODO: система событий неправильно прокидывает аргументы из шаблонов, будет исправлено тут:
    // https://online.sbis.ru/opendoc.html?guid=19d6ff31-3912-4d11-976f-40f7e205e90a
    protected _selectedKeysChanged(event: SyntheticEvent): void {
        this._proxyEvent(event, 'selectedKeysChanged', Array.prototype.slice.call(arguments, 1));
    }

    protected _excludedKeysChanged(event: SyntheticEvent): void {
        this._proxyEvent(event, 'excludedKeysChanged', Array.prototype.slice.call(arguments, 1));
    }

    protected _listSelectedKeysCountChanged(event: SyntheticEvent): void {
        this._proxyEvent(
            event,
            'listSelectedKeysCountChanged',
            Array.prototype.slice.call(arguments, 1)
        );
    }

    protected _itemClick(event: SyntheticEvent): unknown {
        return this._proxyEvent(event, 'itemClick', Array.prototype.slice.call(arguments, 1));
    }

    protected _proxyEvent(event: SyntheticEvent, eventName: string, args: object[]): unknown {
        // Forwarding bubbling events makes no sense.
        if (!event.propagating()) {
            return this._notify(eventName, args) || event.result;
        }
    }

    private _logScrollPosition(scrollTop: number, scrollLeft: number): void {
        if (ContainerBase._debug) {
            let msg: string = 'Controls/scroll:ContainerBase: изменение положения скролла.';

            if (this._lastLogState.top !== scrollTop) {
                msg += ` По вертикали: новое ${scrollTop}, старое ${this._lastLogState.top}.`;
            }
            if (this._lastLogState.left !== scrollLeft) {
                msg += ` По горизонтали: новое ${scrollLeft}, старое ${this._lastLogState.left}.`;
            }

            this._lastLogState.top = scrollTop;
            this._lastLogState.left = scrollLeft;

            Logger.warn(msg, this);
        }
    }

    private _logSizes(state: IScrollState, oldState: IScrollState): void {
        if (ContainerBase._debug) {
            let msg: string = '';

            for (const field of ['clientHeight', 'scrollHeight', 'clientWidth', 'scrollWidth']) {
                if (state[field] !== oldState[field]) {
                    msg += ` ${field}: новое ${state[field]}, старое ${oldState[field]}.`;
                }
            }
            if (msg) {
                Logger.warn(`Controls/scroll:ContainerBase: изменение размеров. ${msg}`, this);
            }
        }
    }

    static _debug: boolean = false;

    static setDebug(debug: boolean): void {
        ContainerBase._debug = debug;
    }

    static getOptionTypes(): object {
        return {
            scrollOrientation: descriptor(String).oneOf([
                SCROLL_MODE.VERTICAL,
                SCROLL_MODE.HORIZONTAL,
                SCROLL_MODE.VERTICAL_HORIZONTAL,
                SCROLL_MODE.NONE,
            ]),
        };
    }

    static getDefaultOptions(): object {
        return {
            scrollOrientation: 'vertical',
            disableScrollReaction: false,
        };
    }
}

/**
 * @typedef {String | Number} Controls/_scroll/ContainerBase/TInitialScrollPosition
 * @variant start - Положение скрола в скролл контейнере находиться в начале.
 * @variant end - Положение скрола в скролл контейнере находиться в конце.
 * @variant Значение в пикселях - Положение скролла в скролл контейнере в момент построения.
 */

/**
 * @typedef {Object} Controls/_scroll/ContainerBase/initialScrollPosition
 * @property {Controls/_scroll/ContainerBase/TInitialScrollPosition} [vertical] Определяет положение скрола в момент инициализации по вертикали.
 * @property {Controls/_scroll/ContainerBase/TInitialScrollPosition} [horizontal] Определяет положение скрола в момент инициализации по горизонтали.
 */

/**
 * Определяет положение скрола в момент инициализации.
 * @name Controls/_scroll/Container#initialScrollPosition
 * @cfg {Controls/_scroll/ContainerBase/initialScrollPosition}
 * @demo Controls-demo/Scroll/Container/InitialScrollPosition/Index
 * @remark
 * Примечания к использованию опции со значением в пикселях:
 * <ul>
 *     <li>Не рекомендуется использовать числовые значения с прилипающими блоками в контенте, т.к. после построения будет скачок прилипаюших блоков.</li>
 *     <li>Для отображения теней на момент построения установите shadowMode="js".</li>
 * </ul>
 */
