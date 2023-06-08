/**
 * @kaizen_zone 7b560386-8131-481a-b9c0-8b3ede6f29a0
 */
import { compatibility, constants, detection } from 'Env/Env';
import { SyntheticEvent } from 'Vdom/Vdom';
import { TemplateFunction } from 'UI/Base';
import ContainerBase, { IContainerBaseOptions } from 'Controls/_scroll/ContainerBase';
import Observer from './IntersectionObserver/Observer';
import ShadowsModel from './Container/ShadowsModel';
import ScrollbarsModel from './Container/ScrollbarsModel';
import PagingModel, { TPagingModeScroll } from './Container/PagingModel';
import {
    getDefaultOptions as getScrollModeDefaultOptions,
    IScrollMode,
    IScrollModeOptions,
    THorizontalScrollMode,
} from './Container/Interface/IScrollMode';
import {
    getDefaultOptions as getShadowsDefaultOptions,
    IShadowsOptions,
    IShadowsVisibilityByInnerComponents,
    SHADOW_MODE,
    SHADOW_VISIBILITY,
} from './Container/Interface/IShadows';
import { IIntersectionObserverObject } from './IntersectionObserver/Types';
import { POSITION, SCROLL_MODE } from './Container/Type';
import { getScrollPositionByState, SCROLL_DIRECTION, SCROLL_POSITION } from './Utils/Scroll';
import ArrowButtonsModel from 'Controls/_scroll/Container/ArrowButtonsModel';
import { IHasUnrenderedContent, IScrollState } from './Utils/ScrollState';
import { descriptor } from 'Types/entity';
import {
    StickyPosition,
    TypeFixedBlocks,
    _IStickyDataContext as IStickyDataContext,
    _IStickyGroupDataContext as IStickyGroupDataContext,
    _StickyController as StickyController,
} from 'Controls/stickyBlock';
import { LocalStorageNative } from 'Browser/Storage';
import template = require('wml!Controls/_scroll/Container/Container');
import baseTemplate = require('wml!Controls/_scroll/ContainerBase/ContainerBase');
import 'css!Controls/scroll';

// Шаг для скролла.
export const BUTTONS_SCROLL_STEP = 300;

/**
 * @typedef {String} TPagingPosition
 * @variant left Отображения пэйджинга слева.
 * @variant right Отображения пэйджинга справа.
 */
type TPagingPosition = 'left' | 'right';

export interface IContainerOptions
    extends IContainerBaseOptions,
        IShadowsOptions,
        IScrollModeOptions {
    backgroundStyle: string;
    pagingMode?: TPagingModeScroll;
    pagingContentTemplate?: Function | string;
    pagingPosition?: TPagingPosition;
    pagingVisible: boolean;
    syncDomOptimization: boolean;
    // Скрываем скроллбар, даже если не было зарегистрировано использование колесика мыши.
    // Применяется в карусели, где для скролла используются стрелки влево-вправо.
    forceScrollbarVisible: boolean;
}

interface IBlockSize {
    rect: DOMRect;
    block: object;
}

const SCROLL_BY_ARROWS = 40;
const DEFAULT_BACKGROUND_STYLE = 'default';
/**
 * Контейнер с тонким скроллом.
 *
 * @remark
 * Контрол работает как нативный скролл: скроллбар появляется, когда высота контента больше высоты контрола. Для корректной работы контрола необходимо ограничить его высоту.
 * Для корректной работы внутри WS3 необходимо поместить контрол в контроллер Controls/dragnDrop:Compound, который обеспечит работу функционала Drag-n-Drop.
 *
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-22.6000/Controls-default-theme/variables/_scroll.less переменные тем оформления}
 *
 * @class Controls/_scroll/Container
 * @extends Controls/_scroll/ContainerBase
 * @implements Controls/scroll:IShadows
 * @implements Controls/scroll:IScrollMode
 *
 * @public
 * @demo Controls-demo/Scroll/Container/Default/Index
 *
 */

/*
 * Container with thin scrollbar.
 *
 * @class Controls/_scroll/Container
 * @extends Controls/_scroll/ContainerBase
 *
 * @public
 * @author Пьянков С.А.
 * @demo Controls-demo/Scroll/Container/Default/Index
 *
 */
export default class Container extends ContainerBase<IContainerOptions> implements IScrollMode {
    readonly '[Controls/_scroll/Container/Interface/IShadows]': boolean = true;
    readonly '[Controls/_scroll/Container/Interface/IScrollMode]': boolean = true;
    readonly _moduleName: string = 'Controls/scroll:Container';

    protected _template: TemplateFunction = template;
    protected _baseTemplate: TemplateFunction = baseTemplate;
    protected _options: IContainerOptions;

    protected _shadows: ShadowsModel;
    protected _scrollbars: ScrollbarsModel;
    protected _arrowButtons: ArrowButtonsModel;
    protected _paging: PagingModel;
    protected _dragging: boolean = false;
    protected _stickyModelsContext: IStickyDataContext;
    protected _stickyGroupModelsContext: IStickyGroupDataContext;
    protected _dispatchStickyContextCallback: Function = this._dispatchStickyContext.bind(this);
    protected _initialScrollPositionStyle: string;
    protected _getShadowClassesCallback: Function;
    protected _arrowButtonHandlerCallback: Function;
    protected _positionChangedHandlerCallback: Function;
    protected _draggingChangedHandlerCallback: Function;

    protected _intersectionObserverController: Observer;
    protected _stickyController: StickyController;
    protected _setStickyContextUpdaterCallback: Function;
    protected _updateStickyContext: Function;

    protected _verticalScrollbarPadding: object = { start: false, end: false };
    protected _horizontalScrollbarPadding: object = {
        start: false,
        end: false,
    };
    protected _isOptimizeShadowEnabled: boolean;
    protected _optimizeShadowClass: string;
    protected _setPagingVisibleCallback: Function;
    private _isControllerInitialized: boolean;
    private _wasMouseEnter: boolean = false;
    private _isScrollEventFired: boolean = false;
    private _gridAutoShadows: boolean = true;
    private _pagingVisible: boolean;

    private _arrowButtonClickCallback: Function = null;
    private _horizontalScrollMode: THorizontalScrollMode;
    private _isHorizontalScrollModeSetFromCallback: boolean;
    private _scrollbarVisible:
        | boolean
        | {
              vertical: boolean;
              horizontal: boolean;
          };
    private _isFirstUpdateState: boolean = true;

    private _containerLoadedResolve: Function;
    private _containerLoaded: Promise<void> | boolean;

    private _mouseEnterHandled: boolean = false;

    /**
     * флаг необходим чтобы переключит скролл на body в адаптиве,
     * альтернатива в виде определения по moduleName выглядит не очень
     */
    protected _$isScrollContainer: boolean = true;

    get containerLoaded(): Promise<void> | boolean {
        return this._containerLoaded;
    }

    _beforeMount(options: IContainerOptions): void {
        // TODO при переписывании учесть, что StickyController должен создаваться только тогда, когда есть стики блоки.
        this._stickyController = new StickyController(
            this._dispatchStickyContextCallback,
            this._stickyFixedCallback.bind(this),
            this._headersResizeHandler.bind(this)
        );
        this._horizontalScrollMode = options.horizontalScrollMode;
        this._setHorizontalScrollMode = this._setHorizontalScrollMode.bind(this, [options]);
        this._setArrowButtonClickCallback = this._setArrowButtonClickCallback.bind(this);
        this._removeArrowButtonClickCallback = this._removeArrowButtonClickCallback.bind(this);
        this._shadows = new ShadowsModel({
            initialScrollPosition: options.initialScrollPosition,
            ...this._getShadowsModelOptions(options),
        });
        this._scrollbars = new ScrollbarsModel(options);
        if (this._shouldDisplayArrowButtons(options)) {
            this._arrowButtons = new ArrowButtonsModel();
        }
        // При инициализации оптимизированные тени включаем только если они явно включены, или включен режим auto.
        // В режиме mixed используем тени на css что бы не вызывать лишние синхронизации. Когда пользователь наведет
        // мышкой на скролл контейнер или по другим обнавлениям тени начнут работать через js.
        this._isOptimizeShadowEnabled =
            Container._isCssShadowsSupported() &&
            (options.shadowMode === SHADOW_MODE.CSS ||
                (options.shadowMode === SHADOW_MODE.MIXED &&
                    (options.topShadowVisibility === SHADOW_VISIBILITY.AUTO ||
                        options.bottomShadowVisibility === SHADOW_VISIBILITY.AUTO ||
                        options.topShadowVisibility === SHADOW_VISIBILITY.GRIDAUTO ||
                        options.bottomShadowVisibility === SHADOW_VISIBILITY.GRIDAUTO)));
        this._optimizeShadowClass = this._getOptimizeShadowClass(options);
        this._containerLoaded = new Promise<void>((res) => {
            this._containerLoadedResolve = res;
        });
        this._setStickyContextUpdaterCallback = this._setStickyContextUpdater.bind(this);
        this._initialScrollPositionStyle = this._getInitialScrollPositionStyle(options);
        this._setPagingVisibleCallback = this._setPagingVisible.bind(this);
        this._getShadowClassesCallback = this._getShadowClasses.bind(this);
        this._arrowButtonHandlerCallback = this._arrowButtonHandler.bind(this);
        this._positionChangedHandlerCallback = this._positionChangedHandler.bind(this);
        this._draggingChangedHandlerCallback = this._draggingChangedHandler.bind(this);
        super._beforeMount(...arguments);
    }

    _afterMount(options: IContainerOptions): void {
        // Будем показывать скроллбар до тех пор, пока пользователь не воспользовался колесиком мышки, даже если
        // прикладник задал опцию scrollbarVisible=false.
        // Таким образом пользователи без колесика мышки смогут скроллить контент.
        // Если пользователь использовал колесико мышки - записываем это в localstorage
        const wheelHappened =
            LocalStorageNative.getItem('scrollContainerWheelEventHappened') === 'true';
        this._initScrollbar(wheelHappened, options);

        this._switchInitialScrollPosition(options);

        if (this._isPagingVisible(this._options)) {
            this._paging = new PagingModel();
            this._scrollCssClass = this._getScrollContainerCssClass(options);
            this._paging.pagingMode = this._options.pagingMode;
        }

        super._afterMount();
        if (this._options.buttonsMode !== 'hover') {
            this._updateScrollButtons();
        }

        // Если есть заголовки, фиксирующиеся снизу, то при построении нужно обновить им позицию,
        // т.к. они будут зафиксированы.
        // Если тени принудительно включены, то надо инициализировать заголовки, что бы отрисовать тени на них.
        if (
            compatibility.touch ||
            this._stickyController.hasBottomBlocks() ||
            this._shadows.hasVisibleShadow()
        ) {
            this.initHeaderController();
        }

        this._updateShadowsScrollState();
        this._stickyController.scrollStateChanged(this._scrollModel);
        this._containerLoadedResolve();
        this._containerLoaded = true;

        this._scrollbars.updateOptions({
            ...options,
            scrollbarVisible: this._scrollbarVisible || this._resolveScrollbarVisibility(options),
        });
        this._updateScrollbarsPadding();

        if (detection.isMac) {
            // ResizeObserver на Mac не реагирует на изменение padding, если не задана высота через height из-за этого
            // не происходит обновления пейджинга.
            this._paging?.update(this._scrollModel);
        }
    }

    protected _beforeUpdate(options: IContainerOptions): void {
        super._beforeUpdate(...arguments);
        // horizontalScrollMode может быть задан как из callback-функции setHorizontalScrollMode, так и из опций,
        // В случае, если он задаётся из callback-функции его нельзя обновлять в update
        if (
            !this._isHorizontalScrollModeSetFromCallback &&
            options.horizontalScrollMode !== this._horizontalScrollMode
        ) {
            this._horizontalScrollMode = options.horizontalScrollMode;
        }

        if (this._shouldDisplayArrowButtons(options)) {
            if (!this._arrowButtons) {
                this._arrowButtons = new ArrowButtonsModel();
            }
            this._updateScrollButtons();
        } else if (this._arrowButtons) {
            this._arrowButtons = null;
        }

        if (this._isPagingVisible(options)) {
            if (!this._paging) {
                this._paging = new PagingModel();
            }
            this._paging.isVisible =
                this._scrollModel.canVerticalScroll && this._options.scrollOrientation !== 'none';
            if (this._options.pagingMode !== options.pagingMode) {
                this._paging.pagingMode = options.pagingMode;
            }
            this._updateContentWrapperCssClass();
        } else if (this._paging) {
            this._paging = null;
            this._updateContentWrapperCssClass();
        }

        if (options.scrollOrientation !== this._options.scrollOrientation) {
            this._scrollbars.updateScrollbarsModels(options);
            this._shadows = new ShadowsModel(this._getShadowsModelOptions(options));
            // Стики блок может зафиксироваться в момент выключенного скроллирования. Когда скролл включится и
            // создадутся модели - проставим им сохраненное состояние fixed.
            this._shadows.setStickyFixed(
                this._stickyController.hasFixed(StickyPosition.Top) &&
                    this._stickyController.hasShadowVisible(StickyPosition.Top),
                this._stickyController.hasFixed(StickyPosition.Bottom) &&
                    this._stickyController.hasShadowVisible(StickyPosition.Bottom),
                this._stickyController.hasFixed(StickyPosition.Left),
                this._stickyController.hasFixed(StickyPosition.Right),
                true
            );
        }
        this._updateShadows(this._scrollModel, options);
        this._isOptimizeShadowEnabled = this._getIsOptimizeShadowEnabled(options);
        this._optimizeShadowClass = this._getOptimizeShadowClass();
        // TODO: Логика инициализации для поддержки разных браузеров была скопирована почти полностью
        //  из старого скроллконейнера, нужно отрефакторить. Очень запутанно
        this._updateScrollContainerPaigingSccClass(options);
        this._scrollbars.updateOptions({
            ...options,
            scrollbarVisible: this._scrollbarVisible || this._resolveScrollbarVisibility(options),
        });
        this._updateScrollbarsPadding();
        this._shadows.updateOptions(this._getShadowsModelOptions(options));
    }

    protected _afterUpdate() {
        super._afterUpdate(...arguments);
    }

    protected _beforeUnmount(): void {
        if (this._intersectionObserverController) {
            this._intersectionObserverController.destroy();
            this._intersectionObserverController = null;
        }
        this._stickyController.destroy();
        super._beforeUnmount();
    }

    protected _isPagingVisible(options: IContainerOptions): boolean {
        if (typeof options.pagingMode !== 'undefined') {
            return options.pagingMode !== 'hidden';
        }
        return this._pagingVisible;
    }

    initHeaderController(): Promise<void> {
        if (!this._isControllerInitialized) {
            this._isControllerInitialized = true;
            this._stickyController.init();
        }
    }

    private _initScrollbar(wheelHappened: boolean, options: IContainerOptions): void {
        const hasButtons = this._shouldDisplayArrowButtons(options);
        const wheelEventHappened =
            options.forceScrollbarVisible === false || hasButtons || wheelHappened;
        if (ScrollbarsModel.wheelEventHappened !== wheelEventHappened) {
            ScrollbarsModel.wheelEventHappened = wheelEventHappened;
            this._scrollbars.updateOptions({
                ...options,
                scrollbarVisible:
                    this._scrollbarVisible || this._resolveScrollbarVisibility(options),
            });
        }
    }

    private _setStickyContextUpdater(updateStickyContext: Function): void {
        this._updateStickyContext = updateStickyContext;
    }

    protected _dispatchStickyContext(
        stickyModelsContext: IStickyDataContext,
        stickyGroupModelsContext: IStickyGroupDataContext
    ): void {
        if (!this._stickyModelsContext) {
            this._stickyModelsContext = { ...stickyModelsContext, models: {} };
            this._stickyGroupModelsContext = {
                ...stickyGroupModelsContext,
                scrollState: {
                    scrollTop: this._scrollModel?.scrollTop,
                    horizontalPosition: this._scrollModel?.horizontalPosition,
                },
            };
        } else {
            this._updateStickyContext(stickyModelsContext, stickyGroupModelsContext, {
                ...this._scrollModel,
                horizontalScrollMode: this._horizontalScrollMode,
            });
        }
    }

    private _setPagingVisible(pagingVisible: boolean = false): void {
        this._pagingVisible = pagingVisible;
    }

    /**
     * Возврашает видимость скролла на основе scrollbarVisible или текущего режима отображения
     * @param options
     * @private
     */
    private _resolveScrollbarVisibility(options: IContainerOptions):
        | boolean
        | {
              vertical: boolean;
              horizontal: boolean;
          } {
        if (this._horizontalScrollMode === 'custom') {
            return {
                vertical: !!(
                    (this._options && this._options.scrollbarVisible) ||
                    (options && options.scrollbarVisible)
                ),
                horizontal: false,
            };
        }

        let scrollbarVisibility;
        if (options.scrollOrientation === SCROLL_MODE.VERTICAL) {
            scrollbarVisibility = options.verticalScrollMode === 'scrollbar';
        } else if (options.scrollOrientation === SCROLL_MODE.HORIZONTAL) {
            scrollbarVisibility = options.horizontalScrollMode === 'scrollbar';
        } else {
            // По стандарту, в двунаправленном скролл контейнере может использоваться только скроллбар.
            scrollbarVisibility = 'scrollbar';
        }

        return (
            scrollbarVisibility &&
            !!options.scrollbarVisible &&
            options.forceScrollbarVisible !== false
        );
    }

    private _updateScrollbarsPadding(): void {
        if (!this._wasMouseEnter) {
            return;
        }

        if (this._verticalScrollbarPadding.end !== this._scrollbars.horizontal?.isVisible) {
            this._verticalScrollbarPadding = {
                start: false,
                end: this._scrollbars.horizontal?.isVisible,
            };
        }

        if (this._horizontalScrollbarPadding.end !== this._scrollbars.vertical?.isVisible) {
            this._horizontalScrollbarPadding = {
                start: false,
                end: this._scrollbars.vertical?.isVisible,
            };
        }
    }

    private _updateShadowMode(options?: IContainerOptions): boolean {
        let changed: boolean = false;
        const isOptimizeShadowEnabled = this._getIsOptimizeShadowEnabled(options || this._options);
        if (this._isOptimizeShadowEnabled !== isOptimizeShadowEnabled) {
            this._isOptimizeShadowEnabled = isOptimizeShadowEnabled;
            this._optimizeShadowClass = this._getOptimizeShadowClass();
            changed = true;
        }
        return changed;
    }

    _updateShadows(state?: IScrollState, options?: IContainerOptions): void {
        const changed: boolean = this._updateShadowMode(options);
        if (changed) {
            this._shadows.updateScrollState(state || this._scrollModel);
        }
    }

    private _getShadowsModelOptions(options: IContainerOptions): IShadowsOptions {
        const shadowsModel = { ...options };
        // gridauto нужно для таблицы
        if (options.topShadowVisibility === SHADOW_VISIBILITY.GRIDAUTO) {
            shadowsModel.topShadowVisibility = this._gridAutoShadows
                ? SHADOW_VISIBILITY.VISIBLE
                : SHADOW_VISIBILITY.AUTO;
        }
        if (options.bottomShadowVisibility === SHADOW_VISIBILITY.GRIDAUTO) {
            shadowsModel.bottomShadowVisibility = this._gridAutoShadows
                ? SHADOW_VISIBILITY.VISIBLE
                : SHADOW_VISIBILITY.AUTO;
        }
        return shadowsModel;
    }

    protected _scrollHandler(e: SyntheticEvent): void {
        // Обновляем CSS тени на JS тени.
        if (
            !this._isScrollEventFired &&
            this._isOptimizeShadowEnabled &&
            this._options.shadowMode === SHADOW_MODE.MIXED
        ) {
            this._updateShadows(this._scrollModel, this._options);
            this._isOptimizeShadowEnabled = this._getIsOptimizeShadowEnabled(this._options);
            this._optimizeShadowClass = this._getOptimizeShadowClass();
        }

        this._isScrollEventFired = true;

        super._scrollHandler(e);
        this.initHeaderController();
    }

    _controlResizeHandler(): void {
        super._controlResizeHandler();
    }

    _updateState(...args) {
        const isUpdated: boolean = super._updateState(...args);
        if (isUpdated) {
            if (
                this._wasMouseEnter &&
                this._scrollModel?.canVerticalScroll &&
                !this._oldScrollState.canVerticalScroll
            ) {
                this._updateShadowMode();
            }

            this._updateShadowsScrollState();

            if (this._scrollModel && this._isInitializationDelayed()) {
                this._scrollbars.updateScrollState(this._scrollModel, this._container);
            }

            this._paging?.update(this._scrollModel);
            this._updateScrollButtons();
            this._updateShadowVisibilityInStickyController();

            this._updateScrollContainerPaigingSccClass(this._options);

            if (this._scrollModel.clientHeight !== this._oldScrollState.clientHeight) {
                this._updateScrollbar();
            }
            this._stickyController.scrollStateChanged(this._scrollModel);
        }
        return isUpdated;
    }

    private _updateShadowsScrollState(): void {
        // Если включены тени через стили, то нам все равно надо посчитать состояние теней
        // для фиксированных заголовков если они есть.
        if (
            !this._isOptimizeShadowEnabled ||
            this._stickyController.hasFixed(POSITION.TOP) ||
            this._stickyController.hasFixed(POSITION.BOTTOM)
        ) {
            this._shadows.updateScrollState(this._scrollModel);
        }
    }

    protected _updateScrollContainerPaigingSccClass(options: IContainerOptions) {
        const scrollCssClass = this._getScrollContainerCssClass(options);
        if (this._scrollCssClass !== scrollCssClass) {
            this._scrollCssClass = scrollCssClass;
            this._updateContentWrapperCssClass(options);
        }
    }

    protected _getScrollContainerCssClass(options: IContainerBaseOptions): string {
        return this._scrollbars.getScrollContainerClasses(options);
    }

    protected _getContentWrapperCssClass(): string {
        let cssClass = super._getContentWrapperCssClass();
        if (this._paging?.isVisible) {
            cssClass += ` controls-Scroll__content_paging controls_paging_theme-${this._options.theme}`;
        }
        return cssClass;
    }

    protected _draggingChangedHandler(event: SyntheticEvent, dragging: boolean): void {
        this._dragging = dragging;
    }

    protected _positionChangedHandler(event, scrollPosition, direction): void {
        // В вертикальном направлении скролим с учетом виртуального скрола.
        if (direction === SCROLL_DIRECTION.VERTICAL) {
            this._setScrollTop(scrollPosition);
        } else {
            this.scrollTo(scrollPosition, direction);
        }
    }

    protected _updateShadowVisibility(
        event: SyntheticEvent,
        shadowsVisibility: IShadowsVisibilityByInnerComponents
    ): void {
        event.stopImmediatePropagation();

        let isChanged: boolean = false;
        for (const position in shadowsVisibility) {
            if (!shadowsVisibility.hasOwnProperty(position)) {
                continue;
            }
            if (
                this._shadows[position] &&
                this._shadows[position].getVisibilityByInnerComponents() !==
                    shadowsVisibility[position]
            ) {
                isChanged = true;
            }
        }

        if (this._arrowButtons) {
            const isLeftFixed = shadowsVisibility.left === SHADOW_VISIBILITY.VISIBLE;
            const isRightFixed = shadowsVisibility.right === SHADOW_VISIBILITY.VISIBLE;
            isChanged =
                isLeftFixed !== this._arrowButtons?.isLeftFixed ||
                isRightFixed !== this._arrowButtons?.isRightFixed;
        }

        if (!isChanged) {
            return;
        }

        if (this._gridAutoShadows) {
            this._gridAutoShadows = false;
            this._shadows.updateOptions(this._getShadowsModelOptions(this._options));
        }
        const needUpdate = this._wasMouseEnter || !this._isOptimizeShadowEnabled;
        this._shadows.updateVisibilityByInnerComponents(shadowsVisibility, needUpdate);
        this._updateScrollButtonsByShadowVisibility(shadowsVisibility);

        // Если принудительно включили тени изнутри, то надо инициализировать заголовки что бы отрисовать тени на них.
        if (this._shadows.hasVisibleShadow()) {
            this.initHeaderController();
        }

        this._updateShadowVisibilityInStickyController();
        this._updateStateAndGenerateEvents(this._scrollModel);
    }

    protected _getBlurClasses(): string {
        if (this._options.shadowMode !== SHADOW_MODE.BLUR) {
            return;
        }

        let resultClasses = '';
        const isLeftBlurVisible = this._shadows.left.isEnabled && this._shadows.left.isVisible;
        const isRightBlurVisible = this._shadows.right.isEnabled && this._shadows.right.isVisible;
        if (isLeftBlurVisible && isRightBlurVisible) {
            resultClasses = 'controls-Scroll-Container__blur__leftRight';
        } else if (isLeftBlurVisible) {
            resultClasses = 'controls-Scroll-Container__blur__left';
        } else if (isRightBlurVisible) {
            resultClasses = 'controls-Scroll-Container__blur__right';
        }
        return resultClasses;
    }

    protected _getStyleForCorrectWorkBlur(): string {
        // В хроме могут возникать артефакты, если тень сделана через mask-image.
        if (this._options.shadowMode === SHADOW_MODE.BLUR) {
            return 'will-change: transform;';
        }
        return '';
    }

    private _getInitialScrollPositionStyle(options: IContainerOptions): string {
        let resultStyle = '';
        if (typeof options.initialScrollPosition?.vertical === 'number') {
            resultStyle = `margin-top: ${-options.initialScrollPosition?.vertical}px;`;
        } else if (typeof options.initialScrollPosition?.horizontal === 'number') {
            resultStyle = `margin-left: ${-options.initialScrollPosition?.horizontal}px;`;
        }
        return resultStyle;
    }

    private _switchInitialScrollPosition(options: IContainerOptions): void {
        this._initialScrollPositionStyle = '';
        // Снимаем margin перед проскроллом, иначе он снимется только в следующем цикле синхронизации и будет влиять на
        // scrollHeight.
        this._children.content.style.margin = '';
        if (typeof options.initialScrollPosition?.vertical === 'number') {
            this.scrollTo(options.initialScrollPosition?.vertical);
        } else if (typeof options.initialScrollPosition?.horizontal === 'number') {
            this.scrollTo(options.initialScrollPosition?.horizontal, SCROLL_DIRECTION.HORIZONTAL);
        }
    }

    /**
     * Обновляет видимость кнопок со стрелками по состоянию теней.
     */
    private _updateScrollButtonsByShadowVisibility(
        shadowsVisibility?: IShadowsVisibilityByInnerComponents
    ): void {
        if (!this._arrowButtons) {
            return;
        }

        // В событии указано, что мы должны ВСЕГДА показывать кнопку
        if (shadowsVisibility.left === SHADOW_VISIBILITY.VISIBLE) {
            this._arrowButtons.isLeftVisible = this._arrowButtons.isLeftFixed = true;
        } else {
            this._arrowButtons.isLeftFixed = false;
        }

        // // В событии указано, что мы должны ВСЕГДА показывать кнопку
        if (shadowsVisibility.right === SHADOW_VISIBILITY.VISIBLE) {
            this._arrowButtons.isRightVisible = this._arrowButtons.isRightFixed = true;
        } else {
            this._arrowButtons.isRightFixed = false;
        }
        // В событии указано, что мы должны разруливать кнопку на Container
        if (
            shadowsVisibility.left === SHADOW_VISIBILITY.AUTO ||
            shadowsVisibility.right === SHADOW_VISIBILITY.AUTO
        ) {
            this._updateScrollButtons();
        }
    }

    /**
     * Обновляет видимость кнопок со стрелками по состоянию модели скролла _scrollModel.
     * Вызываем
     * 1. При инициализации контейнера
     * 2. При изменении состояния контейнера (размеров, позициии скролла и тд)
     * 3. При изменении опции horizontalScrollMode (Режим скролла)
     * 4. По состоянию теней, если одна из теней имеет видимость SHADOW_VISIBILITY.AUTO
     */
    private _updateScrollButtons(): void {
        if (!this._arrowButtons) {
            return;
        }

        if (
            this._options.horizontalScrollMode === 'buttons' ||
            this._options.horizontalScrollMode === 'buttonsArea'
        ) {
            if (!this._arrowButtons.isLeftFixed) {
                this._arrowButtons.isLeftVisible =
                    this._scrollModel.canHorizontalScroll &&
                    this._scrollModel.horizontalPosition !== SCROLL_POSITION.START;
            }

            if (!this._arrowButtons.isRightFixed) {
                this._arrowButtons.isRightVisible =
                    this._scrollModel.canHorizontalScroll &&
                    this._scrollModel.horizontalPosition !== SCROLL_POSITION.END;
            }
        }

        if (
            this._options.verticalScrollMode === 'buttons' ||
            this._options.verticalScrollMode === 'buttonsArea'
        ) {
            if (!this._arrowButtons.isTopFixed) {
                this._arrowButtons.isTopVisible =
                    this._scrollModel.canVerticalScroll &&
                    this._scrollModel.verticalPosition !== SCROLL_POSITION.START;
            }

            if (!this._arrowButtons.isBottomFixed) {
                this._arrowButtons.isBottomVisible =
                    this._scrollModel.canVerticalScroll &&
                    this._scrollModel.verticalPosition !== SCROLL_POSITION.END;
            }
        }
    }

    protected _setArrowButtonClickCallback(callback: Function): void {
        this._arrowButtonClickCallback = this._arrowButtonClickCallback || callback;
    }

    protected _removeArrowButtonClickCallback(callback: Function): void {
        if (callback === this._arrowButtonClickCallback) {
            this._arrowButtonClickCallback = null;
        }
    }

    /**
     * Обработчик клика по кнопке со стрелкой.
     * @param event
     * @param direction
     * @private
     */
    protected _arrowButtonHandler(direction: 'prev' | 'next', orientation: SCROLL_DIRECTION): void {
        const result = this._arrowButtonClickCallback?.(direction);
        if (result !== false) {
            const sign = direction === 'next' ? 1 : -1;
            const position = getScrollPositionByState(this._scrollModel, orientation);
            this.scrollTo(
                position + sign * BUTTONS_SCROLL_STEP,
                orientation,
                this._options.smoothScrolling
            );
        }
    }

    /**
     * Возвращает признак того, что контейнер в режиме отображения кнопок прокрутки
     * @param options
     * @private
     */
    private _shouldDisplayArrowButtons(options: IContainerOptions): boolean {
        // По стандарту, в двунаправленном скролл контейнере может использоваться только скроллбар.
        return (
            options.scrollOrientation !== 'verticalHorizontal' &&
            (options.horizontalScrollMode === 'buttons' ||
                options.horizontalScrollMode === 'buttonsArea' ||
                options.verticalScrollMode === 'buttons' ||
                options.verticalScrollMode === 'buttonsArea')
        );
    }

    private _updateShadowVisibilityInStickyController(): void {
        this._stickyController.setShadowVisibility(
            this._shadows.top?.getStickyHeadersShadowsVisibility(),
            this._shadows.bottom?.getStickyHeadersShadowsVisibility()
        );
    }

    // Сейчас наличие контента сверху и снизу мы определяем косвенно по информации от списков надо ли отображать тень.
    // Это надо переделывать. Списки ничего не должны знать о тенях, и должны общаться со скролл контенером
    // в терминах виртуального скрола. Значение gridauto должно быть не у опций topShadowVisibility и
    // bottomShadowVisibility. На мой взгляд должна быть опция говорящая не то, что надо отображеть тень, а работающая
    // тоже в терминах виртуального скрола. Т.е. чтото типа hasUnrenderedContent. Список может поменять значене этой
    // опции изнутри.
    protected _getHasUnrenderedContentState(): IHasUnrenderedContent {
        return {
            top:
                (this._gridAutoShadows && this._options.topShadowVisibility === 'gridauto') ||
                this._shadows.top?.getVisibilityByInnerComponents() === SHADOW_VISIBILITY.VISIBLE,
            bottom:
                (this._gridAutoShadows && this._options.bottomShadowVisibility === 'gridauto') ||
                this._shadows.bottom?.getVisibilityByInnerComponents() ===
                    SHADOW_VISIBILITY.VISIBLE,
        };
    }

    protected _getFullStateFromDOM(): IScrollState {
        const state: IScrollState = super._getFullStateFromDOM();
        return {
            ...state,
            hasUnrenderedContent: this._getHasUnrenderedContentState(),
        };
    }

    protected _getShadowClasses(direction: string, orientation: string): string {
        const stylePostfix = this._options.shadowMode === 'rounded' ? '-rounded' : '';
        return (
            `controls-Scroll__shadow_${direction}${stylePostfix}` +
            ` controls-Scroll__shadow_${orientation}${stylePostfix}` +
            ` controls-Scroll__shadow_${orientation}_style-${this._getShadowStyle(
                direction,
                orientation
            )}${stylePostfix}`
        );
    }

    protected _getShadowStyle(direction: string, orientation: string): string {
        if (direction === 'vertical' && orientation === 'right') {
            return this._horizontalScrollMode === 'custom' ? 'custom' : this._options.shadowStyle;
        }
        return this._options.shadowStyle;
    }

    protected _updateStateAndGenerateEvents(newState: IScrollState): void {
        super._updateStateAndGenerateEvents({
            ...newState,
            hasUnrenderedContent: this._getHasUnrenderedContentState(),
        });
    }

    protected _getScrollNotifyConfig(): number[] {
        const baseConfig = super._getScrollNotifyConfig();
        const topShadowVisible =
            this._shadows.top?.getVisibilityByInnerComponents() === SHADOW_VISIBILITY.VISIBLE;
        const bottomShadowVisible =
            this._shadows.bottom?.getVisibilityByInnerComponents() === SHADOW_VISIBILITY.VISIBLE;
        baseConfig.push(topShadowVisible, bottomShadowVisible);
        return baseConfig;
    }

    protected _keydownHandler(event: SyntheticEvent): void {
        // если сами вызвали событие keydown (горячие клавиши), нативно не прокрутится, прокрутим сами
        if (!event.nativeEvent.isTrusted) {
            let offset: number;
            const clientHeight = this._scrollModel.clientHeight;
            const scrollTop: number = this._scrollModel.scrollTop;
            const scrollContainerHeight: number =
                this._scrollModel.scrollHeight - this._scrollModel.clientHeight;

            if (event.nativeEvent.which === constants.key.pageDown) {
                offset = scrollTop + clientHeight;
            }
            if (event.nativeEvent.which === constants.key.down) {
                offset = scrollTop + SCROLL_BY_ARROWS;
            }
            if (event.nativeEvent.which === constants.key.pageUp) {
                offset = scrollTop - clientHeight;
            }
            if (event.nativeEvent.which === constants.key.up) {
                offset = scrollTop - SCROLL_BY_ARROWS;
            }

            if (offset > scrollContainerHeight) {
                offset = scrollContainerHeight;
            }
            if (offset < 0) {
                offset = 0;
            }
            if (offset !== undefined && offset !== scrollTop) {
                this.scrollTo(offset);
                event.preventDefault();
            }

            if (event.nativeEvent.which === constants.key.home && scrollTop !== 0) {
                this.scrollToTop();
                event.preventDefault();
            }
            if (
                event.nativeEvent.which === constants.key.end &&
                scrollTop !== scrollContainerHeight
            ) {
                this.scrollToBottom();
                event.preventDefault();
            }
        }
    }

    protected _arrowClickHandler(event, btnName) {
        let scrollParam;

        switch (btnName) {
            case 'Begin':
                scrollParam = 'top';
                break;
            case 'End':
                scrollParam = 'bottom';
                break;
            case 'Prev':
                scrollParam = 'pageUp';
                break;
            case 'Next':
                scrollParam = 'pageDown';
                break;
        }
        this._doScroll(scrollParam);
    }

    protected _onWheelHandler(event: SyntheticEvent): void {
        if (!ScrollbarsModel.wheelEventHappened) {
            LocalStorageNative.setItem('scrollContainerWheelEventHappened', 'true');
            ScrollbarsModel.wheelEventHappened = true;
        }

        // Если скролльнули по скроллбару, то нативно не скроллим, т.к. скроллбар сам сменит scrollTop.
        // Рассматриваемый кейс: горизонтальный скролл контейнр лежит в вертикальном скролле. Скроллят колесиком по
        // гор. скроллбару и одновременно идет нативный вертикальный скролл и горизонтальный от гор. скроллбара.
        if (
            Array.isArray(event?.target.className) &&
            event?.target.className.includes('controls-VScrollbar')
        ) {
            event.preventDefault();
        }
    }
    protected _mouseoverHandler(event) {
        if (!this._mouseEnterHandled) {
            this._mouseenterHandler(event);
        }
    }

    protected _mouseenterHandler(event) {
        this._mouseEnterHandled = true;
        if (this._gridAutoShadows && this._scrollModel?.canVerticalScroll) {
            this._gridAutoShadows = false;
            this._shadows.updateOptions(this._getShadowsModelOptions(this._options));
            this._updateShadows();
        }

        // Если до mouseenter не вычисляли скроллбар, сделаем это сейчас.
        if (!this._wasMouseEnter) {
            if (this._options.buttonsMode === 'hover') {
                this._updateScrollButtons();
            }
            this._wasMouseEnter = true;
            this._updateScrollbar();
            // При открытии плавающих панелей, когда курсор находится над скрлл контейнером,
            // иногда события по которым инициализируется состояние скролл контейнера стреляют после mouseenter.
            // В этом случае не обновляем скролбары, а просто делаем _wasMouseEnter = true выше.
            // Скроллбары рассчитаются после инициализации состояния скролл контейнера.
            if (this._scrollModel) {
                this._scrollbars.updateScrollState(this._scrollModel, this._container);
            }
            if (!compatibility.touch) {
                this.initHeaderController();
            }
        }

        if (this._scrollbars.take()) {
            this._notify('scrollbarTaken', [], { bubbling: true });
        }
    }

    protected _mouseleaveHandler(event) {
        if (this._scrollbars.release()) {
            this._notify('scrollbarReleased', [], { bubbling: true });
        }
    }

    protected _scrollbarTakenHandler() {
        this._scrollbars.taken();
    }

    protected _scrollbarReleasedHandler(event) {
        if (this._scrollbars.released()) {
            event.preventDefault();
        }
    }

    _updatePlaceholdersSize(e: SyntheticEvent<Event>, placeholdersSizes): void {
        super._updatePlaceholdersSize(...arguments);
        this._scrollbars.updatePlaceholdersSize(placeholdersSizes);
    }

    private _isInitializationDelayed(): boolean {
        // Оптимизация отключена для ie. С оптимизацией некорректно работал :hover для скролбаров.
        // На демке без наших стилей иногда не появляется скролбар по ховеру. Такое впечатление что не происходит
        // paint после ховера и после снятия ховера. Изменение любых стилей через девтулсы исправляет ситуаци.
        // Если покрасить подложку по которой движется скролл красным, то после ховера видно, как она перерисовыатся
        // только в местах где по ней проехал скролбар.
        // После отключения оптимизации проблема почему то уходит.
        return this._wasMouseEnter || detection.isIE;
    }

    // Intersection observer

    private _initIntersectionObserverController(): void {
        if (!this._intersectionObserverController) {
            this._intersectionObserverController = new Observer(this._intersectHandler.bind(this));
        }
    }

    protected _intersectionObserverRegisterHandler(
        event: SyntheticEvent,
        intersectionObserverObject: IIntersectionObserverObject
    ): void {
        this._initIntersectionObserverController();
        this._intersectionObserverController.register(this._container, intersectionObserverObject);
        if (!intersectionObserverObject.observerName) {
            event.stopImmediatePropagation();
        }
    }

    protected _intersectionObserverUnregisterHandler(
        event: SyntheticEvent,
        instId: string,
        observerName: string
    ): void {
        if (this._intersectionObserverController) {
            this._intersectionObserverController.unregister(instId, observerName);
        }
        if (!observerName) {
            event.stopImmediatePropagation();
        }
    }

    protected _intersectHandler(items): void {
        this._notify('intersect', [items]);
    }

    protected _getOptimizeShadowClass(options?: IContainerOptions): string {
        const opts: IContainerOptions = options || this._options;
        let style: string = '';
        if (this._isOptimizeShadowEnabled) {
            if (this._options.scrollOrientation === 'horizontal') {
                style +=
                    'controls-Scroll__backgroundShadow__horizontal ' +
                    `controls-Scroll__background-Shadow__horizontal__style-${opts.backgroundStyle} ` +
                    `controls-Scroll__background-Shadow_left-${this._shadows.left?.isVisibleShadowOnCSS}_right-${this._shadows.right?.isVisibleShadowOnCSS}_style-${opts.shadowStyle}`;
            } else {
                style +=
                    'controls-Scroll__backgroundShadow ' +
                    `controls-Scroll__background-Shadow_style-${opts.backgroundStyle} ` +
                    `controls-Scroll__background-Shadow_top-${this._shadows.top?.isVisibleShadowOnCSS}_bottom-${this._shadows.bottom?.isVisibleShadowOnCSS}_style-${opts.shadowStyle}`;
            }
        }
        return style;
    }

    protected _getIsOptimizeShadowEnabled(options: IContainerOptions): boolean {
        return options.shadowMode === SHADOW_MODE.CSS && Container._isCssShadowsSupported();
    }

    // StickyController

    _stickyFixedCallback(): void {
        if (this._isOptimizeShadowEnabled) {
            // У стики блока может стрельнуть IntersectionObserver до ресайз обсервера скролл контейнера.
            this._shadows.updateScrollState(
                this._scrollModel || this._getFullStateFromDOM(),
                false
            );
        }
        this._headersResizeHandler();
        const needUpdate =
            this._wasMouseEnter ||
            this._isScrollEventFired ||
            this._options.shadowMode === SHADOW_MODE.JS;
        this._shadows.setStickyFixed(
            this._stickyController.hasFixed(StickyPosition.Top) &&
                this._stickyController.hasShadowVisible(StickyPosition.Top),
            this._stickyController.hasFixed(StickyPosition.Bottom) &&
                this._stickyController.hasShadowVisible(StickyPosition.Bottom),
            this._stickyController.hasFixed(StickyPosition.Left),
            this._stickyController.hasFixed(StickyPosition.Right),
            needUpdate
        );

        this._updateShadowVisibilityInStickyController();
    }

    // StickyHeaderController

    protected _headersResizeHandler(): void {
        this._updateScrollbar();
    }

    private _updateScrollbar(): void {
        if (!this._isInitializationDelayed()) {
            return;
        }

        const scrollbarOffsetTop = this._stickyController.getBlocksHeight(
            StickyPosition.Top,
            TypeFixedBlocks.InitialFixed,
            true
        );
        const scrollbarOffsetBottom = this._stickyController.getBlocksHeight(
            StickyPosition.Bottom,
            TypeFixedBlocks.InitialFixed,
            true
        );
        // Обновляем скролбары только после наведения мышкой.
        this._scrollbars.setOffsets(
            { top: scrollbarOffsetTop, bottom: scrollbarOffsetBottom },
            true
        );
    }

    getHeadersHeight(
        position: StickyPosition,
        type: TypeFixedBlocks = TypeFixedBlocks.InitialFixed,
        considerOffsetTop: boolean = true
    ): number {
        return this._stickyController.getBlocksHeight(position, type, considerOffsetTop);
    }

    getHeadersWidth(
        position: StickyPosition,
        type: TypeFixedBlocks = TypeFixedBlocks.InitialFixed
    ): number {
        return this._stickyController.getBlocksWidth();
    }

    getHeadersRects(
        position: StickyPosition,
        type: TypeFixedBlocks = TypeFixedBlocks.InitialFixed
    ): IBlockSize[] {
        return this._stickyController.getBlocksRects(position, type);
    }

    syncRegisterDelayedBlocks(): void {
        this._stickyController.syncRegisterDelayed();
    }

    /**
     * Метод возвращает высоты заголовков, которые БУДУТ зафиксированны при переданном scrollTop.
     * В будущем может быть спилен т.к. могут появиться кейсы, когда при фиксации заголовка в нем будет меняться
     * контент, а значит и изменяться размеры, которые мы узнаем только после перерисовки.
     * @private
     */
    getBlocksHeightByScrollTop(scrollTop: number): number {
        return this._stickyController.getFixedBlocksHeightByScrollTop(scrollTop);
    }

    // FIXME: костыль для input:Area, чтобы она напрямую в детей не лазала
    getScrollTop(): number {
        return this._children.content?.scrollTop || 0;
    }

    _setHorizontalScrollMode(options: IContainerOptions, mode: THorizontalScrollMode): void {
        if (mode === this._horizontalScrollMode) {
            return;
        }
        this._isHorizontalScrollModeSetFromCallback = true;
        this._horizontalScrollMode = mode;
        this._scrollbarVisible = this._resolveScrollbarVisibility(options);
        this._scrollbars?.updateOptions({
            ...options,
            scrollbarVisible: this._scrollbarVisible || options.scrollbarVisible,
        });
    }

    _canHorizontalScroll(): boolean {
        return this._horizontalScrollMode === 'custom'
            ? !!this._scrollModel?.canHorizontalScroll
            : false;
    }

    protected _getHorizontalPosition(): string {
        return this._scrollModel?.horizontalPosition || SCROLL_POSITION.START;
    }

    /**
     * Включает логированние событий изменения положения скролла.
     * Можно включить логирование из консоли браузера выполнив команду
     * require(['Controls/scroll'], (scroll) => {scroll.Container.setDebug(true)})
     * @param debug
     */
    static setDebug(debug: boolean): void {
        ContainerBase.setDebug(debug);
    }

    static _isCssShadowsSupported(): boolean {
        // Ie и Edge неправильно позиционируют фон со стилями
        // background-position: bottom и background-attachment: local
        return !detection.isMobileIOS && !detection.isIE && !detection.isMobileAndroid;
    }

    static getOptionTypes(): object {
        return {
            ...ContainerBase.getOptionTypes(),

            topShadowVisibility: descriptor(String).oneOf([
                SHADOW_VISIBILITY.AUTO,
                SHADOW_VISIBILITY.HIDDEN,
                SHADOW_VISIBILITY.VISIBLE,
                'gridauto',
            ]),
            bottomShadowVisibility: descriptor(String).oneOf([
                SHADOW_VISIBILITY.AUTO,
                SHADOW_VISIBILITY.HIDDEN,
                SHADOW_VISIBILITY.VISIBLE,
                'gridauto',
            ]),
            shadowMode: descriptor(String).oneOf([
                SHADOW_MODE.CSS,
                SHADOW_MODE.JS,
                SHADOW_MODE.MIXED,
                SHADOW_MODE.BLUR,
                SHADOW_MODE.ROUNDED,
            ]),
        };
    }

    static getDefaultOptions(): object {
        return {
            ...ContainerBase.getDefaultOptions(),
            ...getScrollModeDefaultOptions(),
            ...getShadowsDefaultOptions(),
            smoothScrolling: false,
            shadowStyle: 'default',
            backgroundStyle: DEFAULT_BACKGROUND_STYLE,
            syncDomOptimization: true,
            horizontalContentFit: 'contain',
            scrollbarVisible: true,
            buttonsMode: 'always',
        };
    }
}
/**
 * @name Controls/_scroll/Container#content
 * @cfg {Content} Содержимое контейнера.
 */

/*
 * @name Controls/_scroll/Container#content
 * @cfg {Content} Container contents.
 */

/**
 * @name Controls/_scroll/Container#style
 * @cfg {String} Цветовая схема (цвета тени и скролла).
 * @variant normal Тема по умолчанию (для ярких фонов).
 * @variant inverted Преобразованная тема (для темных фонов).
 * @see backgroundStyle
 */

/*
 * @name Controls/_scroll/Container#style
 * @cfg {String} Color scheme (colors of the shadow and scrollbar).
 * @variant normal Default theme (for bright backgrounds).
 * @variant inverted Inverted theme (for dark backgrounds).
 */

/**
 * @name Controls/_scroll/Container#backgroundStyle
 * @cfg {String} Определяет префикс стиля для настройки элементов, которые зависят от цвета фона.
 * @default default
 * @remark При нестандартном цвете фона, будет виден лишний градиент от тени. Значение опции в том числе добавит
 * постфикс к классу с css тенью. При этом нужно самим написать новый стиль для тени, либо можно воспользоваться
 * готовыми значениями
 * * master - значение для скролл контейнера контентом которого является masterDetail
 * * unaccented - значение для скролл контейнера, к которого цвет фона контента unaccented
 * @demo Controls-demo/Scroll/Container/BackgroundStyle/Index
 * @see style
 */

/**
 * @typedef PagingModeScrollTypes
 * @variant hidden Предназначен для отключения отображения пейджинга в реестре.
 * @variant basic Предназначен для пейджинга в реестре с подгрузкой по скроллу.
 * @variant edge Предназначен для пейджинга с отображением одной команды прокрутки. Отображается кнопка в конец, либо
 * в начало, в зависимости от положения.
 * @variant Предназначен для пейджинга с отображением двух команд прокрутки. Отображается кнопка в конец и в начало.
 * @variant begin Предназначен для пейджинга с отображением одной команды прокрутки. Отображается только кнопка в начало.
 * @variant end Предназначен для пейджинга с отображением одной команды прокрутки. Отображается только кнопка в конец.
 */

/**
 * @name Controls/_scroll/Container#pagingMode
 * @cfg {Controls/_scroll/Container/PagingModeScrollTypes.typedef} Определяет стиль отображения пэйджинга.
 * @default hidden
 * @demo Controls-demo/Scroll/Paging/Basic/Index
 * @demo Controls-demo/Scroll/Paging/Edge/Index
 * @demo Controls-demo/Scroll/Paging/Edges/Index
 * @demo Controls-demo/Scroll/Paging/End/Index
 */

/**
 * @name Controls/_scroll/Container#pagingContentTemplate
 * @cfg {Function} Опция управляет отображением произвольного шаблона внутри пэйджинга.
 * @demo Controls-demo/Scroll/Paging/ContentTemplate/Index
 */

/**
 * @name Controls/_scroll/Container#pagingPosition
 * @cfg {TPagingPosition} Опция управляет позицией пэйджинга.
 * @default right
 * @demo Controls-demo/Scroll/Paging/PositionLeft/Index
 */

/**
 * @name Controls/_scroll/Container#shadowStyle
 * @cfg {String} Определяет постфикс у класса тени
 * @default default
 */

/**
 * @name Controls/_scroll/Container#scrollOrientation
 * @cfg {String} Определяет направление скроллирования
 * @demo Controls-demo/Scroll/ScrollMode/Index
 * @default vertical
 * @variant vertical Скроллирование по вертикали
 * @variant horizontal Скроллирование по горизонтали
 * @variant verticalHorizontal Скроллирование по вертикали и по горизонтали
 * @variant none Скроллирование отключено
 * @remark
 * Важно! Если установлено значение vertical или horizontal, то скролл будет работать, только по указанному направлению, а также скролбар будет отображен с 1 стороны.
 * Если вы точно уверены, что содержимое должно скролиться и по горизонтали и по вертикали, то установите значение verticalHorizontal
 */

/**
 * @name Controls/_scroll/Container#horizontalScrollMode
 * @cfg {String} Режим отображения элемента управления скроллированием в контейнере.
 * @demo Controls-demo/Scroll/HorizontalScrollMode/Index
 * @default scrollbar
 * @variant scrollbar Прокрутка при помощи скроллбара
 * @variant buttons Прокрутка при помощи кнопок
 */

/**
 * @name Controls/_scroll/Container#verticalScrollMode
 * @cfg {String} Режим отображения элемента управления скроллированием в контейнере.
 * @demo Controls-demo/Scroll/VerticalScrollMode/Index
 * @default scrollbar
 * @variant scrollbar Прокрутка при помощи скроллбара
 * @variant buttons Прокрутка при помощи кнопок
 */

/**
 * @name Controls/_scroll/Container#smoothScrolling
 * @cfg {Boolean} Включает плавную прокрутку кнопками скролла
 * @default false
 */

/**
 * @name Controls/_scroll/Container#horizontalContentFit
 * @cfg {String} Определяет, как содержимое при {@link Controls/scroll:Container#scrollOrientation горизонтальном скролле} должно заполнять контейнер.
 * @variant contain ширина контента ограничивается шириной скролл контейнера.
 * @variant fill контент меняет свой размер таким образом, чтобы заполнить всю область скролл контейнера.
 * @default contain
 */

/**
 * @typedef {Object} ScrollbarVisible
 * @description Конфигурация отображения скроллбара. Используется в опции {@link Controls/scroll:Container#scrollbarVisible scrollbarVisible}.
 * @property {Boolean} vertical Определяет, следует ли отображать вертикальный скроллбар.
 * @property {Boolean} horizontal Определяет, следует ли отображать горизонтальный скроллбар.
 */

/**
 * @name Controls/_scroll/Container#scrollbarVisible
 * @cfg {Boolean | ScrollbarVisible} Определяет, следует ли отображать скроллбар.
 * @default true
 * @demo Controls-demo/Scroll/ScrollbarVisible/Index
 */

/**
 * @name Controls/_scroll/Container#buttonsMode
 * @cfg { String } Определяет режим отображения кнопок для навигации.
 * @variant hover Кнопки отображаются при наведении
 * @variant always Кнопки отображаются всегда
 * @default always
 */

/**
 * @event scroll Происходит при скролле.
 * @deprecated Используйте событие scrollStateChanged
 * @name Controls/_scroll/Container#scroll
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Number} scrollPosition Новая позиция скролла.
 * @param {Number} oldScrollPosition Предыдущая позиция скролла.
 */

/**
 * @event scrollStateChanged Происходит при скролле/изменениях размерах контента/изменениях размерах скроллируемой области.
 * @name Controls/_scroll/Container#scrollStateChanged
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Controls/scroll:IScrollState} scrollState Новое состояние скролл контейнера.
 * @param {Controls/scroll:IScrollState} oldScrollState Предыдущие состояние скролл контейнера.
 */
