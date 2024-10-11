/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import {
    Controller as ManagerController,
    IDragOffset,
    IPopupController,
    IPopupItem,
    IPopupOptions,
    IPopupPosition,
    IPopupSizes,
} from 'Controls/popup';
import getTargetCoords from 'Controls/_popupTemplateStrategy/TargetCoords';
import { Control } from 'UI/Base';
import { goUpByControlTree } from 'UI/Focus';
import { Logger } from 'UI/Utils';
import { constants } from 'Env/Env';
import oldWindowManager from 'Controls/_popupTemplateStrategy/_oldWindowManager';
import { getAdaptiveModeForLoaders } from 'UI/Adaptive';
// eslint-disable-next-line
import { Deferred } from 'Types/deferred';
import * as cMerge from 'Core/core-merge';
import * as cInstance from 'Core/core-instance';
import { DimensionsMeasurer } from 'Controls/sizeUtils';
import getDirection from 'Controls/_popupTemplateStrategy/Util/getDirection';
import { parse as parserLib } from 'WasabyLoader/Library';
import {
    RIGHT_PANEL_WIDTH,
    getRightPanelWidth as utilGetRightPanelWidth,
    initializationPopupConstants,
    BASE_WIDTHS_POPUP,
} from 'Controls/popupTemplate';

export { RIGHT_PANEL_WIDTH };

export const getRightPanelWidth = () => {
    return utilGetRightPanelWidth();
};
let _fakeDiv: HTMLElement;

let themeConstants = {};
/**
 * Base Popup Controller
 * @private
 */
abstract class BaseController implements IPopupController {
    // Перед добавлением окна в верстку
    POPUP_STATE_INITIALIZING: string = 'initializing';
    // После добавления окна в верстку
    POPUP_STATE_CREATED: string = 'created';
    // Перед обновлением опций окна
    POPUP_STATE_UPDATING: string = 'updating';
    // После обновления опций окна
    POPUP_STATE_UPDATED: string = 'updated';
    // Окно начало удаление, перед всеми операциями по закрытию детей и пендингов
    POPUP_STATE_START_DESTROYING: string = 'startDestroying';
    // Окно в процессе удаления (используется где есть операции перед удалением, например анимация)
    POPUP_STATE_DESTROYING: string = 'destroying';
    // Окно удалено из верстки
    POPUP_STATE_DESTROYED: string = 'destroyed';

    TYPE: string = 'Base';

    elementCreatedWrapper(item: IPopupItem, container: HTMLElement): boolean {
        if (this._checkContainer(item, container, 'elementCreated')) {
            item.popupState = this.POPUP_STATE_CREATED;
            oldWindowManager.addZIndex(item.currentZIndex);
            if (item.popupOptions.autoClose) {
                this._closeByTimeout(item);
            }
            const result = this.elementCreated.apply(this, arguments);
            item.popupOptions.updateCallback?.(item);
            return result;
        }
    }

    protected elementCreated(item: IPopupItem, container: HTMLElement): boolean {
        // method can be implemented
        return false;
    }

    elementMountedWrapper(item: IPopupItem, container: HTMLElement): boolean {
        if (this._checkContainer(item, container, 'popupMounted')) {
            return this.elementMounted.apply(this, arguments);
        }
    }

    protected elementMounted(item: IPopupItem, container: HTMLElement): boolean {
        return false;
    }

    elementUpdatedWrapper(item: IPopupItem, container: HTMLElement): boolean {
        if (this._checkContainer(item, container, 'elementUpdated')) {
            if (
                item.popupState === this.POPUP_STATE_CREATED ||
                item.popupState === this.POPUP_STATE_UPDATED ||
                item.popupState === this.POPUP_STATE_UPDATING
            ) {
                item.popupState = this.POPUP_STATE_UPDATING;
                this.elementUpdated.apply(this, arguments);
                item.popupOptions.updateCallback?.(item);
                return true;
            }
        }
        return false;
    }

    protected elementUpdated(item: IPopupItem, container: HTMLElement): boolean {
        // method can be implemented
        if (
            BASE_WIDTHS_POPUP.includes(item.popupOptions.width) ||
            BASE_WIDTHS_POPUP.includes(item.width) ||
            BASE_WIDTHS_POPUP.includes(item.position.width)
        ) {
            this._prepareSizeWithoutDOM(item);
        }
        return false;
    }

    updatePosition(item: IPopupItem, container: HTMLElement): boolean {
        // method can be implemented
        return false;
    }

    elementAfterUpdatedWrapper(item: IPopupItem, container: HTMLElement): boolean {
        if (this._checkContainer(item, container, 'elementAfterUpdated')) {
            // We react only after the update phase from the controller
            if (item.popupState === this.POPUP_STATE_UPDATING) {
                item.popupState = this.POPUP_STATE_UPDATED;
                return this.elementAfterUpdated.apply(this, arguments);
            }
        }
        return false;
    }

    protected elementAfterUpdated(item: IPopupItem, container: HTMLElement): boolean {
        // method can be implemented
        return false;
    }

    beforeElementDestroyed(item: IPopupItem, container: HTMLElement): boolean {
        item.popupState = this.POPUP_STATE_START_DESTROYING;
        return true;
    }

    elementDestroyedWrapper(item: IPopupItem, container: HTMLElement): Promise<void> {
        if (item.popupState === this.POPUP_STATE_INITIALIZING) {
            return new Deferred().callback();
        }
        if (
            item.popupState === this.POPUP_STATE_DESTROYED ||
            item.popupState === this.POPUP_STATE_DESTROYING
        ) {
            return item._destroyDeferred;
        }

        if (item.popupState !== this.POPUP_STATE_DESTROYED) {
            item.popupState = this.POPUP_STATE_DESTROYING;
            item._destroyDeferred = this.elementDestroyed.apply(this, arguments);

            return item._destroyDeferred.addCallback(() => {
                oldWindowManager.removeZIndex(item.currentZIndex);
                item.popupState = this.POPUP_STATE_DESTROYED;
            });
        }
        return new Deferred().callback();
    }

    protected elementDestroyed(item: IPopupItem): Promise<void> {
        return new Deferred().callback();
    }

    protected _getDefaultOptions(item: IPopupItem, popupTemplate?: unknown): IPopupOptions {
        const template = popupTemplate || item.popupOptions.template;

        let templateClass;

        if (typeof template === 'string') {
            const templateInfo = parserLib(template);
            templateClass = require(templateInfo.name);

            templateInfo.path.forEach((key) => {
                templateClass = templateClass[key];
            });
        } else {
            templateClass = template;
        }

        // library export
        if (templateClass && templateClass.default) {
            templateClass = templateClass.default;
        }

        // Защита от ситуации, когда getDefaultOptions есть, но вернул undefined.
        const defaultOptions =
            templateClass && templateClass.getDefaultOptions && templateClass.getDefaultOptions();
        const defaultProps = templateClass?.defaultProps;
        return defaultOptions || defaultProps || {};
    }

    private _checkItemWidthValue(item: IPopupItem): boolean {
        const defaultOptions = this._getDefaultOptions(item);
        const optionsWidthSet = {
            width: defaultOptions.width || item.popupOptions.width,
            minWidth: defaultOptions.minWidth || item.popupOptions.minWidth,
            maxWidth: defaultOptions.maxWidth || item.popupOptions.maxWidth,
        };
        return (
            BASE_WIDTHS_POPUP.includes(optionsWidthSet.width) ||
            BASE_WIDTHS_POPUP.includes(optionsWidthSet.minWidth) ||
            BASE_WIDTHS_POPUP.includes(optionsWidthSet.maxWidth)
        );
    }

    getDefaultConfig(item: IPopupItem): Promise<void> | void | boolean {
        item.position = {
            top: -10000,
            left: -10000,
            maxWidth: item.popupOptions.maxWidth,
            minWidth: item.popupOptions.minWidth,
            maxHeight: item.popupOptions.maxHeight,
            minHeight: item.popupOptions.minHeight,
        };
        const promiseArray = [];
        if (this._checkItemWidthValue(item)) {
            promiseArray.push(this.initializationConstants());
        }
        if (promiseArray.length !== 0) {
            return Promise.all(promiseArray).then((res) => {
                return this._getDefaultConfig(item);
            });
        }
        this._getDefaultConfig(item);
    }

    closePopupByOutsideClick(item: IPopupItem): void {
        if (ManagerController) {
            ManagerController.getController()?.remove(item.id);
        }
    }

    beforeUpdateOptions(item: IPopupItem): void {
        item.popupState = item.controller.POPUP_STATE_INITIALIZING;
    }

    afterUpdateOptions(item: IPopupItem): void {
        item.popupState = item.controller.POPUP_STATE_CREATED;
    }

    elementUpdateOptions(item: IPopupItem, container: HTMLElement): boolean | Promise<boolean> {
        this.elementUpdatedWrapper(item, container);
        return true;
    }

    elementAnimated(item: IPopupItem): boolean {
        // method can be implemented
        return false;
    }

    popupDragStart(item: IPopupItem, container: HTMLElement, offset: IDragOffset): void {
        // method can be implemented
    }

    popupDragEnd(item: IPopupItem, offset: number): void {
        // method can be implemented
    }

    elementMaximized(item: IPopupItem, container: HTMLElement, state: boolean): boolean {
        // method can be implemented
        return false;
    }

    initializationConstants(): Promise<void | object> {
        return initializationPopupConstants().then((result) => {
            themeConstants = result;
        });
    }

    protected _prepareSize(
        optionsSet: IPopupOptions[],
        property: string,
        themeSizesConstants?: unknown
    ): number | void {
        const sizesConstants = themeSizesConstants || themeConstants;
        for (let i = 0; i < optionsSet.length; i++) {
            if (optionsSet[i][property]) {
                if (typeof optionsSet[i][property] === 'string') {
                    if (Object.keys(sizesConstants).includes(optionsSet[i][property])) {
                        return sizesConstants[optionsSet[i][property]];
                    } else if (!optionsSet[i][property].includes('%')) {
                        // get size, if it's not percentage value
                        return parseInt(optionsSet[i][property], 10);
                    }
                } else {
                    return parseInt(optionsSet[i][property], 10);
                }
            }
        }
        return undefined;
    }

    protected _validateConfiguration(item: IPopupItem): void {
        if (item.popupOptions.maxWidth < item.popupOptions.minWidth) {
            item.popupOptions.maxWidth = item.popupOptions.minWidth;
        }

        if (item.popupOptions.maxWidth && item.popupOptions.width > item.popupOptions.maxWidth) {
            item.popupOptions.width = item.popupOptions.maxWidth;
        }

        if (item.popupOptions.minWidth && item.popupOptions.width < item.popupOptions.minWidth) {
            item.popupOptions.width = item.popupOptions.minWidth;
        }
    }

    protected _prepareSizes(item: IPopupItem, container?: HTMLElement) {
        const defaultOptions = this._getDefaultOptions(item);

        item.popupOptions.width = this._prepareSize([item.popupOptions, defaultOptions], 'width');
        item.popupOptions.minWidth = this._prepareSize(
            [item.popupOptions, defaultOptions],
            'minWidth'
        );
        item.popupOptions.maxWidth = this._prepareSize(
            [item.popupOptions, defaultOptions],
            'maxWidth'
        );

        this._validateConfiguration(item);

        if (!item.popupOptions.hasOwnProperty('minimizedWidth')) {
            item.popupOptions.minimizedWidth = defaultOptions.minimizedWidth;
        }
    }

    protected _prepareSizeWithoutDOM(item: IPopupItem) {
        this._prepareSizes(item);
    }

    protected _getDefaultConfig(item: IPopupItem): void {
        this._prepareSizeWithoutDOM(item);
    }

    popupMovingSize(item: IPopupItem, offset: object, position: string): boolean {
        return false;
    }

    protected _popupDefaultResizing(item: IPopupItem, offset: object, position: string): boolean {
        const newWidthValue = Math.max(
            (item.position.width || item.sizes.width) + offset.x,
            item.position.minWidth || 0
        );
        const newHeightValue = Math.max(
            (item.position.height || item.sizes.height) + offset.y,
            item.position.minHeight || 0
        );
        item.position.width = newWidthValue;
        item.position.height = newHeightValue;
        if (item.popupOptions && !item.popupOptions.height) {
            item.popupOptions.height = newHeightValue;
        }
        if (position?.includes('left-right')) {
            if (typeof item.position.left !== 'undefined') {
                item.position.left -= offset.x / 2;
            }
        } else if (position?.includes('top')) {
            if (typeof item.position.top !== 'undefined') {
                item.position.top -= offset.y;
            }
        } else if (position?.includes('left')) {
            if (typeof item.position.left !== 'undefined') {
                item.position.left -= offset.x;
            }
        } else if (
            position?.includes('right') &&
            item.popupOptions?.targetPoint?.horizontal === 'center'
        ) {
            if (typeof item.position.left !== 'undefined') {
                item.position.left -= offset.x / 2;
            }
        }
        return true;
    }

    popupMouseEnter(item: IPopupItem): boolean {
        if (item.popupOptions.autoClose) {
            if (item.closeId) {
                clearTimeout(item.closeId);
                item.closeId = null;
            }
        }
        return false;
    }

    popupMouseLeave(item: IPopupItem): boolean {
        if (item.popupOptions.autoClose) {
            this._closeByTimeout(item);
        }
        return false;
    }

    orientationChanged(item: IPopupItem, container: HTMLElement): boolean {
        return this.elementUpdatedWrapper(item, container);
    }

    pageScrolled(item: IPopupItem, container: HTMLElement): boolean {
        return this.elementUpdatedWrapper(item, container);
    }

    resizeInner(item: IPopupItem, container: HTMLElement): boolean {
        return this.elementUpdatedWrapper(item, container);
    }

    resizeOuter(item: IPopupItem, container: HTMLElement): boolean {
        return this.elementUpdatedWrapper(item, container);
    }

    workspaceResize(): boolean {
        return false;
    }

    dragNDropOnPage(item: IPopupItem, container: HTMLElement, isInsideDrag: boolean): boolean {
        return false;
    }

    needRecalcOnKeyboardShow(): boolean {
        return false;
    }

    protected _getPopupSizes(item: IPopupItem, container: HTMLElement): IPopupSizes {
        const containerSizes: IPopupSizes = this.getContentSizes(container);

        item.sizes = {
            width: item.popupOptions.width || containerSizes.width,
            height: item.popupOptions.height || containerSizes.height,
        };
        item.sizes.margins = this._getMargins(item);
        return item.sizes;
    }

    protected _getPopupContainer(id: string): HTMLElement {
        const popupContainer = ManagerController.getContainer();
        const item = popupContainer && popupContainer._children[id];
        // todo https://online.sbis.ru/opendoc.html?guid=d7b89438-00b0-404f-b3d9-cc7e02e61bb3
        let container = item && item._container;
        if (container && container.jquery) {
            container = container[0];
        }
        return container;
    }

    private _closeByTimeout(item: IPopupItem): void {
        const timeAutoClose = 5000;

        item.closeId = setTimeout(() => {
            ManagerController.getController()?.remove(item.id);
        }, timeAutoClose);
    }

    private _checkContainer(item: IPopupItem, container: HTMLElement, stage: string): boolean {
        if (!container) {
            // if popup has initializing state then container doesn't created yet
            if (item.popupState !== this.POPUP_STATE_INITIALIZING) {
                const message = `Error when building the template ${item.popupOptions.template} on stage ${stage}`;
                Logger.error('Controls/popup', message);
            }
            return false;
        }
        return true;
    }

    protected getContentSizes(container?: HTMLElement = null): IPopupSizes {
        // Чтобы размер контейнера не искажался при масштабировании использую getBoundingClientRect
        const sizes = DimensionsMeasurer.getBoundingClientRect(container);
        return {
            width: Math.round(sizes?.width),
            height: Math.round(sizes?.height),
        };
    }

    protected _isAboveMaximizePopup(item: IPopupItem): boolean {
        const getOpenerNode = (): HTMLElement => {
            if (item.popupOptions?.opener && !item.popupOptions?.opener?._destroyed) {
                return item.popupOptions.opener._container || item.popupOptions.opener;
            }
            return null;
        };
        const openerContainer: HTMLElement = getOpenerNode();
        const parents: Control[] = this._goUpByControlTree(
            openerContainer || item.activeNodeAfterDestroy
        );
        const popupModuleName: string = 'Controls/popupTemplateStrategy:Popup';
        const oldPopupModuleName: string = 'Lib/Control/Dialog/Dialog'; // Compatible

        for (let i = 0; i < parents.length; i++) {
            if (
                parents[i]._moduleName === popupModuleName ||
                parents[i]._moduleName === oldPopupModuleName
            ) {
                if (parents[i]._options.maximize || parents[i]._options.fullscreen) {
                    return true;
                }
            }
        }
        const popupItems = ManagerController.getController()?.getPopupItems() || [];
        let hasFullscreenPopup = false;
        let popupItemWasInStack = false;
        popupItems.forEach((popupItem) => {
            if (popupItem === item) {
                popupItemWasInStack = true;
            }
            if (
                !popupItemWasInStack &&
                (popupItem.popupOptions?.fullscreen || popupItem.popupOptions.maximize)
            ) {
                hasFullscreenPopup = true;
            }
        });
        return hasFullscreenPopup;
    }

    private _goUpByControlTree(container: HTMLElement): Control[] {
        return goUpByControlTree(container);
    }

    private _hasPoisitionByCoords(item: IPopupItem): boolean {
        const { target } = item.popupOptions;
        if (target && typeof target === 'object') {
            const isNumber = (property) => {
                const m = `Controls/popup: Ошибка при указании координаты ${property} в опции target. Задано не число`;
                if (target.hasOwnProperty(property)) {
                    if (typeof target[property] !== 'number') {
                        Logger.error(m);
                        return false;
                    }
                    return true;
                }
                return false;
            };
            // Проверяем на кол-во св-в, т.к. в target может лежать html-элемент со св-вами x, y.
            // Если не тот формат что мы ожидаем - игнорируем.
            const keys = Object.keys(target);
            const maxKeys = 4;
            return keys.length <= maxKeys && isNumber('x') && isNumber('y');
        }
        return false;
    }

    protected _getTargetCoords(item: IPopupItem, sizes: IPopupSizes = {}) {
        const hasPosition = this._hasPoisitionByCoords(item);
        if (item.popupOptions.nativeEvent || hasPosition) {
            let position;
            if (item.popupOptions.nativeEvent) {
                Logger.warn(
                    'Controls/popup:Sticky: Опция nativeEvent устарела и больше не поддерживается.' +
                        'Используйте опцию target со значением {x: number, y: number} для описания точки позиционирования'
                );
                position = DimensionsMeasurer.getMouseCoordsByMouseEvent(
                    item.popupOptions.nativeEvent
                );
                const positionCfg = {
                    direction: {
                        horizontal: 'right',
                        vertical: 'bottom',
                    },
                };
                cMerge(item.popupOptions, positionCfg);
                sizes.margins = { top: 0, left: 0 };
            } else {
                position = item.popupOptions.target;
            }
            const { x, y, width, height } = position;
            const size = 1;
            const documentDimensions = DimensionsMeasurer.getElementDimensions(
                document.documentElement
            );
            const bodyDimensions = DimensionsMeasurer.getElementDimensions(document.body);
            const fullTopOffset: number =
                documentDimensions.scrollTop ||
                bodyDimensions.scrollTop ||
                0 - documentDimensions.clientTop ||
                bodyDimensions.clientTop ||
                0;
            const fullLeftOffset: number =
                documentDimensions.scrollLeft ||
                bodyDimensions.scrollLeft ||
                0 - documentDimensions.clientLeft ||
                bodyDimensions.clientLeft ||
                0;
            const viewportSize = DimensionsMeasurer.getVisualViewportDimensions(
                item.popupOptions.target || document.body
            );
            return {
                width: width || size,
                height: height || size,
                top: y + fullTopOffset + viewportSize.offsetTop,
                left: x + fullLeftOffset + viewportSize.offsetLeft,
                bottom: y + (height || size) + fullTopOffset + viewportSize.offsetTop,
                right: x + (width || size) + fullLeftOffset + viewportSize.offsetLeft,
                topScroll: fullTopOffset,
                leftScroll: fullLeftOffset,
                zoom: DimensionsMeasurer.getZoomValue(),
            };
        }

        if (!constants.isBrowserPlatform) {
            return {
                width: 0,
                height: 0,
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                topScroll: 0,
                leftScroll: 0,
            };
        }
        return getTargetCoords(this._getTargetNode(item));
    }

    protected _getTargetNode(item: IPopupItem): HTMLElement {
        let target = constants.isBrowserPlatform && document.body;
        if (
            cInstance.instanceOfModule(item.popupOptions.target, 'UI/Base:Control') ||
            item.popupOptions.target?._container
        ) {
            if (!item.popupOptions.target._destroyed) {
                target = item.popupOptions.target._container;
            }
        } else {
            target = item.popupOptions.target || target;
        }
        // На случай если попала нода jquery
        if (target.jquery) {
            target = target[0];
        }
        return target;
    }

    protected _getMargins(item: IPopupItem): {
        top: number;
        left?: number;
        right?: number;
    } {
        // If the classes have not changed, then the indents remain the same
        if ((item.className || '') === (item.popupOptions.className || '')) {
            if (!item.margins) {
                item.margins = {
                    top: 0,
                    left: 0,
                };
            }
        } else {
            item.className = item.popupOptions.className;
            item.margins = this._getFakeDivMargins(item);
        }
        return {
            top: item.margins.top || 0,
            left: item.margins.left || 0,
            right: item.margins.right || 0,
        };
    }

    private _getFakeDivMargins(item: IPopupItem): {
        top: number;
        left?: number;
        right?: number;
    } {
        const fakeDiv = this._getFakeDiv();
        const theme = ManagerController.getTheme();
        fakeDiv.className = item.popupOptions.className + ` controls_popupTemplate_theme-${theme}`;

        const styles = this._getContainerStyles(fakeDiv);
        let horizontalMargin;
        const horizontalMarginDirection = getDirection('left');
        if (horizontalMarginDirection === 'right') {
            horizontalMargin = `-${styles.marginRight}`;
        } else {
            horizontalMargin = styles.marginLeft;
        }
        return {
            top: parseFloat(styles.marginTop),
            [horizontalMarginDirection]: parseFloat(horizontalMargin),
        };
    }

    private _getFakeDiv(): HTMLElement {
        if (!constants.isBrowserPlatform) {
            return {
                marginLeft: 0,
                marginTop: 0,
            };
        }
        // create fake div on invisible part of window, cause user class can overlap the body
        if (!_fakeDiv) {
            _fakeDiv = document.createElement('div');
            _fakeDiv.style.position = 'absolute';
            _fakeDiv.style.left = '-10000px';
            _fakeDiv.style.top = '-10000px';
            document.body.appendChild(_fakeDiv);
        }
        return _fakeDiv;
    }

    private _getContainerStyles(container: Element): {
        marginTop: string;
        marginLeft?: string;
        marginRight?: string;
    } {
        return window.getComputedStyle(container);
    }

    private static rootContainers = {};

    static getRootContainerCoords(
        item: IPopupItem,
        baseRootSelector: string,
        rightOffset?: number
    ): IPopupPosition | void {
        const getRestrictiveContainer = (popupItem: IPopupItem) => {
            if (popupItem.popupOptions.restrictiveContainer) {
                return popupItem.popupOptions.restrictiveContainer;
            }
            // Проверяем, есть ли у родителя ограничивающий контейнер
            if (popupItem.parentId && popupItem.controller?.TYPE !== 'Stack') {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const parentItem = require('Controls/popup')
                    .Controller.getController()
                    ?.find(popupItem.parentId);
                if (!parentItem) {
                    Logger.error(`Ошибка при открытии окна с шаблоном ${item.popupOptions.template},
                     один из его родителей уничтожен, проверьте opener у окна с
                     шаблоном ${popupItem.popupOptions.template}`);
                }
                return getRestrictiveContainer(parentItem);
            }
        };
        const itemRestrictiveContainer = getRestrictiveContainer(item);
        item.calculatedRestrictiveContainer = itemRestrictiveContainer;
        const bodySelector = 'body';
        const getCoords = (container) => {
            if (container) {
                let coordsByContainer = BaseController.getCoordsByContainer(container, item);
                if (coordsByContainer) {
                    coordsByContainer = { ...coordsByContainer };
                    if (rightOffset) {
                        coordsByContainer.width -= rightOffset;
                        coordsByContainer.right -= rightOffset;
                    }
                    return coordsByContainer;
                }
            }
        };

        // Если задан restrictiveContainer или он задан у родителя, то берем его координату
        const itemRestrictiveContainerCoords = getCoords(itemRestrictiveContainer);
        if (itemRestrictiveContainerCoords) {
            return itemRestrictiveContainerCoords;
        }

        // Если приложение сообщило размеры контента - берем их
        const contentData = ManagerController.getContentData();
        if (contentData) {
            const bodyCoords = BaseController.getCoordsByContainer(bodySelector, item) || {};
            return {
                right: contentData.left + contentData.width,
                top: contentData.top,
                bottom: bodyCoords.bottom,
                left: contentData.left,
                height: bodyCoords.height,
                width: contentData.width,
                topScroll: bodyCoords.topScroll,
                leftScroll: bodyCoords.leftScroll,
            };
        }

        const restrictiveContainers = [];
        if (!getAdaptiveModeForLoaders().device.isPhone()) {
            restrictiveContainers.push(baseRootSelector);
        }
        restrictiveContainers.push(bodySelector);
        for (const restrictiveContainer of restrictiveContainers) {
            const coords = getCoords(restrictiveContainer);
            if (coords) {
                return coords;
            }
        }
    }

    static resetRootContainerCoords(): void {
        BaseController.rootContainers = {};
    }

    static getCoordsByContainer(
        restrictiveContainer: any,
        popupItem: IPopupItem
    ): IPopupPosition | void {
        if (BaseController.rootContainers[restrictiveContainer]) {
            return BaseController.rootContainers[restrictiveContainer];
        }

        if (restrictiveContainer instanceof HTMLElement) {
            const errorMessage =
                'Неверное значение опции restrictiveContainer.' +
                ' Опция принимает в качестве значения селектор (строку)';
            Logger.error(`Controls/popup: ${errorMessage}`);
            return;
        }

        const restrictiveContainerNodes = [
            ...(document?.querySelectorAll(restrictiveContainer) || []),
        ];
        let restrictiveContainerNode;
        let hasEmptyNode = false;

        // На случай, если в restrictiveContainer передали класс, который имеют сразу несколько элементов,
        // возьмем первый подходящий
        Array.from(restrictiveContainerNodes).forEach((item: HTMLElement): void => {
            if (!restrictiveContainerNode) {
                if (item.offsetHeight || item.offsetWidth) {
                    // Если restrictiveContainer находится внутри самого окна - продолжаем искать дальше
                    if (
                        item.closest('.controls-Popup')?.getAttribute('popupkey') !== popupItem?.id
                    ) {
                        restrictiveContainerNode = item;
                    }
                } else if (item !== document.body) {
                    hasEmptyNode = true;
                }
            }
        });

        if (!restrictiveContainerNode && hasEmptyNode) {
            const errorMessage =
                "В опции restrictiveContainer указан селектор для DOM-element'a, у которого отсутствуют размеры";
            Logger.error(`Controls/popup: ${errorMessage}`);
            return;
        }

        if (restrictiveContainerNode) {
            // TODO: В рамках оптимизации нижний попап скрывается через ws-hidden
            // Нужно это учитывать при расчете размеров https://online.sbis.ru/doc/a88a5697-5ba7-4ee0-a93a-221cce572430
            const popup = restrictiveContainerNode.closest('.controls-Popup');
            const hiddenClass = 'ws-hidden';
            const isPopupHidden = popup && popup.classList.contains(hiddenClass);
            if (isPopupHidden) {
                popup.classList.remove(hiddenClass);
            }

            const targetCoords = getTargetCoords(restrictiveContainerNode);

            if (isPopupHidden) {
                popup.classList.add(hiddenClass);
            }
            return (BaseController.rootContainers[restrictiveContainer] = targetCoords);
        }
    }
}

export default BaseController;
