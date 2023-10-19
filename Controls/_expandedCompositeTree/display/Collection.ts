/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import CollectionItem from './CollectionItem';
import CompositeCollectionItem, { MODULE_NAME } from './CompositeCollectionItem';
import CompositeItem from './strategy/CompositeItem';
import PseudoParent from './strategy/PseudoParent';
import { IDragPosition } from 'Controls/display';
import {
    Tree,
    ITreeCollectionOptions,
    RootSeparatorItem,
    TreeItem
} from 'Controls/baseTree';
import { Model } from 'Types/entity';
import { TreeTileCollectionItem, ITreeTileCollectionOptions } from 'Controls/treeTile';
import { TemplateFunction } from 'UI/Base';
import { isEqual } from 'Types/object';
import { CrudEntityKey } from 'Types/source';
import { IItemActionsOptions } from 'Controls/itemActions';

export interface ICompositeViewConfig extends ITreeTileCollectionOptions, IItemActionsOptions {
    compositeNodesLevel: number;
    itemTemplate: TemplateFunction | string;
    itemTemplateOptions: Object;
}

export interface IOptions<S extends Model, T extends CollectionItem<S>>
    extends ITreeCollectionOptions<S, T> {
    compositeViewConfig: ICompositeViewConfig;
}

export default class Collection<
    S extends Model,
    T extends CollectionItem<S> = CollectionItem<S>
> extends Tree<S, T> {
    readonly '[Controls/expandedCompositeTree:Collection]': boolean;
    protected _$compositeViewConfig: ICompositeViewConfig;
    protected _$compositeNodesLevel: number;
    protected _$rootItemsPositionBottom: boolean;
    private _currentCompositeItem: CompositeCollectionItem;

    getItemBySourceKey(key: string | number, withFilter: boolean = true): T {
        const item = super.getItemBySourceKey(key, withFilter);
        // Если запись не найдена или поиск производился без фильтров
        // пытаемся найти проекцию в дочернем списке.
        if (!item || !withFilter) {
            const sourceItem = this.getSourceDataStrategy().getSourceItemByKey(key);
            if (sourceItem) {
                // Записи бывают двух видов - ноды и листы.
                // Простой find находит первую попавшуюся композитную запись с указанным id,
                // и в ней может не быть искомого значения.
                // Используем each и промежуточный массив композитных записей, чтобы искать
                // и в нодах и в листах
                const compositeItems = [];
                const sourceParentKey = sourceItem.get(this.getParentProperty());
                this.each((compositeCollectionItem) => {
                    if (
                        !compositeCollectionItem[
                            '[Controls/expandedCompositeTree:CompositeCollectionItem]'
                        ]
                    ) {
                        return;
                    }
                    const parent = compositeCollectionItem.getParent();
                    if (parent?.key === sourceParentKey) {
                        compositeItems.push(compositeCollectionItem);
                    }
                });
                for (let i = 0; i < compositeItems.length; i++) {
                    const result = compositeItems[i].getChildrenItemByKey(key, withFilter);
                    if (result) {
                        return result;
                    }
                }
            }
        }
        return item;
    }

    getDeepIndex(item: T): number {
        if (
            !item ||
            item['[Controls/expandedCompositeTree:CompositeCollectionItem]'] ||
            item['[Controls/expandedCompositeTree:CollectionItem]']
        ) {
            return this.getIndex(item);
        }
        const parent = item.getParent();
        const type = item.isNode() === null ? 'leaves' : 'nodes';
        const relatedCompositeItem = this.find((it) => {
            return (
                it[
                    '[Controls/expandedCompositeTree:CompositeCollectionItem]'
                ] &&
                it.getParent()?.key === parent?.key &&
                it.getType() === type
            );
        });
        if (relatedCompositeItem) {
            return relatedCompositeItem.getChildIndex(item);
        }
        return -1;
    }

    protected _initializeUserStrategies() {
        super._initializeUserStrategies();
        this._userStrategies.unshift({
            strategy: PseudoParent,
            options: { display: this },
        });
        this._userStrategies.push({
            strategy: CompositeItem,
            options: {
                display: this,
                rootItemsPositionBottom: this._$rootItemsPositionBottom,
            },
        });
    }

    _initializeFilter(userFilter?: Function[]): void {
        super._initializeFilter(userFilter);

        const compositeNodesLevel = this._$compositeNodesLevel;
        this._$filter.push((contents, sourceIndex, item, collectionIndex) => {
            return (
                (item.isNode() && item.getLevel() < compositeNodesLevel) || item[`[${MODULE_NAME}]`]
            );
        });
    }

    /**
     * Получает запись композитного списка по его ребёнку
     * @param item
     * @private
     */
    private _getCompositeItemByChild(item: TreeTileCollectionItem): CompositeCollectionItem {
        const compositeItems = this._getCompositeItems();
        const parentKey = item.getParent()?.key;
        let compositeItem: CompositeCollectionItem;
        // Выбираем композитный элемент, к которому принадлежит прототип.
        if (compositeItems[parentKey]) {
            compositeItems[parentKey].forEach((it) => {
                const type = item.isNode() === null ? 'leaves' : 'nodes';
                if (it.getType() === type) {
                    compositeItem = it;
                }
            });
        }
        return compositeItem;
    }

    /**
     * Получаем список всех композитных элементов в объект key=>[composite1, composite2].
     * @private
     */
    private _getCompositeItems(): Record<CrudEntityKey, CompositeCollectionItem[]> {
        const compositeItems: Record<CrudEntityKey, CompositeCollectionItem[]> = {};
        this.each((it) => {
            if (it['[Controls/expandedCompositeTree:CompositeCollectionItem]']) {
                const parentKey = it.getParent().key;
                if (!compositeItems[parentKey]) {
                    compositeItems[parentKey] = [];
                }
                compositeItems[parentKey].push(it as CompositeCollectionItem);
            }
        });
        return compositeItems;
    }

    // region Drag-N-Drop

    getItemsDragNDrop(): boolean {
        if (this._currentCompositeItem) {
            return this._currentCompositeItem.getChildrenDragNDrop();
        }
        return this._$itemsDragNDrop;
    }

    setDraggedItems(draggableItem: T, draggedItemsKeys: CrudEntityKey[]): void {
        const currentCompositeItem = this._getCompositeItemByChild(draggableItem);
        if (currentCompositeItem) {
            this._currentCompositeItem = currentCompositeItem;
            currentCompositeItem.setDraggedItems(draggableItem, draggedItemsKeys);
        }
        super.setDraggedItems(draggableItem, draggedItemsKeys);
    }

    setDragPosition(position: IDragPosition<T>): void {
        if (this._currentCompositeItem) {
            this._currentCompositeItem.setDragPosition(position);
        }
        super.setDragPosition(position);
    }

    resetDraggedItems(): void {
        if (this._currentCompositeItem) {
            this._currentCompositeItem.resetDraggedItems();
            this._currentCompositeItem = null;
        }
        super.resetDraggedItems();
    }

    /**
     * Устанавливает признак, что запись утащили за пределы списка
     * @param outside
     */
    setDragOutsideList(outside: boolean): void {
        if (this._currentCompositeItem) {
            this._currentCompositeItem.setDragOutsideList(outside);
        }
        super.setDragOutsideList(outside);
    }

    isDragOutsideList(): boolean {
        if (this._currentCompositeItem) {
            return this._currentCompositeItem.isDragOutsideList();
        }
        return this._isDragOutsideList;
    }

    protected _getDragTargetNode(): TreeItem {
        // Выполняем поиск, т.к. позиция может смениться сразу на несколько элементов
        // и не факт, что в предыдущей позиции был targetNode
        const searchCallback = (item) => {
            return item.isDragTargetNode();
        };
        let result = this.find(searchCallback);
        if (!result && this._currentCompositeItem) {
            result = this._currentCompositeItem.findChild(searchCallback);
        }
        return result;
    }

    // endregion Drag-N-Drop

    getCompositeViewConfig(): ICompositeViewConfig {
        return this._$compositeViewConfig;
    }

    setCompositeViewConfig(compositeViewConfig: ICompositeViewConfig): void {
        if (!isEqual(this._$compositeViewConfig, compositeViewConfig)) {
            this._$compositeViewConfig = compositeViewConfig;
            this._updateItemsProperty(
                'setCompositeViewConfig',
                this._$compositeViewConfig,
                'setCompositeViewConfig'
            );
            this._nextVersion();
        }
    }

    getCompositeNodesLevel(): number {
        return this._$compositeNodesLevel;
    }

    isVisibleItem(key: CrudEntityKey): boolean {
        if (super.isVisibleItem(key)) {
            return true;
        }

        return !!this.getItems().find((item) => {
            if (!item['[Controls/expandedCompositeTree:CompositeCollectionItem]']) {
                return false;
            }

            return (item as unknown as CompositeCollectionItem).isVisibleChildrenItem(key);
        });
    }

    createRootSeparator(options: { itemModule: string }): RootSeparatorItem {
        return this.createItem({
            ...options,
            leftPadding: this._$compositeViewConfig.itemPadding?.left,
            itemModule: 'Controls/baseTree:RootSeparatorItem',
            template: 'Controls/tile:Separator',
            owner: this,
        }) as RootSeparatorItem;
    }
}

Object.assign(Collection.prototype, {
    '[Controls/expandedCompositeTree:Collection]': true,
    SupportNodeFooters: false,
    SupportNodeHeaders: false,
    _moduleName: 'Controls/expandedCompositeTree:Collection',
    _itemModule: 'Controls/expandedCompositeTree:CollectionItem',
    _$compositeViewConfig: null,
    _$compositeNodesLevel: null,
    _$rootItemsPositionBottom: true,
});
