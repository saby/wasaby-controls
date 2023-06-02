/**
 * @kaizen_zone 7b560386-8131-481a-b9c0-8b3ede6f29a0
 */
import { detection } from 'Env/Env';
import { mixin } from 'Types/util';
import { IVersionable, VersionableMixin } from 'Types/entity';
import { SCROLL_DIRECTION } from '../Utils/Scroll';
import ScrollHeightFixUtil = require('Controls/_scroll/Scroll/ScrollHeightFixUtil');
import ScrollbarModel, { IOffsets } from './ScrollbarModel';
import { IScrollState } from '../Utils/ScrollState';
import { SCROLL_MODE } from './Type';
import { IContainerBaseOptions } from 'Controls/_scroll/ContainerBase';

export default class ScrollbarsModel
    extends mixin<VersionableMixin>(VersionableMixin)
    implements IVersionable
{
    readonly '[Types/_entity/VersionableMixin]': true;

    private readonly _useNativeScrollbar: boolean;

    private _options: IContainerBaseOptions;
    /**
     * Нужно ли показывать скролл при наведении.
     * @type {boolean}
     */
    private _showScrollbarOnHover: boolean = true;

    private _models: object = {};
    private _canScroll: boolean = false;
    private _overflowHidden: boolean;

    private _newState: IScrollState;
    private _container: HTMLElement;
    private _newPlaceholderSizes;
    private _forceScrollbarVisible: boolean;

    constructor(options: IContainerBaseOptions) {
        super(options);

        this._options = options;
        this._forceScrollbarVisible = options.forceScrollbarVisible;
        this._overflowHidden = ScrollHeightFixUtil.calcHeightFix();

        // На мобильных устройствах используется нативный скролл, на других платформенный.
        this._useNativeScrollbar =
            detection.isMobileIOS || detection.isMobileAndroid;

        this.updateScrollbarsModels(options);
    }

    updateScrollbarsModels(options: IContainerBaseOptions): void {
        const updateModel = (orientation: 'vertical' | 'horizontal') => {
            if (
                options.scrollOrientation.toLowerCase().indexOf(orientation) !==
                -1
            ) {
                if (!this._models[orientation]) {
                    this._models[orientation] = new ScrollbarModel(
                        SCROLL_DIRECTION[orientation.toUpperCase()],
                        {
                            ...options,
                            scrollbarVisible: this._isVisibleByOptions(
                                options,
                                orientation
                            ),
                        }
                    );
                }
            } else {
                delete this._models[orientation];
            }
        };

        updateModel('vertical');
        updateModel('horizontal');
    }

    updateOptions(options: IContainerBaseOptions): void {
        this._options = options;
        for (const scrollbar of Object.keys(this._models)) {
            // Будем показывать скроллбар до тех пор, пока пользователь не воспользовался колесиком мышки, даже если
            // прикладник задал опцию scrollbarVisible=false.
            // Таким образом пользователи без колесика мышки смогут скроллить контент.
            const isScrollBarVisibleByOptions = this._isVisibleByOptions(
                options,
                scrollbar
            );
            const scrollbarVisible =
                this._forceScrollbarVisible !== false &&
                (isScrollBarVisibleByOptions ||
                    (!ScrollbarsModel.wheelEventHappened &&
                        !this._useNativeScrollbar));
            this._models[scrollbar].updateOptions({
                ...options,
                scrollbarVisible,
            });
            if (
                !isScrollBarVisibleByOptions &&
                ScrollbarsModel.wheelEventHappened
            ) {
                this._models[scrollbar].setEnabled(false);
            }
            // nextVersion нужен только для IE, т.к в нем долго грузится WheelEventSetting
            // (см. afterMount Container.ts).
            // В хроме же из-за этого возникают лишние синхронизации.
            if (detection.isIE) {
                this._nextVersion();
            }
        }
    }

    private _isVisibleByOptions(
        options: IContainerBaseOptions,
        orientation: 'vertical' | 'horizontal'
    ): boolean {
        if (typeof options.scrollbarVisible === 'object') {
            return typeof options.scrollbarVisible[orientation] === 'boolean'
                ? !!options.scrollbarVisible[orientation]
                : true;
        } else {
            return !!options.scrollbarVisible;
        }
    }

    _updateContainerSizes(): void {
        let changed: boolean = false;
        if (this._newState) {
            for (const scrollbar of Object.keys(this._models)) {
                if (this._models[scrollbar].enabled) {
                    changed =
                        this._models[scrollbar].updatePosition(
                            this._newState
                        ) || changed;
                }
            }
        }
        this._updateScrollState();
        this._updatePlaceholdersSize();
        if (changed) {
            this._nextVersion();
        }
    }

    updateScrollState(scrollState: IScrollState, container: HTMLElement): void {
        if (this._forceScrollbarVisible === false) {
            return;
        }

        this._newState = scrollState;
        this._container = container;

        let changed: boolean = false;

        const canScroll =
            this._options.scrollOrientation !== SCROLL_MODE.NONE &&
            (scrollState.canVerticalScroll || scrollState.canHorizontalScroll);
        let canScrollChanged: boolean = false;
        if (canScroll !== this._canScroll) {
            this._canScroll = canScroll;
            changed = true;
            canScrollChanged = true;
        }

        // Используем clientHeight в качестве offsetHeight если нижний скролбар не отбражается.
        const isHorizontalScrollbarHidden =
            this._options.scrollOrientation === SCROLL_MODE.VERTICAL &&
            !detection.firefox &&
            !detection.isIE;
        const overflowHidden = ScrollHeightFixUtil.calcHeightFix({
            scrollHeight: scrollState.scrollHeight,
            offsetHeight: isHorizontalScrollbarHidden
                ? scrollState.clientHeight
                : this._container.offsetHeight,
        });
        if (overflowHidden !== this._overflowHidden) {
            this._overflowHidden = overflowHidden;
            changed = true;
        }

        if (changed) {
            this._nextVersion();
        }
        if (this._canScroll || canScrollChanged) {
            this._updateContainerSizes();
        }
    }

    _updateScrollState(): void {
        if (!this._newState) {
            return;
        }
        let changed: boolean = false;
        for (const scrollbar of Object.keys(this._models)) {
            changed =
                this._models[scrollbar].updateContentSize(this._newState) ||
                changed;
        }

        this._newState = null;

        if (changed) {
            this._nextVersion();
        }
    }

    updatePlaceholdersSize(sizes): void {
        this._newPlaceholderSizes = sizes;
        this._updateContainerSizes();
    }

    _updatePlaceholdersSize(): void {
        if (!this._newPlaceholderSizes) {
            return;
        }

        let changed: boolean = false;
        let model: ScrollbarModel = this._models[SCROLL_DIRECTION.VERTICAL];
        if (model) {
            changed = model.updatePlaceholdersSize({
                start: this._newPlaceholderSizes.top,
                end: this._newPlaceholderSizes.bottom,
            });
        }
        model = this._models[SCROLL_DIRECTION.HORIZONTAL];
        if (model) {
            changed =
                model.updatePlaceholdersSize({
                    start: this._newPlaceholderSizes.left,
                    end: this._newPlaceholderSizes.right,
                }) || changed;
        }

        this._newPlaceholderSizes = null;

        if (changed) {
            this._nextVersion();
        }
    }

    setOffsets(offsets: IOffsets, needUpdate: boolean = true): void {
        let changed: boolean = false;
        for (const scrollbar of Object.keys(this._models)) {
            changed = this._models[scrollbar].setOffsets(offsets) || changed;
        }
        if (changed && needUpdate) {
            this._nextVersion();
        }
    }

    getScrollContainerClasses(options: IContainerBaseOptions): string {
        let css = '';
        if (this._useNativeScrollbar) {
            css += this._getOverflowClass(options);
            if (
                !this._options.scrollbarVisible ||
                (!this._options.scrollbarVisible.vertical &&
                    !this._options.scrollbarVisible.horizontal)
            ) {
                css += this._getHideNativeScrollbarCssClass();
            }
        } else {
            css += this._getHideNativeScrollbarCssClass();
            if (this._overflowHidden) {
                css += ' controls-Scroll__content_hidden';
            } else {
                css += this._getOverflowClass(options);
            }
        }
        return css;
    }

    private _getHideNativeScrollbarCssClass(): string {
        return ' controls-Scroll__content_hideNativeScrollbar controls-Scroll__content_hideNativeScrollbar_ff-ie-edge';
    }

    private _getOverflowClass(options: IContainerBaseOptions): string {
        switch (options.scrollOrientation) {
            case SCROLL_MODE.VERTICAL:
                return ' controls-Scroll-ContainerBase__scroll_vertical';
            case SCROLL_MODE.HORIZONTAL:
                return ' controls-Scroll-ContainerBase__scroll_horizontal';
            case SCROLL_MODE.NONE:
                return ' controls-Scroll-ContainerBase__scroll_none';
            default:
                return ' controls-Scroll-ContainerBase__scroll_verticalHorizontal';
        }
    }

    take(): boolean {
        if (
            this._showScrollbarOnHover &&
            this._canScroll &&
            this._forceScrollbarVisible !== false
        ) {
            return true;
        }
    }
    taken() {
        if (this._showScrollbarOnHover) {
            this._showScrollbarOnHover = false;
            this._nextVersion();
        }
    }
    release(): boolean {
        if (this._showScrollbarOnHover) {
            return true;
        }
    }
    released(): boolean {
        if (!this._showScrollbarOnHover) {
            this._showScrollbarOnHover = true;
            this._nextVersion();
            return true;
        }
        return false;
    }

    get isVisible(): boolean {
        return !this._useNativeScrollbar && this._showScrollbarOnHover;
    }

    get horizontal(): ScrollbarModel {
        return this._models.horizontal;
    }
    get vertical(): ScrollbarModel {
        return this._models.vertical;
    }

    static wheelEventHappened: boolean = false;
}
