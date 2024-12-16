/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */
import { Model } from 'Types/entity';
import { mixin } from 'Types/util';
import {
    ITileCollectionOptions,
    TileMixin,
    GroupItem,
    AdditionalTileStrategy,
} from 'Controls/tile';
import TreeTileCollectionItem, { ITreeTileCollectionItemOptions } from './TreeTileCollectionItem';
import { ItemsFactory, itemsStrategy, IItemsStrategy } from 'Controls/display';
import { ITreeOptions, Tree, TreeItem } from 'Controls/baseTree';
import InvisibleStrategy from './strategy/Invisible';

/**
 * Проверяет видимость элементов коллекции.
 * Элемент виден если это корневой элемент, запись группы или крошек, или дочерний элемент относительно крошек.
 * @param {TreeItem} item
 */
function itemIsVisible(item: TreeItem): boolean {
    if (
        item['[Controls/_display/GroupItem]'] ||
        item['[Controls/_baseTree/BreadcrumbsItem]'] ||
        item['[Controls/_tile/AdditionalTileItem]']
    ) {
        return true;
    }

    const parent = item.getParent();
    return !parent || parent['[Controls/_baseTree/BreadcrumbsItem]'] || parent.isRoot();
}

export interface ITreeTileCollectionOptions<
    S extends Model = Model,
    T extends TreeTileCollectionItem<S> = TreeTileCollectionItem<S>
> extends ITreeOptions<S, T>,
        ITileCollectionOptions<S, T>,
        ITreeTileAspectOptions {}

export interface ITreeTileAspectOptions {
    nodesHeight: number;
    folderWidth: number;
}

/**
 * Коллекция, которая отображает элементы в виде иерархической плитки.
 * @private
 */
export default class TreeTileCollection<
    S extends Model = Model,
    T extends TreeTileCollectionItem = TreeTileCollectionItem
> extends mixin<Tree, TileMixin>(Tree, TileMixin) {
    protected _$nodesHeight: number;

    protected _$folderWidth: number;

    readonly SupportExpand: boolean = false;
    protected _invisibleStrategy: IItemsStrategy<S, T> = InvisibleStrategy;

    constructor(options: ITreeTileCollectionOptions<S, T>) {
        super(options);

        // TODO должно быть в Tree. Перенести туда, когда полностью перейдем на новые коллекции.
        //  Если сразу в Tree положим, то все разломаем
        this.addFilter((contents, sourceIndex, item) => {
            return itemIsVisible(item);
        });
    }

    setActiveItem(item: T): void {
        if (!item) {
            this.setHoveredItem(null);
        }
        super.setActiveItem(item);
    }

    protected _getGroupItemConstructor(): new () => GroupItem<T> {
        return GroupItem;
    }

    getNodesHeight(): number {
        return this._$nodesHeight;
    }

    setNodesHeight(nodesHeight: number): void {
        if (this._$nodesHeight !== nodesHeight) {
            this._$nodesHeight = nodesHeight;
            this._updateItemsProperty('setNodesHeight', this._$nodesHeight, 'setNodesHeight');
            this._nextVersion();
        }
    }

    getFolderWidth(): number {
        return this._$folderWidth;
    }

    setFolderWidth(folderWidth: number): void {
        if (this._$folderWidth !== folderWidth) {
            this._$folderWidth = folderWidth;
            this._updateItemsProperty('setFolderWidth', this._$folderWidth, 'setFolderWidth');
            this._nextVersion();
        }
    }

    getExpanderIcon(): string {
        return 'none';
    }

    protected _getChildrenArray(parent: T, withFilter?: boolean): T[] {
        // фильтруем невидимые элементы, т.к. они нужны только для отрисовки, обрабатывать их никак не нужно
        const childrenArray = super._getChildrenArray(parent, withFilter);
        return childrenArray.filter((it) => {
            return !it['[Controls/_tile/display/mixins/InvisibleItem]'];
        }) as T[];
    }

    protected _getItemsFactory(): ItemsFactory<T> {
        const parent = super._getItemsFactory();

        return function TileItemsFactory(options: ITreeTileCollectionItemOptions): T {
            const params = this._getItemsFactoryParams(options);
            return parent.call(this, params);
        };
    }

    protected _getItemsFactoryParams(params: any): any {
        super._getItemsFactoryParams(params);

        params.nodesHeight = this.getNodesHeight();
        params.folderWidth = this.getFolderWidth();
        return params;
    }

    protected _initializeUserStrategies(): void {
        this._supportItemsSpacing = false;
        super._initializeUserStrategies();
    }

    protected _createComposer(): itemsStrategy.Composer<S, TreeItem<Model>> {
        if (this._$beforeItemsTemplate || this._$afterItemsTemplate) {
            this._userStrategies.push({
                strategy: AdditionalTileStrategy,
                options: {
                    display: this,
                    usingCustomItemTemplates: this._$usingCustomItemTemplates,
                    itemModule: 'Controls/tile:AdditionalTileItem',
                    beforeItemsTemplate: this._$beforeItemsTemplate,
                    afterItemsTemplate: this._$afterItemsTemplate,
                },
            });
        }

        // Не поддерживаем группировку в горизонтальной плитке
        if (this._$orientation === 'horizontal') {
            this._disableSupportsGrouping = true;
            this._$group = null;
        }

        const composer = super._createComposer();

        if (this._$orientation === 'vertical') {
            composer.append(InvisibleStrategy, {
                display: this,
            });
        }

        return composer;
    }
}

Object.assign(TreeTileCollection.prototype, {
    '[Controls/_treeTile/TreeTileCollection]': true,
    SupportNodeFooters: false,
    SupportNodeHeaders: false,
    _moduleName: 'Controls/treeTile:TreeTileCollection',
    _itemModule: 'Controls/treeTile:TreeTileCollectionItem',
    _$nodesHeight: null,
    _$folderWidth: null,
});
