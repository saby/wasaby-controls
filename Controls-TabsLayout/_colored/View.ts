/**
 * @kaizen_zone 0e107c1a-ee17-427f-b2a9-c869f977e22d
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import * as template from 'wml!Controls-TabsLayout/_colored/View';
import { IDragObject } from 'Controls/dragnDrop';
import { IntersectionObserverSyntheticEntry, IScrollState } from 'Controls/scroll';
import { ResizeObserverUtil } from 'Controls/sizeUtils';
import { debounce } from 'Types/function';
import 'css!Controls-TabsLayout/coloredBase';
import { getSettings, setSettings } from 'Controls/Application/SettingsController';
import { TouchDetect } from 'EnvTouch/EnvTouch';
import { IColoredOptions, IItemTab } from './IColored';

let defaultAnimDuration = 0.1;
// Эта высота чтобы схлопывать вкладку на краю
const MIN_HEIGHT = 50;
const DELTA = 50;
const MIN_TAB_HEIGHT = 100;
const POPUP_HIDDEN_CLASS = '.controls-Popup__hidden';

export interface IColoredTabsOptions extends IControlOptions, IColoredOptions {}

export enum BACKGROUND_FILL {
    HEADER = 'header',
    FULL = 'full',
}

/**
 * Контрол группируют контент и позволяют управлять отображением данных на странице.
 *
 * @remark
 * В случае, если в развернутом виде вкладка (корешок) перекрывает часть контента предыдущей вкладки,
 * нужно на контентную область скролл контейнера повесить класс controls-ColoredTabs__content-bottomSpacing
 * для добавления отступа, равному высоте вкладки (корешка).
 * Демо пример можно посмотреть {@link Controls-TabsLayout/coloredGrid:View тут}.
 *
 * @class Controls-TabsLayout/_colored/View
 * @extends UI/Base:Control
 * @control
 * @public
 * @mixes Controls/interface:ISingleSelectable
 * @implements Controls-TabsLayout/colored:IColoredOptions
 * @demo Controls-TabsLayout-demo/colored/BaseView/Default/Index
 *
 */

class View extends Control<IColoredTabsOptions> {
    protected _template: TemplateFunction = template;

    protected _isMounted: boolean;

    protected _items: IItemTab[] = [];
    private _itemsHeight: number[] = [];
    private _itemsInitialHeight: number[] = [];
    private _containerHeight: number;
    private _contentContainers: HTMLElement[] = [];

    private _scrollStatesList: IScrollState[] = [];
    private _containersHeightList: number[] = [];

    private _stackedTop: number[] = [0];
    private _stackedBottom: number[] = [];
    protected _tabsPositionTop: number[] = [0];
    protected _tabsPositionBottom: number[] = [0];

    private _animationTimout: number;
    private _forceScrollToBottom: number[] = [];

    private _touchPositionDnD: number;
    private _mousePositionDnD: number;

    private _shouldNotAnimate: boolean = true;

    private _resizeObserver: ResizeObserverUtil;
    private _selectedKey: number | string = null;
    private _tabsPositionUpdated: boolean = false;
    private _isFirstResize: boolean = true;
    private _isFirstIntersect: boolean = true;

    // Используется только для тестов
    useRoundings: boolean = true;

    // Мы работаем с объектами, которые не меняются по ссылке. Из-за этого не происходит цикл обновления.
    // forceUpdate по какой-то причине не работает на сайте. Будем искусственно обновлять контент
    protected _version: number = 0;

    protected _beforeMount(options: IColoredTabsOptions): void {
        this._setItems(options.items);
    }

    protected _componentDidMount(options: IColoredTabsOptions): void {
        this._isMounted = true;
        this.recalculateTabs = debounce(this.recalculateTabs, 100);
        super._componentDidMount();
        this._calcSizes();
        this._resizeObserver = new ResizeObserverUtil(
            this,
            this._resizeObserverCallback.bind(this)
        );
        this._resizeObserver.observe(this._container.querySelector('.controls-ColoredTabs__body'));

        if (options.propStorageId) {
            this._getSelectedKeyByStorageId(options.propStorageId).then((selectedKey) => {
                if (selectedKey) {
                    const selectedItem = this._getItemByKey(selectedKey);
                    if (selectedItem) {
                        this._saveSelectedKey(selectedKey, options.propStorageId);
                        this._setSelectedItem(selectedItem);
                    } else {
                        this._saveSelectedKey(null, options.propStorageId);
                    }
                }
            });
        } else {
            this._saveSelectedKey(options.selectedKey, options.propStorageId);
            const selectedItem = this._getItemByKey(options.selectedKey);
            if (selectedItem) {
                this._setSelectedItem(selectedItem);
            }
        }
    }

    protected _beforeUpdate(options: IColoredTabsOptions): void {
        this._items = options.items;
        if (this._options.items.length !== options.items.length) {
            const newStackedItems = [];
            this._options.items.forEach((oldItem, oldItemIndex) => {
                const newItemIndex = options.items.findIndex((newItem) => {
                    return newItem.key === oldItem.key;
                });
                if (newItemIndex !== -1) {
                    if (this._stackedTop.includes(oldItemIndex)) {
                        newStackedItems.push(newItemIndex);
                    }
                }
            });
            this._stackedTop = newStackedItems;
            this._tabsPositionUpdated = true;
            this._itemsHeight = [];
            this._contentContainers = [];
            const containerHeight = this._container.querySelector(
                '.controls-ColoredTabs__body'
            ).offsetHeight;
            this._items.forEach((item, index) => {
                this._itemsHeight[index] = containerHeight / this._items.length;
                this._itemsInitialHeight = [...this._itemsHeight];
            });
        } else {
            this.updateSizes();
        }
        if (this._selectedKey !== options.selectedKey) {
            this._saveSelectedKey(options.selectedKey, options.propStorageId);
            this._calcSizes();
        }
        this._version++;
    }

    protected _afterUpdate(): void {
        this._updateTabsPosition();
    }

    protected _beforeUnmount(): void {
        this._resizeObserver.unobserve(
            this._container.querySelector('.controls-ColoredTabs__body')
        );
    }

    protected _updateTabsPosition(): void {
        if (!this._tabsPositionUpdated) {
            return;
        }
        let right = 0;
        let changed = false;
        const baseClassNameTop = '.controls-ColoredTabs__head-tab__fixed-top-';
        const stackedTopReverse = [...this._stackedTop].reverse();
        stackedTopReverse.forEach((index) => {
            const tabWidth = this._getTabWidth(baseClassNameTop, index);
            if (this._tabsPositionTop[index] !== right) {
                this._tabsPositionTop[index] = right;
                changed = true;
            }
            right += tabWidth;
        });

        right = 0;
        const baseClassNameBottom = '.controls-ColoredTabs__head-tab__fixed-bottom-';
        const stackedBottomReverse = [...this._stackedBottom].reverse();
        stackedBottomReverse.forEach((index) => {
            const tabWidth = this._getTabWidth(baseClassNameBottom, index);
            if (this._tabsPositionBottom[index] !== right) {
                this._tabsPositionBottom[index] = right;
                changed = true;
            }
            right += tabWidth;
        });
        if (changed) {
            this._tabsPositionTop = [...this._tabsPositionTop];
            this._tabsPositionBottom = [...this._tabsPositionBottom];
        }
        this._tabsPositionUpdated = false;
    }

    protected _isCompactTab(itemIndex: number): boolean {
        if (this._stackedTop.length <= 1 || this._stackedTop.indexOf(itemIndex) === -1) {
            return;
        }
        if (!this._container) {
            return false;
        }
        const baseClassName = '.controls-ColoredTabs__tab-index-';
        let itemsWidth = 0;
        this._stackedTop.forEach((index) => {
            const tabWidth = this._getTabWidth(baseClassName, index);
            itemsWidth += tabWidth;
        });
        const tabContainerClassName = '.controls-ColoredTabs__head-top';
        const tabContainerWidth = this._container.querySelector(tabContainerClassName).offsetWidth;
        if (tabContainerWidth <= itemsWidth && this._stackedTop.length - 1 !== itemIndex) {
            return true;
        }
    }

    protected _tabHasContent(itemIndex: number): boolean {
        const fixedContainer = this._container?.querySelector('.controls-ColoredTabs__head-top');
        if (itemIndex !== 0 || !fixedContainer) {
            return true;
        }
        const baseClassName = '.controls-ColoredTabs__tab-index-';
        const firstItemWidth = this._getTabWidth(baseClassName, itemIndex);
        const fixedContainerWidth = fixedContainer.offsetWidth;
        return firstItemWidth + this._tabsPositionTop[itemIndex] <= fixedContainerWidth;
    }

    private _getTabWidth(baseClassName: string, itemIndex: number): number {
        const tabClassName = baseClassName + itemIndex;
        return this._container.querySelector(tabClassName)?.offsetWidth || 0;
    }

    updateSizes(): void {
        if (!this._mousePositionDnD && !this._touchPositionDnD) {
            window.requestAnimationFrame(() => {
                let shouldCalcSizes = false;
                const contentsHeight = this._getContentsHeight();
                this._items.forEach((item: IItemTab, index: number) => {
                    const contentHeight = this._getContentHeight(index);
                    if (
                        (contentHeight + DELTA <= this._itemsHeight[index] &&
                            index !== this._itemsHeight.length - 1) ||
                        contentsHeight < this._container.offsetHeight
                    ) {
                        shouldCalcSizes = true;
                    }
                });
                if (shouldCalcSizes) {
                    this._calcSizes();
                }
            });
        }
    }

    private _resizeObserverCallback(entries: []): void {
        if (this._container?.closest(POPUP_HIDDEN_CLASS)) {
            return;
        }
        // При первом срабатывании коллбэк не пересчитываем высоты, если задан selectedKey т.к. высоты уже посчитали
        // до этого.
        if (this._isFirstResize && this._selectedKey) {
            this._containerHeight = entries[0].contentRect.height;
            this._isFirstResize = false;
            return;
        }

        const newHeight = entries[0].contentRect.height;
        if (Math.abs(this._containerHeight - newHeight) < 1) {
            return;
        }

        const oldContainerHeight = this._containerHeight;
        this._calcSizes();
        this._containerHeight = newHeight;
        if (oldContainerHeight) {
            // Убираем анимацию при ресайзе, чтобы элементы встали на свое место быстрее
            const transitionContainer = this._container.querySelector(
                '.controls-ColoredTabs__item-content'
            ) as HTMLElement;
            if (transitionContainer && transitionContainer.style) {
                transitionContainer.style.transition = '';
            }
            this._shouldNotAnimate = true;
        }
    }

    private _calcSizes(): void {
        if (!this._container?.offsetHeight) {
            return;
        }
        if (
            this._items.length >
            this._container.querySelectorAll('.controls-ColoredTabs__item-content').length
        ) {
            return;
        }
        const containerHeight = this._container.querySelector(
            '.controls-ColoredTabs__body'
        ).offsetHeight;
        const amountOfItems = this._container.querySelectorAll(
            '.controls-ColoredTabs__item-content'
        ).length;
        const contentsHeight = [];
        const itemsHeight = [];
        this._items.forEach((item: IItemTab, index: number) => {
            itemsHeight.push(containerHeight / amountOfItems);
            contentsHeight.push(this._getContentHeight(index));
        });
        const itemsWithSmallHeight = [];
        contentsHeight.forEach((height: number, index: number) => {
            if (itemsHeight[index] > contentsHeight[index]) {
                itemsWithSmallHeight.push(index);
            }
        });
        if (!itemsWithSmallHeight.length) {
            itemsHeight.forEach((height, index) => {
                this._setTabHeight(index, height);
            });
        } else {
            let totalHeight = 0;
            itemsWithSmallHeight.forEach((index) => {
                totalHeight += itemsHeight[index] - contentsHeight[index];
                this._setTabHeight(index, contentsHeight[index]);
            });
            const amountOfBigItems = this._items.length - itemsWithSmallHeight.length;
            let contentHeight = 0;
            contentsHeight.forEach((height) => {
                contentHeight += height;
            });
            itemsHeight.forEach((height, index) => {
                if (!itemsWithSmallHeight.includes(index)) {
                    let newValue;
                    if (amountOfBigItems === 1) {
                        newValue =
                            containerHeight >= contentHeight
                                ? contentsHeight[index]
                                : contentsHeight[index] - (contentHeight - containerHeight);
                    } else {
                        newValue = itemsHeight[index] + totalHeight / amountOfBigItems;
                    }
                    this._setTabHeight(index, newValue);
                }
            });
        }
        let contentHeight = 0;
        this._itemsHeight.forEach((height) => {
            contentHeight += height;
        });
        // Если сумма всех высот вкладок меньше чем высота контейнера, добавляем оставшуюся высоту последней вкладке
        if (contentHeight < containerHeight) {
            const lastItemIndex = this._items.length - 1;
            this._setTabHeight(
                lastItemIndex,
                containerHeight - contentHeight + this._itemsHeight[lastItemIndex]
            );
        }
        if (contentHeight > containerHeight) {
            this._items.forEach((height, index) => {
                this._setTabHeight(index, containerHeight / this._itemsHeight.length);
            });
        }
        this._itemsInitialHeight = [...this._itemsHeight];
        this._version++;
    }

    protected _setItems(items: IItemTab[]): void {
        this._items = items;
    }

    recalculateTabs(): void {
        // Мокаем использование, устаревший метод
    }

    protected _getLastPinnedInPosition(position: string): IItemTab {
        if (position === 'top') {
            const lastPinnedTop = this._stackedTop.length - 1;
            return this._items[lastPinnedTop];
        }
        const lastPinnedBottom = this._stackedBottom.length - 1;
        return this._items[lastPinnedBottom];
    }

    protected _getItemContentStyle(item: IItemTab): string {
        const index = this._items.indexOf(item);
        let style = '';
        let transition;
        if (this._shouldNotAnimate) {
            transition = 0;
        } else {
            transition =
                TouchDetect.getInstance().isTouch() &&
                (this._mousePositionDnD || this._touchPositionDnD)
                    ? '0.01'
                    : defaultAnimDuration;
        }
        style += `transition: ${transition}s linear;`;
        let itemBottom = 0;
        const itemsLength = this._items.length - 1;
        for (let i = itemsLength; i > index; i--) {
            itemBottom += this._itemsHeight[i];
        }
        style += `height: ${this._itemsHeight[index]}px; `;
        style += 'bottom: ' + itemBottom + 'px;';
        if (this._items[itemsLength].key === item.key) {
            this._shouldNotAnimate = false;
        }
        return style;
    }

    protected _getItemRatioHeight(): string {
        return 'height: ' + 100 / this._items.length + '%;';
    }

    protected _startDragNDrop(event: SyntheticEvent<MouseEvent>, item: IItemTab): void {
        const index = this._items.indexOf(item);
        if (index !== 0) {
            this._children['dragNDrop' + index].startDragNDrop(null, event);
        }
    }

    protected _dragMoveHandler(event: Event, index: number, dragConfig: IDragObject): void {
        if (!this._mousePositionDnD) {
            this._mousePositionDnD = dragConfig.offset.y;
        }
        const stackedTopIndex = this._stackedTop.indexOf(index);
        const stackedBottomIndex = this._stackedBottom.indexOf(index);
        if (stackedBottomIndex !== -1) {
            if (stackedBottomIndex + 1 < this._stackedBottom.length) {
                return;
            }
        }
        if (stackedTopIndex !== -1) {
            if (stackedTopIndex + 1 < this._stackedTop.length) {
                return;
            }
        }
        const delta = this._mousePositionDnD - dragConfig.offset.y;
        let haveScroll;
        for (let i = 0; i < this._items.length; i++) {
            haveScroll = this._hasScrollAvailable(i, delta);
            if (haveScroll) {
                break;
            }
        }
        if (!haveScroll) {
            return;
        }
        if (this._hasScrollAvailable(index, delta)) {
            if (this._stackedTop.includes(index)) {
                if (delta > 0) {
                    if (this._scrollStatesList[index].verticalPosition !== 'end') {
                        return;
                    }
                } else {
                    if (this._scrollStatesList[index].verticalPosition !== 'start') {
                        return;
                    }
                }
            }
        }
        this._calcTabsPosition(index, delta, false, true);
        this._mousePositionDnD = dragConfig.offset.y;
        this._validateDnDPosition(index);
    }

    protected _dragEndHandler(event: Event): void {
        if (this._mousePositionDnD || this._touchPositionDnD) {
            // Обнуляем конфиг асинхронно, чтобы отменить событие клика
            setTimeout(() => {
                this._mousePositionDnD = null;
                this._touchPositionDnD = null;
            });
            this._validatePosition();
            this._version++;
        }
    }

    protected _isLastItem(index: number): boolean {
        return this._items.length - 1 === index;
    }

    protected _getContainerTop(): number {
        return this._container.querySelector('.controls-ColoredTabs__body').getBoundingClientRect()
            .top;
    }

    protected _intersectHandler(event: Event, entries: IntersectionObserverSyntheticEntry[]): void {
        if (this._container?.closest(POPUP_HIDDEN_CLASS)) {
            return;
        }
        if (this._isFirstIntersect) {
            this._isFirstIntersect = false;

            if (this._selectedKey) {
                return;
            }
        }

        if (!this._shouldNotAnimate) {
            entries.forEach((entry: IntersectionObserverSyntheticEntry) => {
                const itemIndex = entry.data.index;

                if (!entry.nativeEntry.isIntersecting) {
                    if (entry.data.position === 'top') {
                        this._setStackedTop(itemIndex);
                    } else {
                        const entryBottom = entry.nativeEntry.target.getBoundingClientRect().bottom;
                        const containerBottom = this._container.getBoundingClientRect().bottom;
                        if (entryBottom < containerBottom) {
                            return;
                        }
                        this._setStackedBottom(itemIndex);
                    }
                } else {
                    this._children['scrollContainer' + itemIndex].scrollToTop();
                    if (
                        this._stackedTop.indexOf(itemIndex) !== -1 &&
                        entry.data.position === 'top'
                    ) {
                        this._removeStackedTop(itemIndex);
                    } else if (
                        this._stackedBottom.indexOf(itemIndex) !== -1 &&
                        entry.data.position === 'bottom'
                    ) {
                        const itemIndexInArray = this._stackedBottom.indexOf(itemIndex);
                        this._stackedBottom.splice(itemIndexInArray, 1);
                        this._tabsPositionUpdated = true;
                    }
                }
            });
            const lastStackedItemIndex = this._stackedTop.length - 1;
            if (lastStackedItemIndex >= 0 && lastStackedItemIndex <= this._items.length - 1) {
                const lastStackedItem = this._items[lastStackedItemIndex];
                const selectedKey = lastStackedItemIndex === 0 ? null : lastStackedItem.key;
                this._saveSelectedKey(selectedKey, this._options.propStorageId);
            }
        }
    }

    private _setStackedTop(index: number): void {
        if (!this._stackedTop.includes(index)) {
            this._tabsPositionUpdated = true;
            this._stackedTop.push(index);
            this._stackedTop.sort();
        }
    }

    private _setStackedBottom(index: number): void {
        if (!this._stackedBottom.includes(index)) {
            this._stackedBottom.push(index);
            this._stackedBottom.sort().reverse();
            this._tabsPositionUpdated = true;
        }
    }

    private _removeStackedTop(itemIndex: number): void {
        const index = this._stackedTop.indexOf(itemIndex);
        if (index !== -1) {
            for (let i = itemIndex; i < this._items.length; i++) {
                if (this._stackedTop.includes(i)) {
                    const stackedIndex = this._stackedTop.indexOf(i);
                    this._stackedTop.splice(stackedIndex, 1);
                    this._tabsPositionUpdated = true;
                    this._tabsPositionTop[i] = 0;
                }
            }
        }
    }

    protected _isFirstTab(item: IItemTab): boolean {
        return item === this._items[0];
    }

    protected _getBackgroundStyleClass(item: IItemTab): string {
        return `controls-ColoredTabs__background-${item?.backgroundStyle}`;
    }

    protected _distributeClickHandler(): void {
        if (this._selectedKey) {
            this._notify('selectedKeyChanged', [null]);
        }
    }

    protected _getDefaultAnimDuration(): number {
        return defaultAnimDuration;
    }

    protected _isStacked(item: IItemTab): boolean {
        const index = this._items.indexOf(item);
        return this._stackedTop.includes(index) || this._stackedBottom.includes(index);
    }

    protected _touchMoveHandler(event: SyntheticEvent<TouchEvent>, item: IItemTab): void {
        const index = this._items.indexOf(item);
        const currentTouchPosition = event.nativeEvent.touches[0].clientY;
        if (!this._touchPositionDnD) {
            this._touchPositionDnD = currentTouchPosition;
        }
        const positionToScroll = this._touchPositionDnD - currentTouchPosition;
        let haveScroll;
        for (let i = 0; i < this._items.length; i++) {
            haveScroll = this._hasScrollAvailable(i, positionToScroll);
            if (haveScroll) {
                break;
            }
        }
        if (!haveScroll) {
            return;
        }
        this._calcTabsPosition(index, positionToScroll, false);
        this._validatePosition();
        this._touchPositionDnD = currentTouchPosition;
    }

    protected _wheelHandler(event: SyntheticEvent<WheelEvent>, initialItem: IItemTab): void {
        const delta = event.nativeEvent.deltaY > 0 ? DELTA : -DELTA;
        const initialIndex = this._items.indexOf(initialItem);
        if (this._hasScrollAvailable(initialIndex, delta)) {
            if (this._stackedTop.includes(initialIndex)) {
                if (delta > 0) {
                    if (this._scrollStatesList[initialIndex].verticalPosition !== 'end') {
                        return;
                    }
                } else {
                    if (this._scrollStatesList[initialIndex].verticalPosition !== 'start') {
                        return;
                    }
                }
            }
        }
        event.preventDefault();
        this._calcTabsPosition(initialIndex, delta);
        this._validatePosition();
    }
    // eslint-disable-next-line
    private _calcTabsPosition(
        initialIndex: number,
        delta: number,
        forceToBottom: boolean = true,
        ignoreCanScroll?: boolean
    ): void {
        if (delta > 0) {
            let itemToScrollIndex;
            for (let i = initialIndex; i <= this._items.length - 1; i++) {
                const hasScroll = this._hasScrollAvailable(i, delta);
                if (hasScroll || ignoreCanScroll) {
                    itemToScrollIndex = i;
                    break;
                }
            }
            if (typeof itemToScrollIndex !== 'number') {
                return;
            }
            let itemWithHeightIndex;
            for (let i = itemToScrollIndex - 1; i >= 0; i--) {
                if (this._itemsHeight[i] > MIN_TAB_HEIGHT) {
                    itemWithHeightIndex = i;
                    break;
                }
            }
            if (typeof itemWithHeightIndex !== 'number') {
                this._itemsHeight.forEach((height, index) => {
                    if (typeof itemWithHeightIndex !== 'number' && height !== 0) {
                        itemWithHeightIndex = index;
                    }
                });
            }
            if (
                itemToScrollIndex !== initialIndex &&
                forceToBottom &&
                (this._scrollStatesList[initialIndex].verticalPosition !== 'start' ||
                    this._isStacked(this._items[initialIndex]))
            ) {
                this._setForceScrollToBottom(initialIndex);
            }
            if (itemToScrollIndex !== itemWithHeightIndex) {
                let realDelta;
                if (
                    itemWithHeightIndex === initialIndex &&
                    itemWithHeightIndex - 1 >= 0 &&
                    this._itemsHeight[itemWithHeightIndex - 1] > 0 &&
                    this._scrollStatesList[initialIndex].verticalPosition === 'start'
                ) {
                    realDelta = this._updateTabHeight(
                        itemWithHeightIndex - 1,
                        -delta,
                        ignoreCanScroll
                    );
                } else {
                    realDelta = this._updateTabHeight(itemWithHeightIndex, -delta, ignoreCanScroll);
                }
                this._updateTabHeight(itemToScrollIndex, -realDelta, ignoreCanScroll);
            }
        } else {
            let scrollableItemIndex;
            if (initialIndex === 0 && this._hasScrollAvailable(initialIndex, delta)) {
                let canReduce;
                let itemToReduceIndex = initialIndex;
                while (!canReduce) {
                    if (this._itemsHeight[itemToReduceIndex] === 0) {
                        itemToReduceIndex -= 1;
                        break;
                    }
                    if (this._items.length - 1 > itemToReduceIndex) {
                        itemToReduceIndex += 1;
                        canReduce = this._itemCanReduce(itemToReduceIndex);
                    } else {
                        break;
                    }
                }
                const realDelta = this._updateTabHeight(itemToReduceIndex, delta);
                this._updateTabHeight(initialIndex, -realDelta);
            }

            for (let i = initialIndex - 1; i >= 0; i--) {
                const canScroll = this._hasScrollAvailable(i, delta) || ignoreCanScroll;
                if (canScroll) {
                    scrollableItemIndex = i;
                    break;
                }
            }
            if (typeof scrollableItemIndex !== 'number') {
                for (let i = initialIndex - 1; i >= 0; i--) {
                    const canScroll = this._hasScrollAvailable(i, delta) || ignoreCanScroll;
                    if (canScroll) {
                        scrollableItemIndex = i;
                        break;
                    }
                }
            }
            if (typeof scrollableItemIndex === 'number') {
                let itemToScrollIndex = initialIndex;
                let canReduce;
                while (!canReduce) {
                    if (this._items.length - 1 >= itemToScrollIndex) {
                        if (this._itemsHeight[itemToScrollIndex] === 0) {
                            itemToScrollIndex -= 1;
                            break;
                        }
                        canReduce = this._itemCanReduce(itemToScrollIndex);
                        if (!canReduce) {
                            itemToScrollIndex += 1;
                        }
                    } else {
                        itemToScrollIndex -= 1;
                        break;
                    }
                }
                const realDelta = this._updateTabHeight(itemToScrollIndex, delta);
                this._updateTabHeight(scrollableItemIndex, -realDelta, true);
            }
        }
        this._version++;
    }

    private _validatePosition(): void {
        this._itemsHeight.forEach((height: number, index: number) => {
            if (height < MIN_HEIGHT && height !== 0) {
                this._setTabHeight(index, 0);
                let canIncIndex;
                for (let i = index + 1; i < this._items.length; i++) {
                    if (this._itemsHeight[i] !== 0) {
                        canIncIndex = i;
                        break;
                    }
                }
                if (typeof canIncIndex === 'number') {
                    this._updateTabHeight(canIncIndex, height, true);
                } else {
                    for (let i = index - 1; i >= 0; i--) {
                        if (this._itemsHeight[i] !== 0) {
                            canIncIndex = i;
                            break;
                        }
                    }
                    if (typeof canIncIndex === 'number') {
                        this._updateTabHeight(canIncIndex, height, true);
                    }
                }
            } else if (this._getContentHeight(index) < height) {
                const nextTab = index + 1;
                if (this._items.length > nextTab) {
                    this._setTabHeight(index, this._getContentHeight(index));
                    const delta = height - this._getContentHeight(index);
                    const realDelta = this._updateTabHeight(nextTab, delta, true);
                    if (realDelta < delta) {
                        this._updateTabHeight(nextTab + 1, realDelta);
                    }
                }
            }
        });
    }

    private _validateDnDPosition(index: number): void {
        const lessThanMin = this._itemsHeight[index] < MIN_HEIGHT;
        const nextItemIsNotEmpty = this._itemsHeight[index + 1] > 0;
        if (
            lessThanMin &&
            this._stackedTop.indexOf(index) === -1 &&
            this._stackedBottom.indexOf(index) === -1 &&
            nextItemIsNotEmpty
        ) {
            this._setTabHeight(index, MIN_HEIGHT);
        }
    }

    private _itemCanReduce(index: number): boolean {
        return this._itemsHeight[index] > MIN_TAB_HEIGHT;
    }

    private _updateTabHeight(
        index: number,
        delta: number,
        ignoreCanScroll?: boolean,
        ignoreHeight: boolean = true
    ): number {
        const canScroll = this._hasScrollAvailable(index, delta);
        const contentHeight = this._getContentHeight(index);
        if (!ignoreCanScroll && !canScroll && delta > 0) {
            return 0;
        }
        let realDelta = delta;
        if (this._itemsHeight[index] + delta < 0) {
            const difference = this._itemsHeight[index] + delta;
            realDelta = delta - difference;
        } else if (!ignoreHeight && this._itemsHeight[index] + delta > contentHeight) {
            realDelta = this._itemsHeight[index] + delta - contentHeight;
        }
        this._setTabHeight(index, this._itemsHeight[index] + realDelta);
        return realDelta;
    }

    private _setTabHeight(index: number, delta: number): void {
        this._itemsHeight[index] = delta;
        if (delta === 0) {
            this._children['scrollContainer' + index]?.scrollToTop();
        }
        this._updateContainerSizes(index, delta);
    }

    protected _updateContainerSizes(index: number, delta: number): void {
        this._containersHeightList[index] = delta;
    }

    private _hasScrollAvailable(index: number, delta: number): boolean {
        const contentHeight = this._getContentHeight(index);
        const containerHeight = this._getContainerHeight(index);
        if (!this._containersHeightList[index]) {
            this._containersHeightList[index] = containerHeight;
        }
        const scrollTop = contentHeight - this._containersHeightList[index];
        const hasScroll = scrollTop > 0;
        if (hasScroll) {
            if (delta > 0) {
                return this._scrollStatesList[index].verticalPosition !== 'end';
            }
        }
        return hasScroll;
    }

    private _getContainerHeight(index: number): number {
        return this._container.querySelector(
            '.controls-ColoredTabs__content__scroll__index-' + index
        ).offsetHeight;
    }

    private _getContentHeight(index: number): number {
        if (!this._contentContainers[index]) {
            const baseContentClassName = '.controls-ColoredTabs__custom-content__index-';
            const contentClassName = baseContentClassName + index;
            this._contentContainers[index] = this._container.querySelector(contentClassName);
        }
        if (typeof this._contentContainers[index]?.offsetHeight === 'number') {
            return this._contentContainers[index].offsetHeight;
        }
    }

    private _getContentsHeight(): number {
        let contentsHeight = 0;
        this._items.forEach((item, index) => {
            contentsHeight += this._getContentHeight(index);
        });
        return contentsHeight;
    }

    protected _scrollStateChangedHandler(event: Event, index: number, state: {}): void {
        this._scrollStatesList[index] = state;
        // Когда мы уменьшаем размер контейнера - скролл не остается на той же позиции и элементы скрываются
        // Будем скроллить его сами во время анимации
        if (this._forceScrollToBottom.includes(index)) {
            this._children['scrollContainer' + index].scrollToBottom();
            if (this._animationTimout) {
                clearTimeout(this._animationTimout);
            }
            this._animationTimout = setTimeout(() => {
                const forceScrollIndex = this._forceScrollToBottom.indexOf(index);
                this._forceScrollToBottom.splice(forceScrollIndex, 1);
            }, 100);
        }
    }

    private _setForceScrollToBottom(index: number): void {
        const forceScrollIndex = this._forceScrollToBottom.indexOf(index);
        if (forceScrollIndex === -1) {
            this._forceScrollToBottom.push(index);
        }
    }

    protected _setSelectedItem(item: IItemTab): void {
        let haveScroll;
        for (let i = 0; i < this._items.length; i++) {
            haveScroll = this._hasScrollAvailable(i, 0);
            if (haveScroll) {
                break;
            }
        }
        if (!haveScroll) {
            return;
        }
        if (!this._touchPositionDnD && !this._mousePositionDnD) {
            const itemIndex = this._items.indexOf(item);
            let maxHeight = 0;
            const maxItemHeight = this._getContentHeight(itemIndex);
            this._items.forEach((_, index) => {
                maxHeight += this._itemsInitialHeight[index];
            });
            if (this._stackedTop.length - 1 === itemIndex) {
                if (itemIndex === 0) {
                    if (
                        this._itemsHeight[itemIndex] < maxHeight &&
                        maxItemHeight > this._itemsHeight[itemIndex]
                    ) {
                        for (let i = this._items.length - 1; i >= itemIndex; i--) {
                            this._maximizeTabHeight(i, maxHeight);
                        }
                    } else {
                        this._itemsHeight.forEach((height, index) => {
                            this._setTabHeight(index, this._itemsInitialHeight[index]);
                            this._children['scrollContainer' + index].scrollToTop();
                        });
                    }
                } else {
                    this._itemsHeight.forEach((height, index) => {
                        this._setTabHeight(index, this._itemsInitialHeight[index]);
                        this._children['scrollContainer' + index].scrollToTop();
                    });
                }
            } else {
                if (this._stackedTop.length - 1 > itemIndex) {
                    for (let i = this._stackedTop.length - 1; i >= itemIndex; i--) {
                        this._maximizeTabHeight(i, maxHeight);
                    }
                } else {
                    this._maximizeTabHeight(itemIndex, maxHeight);
                }
            }
            this._version++;
        }
    }

    protected _onItemClickHandler(event: SyntheticEvent<MouseEvent>, item: IItemTab): void {
        this._setSelectedItem(item);
    }

    private _maximizeTabHeight(itemIndex: number, maxHeight: number): void {
        const initialHeight = [...this._itemsHeight];
        let maxItemHeight = this._getContentHeight(itemIndex);
        if (maxHeight <= maxItemHeight || this._items.length - 1 === itemIndex) {
            this._itemsHeight.forEach((itemHeight: number, index: number) => {
                if (index === itemIndex) {
                    this._setTabHeight(index, maxHeight);
                } else {
                    this._setTabHeight(index, 0);
                }
            });
            return;
        }
        maxItemHeight = Math.min(maxHeight, maxItemHeight);
        for (let i = 0; i < itemIndex; i++) {
            this._setTabHeight(i, 0);
        }
        this._setTabHeight(itemIndex, maxItemHeight);
        let delta = maxItemHeight;
        for (let i = this._items.length - 1; i > itemIndex; i--) {
            const itemHeight = this._itemsHeight[i] - delta;
            if (itemHeight > 0) {
                this._setTabHeight(i, itemHeight);
                break;
            } else {
                this._setTabHeight(i, 0);
                delta = delta - this._itemsHeight[i];
            }
        }
        const validateResult = () => {
            let resultValue = 0;
            this._itemsHeight.forEach((height) => {
                resultValue += height;
            });
            if (resultValue !== maxHeight) {
                const nextItemIndex = itemIndex + 1;
                if (this._items[nextItemIndex]) {
                    const contentHeight = this._getContentHeight(nextItemIndex);
                    if (contentHeight > this._itemsHeight[nextItemIndex]) {
                        this._setTabHeight(nextItemIndex, maxHeight - maxItemHeight);
                        return;
                    }
                }
                this._itemsHeight = initialHeight;
            }
        };
        validateResult();
    }

    private _saveSelectedKey(newKey: string | number, propStorageId: string): void {
        this._selectedKey = newKey;
        this._notify('selectedKeyChanged', [newKey]);
        this._saveSelectedKeyInStorage(propStorageId);
    }

    private _getItemByKey(key: string | number): IItemTab {
        if (key === null) {
            return;
        }

        return this._items[
            this._items.findIndex((item) => {
                return item.key === key.toString();
            })
        ];
    }

    private _getSelectedKeyByStorageId(propStorageId: string): Promise<string | number> {
        return new Promise((resolve) => {
            getSettings([propStorageId]).then((storage) => {
                if (
                    storage &&
                    storage[propStorageId] &&
                    storage[propStorageId].time === new Date().setHours(0, 0, 0, 0)
                ) {
                    resolve(storage[propStorageId].selectedKey);
                } else {
                    resolve(undefined);
                }
            });
        });
    }

    private _saveSelectedKeyInStorage(propStorageId: string): void {
        if (propStorageId === undefined) {
            return;
        }

        setSettings({
            [propStorageId]: {
                selectedKey: this._selectedKey,
                time: new Date().setHours(0, 0, 0, 0),
            },
        });
    }

    static defaultProps: IColoredTabsOptions = {
        backgroundFill: BACKGROUND_FILL.FULL,
    };

    // Используется только в демках.
    static _offAnimation(): void {
        const animDuration = 0.01;
        defaultAnimDuration = animDuration;
    }
}

export default View;
