/**
 * @kaizen_zone 85fa96d3-2240-448c-8ebb-e69dbcb05d63
 */
import { mixin } from 'Types/util';
import { TreeItem } from 'Controls/baseTree';
import { Model } from 'Types/entity';
import { EnumeratorCallback, ObservableList, RecordSet } from 'Types/collection';
import { TreeTileCollection, TreeTileCollectionItem, TreeTileView } from 'Controls/treeTile';
import { TreeGridCollection, TreeGridView } from 'Controls/treeGrid';
import * as CompositeItemTemplate from 'wml!Controls/_expandedCompositeTree/render/CompositeItemTemplate';
import * as CompositeFooter from 'wml!Controls/_expandedCompositeTree/render/CompositeFooter';

import { ITreeItemOptions } from 'Controls/tree';
import { TemplateFunction } from 'UI/Base';
import type { ICompositeViewConfig, ICompositeViewMode } from './Collection';
import { isEqual } from 'Types/object';
import { detection } from 'Env/Env';
import { CrudEntityKey } from 'Types/source';
import { IDragPosition } from 'Controls/display';
import { IRenderScopeProps } from '../interface/IRenderScopeProps';
import { TVisibility } from 'Controls/interface';

export const MODULE_NAME = 'Controls/expandedCompositeTree:CompositeCollectionItem';

interface ICompositeCollectionItemOptions extends ITreeItemOptions<Model> {
    compositeViewConfig: ICompositeViewConfig;
    list: ObservableList<Model>;
    hasCompositeItemsBothTypes?: boolean;
    parentProperty?: string;
    nodeProperty?: string;
    keyProperty?: string;
}

export default class CompositeCollectionItem<T extends Model = Model> extends mixin<
    TreeItem<Model>
>(TreeItem) {
    readonly EditableItem: boolean = true;
    readonly DisplayItemActions: boolean = true;
    readonly DisplaySearchValue: boolean = false;

    get Markable(): boolean {
        return false;
    }

    readonly SelectableItem: boolean = false;
    readonly EnumerableItem: boolean = true;
    readonly EdgeRowSeparatorItem: boolean = false;
    readonly DraggableItem: boolean = false;
    readonly ActivatableItem: boolean = false;
    readonly SupportItemActions: boolean = false;

    readonly listInstanceName: string = 'controls-ExpandedCompositeTree';
    readonly listElementName: string = 'composite-item';

    protected _renderCollection: TreeTileCollection;
    protected _$compositeViewConfig: ICompositeViewConfig;
    protected _$compositeViewMode: ICompositeViewMode;
    protected _$type: string;
    // Определяет, можно ли показать кнопку "Ещё" в композитном элементе.
    // Кнопка показывается в последнем композитном элементе.
    // Расчет производится в стратегии CompositeItem.
    protected _$canShowFooter: boolean;
    // Определяет, что композитная запись есть и для узлов и для листьев.
    // Требуется, например, когда прямо за плиткой узлов идёт плитка листьев,
    // И между ними нужно обеспечить стандартный отступ xl
    protected _$hasCompositeItemsBothTypes: boolean;

    protected _$expandedItems: CrudEntityKey[];
    protected _$collapsedItems: CrudEntityKey[];
    protected _$displayProperty: string;
    protected _$parentProperty: string;
    protected _$nodeProperty: string;
    protected _$keyProperty: string;

    constructor(options: ICompositeCollectionItemOptions) {
        super(options);

        this._initializeCollection(options.list);
    }

    getList(): ObservableList<Model> {
        return this._renderCollection.getSourceCollection() as ObservableList<Model>;
    }

    getType(): string {
        return this._$type;
    }

    isVisibleChildrenItem(key: CrudEntityKey): boolean {
        return this._renderCollection.isVisibleItem(key);
    }

    getChildrenItemByKey(key: CrudEntityKey, withFilter?: boolean): TreeItem {
        return this._renderCollection.getItemBySourceKey(key, withFilter);
    }

    eachChild(callback: EnumeratorCallback<TreeTileCollectionItem>, context?: object): void {
        return this._renderCollection.each(callback, context);
    }

    findChild(predicate: (item: T) => boolean): TreeTileCollectionItem {
        return this._renderCollection.find(predicate);
    }

    getChildIndex(item: T): number {
        return this._renderCollection.getIndex(item);
    }

    getChildSourceCollection(): RecordSet {
        return this._renderCollection.getSourceCollection();
    }

    // region Drag-N-Drop

    getChildrenDragNDrop(): boolean {
        return this._renderCollection.getItemsDragNDrop();
    }

    setDraggedItems(
        draggableItem: TreeTileCollectionItem,
        draggedItemsKeys: CrudEntityKey[]
    ): void {
        this._renderCollection.setDraggedItems(draggableItem, draggedItemsKeys);
    }

    setDragPosition(position: IDragPosition<TreeTileCollectionItem>): void {
        // Если позиция относительно записи, которая не принадлежит этому элементу, то позицию менять не нужно,
        // т.к. перетаскивают запись за пределами этого списка.
        if (
            this._renderCollection !==
            (position.dispItem.getOwner() as unknown as TreeTileCollection)
        ) {
            return;
        }
        this._renderCollection.setDragPosition(position);
    }

    resetDraggedItems(): void {
        this._renderCollection.resetDraggedItems();
    }

    setDragOutsideList(outside: boolean): void {
        this._renderCollection.setDragOutsideList(outside);
    }

    isDragOutsideList(): boolean {
        return this._renderCollection.isDragOutsideList();
    }

    // endregion Drag-N-Drop

    private _initializeCollection(list: ObservableList<Model>): void {
        const itemPadding = {
            ...this._$compositeViewConfig?.itemPadding,
        };
        if (this._$type === 'nodes') {
            itemPadding.top = 'null';
            itemPadding.bottom = 'null';
        }
        const CollectionModule =
            this._$compositeViewMode === 'table' ? TreeGridCollection : TreeTileCollection;
        this._renderCollection = new CollectionModule({
            parentProperty: this._$parentProperty,
            nodeProperty: this._$nodeProperty,
            displayProperty: this._$displayProperty,
            expandedItems: this._$expandedItems,
            collapsedItems: this._$collapsedItems,
            keyProperty: this._$keyProperty,
            multiSelectVisibility: this._$multiSelectVisibility,
            ...this._$compositeViewConfig,
            itemPadding,
            adaptiveMode: this.getOwner().getAdaptiveMode(),
            collection: list,
            root: this.getParent().key,
            orientation: this.getOrientation(list),
        });
    }

    private _updateRenderCollection(
        oldConfig: ICompositeViewConfig,
        newConfig: ICompositeViewConfig
    ): void {
        if (!this._renderCollection) {
            return;
        }
        if (oldConfig?.tileSize !== newConfig.tileSize) {
            this._renderCollection.setTileSize(newConfig.tileSize);
        }
        if (oldConfig?.tileWidth !== newConfig.tileWidth) {
            this._renderCollection.setTileWidth(newConfig.tileWidth);
        }
        if (oldConfig?.folderWidth !== newConfig.folderWidth) {
            this._renderCollection?.setFolderWidth(newConfig.folderWidth);
        }
        if (oldConfig?.multiSelectVisibility !== newConfig.multiSelectVisibility) {
            this._renderCollection?.setMultiSelectVisibility(newConfig.multiSelectVisibility);
        }
        if (!isEqual(oldConfig?.itemTemplateOptions, newConfig.itemTemplateOptions)) {
            this._renderCollection.setItemTemplateOptions(newConfig.itemTemplateOptions);
        }
    }

    setCompositeViewConfig(compositeViewConfig: ICompositeViewConfig): void {
        if (!isEqual(this._$compositeViewConfig, compositeViewConfig)) {
            this._updateRenderCollection(this._$compositeViewConfig, compositeViewConfig);
            this._$compositeViewConfig = compositeViewConfig;
            this._nextVersion();
        }
    }

    setMultiSelectVisibility(multiSelectVisibility: TVisibility): boolean {
        if (multiSelectVisibility !== this._$multiSelectVisibility) {
            this._updateRenderCollection(this._$compositeViewConfig, {
                ...this._$compositeViewConfig,
                multiSelectVisibility,
            });
        }
        return super.setMultiSelectVisibility(multiSelectVisibility);
    }

    setExpandedItems(expandedKeys: CrudEntityKey[]): void {
        this._$expandedItems = expandedKeys;
        this._renderCollection.setExpandedItems(expandedKeys);
        this._nextVersion();
    }

    setCollapsedItems(collapsedKeys: CrudEntityKey[]): void {
        this._$collapsedItems = collapsedKeys;
        this._renderCollection.setCollapsedItems(collapsedKeys);
        this._nextVersion();
    }

    isMobile(): boolean {
        const adaptiveMode = this.getOwner().getAdaptiveMode();
        return (
            detection.isMobilePlatform ||
            adaptiveMode?.device?.isPhone() ||
            adaptiveMode?.device?.isTablet()
        );
    }

    getWrapperClasses(): string {
        let classes = '';
        if (this._$compositeViewConfig?.contrastBackground) {
            classes += 'controls-ExpandedCompositeTree-item_contrastBackground';
        }
        return classes;
    }

    getPaddingClasses(): string {
        let classes = 'controls-ExpandedCompositeTree-item';

        // На мобильных устройствах контейнер горизонтальной плитки должен быть без отступов, вплотную к границам экрана

        if (!(this.isMobile() && this._$type === 'nodes')) {
            const rightPadding = this.getOwner().getRightPadding().toLowerCase();
            const leftPadding = this.getOwner().getLeftPadding().toLowerCase();
            classes += ` controls-padding_right-${rightPadding}`;
            classes += ` controls-padding_left-${leftPadding}`;
        }

        const tileTopPadding = this._$compositeViewConfig?.itemPadding.top;
        const tileBottomPadding = this._$compositeViewConfig?.itemPadding.bottom;
        // При последовательном выводе плитки после карусели с узлами,
        // Между ними должно быть зафиксированное расстояние xl.
        if (this._$type === 'nodes') {
            classes += ` controls-ExpandedCompositeTree-compositePaddingTop_null_itemPadding_${tileTopPadding}`;
            if (this._$hasCompositeItemsBothTypes) {
                classes +=
                    ' controls-ExpandedCompositeTree-compositePaddingBottom_xl_itemPadding_null';
            } else {
                classes += ` controls-ExpandedCompositeTree-compositePaddingBottom_null_itemPadding_${tileBottomPadding}`;
            }
        } else if (this._$hasCompositeItemsBothTypes) {
            classes += ` controls-ExpandedCompositeTree-compositePaddingTop_xl_itemPadding_${tileTopPadding}`;
        }

        return classes;
    }

    getMultiSelectVisibility(): string {
        return 'hidden';
    }

    getTemplate(): TemplateFunction | string {
        return CompositeItemTemplate;
    }

    getRenderTemplate(): Function {
        if (this._$compositeViewMode === 'table') {
            return TreeGridView;
        } else {
            return TreeTileView;
        }
    }

    getOrientation(list: ObservableList<Model>): 'horizontal' | 'vertical' {
        const forcedVertical = this.isMobile() && list.getCount() === 1;
        return this._$type === 'nodes' && !forcedVertical ? 'horizontal' : 'vertical';
    }

    getRenderParams(): IRenderScopeProps {
        return this._$compositeViewMode === 'table'
            ? this._getTableRenderParams()
            : this._getTileRenderParams();
    }

    protected _getTileRenderParams(): IRenderScopeProps {
        const rightPadding = this.getOwner().getRightPadding().toLowerCase();
        const leftPadding = this.getOwner().getLeftPadding().toLowerCase();
        const isMobile = this.isMobile();
        const itemsContainerPadding = {
            top: 'null',
            left: 'null',
            right: 'null',
            bottom: 'null',
        };

        if (isMobile && this._$type === 'nodes') {
            itemsContainerPadding.left = leftPadding;
            itemsContainerPadding.right = rightPadding;
        }

        // Вообще неочевидная тема. При загрузке вверх и курсорной навигации - с БЛ должны прилетать именно первые
        // записи текущего узла. Если записей больше, чем pageSize, то флаг наличия незагруженных данных прилетает в
        // boolean-формате и записывается в направление загрузки. В данном кейсе - в backward.
        // А рендерить кнопку "ещё" всё равно нужно. Из-за этого пришлось смотреть и на backward, хотя в целом это
        // неправильно. Оформил подзадачу на выправление логики загрузки.
        // https://online.sbis.ru/opendoc.html?guid=370b3afe-3fbc-40f3-ac11-984c2a87967e&client=3
        const isRenderFooter =
            (this.getParent().getHasMoreStorage().forward ||
                this.getParent().getHasMoreStorage().backward) &&
            this._$canShowFooter;

        const itemPadding = {
            ...this._$compositeViewConfig?.itemPadding,
        };
        if (this._$type === 'nodes') {
            itemPadding.top = 'null';
            itemPadding.bottom = 'null';
        }

        return {
            itemPadding,
            itemsContainerPadding,
            footerTemplate: isRenderFooter ? CompositeFooter : undefined,
            footerTemplateOptions: {
                itemPadding,
            },
            itemTemplate: this._$compositeViewConfig?.itemTemplate,
            itemTemplateOptions: this._$compositeViewConfig?.itemTemplateOptions,
            listModel: this._renderCollection,
            orientation: this.getOrientation(this.getList()),
            shadowMode: isMobile ? 'js' : 'blur',
            itemActions: this._$compositeViewConfig?.itemActions,
            contextMenuConfig: this._$compositeViewConfig?.contextMenuConfig,
            itemActionsClass: this._$compositeViewConfig?.itemActionsClass,
            itemActionsPosition: this._$compositeViewConfig?.itemActionsPosition,
            itemActionsProperty: this._$compositeViewConfig?.itemActionsProperty,
            contextMenuVisibility: this._$compositeViewConfig?.contextMenuVisibility,
            itemActionVisibilityCallback: this._$compositeViewConfig?.itemActionVisibilityCallback,
            editingConfig: this._$compositeViewConfig?.editingConfig,
        };
    }

    protected _getTableRenderParams(): IRenderScopeProps {
        const isRenderFooter =
            (this.getParent().getHasMoreStorage().forward ||
                this.getParent().getHasMoreStorage().backward) &&
            this._$canShowFooter;
        const footer = isRenderFooter
            ? [
                  {
                      startColumn: 1,
                      endColumn: this._$compositeViewConfig?.columns.length + 1,
                      template: CompositeFooter,
                  },
              ]
            : undefined;
        this._renderCollection.setFooter({ footer });
        return {
            itemPadding: this._$compositeViewConfig?.itemPadding,
            footer,
            footerTemplateOptions: {
                itemPadding: this._$compositeViewConfig?.itemPadding,
            },
            itemTemplate: this._$compositeViewConfig?.itemTemplate,
            itemTemplateOptions: this._$compositeViewConfig?.itemTemplateOptions,
            columns: this._$compositeViewConfig?.columns,
            header: this._$compositeViewConfig?.header,
            listModel: this._renderCollection,
            itemActions: this._$compositeViewConfig?.itemActions,
            contextMenuConfig: this._$compositeViewConfig?.contextMenuConfig,
            itemActionsClass: this._$compositeViewConfig?.itemActionsClass,
            itemActionsPosition: this._$compositeViewConfig?.itemActionsPosition,
            itemActionsProperty: this._$compositeViewConfig?.itemActionsProperty,
            contextMenuVisibility: this._$compositeViewConfig?.contextMenuVisibility,
            itemActionVisibilityCallback: this._$compositeViewConfig?.itemActionVisibilityCallback,
            editingConfig: this._$compositeViewConfig?.editingConfig,
        };
    }
}

Object.assign(CompositeCollectionItem.prototype, {
    '[Controls/expandedCompositeTree:CompositeCollectionItem]': true,
    '[Controls/_display/TreeItem]': true,
    _moduleName: MODULE_NAME,
    _$searchValue: '',
    _instancePrefix: 'ect-composite-item-',
    _$hasStickyGroup: false,
    _$compositeViewConfig: null,
    _$type: '',
    _$canShowFooter: false,
    _$hasCompositeItemsBothTypes: false,
    _$compositeViewMode: 'tile',
    _$displayProperty: null,
    _$parentProperty: null,
    _$nodeProperty: null,
    _$keyProperty: null,
    _$collapsedItems: [],
    _$expandedItems: [],
});
