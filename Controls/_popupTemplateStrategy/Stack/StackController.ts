/**
 * @kaizen_zone 9b624d5d-133f-4f58-8c48-7fb841857d9e
 */
import BaseController, { getRightPanelWidth } from 'Controls/_popupTemplateStrategy/BaseController';
import {
    Controller,
    IPopupSizes,
    IPopupOptions,
    IPopupPosition,
    IStackPopupOptions,
    IPopupItem,
} from 'Controls/popup';
import StackStrategy from 'Controls/_popupTemplateStrategy/Stack/StackStrategy';
import {
    getPopupWidth,
    savePopupWidth,
} from 'Controls/_popupTemplateStrategy/Util/PopupWidthSettings';
import {
    BASE_WIDTH_SIZES as UTIL_BASE_WIDTH_SIZES,
    initializationConstants,
    MIN_MAXIMIZED_WIDTH,
    IStackSavedConfig,
    getMiddleWidth,
} from 'Controls/popupTemplate';
import { List } from 'Types/collection';
import getTargetCoords from 'Controls/_popupTemplateStrategy/TargetCoords';
import { parse as parserLib } from 'Core/library';
import StackContent from 'Controls/_popupTemplateStrategy/Stack/Template/StackContent';
import { constants, detection } from 'Env/Env';
import { Bus } from 'Env/Event';
import * as isNewEnvironment from 'Core/helpers/isNewEnvironment';
// eslint-disable-next-line
import { Deferred } from 'Types/deferred';
import { DimensionsMeasurer } from 'Controls/sizeUtils';
import { controller } from 'I18n/i18n';

/**
 * Stack Popup Controller
 * @class Controls/_popupTemplateStrategy/Stack/Opener/StackController
 *
 * @private
 */

const ACCORDEON_MIN_WIDTH = 50;
const MIN_DISTANCE = 50;

let themeConstants = {};

interface IPopupOptions extends IStackPopupOptions {
    currentWidth: number;
    currentMaxWidth: number;
    currentMinWidth: number;
    hasDefaultStackTemplate: boolean;
    fullscreen: boolean;
}

export interface IStackItem extends IPopupItem {
    containerWidth: number;
    popupOptions: IPopupOptions;
    minSavedWidth: number;
    maxSavedWidth: number;
}

export class StackController extends BaseController {
    TYPE: string = 'Stack';
    _stack: List<IStackItem> = new List();

    BASE_WIDTH_SIZES: string[] = UTIL_BASE_WIDTH_SIZES;
    private _sideBarVisible: boolean = true;
    private _positionBeforeUpdate: IPopupPosition;

    elementCreated(item: IStackItem, container: HTMLElement): boolean {
        const isSinglePopup = this._stack.getCount() < 2;
        let positionUpdate: boolean = false;

        if (isSinglePopup) {
            this._prepareSizeWithoutDOM(item);
        } else {
            this._prepareSizes(item, container);
        }

        if (item.popupOptions.isCompoundTemplate) {
            this._setStackContent(item);
            this._stack.add(item);
            this._update();
        } else if (!isSinglePopup) {
            this._update();
        } else {
            positionUpdate = this._updateItemPosition(item);
        }

        if (!isNewEnvironment()) {
            if (isSinglePopup) {
                this._updateSideBarVisibility(container);
            }
        }

        if (item.popupOptions.isCompoundTemplate) {
            return true;
        }

        // Если стековое окно 1, то перерисовок звать не надо, только если после маунта позиция и размеры изменились
        // Если окон больше, то перерисовка должна быть, меняются классы, видимость.
        return !isSinglePopup || positionUpdate;
    }

    elementUpdateOptions(item: IStackItem, container: HTMLElement): boolean | Promise<boolean> {
        this._preparePropStorageId(item);
        if (!item.popupOptions.propStorageId) {
            return this._updatePopup(item, container);
        } else {
            return this._getPopupWidth(item).then(() => {
                return this._updatePopup(item, container);
            });
        }
    }

    elementUpdated(item: IStackItem, container: HTMLElement): boolean {
        this._positionBeforeUpdate = item.position;
        this._updatePopup(item, container);
        return true;
    }

    elementAfterUpdated(item: IStackItem, container: HTMLElement): boolean {
        let needUpdate = false;
        if (item.childs.length) {
            // Если у окна restrictiveContainer лежит на другом окне - то нужно высчитывать позицию только когда
            // родительское окно ее высчитает. Иначе при ресайзе страницы и родитель и дочернее обновят позицию в
            // 1 цикл, что приведет к неправильной позиции дочернего.
            if (JSON.stringify(item.position) !== JSON.stringify(this._positionBeforeUpdate)) {
                BaseController.resetRootContainerCoords();
                for (const child of item.childs) {
                    if (child.controller.TYPE === this.TYPE) {
                        needUpdate = true;
                    }
                }
                if (needUpdate) {
                    this._update();
                }
            }
        }
        return needUpdate;
    }

    elementDestroyed(item: IStackItem): Promise<null> {
        this._stack.remove(item);
        this._update();
        return new Deferred().callback();
    }

    getDefaultConfig(item: IStackItem): void | Promise<void> {
        const promiseArray = [];
        this._preparePropStorageId(item);
        if (this._checkItemWidthValue(item)) {
            promiseArray.push(this.initializationConstants());
        }
        if (item.popupOptions.propStorageId) {
            promiseArray.push(this._getPopupWidth(item));
        }
        if (promiseArray.length !== 0) {
            return Promise.all(promiseArray).then((res) => {
                return this._getDefaultConfig(item);
            });
        }
        this._getDefaultConfig(item);
    }

    private _setFullscreenState(item: IStackItem, state: boolean): void {
        item.popupOptions.fullscreen = state;
    }

    elementFullscreen(
        item: IStackItem,
        container?: HTMLElement,
        fullscreen: boolean = null,
    ): boolean {
        const stackParentsCoords = this._getStackParentCoords(item);
        const width = StackStrategy.getMaxPanelWidth(stackParentsCoords, item.popupOptions);
        if (fullscreen && !item.popupOptions.fullscreen) {
            item.previousSavedWidth = item.popupOptions.width;
            item.popupOptions.width = width;
        } else {
            item.popupOptions.width = item.previousSavedWidth;
        }
        this._setFullscreenState(item, fullscreen);
        this._prepareSizes(item, container);
        this._update();
        this._savePopupWidth(item, item.popupOptions.width);
        return true;
    }

    elementMaximized(
        item: IStackItem,
        container?: HTMLElement,
        maximized: boolean = null,
        isPopup: boolean = true
    ): boolean {
        const state = maximized !== null ? maximized : !this.getMaximizedState(item, isPopup);
        const middleWidth = this._getMiddleWidth(item, this._getMaxPanelWidth(item, isPopup));
        this._setMaximizedState(item, state);
        const stackParentCoords = this._getStackParentCoords(item);
        const maxPanelWidth = StackStrategy.getMaxPanelWidth(
            stackParentCoords,
            item.popupOptions
        );
        const minWidth = this._getMinWidth(item, maxPanelWidth);
        let maxWidth;
        if (item.maxSavedWidth < item.popupOptions.maxWidth && middleWidth >= item.maxSavedWidth) {
            maxWidth = item.popupOptions.maxWidth;
        } else {
            maxWidth = item.maxSavedWidth || item.popupOptions.maxWidth;
        }
        item.popupOptions.width = item.popupOptions.maximized ? maxWidth : minWidth;
        this._prepareSizes(item, container);
        this._update();
        this._savePopupWidth(item, item.popupOptions.width);
        return true;
    }

    initializationConstants(): Promise<void | object> {
        return initializationConstants().then((result) => {
            themeConstants = result;
        });
    }

    private _checkItemWidthValue(item: IStackItem): boolean {
        const defaultOptions = this._getDefaultOptions(item);
        const optionsWidthSet = {
            width: defaultOptions.width || item.popupOptions.width,
            minWidth: defaultOptions.minWidth || item.popupOptions.minWidth,
            maxWidth: defaultOptions.maxWidth || item.popupOptions.maxWidth,
        };
        return (
            this.BASE_WIDTH_SIZES.includes(optionsWidthSet.width) ||
            this.BASE_WIDTH_SIZES.includes(optionsWidthSet.minWidth) ||
            this.BASE_WIDTH_SIZES.includes(optionsWidthSet.maxWidth)
        );
    }

    private _updateMaximizedState(item: IStackItem, state?: boolean): void {
        const stackParentCoords = this._getStackParentCoords(item);
        const maxPanelWidth = StackStrategy.getMaxPanelWidth(
            stackParentCoords,
            item.popupOptions
        );
        const maximized =
            state !== undefined ? state : this._getMaximizedState(item, maxPanelWidth);
        this._setMaximizedState(item, maximized);
    }

    /**
     * Расчет минимальноё ширины для панели в случае переключения maximized
     * Если minSavedWidth оказался больше максимальной доступной ширины попапа, то нужно использовать минимальную
     * Иначе при переключении maximized в обоих состояниях будет обрезаться
     * @param item
     * @param maxPanelWidth
     * @private
     */
    private _getMinWidth(item: IStackItem, maxPanelWidth: number): number {
        const middleWidth = this._getMiddleWidth(item, maxPanelWidth);
        const minWidth = item.popupOptions.minimizedWidth || item.popupOptions.minWidth;
        // Если размер экрана/рабочей области такой, что минимальное сохраненное значение больше медианы по ширине -
        // то сбросим его к минимальному возможному значению.
        if (middleWidth < item.minSavedWidth) {
            return minWidth;
        }
        if (item.minSavedWidth < maxPanelWidth) {
            return item.minSavedWidth;
        }
        return minWidth;
    }

    resizeInner(): boolean {
        return false;
    }

    workspaceResize(): boolean {
        this._update();
        return !!this._stack.getCount();
    }

    popupMovingSize(item: IStackItem, offset: object, position?: string): boolean {
        const currentWidth = item.position.width || item.popupOptions.width;
        const newValue = currentWidth + offset.x;
        const minWidth = item.popupOptions.minimizedWidth || item.popupOptions.minWidth;
        let clientWidth = item.popupOptions.maxWidth;
        if (constants.isBrowserPlatform) {
            clientWidth = document?.body?.clientWidth - getRightPanelWidth();
        }
        const maxWidth = Math.min(item.popupOptions.maxWidth, clientWidth);
        const midWidth = (maxWidth + minWidth) / 2;
        const isMoreThanMid = newValue >= midWidth;
        let minSavedWidth = !isMoreThanMid ? newValue : item.minSavedWidth;
        let maxSavedWidth = isMoreThanMid ? newValue : item.maxSavedWidth;

        // Если расстояние между сохраненными ширинами меньше MIN_DISTANCE,
        // то одну из сохраненных ширин сбрасываем, чтобы
        // разворот по кнопке был более заметным.
        if (maxSavedWidth - minSavedWidth < MIN_DISTANCE) {
            if (isMoreThanMid) {
                minSavedWidth -= MIN_DISTANCE;
            } else {
                maxSavedWidth = item.popupOptions.maxWidth;
            }
        }

        item.popupOptions.width = newValue;
        item.minSavedWidth = minSavedWidth;
        item.maxSavedWidth = maxSavedWidth;
        item.popupOptions.workspaceWidth = newValue;
        this._updateMaximizedState(item);
        this._update();
        this._savePopupWidth(item);
        return true;
    }

    getMaximizedState(item: IStackItem, isPopup: boolean = true): boolean {
        if (constants.isServerSide) {
            const { width, minWidth, maxWidth } = item.popupOptions;
            return width - (minWidth + maxWidth) / 2 > 0;
        }

        return this._getMaximizedState(item, this._getMaxPanelWidth(item, isPopup));
    }

    protected _getMaxPanelWidth(item: IStackItem, isPopup: boolean = true): number {
        // При расчете maximized используем right родительского элемента, чтобы определить состояние относительно
        // ширины рабочей области, а не ширины страницы.
        // Карточка, которая строится в отдельном окне, не имеет зафиксированной позиции, при растяжении постоянно
        // будет менятся right и расчет максимальной ширины будет все время меняться.
        // Поэтому берем минимальное значение из width всей страницы и maxHeight заданный в конфиге.
        if (!isPopup) {
            return document.body.clientWidth - getRightPanelWidth();
        } else {
            const stackParentCoords = this._getStackParentCoords(item);
            return StackStrategy.getMaxPanelWidth(
                stackParentCoords,
                item.popupOptions
            );
        }
    }

    private _getMaximizedState(item: IStackItem, maxPanelWidth: number): boolean {
        if (
            !item.popupOptions.minimizedWidth &&
            item.popupOptions.minWidth &&
            item.popupOptions.maxWidth
        ) {
            const middle = this._getMiddleWidth(item, maxPanelWidth);
            let width = item.popupOptions.width;
            if (
                maxPanelWidth &&
                width > maxPanelWidth &&
                item.popupOptions.minWidth <= MIN_MAXIMIZED_WIDTH
            ) {
                width = maxPanelWidth;
            }
            return width - middle > 0;
        }
        return item.popupOptions.templateOptions.maximized;
    }

    private _getMiddleWidth(item: IStackItem, maxPanelWidth: number): number {
        return getMiddleWidth(item, maxPanelWidth);
    }

    private _updateItemPosition(item: IStackItem): boolean {
        // Пересчитаем еще раз позицию, на случай, если ресайзили окно браузера
        const position = this._getItemPosition(item);
        // быстрая проверка на равенство простых объектов
        if (JSON.stringify(item.position) !== JSON.stringify(position)) {
            item.position = position;
            this._updatePopupOptions(item);
            return true;
        }

        return false;
    }

    private _update(): void {
        let cache: IStackItem[] = [];
        this._stack.each((item) => {
            if (item.popupState !== this.POPUP_STATE_DESTROYING) {
                this._updateItemPosition(item);
                this._updatePopupWidth(item, item.position.width);
                this._removeLastStackClass(item);
                const currentWidth = this._getPopupHorizontalLength(item);
                let forRemove;
                if (currentWidth) {
                    const cacheItem = cache.find((el) => {
                        const itemWidth = this._getPopupHorizontalLength(el);
                        return itemWidth === currentWidth && item.currentZIndex >= el.currentZIndex;
                    });

                    if (cacheItem) {
                        forRemove = cacheItem;
                        this._hidePopup(cacheItem);
                    }
                    this._showPopup(item);
                    cache.push(item);
                }

                cache = cache.filter((el) => {
                    if (el === forRemove) {
                        forRemove = null;
                        return false;
                    }
                    const itemWidth = this._getPopupHorizontalLength(el);
                    const isVisiblePopup =
                        itemWidth >= (currentWidth || 0) || item.currentZIndex < el.currentZIndex;
                    if (!isVisiblePopup) {
                        this._hidePopup(el);
                    }
                    return isVisiblePopup;
                });

                if (StackStrategy.isMaximizedPanel(item)) {
                    this._updateMaximizedState(item);
                    this._prepareMaximizedState(item);
                }
            }
        });
        const lastItem = this._stack.at(this._stack.getCount() - 1);
        if (lastItem) {
            this._addLastStackClass(lastItem);
        }
        if (!isNewEnvironment()) {
            this._updateSideBarVisibility();
        }
    }

    // length = popup size + popup padding
    private _getPopupHorizontalLength(item: IStackItem): number {
        const windowDimensions = DimensionsMeasurer.getWindowDimensions();
        let offset = 0;
        if (item.position?.right) {
            offset = item.position.right;
        } else if (item.position?.left) {
            if (controller.currentLocaleConfig.directionality === 'rtl') {
                offset = item.position.left;
            } else {
                offset =
                    windowDimensions.innerWidth -
                    (item.containerWidth || item.position.width) -
                    item.position.left;
            }
        }
        return (item.containerWidth || item.position.width) + offset;
    }

    protected _prepareSizes(item: IStackItem, container?: HTMLElement): void {
        let width;
        let maxWidth;
        let minWidth;
        let templateContainer;

        if (container) {
            /* start: Remove the set values that affect the size and positioning to get the real size of the content */
            templateContainer = this._getStackContentWrapperContainer(container);
            width = templateContainer.style.width;
            maxWidth = templateContainer.style.maxWidth;
            minWidth = templateContainer.style.minWidth;
            // We won't remove width and height, if they are set explicitly.
            if (!item.popupOptions.width) {
                templateContainer.style.width = 'auto';
            }
            if (!item.popupOptions.maxWidth) {
                templateContainer.style.maxWidth = 'auto';
            }
            if (!item.popupOptions.minWidth) {
                templateContainer.style.minWidth = 'auto';
            }
            /* end: We remove the set values that affect the size and positioning to get the real size of the content */
        }
        const templateStyle = container ? getComputedStyle(container.children[0]) : {};
        const defaultOptions = this._getDefaultOptions(item);

        item.popupOptions.minWidth = this._prepareSize(
            [item.popupOptions, defaultOptions, templateStyle],
            'minWidth',
            themeConstants
        );
        item.popupOptions.maxWidth = this._prepareSize(
            [item.popupOptions, defaultOptions, templateStyle],
            'maxWidth',
            themeConstants
        );
        item.popupOptions.width = this._prepareSize([item.popupOptions, defaultOptions], 'width', themeConstants);

        this._validateConfiguration(item);

        if (!item.popupOptions.hasOwnProperty('minimizedWidth')) {
            item.popupOptions.minimizedWidth = defaultOptions.minimizedWidth;
        }

        if (container) {
            /* start: Return all values to the node. Need for vdom synchronizer */
            templateContainer.style.width = width;
            templateContainer.style.maxWidth = maxWidth;
            templateContainer.style.minWidth = minWidth;
            /* end: Return all values to the node. Need for vdom synchronizer */
        }
    }

    protected _prepareSize(optionsSet: IPopupOptions[], property: string, constants?: unknown): number | void {
        return super._prepareSize(optionsSet, property, constants);
    }

    private _getDefaultConfig(item: IStackItem): void {
        this._prepareSizeWithoutDOM(item);
        this._setStackContent(item);

        // TODO: old logic will removed
        if (StackStrategy.isMaximizedPanel(item) && !item.popupOptions.propStorageId) {
            // set default values
            item.popupOptions.templateOptions.maximizeButtonVisibility = undefined; // for vdom dirtyChecking
            const maximizedState = item.popupOptions.hasOwnProperty('maximized')
                ? item.popupOptions.maximized
                : false;
            this._setMaximizedState(item, maximizedState);
        }

        if (item.popupOptions.isCompoundTemplate) {
            // set sizes before positioning. Need for templates who calculate sizes relatively popup sizes
            const position = this._getItemPosition(item);
            item.position = {
                top: -10000,
                left: -10000,
                height: this._getWindowSize(document?.body).height,
                width: position.width || undefined,
            };
        } else {
            // TODO KINGO
            // Когда несколько раз зовут open до того как построилось окно и у него может вызываться фаза update
            // мы обновляем опции, которые пришли в последний вызов метода open и зовем getDefaultConfig, который
            // добавляет item в _stack. Добавление нужно делать 1 раз, чтобы не дублировалась конфигурация.
            const itemIndex = this._stack.getIndexByValue('id', item.id);
            if (itemIndex === -1) {
                this._stack.add(item);
            } else {
                // Нельзя заменить сам итем в стэке, иначе он измениться по ссылке
                const stackItem = this._stack.at(itemIndex);
                Object.assign(stackItem, item);
            }
            item.position = this._getItemPosition(item);
            // Поставим height при построении, чтобы элемент сразу был правильной высоты до показа
            if (!item.calculatedRestrictiveContainer) {
                item.position.height = this._getWindowSize(document?.body).height;
            }
            if (StackStrategy.isMaximizedPanel(item)) {
                this._updateMaximizedState(item);
                this._prepareMaximizedState(item);
            }
            if (this._stack.getCount() <= 1) {
                this._updatePopupOptions(item);
                this._addLastStackClass(item);
            }
        }
    }

    private _getItemPosition(item: IStackItem): IPopupPosition {
        const targetCoords = this._getStackParentCoords(item);
        const isAboveMaximizePopup: boolean = this._isAboveMaximizePopup(item);
        const position = StackStrategy.getPosition(targetCoords, item, isAboveMaximizePopup);
        const width = position.width || position.minWidth || position.maxWidth;
        item.popupOptions.currentWidth = width;
        item.popupOptions.workspaceWidth = width;
        item.popupOptions.currentMinWidth = position.minWidth;
        item.popupOptions.currentMaxWidth = position.maxWidth;
        // todo https://online.sbis.ru/opendoc.html?guid=256679aa-fac2-4d95-8915-d25f5d59b1ca
        item.popupOptions.stackMinimizedWidth = item.popupOptions.minimizedWidth;

        this._updatePopupWidth(item, position.width);
        return position;
    }

    protected _validateConfiguration(item: IStackItem): void {
        super._validateConfiguration(item);
    }

    private _updatePopup(item: IStackItem, container: HTMLElement): boolean {
        this._updatePopupOptions(item);
        this._setStackContent(item);
        this._prepareSizes(item, container);
        this._update();
        return true;
    }

    private _prepareSizeWithoutDOM(item: IStackItem): void {
        this._prepareSizes(item);
    }

    private _getContainerWidth(container: HTMLElement): number {
        // The width can be set when the panel is displayed. To calculate the width of the content, remove this value.
        const currentContainerWidth = container.style.width;
        container.style.width = 'auto';

        const templateWidth = container.querySelector(
            '.controls-Stack__content-wrapper'
        ).offsetWidth;
        container.style.width = currentContainerWidth;
        return templateWidth;
    }

    private _updatePopupWidth(item: IStackItem, width: number): void {
        if (!width && item.popupState !== this.POPUP_STATE_INITIALIZING) {
            item.containerWidth = this._getContainerWidth(this._getPopupContainer(item.id));
        }
    }

    private _getStackContentWrapperContainer(stackContainer: HTMLElement): HTMLElement {
        return stackContainer.querySelector('.controls-Stack__content-wrapper');
    }

    private _getStackParentCoords(item: IStackItem): IPopupPosition {
        const coords = StackController.calcStackParentCoords(item);
        if (!item.popupOptions.hasDefaultStackTemplate) {
            coords.right -= getRightPanelWidth();
        }
        let parentItem = Controller.find(item.parentId);
        // Если стековое окно открывается внутри другого стекового окна, то пытаемся его найти
        do {
            if (parentItem && parentItem.controller.TYPE === this.TYPE) {
                const position = parentItem.popupOptions?.stackPosition || 'right';
                if (
                    item.popupOptions.hasDefaultStackTemplate &&
                    parentItem.popupOptions.hasDefaultStackTemplate
                ) {
                    coords[position] = parentItem.position[position];
                    return coords;
                }
            }
            if (parentItem) {
                parentItem = Controller.find(parentItem.parentId);
            }
        } while (parentItem);
        return coords;
    }

    private _showPopup(item: IStackItem): void {
        item.position.hidden = false;
    }

    private _hidePopup(item: IStackItem): void {
        if (!item.popupOptions.shouldNotHideOverlayedPopup && !item.popupOptions.fullscreen) {
            item.position.hidden = true;
        }
    }

    private _updatePopupOptions(item: IStackItem): void {
        // for vdom synchronizer. Updated the link to the options when className was changed
        if (!item.popupOptions._version) {
            item.popupOptions.getVersion = () => {
                return item.popupOptions._version;
            };
            item.popupOptions._version = 0;
        }
        item.popupOptions._version++;
    }

    private _prepareMaximizedState(item: IStackItem): void {
        const stackParentCoords = this._getStackParentCoords(item);
        const maxPanelWidth = StackStrategy.getMaxPanelWidth(
            stackParentCoords,
            item.popupOptions
        );
        const canMaximized = maxPanelWidth > item.popupOptions.minWidth;
        if (!canMaximized) {
            // If we can't turn around, we hide the turn button and change the state
            item.popupOptions.templateOptions.maximizeButtonVisibility = false;
            item.popupOptions.templateOptions.maximized = false;
        } else {
            item.popupOptions.templateOptions.maximizeButtonVisibility = true;

            // Restore the state after resize
            item.popupOptions.templateOptions.maximized = item.popupOptions.maximized;
        }
    }

    private _setMaximizedState(item: IStackItem, state: boolean): void {
        item.popupOptions.maximized = state;
        item.popupOptions.templateOptions.maximized = state;
    }

    private _getWindowSize(container: HTMLElement): IPopupSizes {
        const windowDimensions = DimensionsMeasurer.getWindowDimensions(container);
        return {
            width: windowDimensions?.innerWidth,
            height: windowDimensions?.innerHeight,
        };
    }

    private _setStackContent(item: IStackItem): void {
        item.popupOptions.content = StackContent;
    }

    protected _getDefaultOptions(item: IStackItem): IStackPopupOptions {
        let template = item.popupOptions.template;

        if (template === 'SabyPage/popup:Template') {
            // В случае если построение идет через загрузчики, будем работать с шаблоном, лежащим в обертке sabyPage.
            template = item.popupOptions.templateOptions.pageTemplate;
        }

        if (typeof item.popupOptions.hasDefaultStackTemplate !== 'boolean') {
            item.popupOptions.hasDefaultStackTemplate = true;
        }

        return super._getDefaultOptions(item, template);
    }

    private _preparePropStorageId(item: IStackItem): void {
        if (!item.popupOptions.propStorageId) {
            const defaultOptions = this._getDefaultOptions(item);
            item.popupOptions.propStorageId = defaultOptions.propStorageId;
        }
    }

    private _getPopupWidth(item: IStackItem): Promise<number | void> {
        return getPopupWidth(item.popupOptions.propStorageId).then((width?: number) => {
            if (width) {
                this._writeCompatiblePopupWidth(item, width);
            }
            return width;
        });
    }

    private _writeCompatiblePopupWidth(
        item: IStackItem,
        widthState: number | IStackSavedConfig
    ): void {
        // Обратная совместимость со старым режимом работы максимизации окна.
        // Раньше сохранялась только текущая ширина окна.
        if (typeof widthState === 'number') {
            item.popupOptions.width = widthState;
        } else {
            item.popupOptions.width = widthState.width;
            item.maxSavedWidth = widthState.maxSavedWidth;
            item.minSavedWidth = widthState.minSavedWidth;
        }
    }

    private _savePopupWidth(item: IStackItem, width?: number): void {
        const widthState = {
            width: width || item.position.width || item.popupOptions.width,
            minSavedWidth: item.minSavedWidth,
            maxSavedWidth: item.maxSavedWidth,
        };
        savePopupWidth(item.popupOptions.propStorageId, widthState);
    }

    private _addLastStackClass(item: IStackItem): void {
        item.popupOptions.className =
            (item.popupOptions.className || '') + ' controls-Stack__last-item';
    }

    private _removeLastStackClass(item: IStackItem): void {
        const className = (item.popupOptions.className || '').replace(
            /controls-Stack__last-item/gi,
            ''
        );
        item.popupOptions.className = className.trim();
    }

    // TODO COMPATIBLE
    private _getSideBarWidth(): number {
        const sideBar = document.querySelector(
            '.ws-float-area-stack-sidebar, .navSidebar__sideLeft, .online-Sidebar'
        );
        return (sideBar && sideBar.clientWidth) || 0;
    }

    private _updateSideBarVisibility(container: HTMLElement): void {
        let maxWidth = 0;
        this._stack.each((item) => {
            if (item.popupOptions.width > maxWidth) {
                maxWidth = item.popupOptions.width;
            }
        });

        const isVisible =
            this._getWindowSize(container).width - maxWidth >=
            this._getSideBarWidth() + ACCORDEON_MIN_WIDTH;

        if (isVisible !== this._sideBarVisible) {
            this._sideBarVisible = isVisible;
            Bus.channel('navigation').notify(
                'accordeonVisibilityStateChange',
                this._sideBarVisible
            );
        }
    }

    static calcStackParentCoords(item: IStackItem): IPopupPosition {
        let rootCoords;
        const rightPanelWidth = getRightPanelWidth();
        // TODO: Ветка для старой страницы
        if (!isNewEnvironment()) {
            let stackRoot = document.querySelector('.ws-float-area-stack-root') as HTMLElement;
            const isNewPageTemplate = document.body.classList.contains('ws-new-page-template');
            const contentIsBody = stackRoot === document.body;
            if (!contentIsBody && !isNewPageTemplate && stackRoot) {
                stackRoot = stackRoot.parentElement as HTMLElement;
            }
            rootCoords = getTargetCoords(stackRoot || document.body);
            rootCoords.right -= rightPanelWidth;
        } else {
            const selector = '.controls-Popup__stack-target-container';
            rootCoords = BaseController.getRootContainerCoords(item, selector, rightPanelWidth);
        }

        // calc with scroll only on desktop devices, because stack popup has fixed position and can scroll with page
        const leftPageScroll = detection.isMobilePlatform ? 0 : rootCoords.leftScroll;
        let elDimensions = document.documentElement;
        if (detection.isMobileAndroid) {
            // https://online.sbis.ru/opendoc.html?guid=b9911ef8-4963-4555-811d-32931e18620d&client=3
            elDimensions = document.body;
        }
        const documentDimensions = DimensionsMeasurer.getElementDimensions(elDimensions);
        const stackParentCoords = {
            top: Math.max(rootCoords.top, 0),
            height: rootCoords.height,
            right: documentDimensions.clientWidth - rootCoords.right + leftPageScroll,
            left: rootCoords.left,
        };
        if (controller.currentLocaleConfig.directionality === 'rtl') {
            stackParentCoords.left =
                documentDimensions.clientWidth - rootCoords.right + leftPageScroll;
            stackParentCoords.right = rootCoords.left;
        }
        return stackParentCoords;
    }
}

export default new StackController();
