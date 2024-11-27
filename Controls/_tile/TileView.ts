/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */
import * as React from 'react';
import { IItemPadding, IListViewOptions, ListView } from 'Controls/baseList';
import { IItemsContainerPadding } from './interface/IItemsContainerPadding';
import { TouchDetect } from 'EnvTouch/EnvTouch';
import { TILE_SCALING_MODE, ZOOM_COEFFICIENT, ZOOM_DELAY } from './utils/Constants';
import { isEqual } from 'Types/object';
import { TemplateFunction } from 'UI/Base';
import TileCollectionItem from './display/TileCollectionItem';
import TileCollection from './display/TileCollection';
import { SyntheticEvent } from 'UI/Vdom';
import { Model } from 'Types/entity';
import { constants, detection } from 'Env/Env';
import { getItemSize } from './utils/imageUtil';
import {
    TImageFit,
    TImageUrlResolver,
    TTileMode,
    TTileScalingMode,
    TTileSize,
    AVAILABLE_CONTAINER_HORIZONTAL_PADDINGS,
    AVAILABLE_CONTAINER_VERTICAL_PADDINGS,
} from './display/mixins/Tile';
import TileItem, { TActionMode } from './display/mixins/TileItem';
import 'css!Controls/tile';
import { DimensionsMeasurer } from 'Controls/sizeUtils';
import { BaseTileViewTemplate as template, For } from 'Controls/baseTile';

const AVAILABLE_ITEM_PADDINGS = ['null', 'default', '3xs', '2xs', 'xs', 's', 'm'];

type TActionMenuViewMode = 'menu' | 'preview';

export interface ITileAspectOptions {
    tileSize: TTileSize;
    tileMode: TTileMode;
    tileWidth: number;
    tileHeight: number;
    tileWidthProperty: string;
    tileScalingMode: TTileScalingMode;
    tileFitProperty: string;

    imageProperty: string;
    imageWidthProperty: string;
    imageHeightProperty: string;
    imageFit: TImageFit;
    imageUrlResolver: TImageUrlResolver;

    actionMenuViewMode: TActionMenuViewMode;
    actionMode: TActionMode;
    itemsContainerPadding: IItemsContainerPadding;
    afterItemsTemplate?: TemplateFunction | string;
    beforeItemsTemplate?: TemplateFunction | string;

    orientation: 'vertical' | 'horizontal';
}

export interface ITileOptions extends IListViewOptions, ITileAspectOptions {
    listModel: TileCollection;
}

interface IChildren {
    itemsContainer: HTMLElement;
}

/**
 * Представление плиточного контрола
 * @private
 */
export default class TileView extends ListView {
    protected _template: TemplateFunction = template;
    protected _options: ITileOptions;
    protected _children: IChildren;

    protected _defaultItemTemplate: string = 'Controls/tile:ItemTemplate';
    protected _mouseMoveTimeout: number;
    protected _listModel: TileCollection;

    protected _animatedItemTargetPosition: React.CSSProperties;
    protected _shouldPerformAnimation: boolean;
    protected _targetItemRect: ClientRect;

    protected _beforeMount(options: ITileOptions): void {
        super._beforeMount(options);
        this._forTemplate = For;
    }

    protected _afterMount(options: ITileOptions): void {
        this._notify('register', ['controlResize', this, this._onResize], {
            bubbling: true,
        });
        this._notify('register', ['customscroll', this, this._onScroll, { listenAll: true }], {
            bubbling: true,
        });
        this._notify(
            'registerScroll',
            ['customscroll', this, this._onScroll, { listenAll: true }],
            {
                bubbling: true,
            }
        );
        this._notify(
            'register',
            ['viewportResize', this, this._onViewportResize, { listenAll: true }],
            { bubbling: true }
        );
        this._notify(
            'registerScroll',
            ['viewportResize', this, this._onViewportResize, { listenAll: true }],
            { bubbling: true }
        );
        super._afterMount(options);
    }

    protected _onItemContextMenu(event: Event, item: TileCollectionItem): void {
        if (this._listModel.getTileScalingMode() === 'preview') {
            // не начинаем анимацию, если открываем меню, иначе, из-за анимации, меню может позиционироваться криво
            if (!item.isScaled()) {
                item.setAnimated(false);
                item.setFixedPositionStyle(undefined);
            }
        }
        super._onItemContextMenu(event, item);
    }

    private _onResize(event: SyntheticEvent<AnimationEvent>): void {
        // TODO Если включены операции над записью с задержкой, то после завершения анимации попап стреляет Resize
        //  https://online.sbis.ru/opendoc.html?guid=d8d0bf9e-fc25-4882-84d9-9ff5e20d52da
        if (event?.type !== 'animationend') {
            this._listModel.setHoveredItem(null);
        }
    }

    protected _beforeUpdate(newOptions: ITileOptions): void {
        super._beforeUpdate(newOptions);

        // region Update Model
        if (this._options.tileMode !== newOptions.tileMode) {
            this._listModel.setTileMode(newOptions.tileMode);
        }
        if (this._options.tileSize !== newOptions.tileSize) {
            this._listModel.setTileSize(newOptions.tileSize);
        }
        if (this._options.orientation !== newOptions.orientation) {
            this._listModel.setOrientation(newOptions.orientation);
        }
        if (this._options.itemsContainerPadding !== newOptions.itemsContainerPadding) {
            this._listModel.setItemsContainerPadding(newOptions.itemsContainerPadding);
        }
        if (this._options.tileHeight !== newOptions.tileHeight) {
            this._listModel.setTileHeight(newOptions.tileHeight);
        }
        if (this._options.tileWidth !== newOptions.tileWidth) {
            this._listModel.setTileWidth(newOptions.tileWidth);
        }
        if (this._options.tileWidthProperty !== newOptions.tileWidthProperty) {
            this._listModel.setTileWidthProperty(newOptions.tileWidthProperty);
        }
        if (this._options.tileFitProperty !== newOptions.tileFitProperty) {
            this._listModel.setTileFitProperty(newOptions.tileFitProperty);
        }
        if (this._options.tileScalingMode !== newOptions.tileScalingMode) {
            this._listModel.setTileScalingMode(newOptions.tileScalingMode);
        }
        if (this._options.imageProperty !== newOptions.imageProperty) {
            this._listModel.setImageProperty(newOptions.imageProperty);
        }
        if (this._options.imageFit !== newOptions.imageFit) {
            this._listModel.setImageFit(newOptions.imageFit);
        }
        if (this._options.imageHeightProperty !== newOptions.imageHeightProperty) {
            this._listModel.setImageHeightProperty(newOptions.imageHeightProperty);
        }
        if (this._options.imageWidthProperty !== newOptions.imageWidthProperty) {
            this._listModel.setImageWidthProperty(newOptions.imageWidthProperty);
        }
        if (this._options.imageUrlResolver !== newOptions.imageUrlResolver) {
            this._listModel.setImageUrlResolver(newOptions.imageUrlResolver);
        }
        if (!isEqual(this._options.roundBorder, newOptions.roundBorder)) {
            this._listModel.setRoundBorder(newOptions.roundBorder);
        }
        // endregion Update Model

        if (newOptions.listModel !== this._listModel) {
            this._setHoveredItem(null, null);
        }
        const hoveredItem = this._listModel.getHoveredItem();
        const tileScalingMode = this._listModel.getTileScalingMode();
        this._shouldPerformAnimation =
            hoveredItem &&
            !hoveredItem.destroyed &&
            tileScalingMode !== 'overlap' &&
            tileScalingMode !== 'none' &&
            hoveredItem['[Controls/_tile/mixins/TileItem]'] &&
            hoveredItem.isFixed();
    }

    protected _afterUpdate(): void {
        super._afterUpdate();

        const hoveredItem = this._listModel.getHoveredItem() as TileCollectionItem;
        if (
            hoveredItem &&
            hoveredItem.SupportItemActions &&
            !hoveredItem.destroyed &&
            hoveredItem['[Controls/_tile/mixins/TileItem]']
        ) {
            // actions нужно всегда показать после отрисовки hoveredItem
            hoveredItem.setCanShowActions(true);

            if (
                this._shouldPerformAnimation &&
                hoveredItem.isFixed() &&
                !hoveredItem.isAnimated()
            ) {
                hoveredItem.setAnimated(true);
                hoveredItem.setFixedPositionStyle(this._animatedItemTargetPosition);
            }
        }
    }

    /**
     * позволяет в шаблоне элемента стопать и обрабатывать свайп только тогда, когда есть ItemActions
     * @private
     */
    protected _onItemTouchMove(
        event: SyntheticEvent<{ direction: string } & Event>,
        item: TileItem
    ): void {
        if (this._options.orientation !== 'horizontal') {
            super._onItemTouchMove(event, item);
        } else {
            event.stopPropagation();
        }
    }

    protected _onItemSwipe(
        event: SyntheticEvent<{ direction: string } & Event>,
        item: TileItem
    ): void {
        if (this._options.orientation !== 'horizontal') {
            super._onItemSwipe(event, item);
        } else {
            event.stopPropagation();
        }
    }

    protected _isPendingRedraw(event, changesType, action, newItems) {
        return (
            !this.isLoadingPercentsChanged(action) &&
            super._isPendingRedraw(event, changesType, action, newItems)
        );
    }

    /**
     * TODO https://online.sbis.ru/opendoc.html?guid=b8b8bd83-acd7-44eb-a915-f664b350363b
     *  Костыль, позволяющий определить, что мы загружаем файл и его прогрессбар изменяется
     *  Это нужно, чтобы в ListView не вызывался resize при изменении прогрессбара и не сбрасывался hovered в плитке
     */
    isLoadingPercentsChanged(newItems: TileCollectionItem[]): boolean {
        return (
            newItems &&
            newItems[0] &&
            newItems[0].getContents() &&
            newItems[0].getContents().getChanged &&
            newItems[0].getContents().getChanged().indexOf('docviewLoadingPercent') !== -1 &&
            newItems[0].getContents().getChanged().indexOf('docviewIsLoading') === -1
        );
    }

    protected _beforeUnmount(): void {
        this._notify('unregister', ['controlResize', this], { bubbling: true });
        this._notify('unregister', ['customscroll', this, { listenAll: true }], { bubbling: true });
        this._notify('unregisterScroll', ['customscroll', this, { listenAll: true }], {
            bubbling: true,
        });
        this._notify('unregister', ['viewportResize', this, { listenAll: true }], {
            bubbling: true,
        });
        this._notify('unregisterScroll', ['viewportResize', this, { listenAll: true }], {
            bubbling: true,
        });
    }

    protected _getPreviewMenuImageStyles(
        menuHeight: number,
        previewHeight: number,
        imageProportion: number
    ): string {
        if (detection.isIE) {
            // Высота блока с заголовком: var(--inline_height_4xl) + var(--border-thickness)
            const titleHeightFallback = 45;
            const imageHeight = Math.max(
                (menuHeight || previewHeight) - titleHeightFallback,
                previewHeight
            );
            const imageWidth = imageHeight * imageProportion;
            return `.controls-TileView__itemActions__menu_imageWrapper {
                        min-width: ${imageWidth}px;
                        min-height: ${imageHeight}px;
                    }
                    .controls-TileView__itemActions__menu_leftContent {
                        width: ${imageWidth}px;
                    }`;
        } else {
            return `.controls-TileView__itemActions__menu_content {
                        --height_image: max(calc(${
                            menuHeight || previewHeight
                        }px - var(--inline_height_4xl) - var(--border-thickness)), ${previewHeight}px);
                        --width_image: calc(var(--height_image) * ${imageProportion});
                    }
                    .controls-TileView__itemActions__menu_imageWrapper {
                        min-width: var(--width_image);
                        min-height: var(--height_image);
                    }
                    .controls-TileView__itemActions__menu_leftContent {
                        width: var(--width_image);
                    }`;
        }
    }

    getImageSizeForMenu(itemContainer: HTMLElement): {
        height: number;
        width: number;
    } {
        const itemRect = itemContainer.getBoundingClientRect();
        const targetItemSize = getItemSize(
            itemContainer,
            this._listModel.getZoomCoefficient(),
            this._listModel.getTileMode()
        );

        const viewContainer =
            this._listModel.getTileScalingMode() === 'inside'
                ? this.getItemsContainer()
                : constants.isBrowserPlatform && document.documentElement;
        const viewContainerRect = DimensionsMeasurer.getBoundingClientRect(viewContainer);

        const targetItemPosition = this._listModel.getItemContainerPosition(
            targetItemSize,
            itemRect,
            viewContainerRect
        );
        return !!targetItemPosition ? targetItemSize : itemRect;
    }

    getActionsMenuConfig(
        contents: Model,
        clickEvent: SyntheticEvent,
        action: object,
        isContextMenu: boolean,
        menuConfig: object,
        item: TileCollectionItem
    ): Record<string, string | Record<string, string | number> | boolean> {
        const isActionMenu = !!action && !action.isMenu;
        if (this._shouldOpenExtendedMenu(isActionMenu) && menuConfig) {
            const menuOptions = menuConfig.templateOptions;
            const itemContainer = clickEvent.target.closest('.controls-TileView__item');
            const imageWrapper = itemContainer.querySelector('.controls-TileView__imageWrapper');
            if (!imageWrapper) {
                return null;
            }

            const targetItemSize = this.getImageSizeForMenu(itemContainer);

            menuOptions.image = item.getImageUrl(undefined, undefined, undefined, undefined, true);
            menuOptions.title = item.getDisplayValue();
            menuOptions.additionalText = item
                .getContents()
                .get(menuOptions.headerAdditionalTextProperty);
            menuOptions.imageClasses = item.getImageClasses();
            menuOptions.previewHeight =
                this._targetItemRect && item.isScaled()
                    ? this._targetItemRect.height
                    : targetItemSize.height;
            menuOptions.previewWidth =
                this._targetItemRect && item.isScaled()
                    ? this._targetItemRect.width
                    : targetItemSize.width;
            menuOptions.imageProportion = menuOptions.previewWidth / menuOptions.previewHeight;
            menuOptions.roundBorder = !!this._options.roundBorder;
            menuOptions.getStyles = this._getPreviewMenuImageStyles;

            return {
                templateOptions: menuOptions,
                closeOnOutsideClick: true,
                target: this._targetItemRect
                    ? this._getTargetPoint(this._targetItemRect)
                    : this._getTargetPoint(imageWrapper.getBoundingClientRect()),
                className: `controls-TileView__itemActions_menu_popup
                            controls_popupTemplate_theme-${this._options.theme}
                            controls_list_theme-${this._options.theme}`,
                targetPoint: {
                    vertical: 'center',
                    horizontal: 'right',
                },
                direction: {
                    vertical: 'center',
                    horizontal: 'left',
                },
                fittingMode: {
                    vertical: 'overflow',
                    horizontal: 'overflow',
                },
                opener: menuConfig.opener,
                template: 'Controls/tile:ActionsMenu',
                actionOnScroll: 'close',
            };
        } else {
            return null;
        }
    }

    /**
     * В процессе открытия меню, запись может пререрисоваться, и таргета не будет в DOM.
     * Для позиционирования достаточно координат {x, y}
     * @param rect
     */
    private _getTargetPoint(rect: ClientRect): { x: number; y: number } {
        return {
            x: rect.left + rect.width,
            y: document.documentElement.scrollTop + rect.top + rect.height / 2,
        };
    }

    private _shouldOpenExtendedMenu(isActionMenu: boolean): boolean {
        return this._options.actionMenuViewMode === 'preview' && !isActionMenu;
    }

    protected _onItemMouseEnter(event: SyntheticEvent<MouseEvent>, item: TileCollectionItem): void {
        this._notify('itemMouseEnter', [item, event]);
        this._setHoveredItemIfNeed(event, item);
    }

    protected _onItemMouseLeave(event: SyntheticEvent, item: TileCollectionItem): void {
        if (!TouchDetect.getInstance().isTouch() && !item.isActive()) {
            this._setHoveredItem(null, event);
            // С помощью флага canShowActions отображают itemActions. Когда показываются itemActions, скрывается title.
            // Поэтому после того как увели мышь с итема, нужно сбросить флаг canShowActions, чтобы показать title.
            if (
                this._shouldProcessHover() &&
                item['[Controls/_tile/mixins/TileItem]'] &&
                item.SupportItemActions
            ) {
                item.setCanShowActions(false);
            }
        }
        this._clearMouseMoveTimeout();
        this._notify('itemMouseLeave', [item, event]);
    }

    protected _onItemMouseMove(event: SyntheticEvent<MouseEvent>, item: TileCollectionItem): void {
        // Событие может сработать между beforeUpdate и afterUpdate, когда старая коллекция разрушена,
        // а элементы еще не убраны из DOM, тогда item будет принадлежать старой коллекции, к которой обращаться нельзя.
        if (item?.getOwner()?.destroyed) {
            return;
        }
        if (
            !item['[Controls/_display/GroupItem]'] &&
            this._shouldProcessHover() &&
            !this._listModel.isDragging() &&
            !item.isFixed()
        ) {
            this._setHoveredItemPosition(event, item);
        }
        this._setHoveredItemIfNeed(event, item);

        super._onItemMouseMove(event, item);
    }

    private _setHoveredItemIfNeed(event: SyntheticEvent, item: TileCollectionItem): void {
        if (this._shouldProcessHover() && this._listModel.getHoveredItem() !== item) {
            this._clearMouseMoveTimeout();
            this._mouseMoveTimeout = setTimeout(() => {
                this._setHoveredItem(item, event);
                this._clearMouseMoveTimeout();
            }, ZOOM_DELAY);
        }
    }

    private _setHoveredItemPosition(e: SyntheticEvent<MouseEvent>, item: TileCollectionItem): void {
        const target = e.target as HTMLElement;
        const tileScalingMode = this._listModel.getTileScalingMode();

        if (tileScalingMode === 'none' || target.closest('.js-controls-TileView__withoutZoom')) {
            if (
                item &&
                item['[Controls/_tile/mixins/TileItem]'] &&
                item.SupportItemActions &&
                this._options.actionMode !== 'adaptive'
            ) {
                // canShowActions можно проставить без задержки, если они не будут пересчитаны
                item.setCanShowActions(true);
            }
            this._targetItemRect = null;
            return;
        }

        const itemContainer: HTMLElement = target.closest(
            '.controls-TileView__item:not(.controls-TileView__item_unscalable)'
        );
        const itemContainerRect = itemContainer.getBoundingClientRect();

        const viewContainer =
            tileScalingMode === 'inside'
                ? this.getItemsContainer()
                : constants.isBrowserPlatform && document.documentElement;
        const viewContainerRect = DimensionsMeasurer.getBoundingClientRect(viewContainer);

        const targetItemSize = getItemSize(
            itemContainer,
            this._listModel.getZoomCoefficient(),
            this._listModel.getTileMode()
        );
        const targetItemPosition = this._listModel.getItemContainerPosition(
            targetItemSize,
            itemContainerRect,
            viewContainerRect
        );

        // Если один из параметров позиции посчитается отрицательным, то позиция не корректна и возвращается null
        if (!targetItemPosition) {
            return;
        }

        const documentRect =
            constants.isBrowserPlatform &&
            DimensionsMeasurer.getBoundingClientRect(document.documentElement);

        // должны учесть родительский контейнер чтобы посчитать положение относительно document,
        // а не относительно container
        // актуально для chrome и firefox
        // а еще оказывается в новой 129 версии хрома это отменили
        let containerRect;
        if ((constants.isBrowserPlatform && detection.chromeVersion < 129) || detection.firefox) {
            // вычисляем tw-@container, через closest не дает взять, говорит синтаксическая ошибка
            let parent = itemContainer?.parentElement;
            let containerElement = document.documentElement;
            while (parent) {
                if (parent.classList.contains('tw-@container')) {
                    containerElement = parent;
                }
                parent = parent.parentElement;
            }
            containerRect = DimensionsMeasurer.getBoundingClientRect(containerElement);
        } else {
            containerRect = {
                left: 0,
                top: 0,
                right: documentRect?.width,
                bottom: documentRect?.height,
            };
        }

        const targetItemPositionInDocument = this._listModel.getItemContainerPositionInDocument(
            targetItemPosition,
            viewContainerRect,
            documentRect,
            containerRect
        );
        this._targetItemRect = {
            ...targetItemSize,
            ...targetItemPositionInDocument,
            x: targetItemPositionInDocument.left,
            y: targetItemPositionInDocument.top,
        };
        // TODO This should probably be moved to some kind of animation manager
        if (targetItemPositionInDocument) {
            const targetPositionStyle = {
                top: `${targetItemPositionInDocument.top}px`,
                left: `${targetItemPositionInDocument.left}px`,
                right: `${targetItemPositionInDocument.right}px`,
                bottom: `${targetItemPositionInDocument.bottom}px`,
            };
            if (tileScalingMode !== 'overlap') {
                const startItemPositionInDocument = this._listModel.getItemContainerStartPosition(
                    itemContainerRect,
                    documentRect
                );
                item.setFixedPositionStyle(startItemPositionInDocument);
                this._animatedItemTargetPosition = targetPositionStyle;
            } else {
                item.setFixedPositionStyle(targetPositionStyle);
            }
        }
    }

    protected _setHoveredItem(item: TileCollectionItem, event: SyntheticEvent<MouseEvent>): void {
        if (this._destroyed || !this._listModel || this._listModel.destroyed) {
            return;
        }

        // Элемент могут удалить, но hover на нем успеет сработать. Проверяем что элемент точно еще есть в модели.
        // Может прийти null, чтобы сбросить элемент
        const hasItem = item === null || !!this._listModel.getItemBySourceItem(item.getContents());
        if (!hasItem) {
            return;
        }
        super._setHoveredItem(item, event);
        if (this._listModel.getHoveredItem() !== item && !this._listModel.getActiveItem()) {
            this._listModel.setHoveredItem(item);
        }

        this._notifyUpdateActions(item, event);
    }

    /**
     * Посылает в BaseControl событие для обновления ItemActions
     * @param item
     * @param event
     * @private
     */
    protected _notifyUpdateActions(item: TileCollectionItem, event: SyntheticEvent): void {
        if (item && this._options.actionMode === 'adaptive' && !!event) {
            const itemWidth = this._calcTileItemWidth(event.target as HTMLElement);
            this._notify('updateItemActionsOnItem', [item.getContents().getKey(), itemWidth], {
                bubbling: true,
            });
        }
    }

    /**
     * Рассчитывает ширину HTML-элемента плитки
     * @param element
     * @private
     */
    protected _calcTileItemWidth(element: HTMLElement): number {
        let itemWidth;
        const itemContainer: HTMLElement = element?.closest('.controls-TileView__item');
        if (!itemContainer) {
            return 0;
        }
        if (element.closest('.js-controls-TileView__withoutZoom')) {
            itemWidth = itemContainer.clientWidth;
        } else {
            const itemSizes = getItemSize(
                itemContainer,
                this._getZoomCoefficient(),
                this._options.tileMode
            );
            itemWidth = itemSizes.width;
        }
        return itemWidth;
    }

    private _getZoomCoefficient(): number {
        const tileScalingMode = this._listModel.getTileScalingMode();
        return tileScalingMode !== TILE_SCALING_MODE.NONE &&
            tileScalingMode !== TILE_SCALING_MODE.OVERLAP
            ? ZOOM_COEFFICIENT
            : 1;
    }

    private _getPadding(paddingOption: string): IItemPadding {
        return {
            left: this._options[paddingOption]?.left || 'default',
            right: this._options[paddingOption]?.right || 'default',
            top: this._options[paddingOption]?.top || 'default',
            bottom: this._options[paddingOption]?.bottom || 'default',
        };
    }

    private _prepareItemsPadding(padding: IItemPadding): void {
        Object.keys(padding).forEach((key) => {
            if (!AVAILABLE_ITEM_PADDINGS.includes(padding[key])) {
                padding[key] = 'default';
            }
        });
    }

    private _prepareItemsContainerPadding(padding: IItemsContainerPadding): void {
        if (!AVAILABLE_CONTAINER_VERTICAL_PADDINGS.includes(padding.top)) {
            padding.top = 'default';
        }
        if (!AVAILABLE_CONTAINER_VERTICAL_PADDINGS.includes(padding.bottom)) {
            padding.bottom = 'default';
        }
        if (!AVAILABLE_CONTAINER_HORIZONTAL_PADDINGS.includes(padding.left)) {
            padding.left = 'default';
        }
        if (!AVAILABLE_CONTAINER_HORIZONTAL_PADDINGS.includes(padding.right)) {
            padding.right = 'default';
        }
    }

    protected _getViewClasses(): string {
        let classes = `controls_list_theme-${this._options.theme} controls-TileView_new`;

        if (this._options.orientation === 'horizontal') {
            classes += ' controls-TileViewContainer_orientation-horizontal';
        }

        // если показывается emptyTemplate отступы между элементом и границей вьюхи не нужны.
        // Иначе будут прыжки при переключении viewMode
        if (!this._options.needShowEmptyTemplate) {
            classes += this._getItemsPaddingContainerClasses();
        }

        return classes;
    }

    protected _getViewStyles(): string {
        return '';
    }

    protected _getItemsContainerClasses(): string {
        return `controls-ListViewV controls-TileView controls-TileView_orientation-${this._options.orientation}`;
    }

    protected _getTriggerClasses(): string {
        return `controls-Tile__loadingTrigger_${this._options.orientation}`;
    }

    protected _getLoadingIndicatorClasses(): string {
        return `controls-${this._options.orientation}Tile__loadingIndicator`;
    }

    private _getItemsPaddingContainerClasses(): string {
        let classes = ' controls-TileView__itemPaddingContainer';

        const prefix = ' controls-TileView__itemsPaddingContainer_spacing';
        const itemPadding = this._getPadding('itemPadding');
        if (this._options.itemsContainerPadding) {
            const itemsContainerPadding = this._getPadding(
                'itemsContainerPadding'
            ) as IItemsContainerPadding;
            this._prepareItemsPadding(itemPadding);
            this._prepareItemsContainerPadding(itemsContainerPadding);
            if (this._options.orientation === 'horizontal') {
                classes += `${prefix}Left_${itemsContainerPadding.left}_horizontal`;
                classes += `${prefix}Right_${itemsContainerPadding.right}_horizontal`;
            } else {
                classes += `${prefix}Left_${itemsContainerPadding.left}_itemPadding_${itemPadding.left}`;
                classes += `${prefix}Right_${itemsContainerPadding.right}_itemPadding_${itemPadding.right}`;
            }
            classes += `${prefix}Top_${itemsContainerPadding.top}_itemPadding_${itemPadding.top}`;
            classes += `${prefix}Bottom_${itemsContainerPadding.bottom}_itemPadding_${itemPadding.bottom}`;
        } else {
            if (this._options.orientation === 'horizontal') {
                classes += `${prefix}Left_null_horizontal`;
                classes += `${prefix}Right_null_horizontal`;
            } else {
                classes += `${prefix}Left_${itemPadding.left}`;
                classes += `${prefix}Right_${itemPadding.right}`;
            }
            classes += `${prefix}Top_${itemPadding.top}`;
            classes += `${prefix}Bottom_${itemPadding.bottom}`;
        }
        return classes;
    }

    protected _onItemWheel(): void {
        this.onScroll();
    }

    protected _onScroll(): void {
        this.onScroll();
    }

    protected _onViewportResize(): void {
        // При изменение размеров вьюпорта плитка может перестроиться, поэтому кидаем событие о ресайзе
        this._notify('controlResize');
    }

    getItemsContainer(): HTMLElement {
        return this._children.itemsContainer;
    }

    private onScroll(): void {
        this._clearMouseMoveTimeout(this);
        if (this._listModel && !this._listModel.destroyed) {
            this._listModel.setHoveredItem(null);
        }
    }

    private _clearMouseMoveTimeout(): void {
        if (this._mouseMoveTimeout) {
            clearTimeout(this._mouseMoveTimeout);
            this._mouseMoveTimeout = null;
        }
    }

    // TODO Нужен синглтон, который говорит, идет ли сейчас перетаскивание
    // https://online.sbis.ru/opendoc.html?guid=a838cfd3-a49b-43a8-821a-838c1344288b
    private _shouldProcessHover(): boolean {
        // document не инициализирован в юнит тестах
        // Ховер НУЖНО обрабатывать, если:
        // а) плитка увеличивается по ховеру
        // б) операции в адаптивном режиме или с задержкой (это на css не решается)
        return (
            (this._options.tileScalingMode !== 'none' ||
                this._options.actionMode === 'adaptive' ||
                this._options.itemActionsVisibility === 'delayed') &&
            !TouchDetect.getInstance().isTouch() &&
            !document?.body?.classList?.contains('ws-is-drag')
        );
    }

    static getDefaultOptions(): object {
        return {
            tileMode: 'static',
            orientation: 'vertical',
            tileScalingMode: TILE_SCALING_MODE.NONE,
        };
    }
}

/*
 * Имя сущности для идентификации списка.
 */
Object.defineProperty(TileView.prototype, 'listInstanceName', {
    value: 'controls-Tile',
    writable: false,
});
