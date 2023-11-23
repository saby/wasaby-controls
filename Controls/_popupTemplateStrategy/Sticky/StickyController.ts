/**
 * @kaizen_zone 9b624d5d-133f-4f58-8c48-7fb841857d9e
 */
import { default as BaseController } from 'Controls/_popupTemplateStrategy/BaseController';
import StickyStrategy from 'Controls/_popupTemplateStrategy/Sticky/StickyStrategy';
import * as StickyContent from 'wml!Controls/_popupTemplateStrategy/Sticky/Template/StickyContent';
import { Logger } from 'UI/Utils';
import {
    getStickyConfig,
    getStickyDefaultPosition,
} from 'Controls/_popupTemplateStrategy/Util/PopupConfigUtil';
import { getScrollbarWidthByMeasuredBlock } from 'Controls/scrollbar';
import { ControllerClass as DnDController } from 'Controls/dragnDrop';
import { constants, detection } from 'Env/Env';
import {
    Controller,
    IDragOffset,
    IPopupItem,
    IPopupPosition,
    IPopupSizes,
    IStickyPopupOptions,
    IStickyPosition,
} from 'Controls/popup';
import {
    getPositionProperties,
    HORIZONTAL_DIRECTION,
    VERTICAL_DIRECTION,
} from '../Util/DirectionUtil';
import { ITargetCoords } from 'Controls/_popupTemplateStrategy/TargetCoords';
import { DimensionsMeasurer, getDimensions } from 'Controls/sizeUtils';
import getDirection from 'Controls/_popupTemplateStrategy/Util/getDirection';
import { getStore } from 'Application/Env';

export type TVertical = 'top' | 'bottom' | 'center';
export type THorizontal = 'left' | 'right' | 'center';

export interface IStickyAlignment {
    vertical?: TVertical;
    horizontal?: THorizontal;
}

export interface IStickyOffset {
    vertical: number;
    horizontal: number;
}

interface IStickyPositionConfigSizes {
    width: number;
    height: number;
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
}

export interface IStickyPositionConfig {
    targetPoint?: IStickyAlignment;
    direction?: IStickyAlignment;
    offset?: IStickyOffset;
    config: IStickyPositionConfigSizes;
    fittingMode: IStickyPosition;
    restrictiveContainerCoords?: ITargetCoords;
    sizes: IPopupSizes;
    fixPosition?: boolean;
    position: IPopupPosition;
}

export interface IStickyItem extends IPopupItem {
    isVisible: boolean;
    popupOptions: IStickyPopupOptions;
    positionConfig: IStickyPositionConfig;
    startPosition: IPopupPosition;
    fixPosition: boolean;
}

/**
 * Sticky Popup Controller
 * @private
 */
export class StickyController extends BaseController {
    TYPE: string = 'Sticky';
    _bodyOverflow: string;

    elementMounted(item: IPopupItem, container: HTMLElement): boolean {
        const targetCoords = this._getTargetCoords(item);
        const zoom = StickyStrategy.getPopupZoom(targetCoords.zoom);
        const fixedZoom = Number(zoom.toFixed(2));
        if (fixedZoom !== 1) {
            item.position.zoom = fixedZoom;
            // Ставим класс синхронно, так как контролы внутри могут позвать утилиту getDimensions
            // еще до цикла синхронизации и проигнорировать zoom, который висит на попапе
            container.className += 'controls-Zoom';
        }
        return false;
    }

    elementCreated(item: IStickyItem, container: HTMLElement): boolean {
        if (this._isTargetVisible(item)) {
            this._setStickyContent(item);
            item.position.position = undefined;
            this.prepareConfig(item, container);
            item.popupOptions.className += this._getStickyTemplateVisibilityClass(item);
        } else {
            this._printTargetRemovedWarn();
            // Удалим попап, если он изначально передается без таргета,
            // т.к. мы не будем знать как его спозиционировать
            Controller.remove(item.id);
        }
        return true;
    }

    protected _getStickyTemplateVisibilityClass(item: IStickyItem): string {
        // Не задаем класс controls-StickyTemplate-visibility, так как на нем установлена анимация для скрытия
        // Анимация не нужна в случае, когда окно создается, но при этом, target находится не в видимой области
        const { actionOnScroll } = item.popupOptions;
        item.isVisible = this._isVisibleTarget(item.popupOptions.target as HTMLElement);
        const parentItem = Controller.find(item.parentId) as IStickyItem;
        const isParentVisible = parentItem ? parentItem.isVisible !== false : true;
        if (
            (actionOnScroll === 'track' || actionOnScroll === 'close') &&
            (!item.isVisible || !isParentVisible)
        ) {
            return ' controls-StickyTemplate-visibility-hidden';
        }
        return '';
    }

    protected _isKeyboardVisible(item: IStickyItem) {
        if (
            constants.isBrowserPlatform &&
            document.activeElement &&
            document.activeElement.closest(`[key="${item.id}"]`)
        ) {
            const isInput = document.activeElement.tagName === 'INPUT';
            const isTextArea = document.activeElement.tagName === 'TEXTAREA';
            const isContentEditable =
                document.activeElement.getAttribute('contenteditable') === 'true';

            if (isInput || isTextArea || isContentEditable) {
                return true;
            }
        }
        return false;
    }

    protected _getShouldNotUpdatePosition(item: IStickyItem): boolean {
        if (
            detection.isMobilePlatform &&
            this._isKeyboardVisible(item) &&
            (typeof item.position.top === 'undefined' || item.position.top > 0)
        ) {
            item.shouldNotUpdatePosition = true;
        }
        return item.shouldNotUpdatePosition;
    }

    elementUpdated(item: IStickyItem, container: HTMLElement): boolean {
        // Если изменялись размеры, и при этом произошло обновление окна, то отменяем ресайз.
        // Так как ожидаем что новые размеры установили вручную
        super.elementUpdated(item);
        delete item.isDrag;
        if (this._isTargetVisible(item)) {
            this._setStickyContent(item);
            const targetCoords = this._getTargetCoords(item, item.positionConfig.sizes);
            this._updateStickyPosition(item, item.positionConfig, targetCoords);
            if (this._isTargetVisible(item)) {
                this._updateClasses(item, item.positionConfig);
                if (item.popupOptions.hasOwnProperty('fixPosition')) {
                    item.positionConfig.fixPosition = item.popupOptions.fixPosition;
                }

                // If popupOptions has new sizes, calculate position using them.
                // Else calculate position using current container sizes.
                this._updateSizes(item.positionConfig, item.popupOptions);
                if (!this._getShouldNotUpdatePosition(item)) {
                    item.position = StickyStrategy.getPosition(
                        item.positionConfig,
                        this._getTargetCoords(item, item.positionConfig.sizes),
                        this._getTargetNode(item)
                    );
                }

                if (item.popupOptions.className) {
                    item.popupOptions.className = item.popupOptions.className.replace(
                        /controls-StickyTemplate-visibility(\S*|)/g,
                        ''
                    );
                    item.popupOptions.className = item.popupOptions.className.replace(
                        /controls-StickyTemplate-animation(\S*|)/g,
                        ''
                    );
                }
                if (!item.popupOptions.disableAnimation) {
                    item.popupOptions.className += ' controls-StickyTemplate-animation';
                }
                item.popupOptions.className += ` controls-StickyTemplate-visibility${this._getStickyTemplateVisibilityClass(
                    item
                )}`;

                // In landscape orientation, the height of the screen is low when the keyboard is opened.
                // Open Windows are not placed in the workspace and chrome scrollit body.
                if (detection.isMobileAndroid) {
                    const height = item.position.height || container.clientHeight;
                    if (height > document.body.clientHeight) {
                        item.position.height = document.body.clientHeight;
                        item.position.top = 0;
                    } else if (
                        item.position.height + item.position.top >
                        document.body.clientHeight
                    ) {
                        // opening the keyboard reduces the height of the body. If popup was positioned at the bottom of
                        // the window, he did not have time to change
                        // his top coordinate => a scroll appeared on the body
                        const dif =
                            item.position.height + item.position.top - document.body.clientHeight;
                        item.position.top -= dif;
                    }
                }
            } else {
                this._printTargetRemovedWarn();
            }
            return true;
        }
    }

    private _isVisibleTarget(target: HTMLElement, scrollTarget: HTMLElement = null): boolean {
        if (typeof target?._container !== 'undefined') {
            target = target._container;
        }
        if (!target || typeof target.getBoundingClientRect === 'undefined') {
            return true;
        }
        if (!scrollTarget) {
            scrollTarget = target;
        }
        const scrollContainer = StickyStrategy.getScrollContainer(scrollTarget);
        const targetDimensions = getDimensions(target);
        if (scrollContainer) {
            const scrollDimensions = getDimensions(scrollContainer);
            if (
                targetDimensions.bottom < scrollDimensions.top ||
                targetDimensions.top > scrollDimensions.bottom
            ) {
                return false;
            }
            // Может возникнуть ситуация, когда окно находится в нескольких вложенных scrollContainer.
            // Из-за чего окно отображается когда target скрыт в одном из вложенных контейнеров.
            // Поэтому, если окно видно в 1 из scrollContainer, то проверяем, что оно видно в другом
            // https://online.sbis.ru/opendoc.html?guid=aedc6f40-e28b-413d-8a21-31c7a1ae83cf
            return this._isVisibleTarget(target, scrollContainer);
        }
        return targetDimensions.bottom >= 0;
    }

    private _childUpdatePos(item: IStickyItem, prevItemPosition: object): void {
        if (item.childs.length) {
            //  Если изменилась позиция стики окна - пересчитаем все дочерние стики окна, т.к.
            // их позиция завязана на позицию родителя
            if (JSON.stringify(item.position) !== JSON.stringify(prevItemPosition)) {
                for (const child of item.childs) {
                    if (child.controller.TYPE === this.TYPE) {
                        // Для того чтобы гарантировано попасть в след. тик, где позиция родителя успела обновиться.
                        const delay = 50;
                        setTimeout(() => {
                            Controller.updatePosition(child.id);
                        }, delay);
                    }
                }
            }
        }
    }

    private _resetItemStyle(
        item: IStickyItem,
        container: HTMLElement,
        width: string,
        maxWidth: string
    ): void {
        /* start: Return all values to the node. Need for vdom synchronizer */
        container.style.width = width;
        container.style.maxWidth = maxWidth;
        // После того, как дочерние контролы меняют размеры, они кидают событие controlResize, окно отлавливает событие,
        // измеряет верстку и выставляет себе новую позицию и размеры. Т.к. это проходит минимум в 2 цикла синхронизации
        // то визуально видны прыжки. Уменьшаю на 1 цикл синхронизации простановку размеров
        // Если ограничивающих размеров нет (контент влезает в экран), то ставим высоту по контенту.
        container.style.maxHeight = item.position.maxHeight ? item.position.maxHeight + 'px' : '';
        container.style.height = item.position.height ? item.position.height + 'px' : 'auto';

        // Синхронно ставлю новую позицию, чтобы не было прыжков при изменении контента
        const verticalPosition = item.position.top ? 'top' : 'bottom';
        const revertVerticalPosition = item.position.top !== undefined ? 'bottom' : 'top';
        container.style[verticalPosition] = item.position[verticalPosition] + 'px';
        container.style[revertVerticalPosition] = 'auto';
    }

    private _scrollAfterReset(item: IStickyItem, container: HTMLElement): void {
        const isBrowser = constants.isBrowserPlatform;
        const hasScrollBeforeReset =
            isBrowser && document.body.scrollHeight > document.body.clientHeight;
        let hasScrollAfterReset =
            isBrowser && document.body.scrollHeight > document.body.clientHeight;
        if (hasScrollAfterReset) {
            // Скролл на боди может быть отключен через стили
            if (!this._bodyOverflow) {
                this._bodyOverflow = getComputedStyle(document.body).overflowY;
            }
            if (this._bodyOverflow === 'hidden') {
                hasScrollAfterReset = false;
            }
        }
        this.prepareConfig(item, container);
        item.shouldNotUpdatePosition = false;
        // Для ситуаций, когда скролл на боди: После сброса высоты для замеров содержимого (style.height = 'auto'),
        // содержимое может быть настолько большим, что выходит за пределы окна браузера (maxHeight 100vh не помогает,
        // т.к. таргет может находиться по центру, соответственно пол попапа все равно уйдет за пределы экрана).
        // Если контент вылез за пределы - на боди появится скролл, но он пропадет, после того как мы высчитаем позицию
        // окна (а считать будем с учетом скролла на странице) и ограничим его размеры.
        // Если позиция идет по координате right (теоретически тоже самое для bottom), то это показ/скрытие скролла
        // влияет на позиционирование. Компенсирую размеры скроллбара.
        if (!hasScrollBeforeReset && hasScrollAfterReset) {
            if (item.position.right) {
                item.position.right += getScrollbarWidthByMeasuredBlock();
            }
        }
    }

    elementAfterUpdated(item: IStickyItem, container: HTMLElement): boolean {
        // TODO https://online.sbis.ru/doc/a88a5697-5ba7-4ee0-a93a-221cce572430
        if (!this._isTargetVisible(item)) {
            this._printTargetRemovedWarn();
            return false;
        }
        const width = container.style.width;
        const maxWidth = container.style.maxWidth;
        // Если внутри лежит скроллконтейнер, то восстанавливаем позицию скролла после изменения размеров
        const scroll = container.querySelector('.controls-Scroll__content');
        const scrollTop = scroll?.scrollTop;
        container.style.maxHeight = item.popupOptions.maxHeight
            ? item.popupOptions.maxHeight + 'px'
            : '100vh';
        container.style.maxWidth = item.popupOptions.maxWidth
            ? item.popupOptions.maxWidth + 'px'
            : '100vw';
        // Если значения явно заданы на опциях, то не сбрасываем то что на контейнере
        if (!item.popupOptions.width) {
            container.style.width = 'auto';
        }
        if (!item.popupOptions.height) {
            container.style.height = 'auto';
        }
        const prevItemPosition = item.position;
        this._scrollAfterReset(item, container);
        this._resetItemStyle(item, container, width, maxWidth);

        // TODO: https://online.sbis.ru/opendoc.html?guid=5ddf9f3b-2d0e-49aa-b5ed-12e943c761d8
        if (scroll) {
            scroll.scrollTop = scrollTop;
        }

        this._childUpdatePos(item, prevItemPosition);
        return true;
    }

    updatePosition(item: IStickyItem, container: HTMLElement): boolean {
        return this.elementAfterUpdated(item, container);
    }

    resizeInner(item: IStickyItem, container: HTMLElement): boolean {
        // если изменяли размеры окна, то нет смысла перерисовывать окно при изменении содержимого внутри
        if (!item.isResizing) {
            return this.elementAfterUpdated(item, container);
        }
        return false;
    }

    dragNDropOnPage(item: IStickyItem, container: HTMLDivElement, isInsideDrag: boolean): boolean {
        const hasChilds = !!item.childs.length;
        const needClose =
            !item.fixPosition &&
            !isInsideDrag &&
            item.popupOptions.closeOnOutsideClick &&
            !hasChilds &&
            item.popupOptions.closeOnOutsideDndEnd;
        if (needClose) {
            return true;
        }
        item.isDrag = true;
        let isPopupHidden = false;
        if (typeof item.popupOptions?.target?.closest === 'function') {
            isPopupHidden =
                item.popupOptions?.target?.closest('.controls-Popup__hidden') ||
                item.popupOptions?.target?.closest('.ws-hidden');
        }
        // Если не закрылись, то зовем пересчет позиции, при драге вне окна таргет мог поменять позицию
        if (!isInsideDrag && !isPopupHidden) {
            this.prepareConfig(item, container);
        }
    }

    getDefaultConfig(item: IStickyItem): void | boolean {
        const config = super.getDefaultConfig.apply(this, arguments);
        const target = this._getTargetNode(item);
        this._setStickyContent(item);
        const popupCfg = getStickyConfig(item);
        this._updateStickyPosition(item, popupCfg);
        // Если идет dnd на странице, стики окна не открываем
        if (DnDController.isDragging() && !item.popupOptions?.openOnDnd) {
            return false;
        }
        item.position = getStickyDefaultPosition(item, target);
        return config;
    }

    needRecalcOnKeyboardShow(): boolean {
        return false;
    }

    beforeUpdateOptions(item: IStickyItem): void {
        // sticky must update on elementAfterUpdatePhase
    }

    afterUpdateOptions(item: IStickyItem): void {
        // sticky must update on elementAfterUpdatePhase
    }

    prepareConfig(item: IStickyItem, container: HTMLElement): void {
        this._removeOrientationClasses(item);
        this._getPopupSizes(item, container);
        item.sizes.margins = this._getMargins(item);
        this._prepareConfig(item, item.sizes);
    }

    private _getHorizontalCoords(item: IStickyItem, horizontalProperty: string): number {
        if (typeof item.position[horizontalProperty] !== 'undefined') {
            return item.position[horizontalProperty];
        }
        const horizontalPosition = item.popupOptions.direction?.horizontal || 'right';
        return window.innerWidth - (item.position[horizontalPosition] + item.sizes.width);
    }

    private _getVerticalCoords(item: IStickyItem, verticalProperty: string): number {
        if (typeof item.position[verticalProperty] !== 'undefined') {
            return item.position[verticalProperty];
        }
        return this._getTopCoords(item);
    }

    popupDragStart(
        item: IStickyItem,
        container: HTMLElement,
        offset: IDragOffset,
        sizes: IPopupSizes = {}
    ): void {
        const { horizontal: horizontalProperty, vertical: verticalProperty } =
            getPositionProperties(item.popupOptions.direction);
        item.isDrag = true;
        const horizontalOffset =
            horizontalProperty === HORIZONTAL_DIRECTION.LEFT ? offset.x : -offset.x;
        const verticalOffset = verticalProperty === VERTICAL_DIRECTION.TOP ? offset.y : -offset.y;
        if (!item.startPosition) {
            item.startPosition = {
                [horizontalProperty]: this._getHorizontalCoords(item, horizontalProperty),
                // Окно, если не умещается под таргетом, то открывается над ним и работает с координатой bottom.
                // Для корректной работы DnD вычисляем top координату для первого перемещения.
                [verticalProperty]: this._getVerticalCoords(item, verticalProperty),
            };
        }
        item.fixPosition = true;
        item.position[horizontalProperty] =
            item.startPosition[horizontalProperty] + horizontalOffset;
        item.position[verticalProperty] = item.startPosition[verticalProperty] + verticalOffset;
        const itemSizes: IPopupSizes = { ...item.sizes, ...sizes };
        // Take the size from cache, because they don't change when you move
        this._prepareConfig(item, itemSizes);
    }

    popupDragEnd(item: IStickyItem, offset: number): void {
        delete item.startPosition;
        delete item.isDrag;
    }

    popupMovingSize(item: IStickyItem, offset: object, position: string): boolean {
        if (item.isDrag) {
            if (offset && !offset.x) {
                item.isResizing = true;
            }
            const res = this._popupDefaultResizing(item, offset, position);
            this._updateStickyPosition(item, item.positionConfig);
            return res;
        }
        return true;
    }

    protected _getTopCoords(item: IStickyItem): number {
        return (
            DimensionsMeasurer.getVisualViewportDimensions().height -
            item.position.bottom -
            item.sizes.height
        );
    }

    private _prepareConfig(item: IStickyItem, sizes: IPopupSizes): void {
        // Не будем менять позицию окна, если таргет скрыли
        if (this._isTargetVisible(item)) {
            const popupCfg = getStickyConfig(item, sizes);
            const targetCoords = this._getTargetCoords(item, sizes);
            popupCfg.direction.horizontal = getDirection(popupCfg.direction.horizontal);
            //
            if (!this._getShouldNotUpdatePosition(item)) {
                item.position = StickyStrategy.getPosition(
                    popupCfg,
                    targetCoords,
                    this._getTargetNode(item)
                );
            }
            if (!!detection.isMobilePlatform && getStore('AdaptiveInitializer').get('isScrollOnBody')) {
                item.position.position = item.position._position;
            }
            this._updateStickyPosition(item, popupCfg, targetCoords);

            item.positionConfig = popupCfg;
            this._updateClasses(item, popupCfg);
        }
    }

    private _updateClasses(item: IStickyItem, popupCfg: IStickyPositionConfig): void {
        // Remove the previous classes of direction and add new ones
        this._removeOrientationClasses(item);
        item.popupOptions.className =
            (item.popupOptions.className || '') + ' ' + this._getOrientationClasses(popupCfg);
    }

    private _updateSizes(
        positionCfg: IStickyPositionConfig,
        popupOptions: IStickyPopupOptions
    ): void {
        const properties = ['width', 'maxWidth', 'minWidth', 'height', 'maxHeight', 'minHeight'];
        properties.forEach((prop) => {
            if (popupOptions[prop]) {
                positionCfg.config[prop] = popupOptions[prop];
            }
        });
    }

    private _getOrientationClasses(popupOptions: IStickyPopupOptions): string {
        let className = 'controls-Popup-corner-vertical-' + popupOptions.targetPoint.vertical;
        className += ' controls-Popup-corner-horizontal-' + popupOptions.targetPoint.horizontal;
        className += ' controls-Popup-align-horizontal-' + popupOptions.direction.horizontal;
        className += ' controls-Popup-align-vertical-' + popupOptions.direction.vertical;
        return className;
    }

    private _removeOrientationClasses(item: IStickyItem): void {
        if (item.popupOptions.className) {
            item.popupOptions.className = item.popupOptions.className
                .replace(/controls-Popup-corner\S*|controls-Popup-align\S*/g, '')
                .trim();
        }
    }

    private _updateStickyPosition(
        item: IStickyItem,
        position: IStickyPositionConfig,
        targetCoords?: ITargetCoords
    ): void {
        const newStickyPosition = {
            targetPoint: position.targetPoint,
            direction: position.direction,
            offset: position.offset,
            position: item.position,
            targetPosition: targetCoords,
            margins: item.margins,
            sizes: item.sizes,
        };
        // быстрая проверка на равенство простых объектов
        if (
            JSON.stringify(item.popupOptions.stickyPosition) !== JSON.stringify(newStickyPosition)
        ) {
            item.popupOptions.stickyPosition = newStickyPosition;
        }
    }

    private _setStickyContent(item: IStickyItem): void {
        item.popupOptions.content = StickyContent;
    }

    private _printTargetRemovedWarn(): void {
        Logger.warn(
            'Controls/popup:Sticky: Пропал target из DOM. Позиция окна может быть не верная'
        );
    }

    protected _isTargetVisible(item: IStickyItem): boolean {
        const targetCoords = this._getTargetCoords(item, {});
        return !!targetCoords.width;
    }
}

export default new StickyController();
