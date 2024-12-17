/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */
import { Model } from 'Types/entity';
import {
    InvisibleStrategy,
    ITreeTileCollectionOptions,
    TreeTileCollection,
    TreeTileCollectionItem,
} from 'Controls/treeTile';
import { itemsStrategy } from 'Controls/display';
import {
    SearchStrategy,
    RootSeparatorStrategy,
    TreeItem,
    RootSeparatorItem,
} from 'Controls/baseTree';
import { TSearchNavigationMode } from 'Controls/interface';

export class SearchTileCollection<
    S extends Model = Model,
    T extends TreeTileCollectionItem = TreeTileCollectionItem
> extends TreeTileCollection {
    protected _$dedicatedItemProperty: string;

    protected _$searchNavigationMode: TSearchNavigationMode;

    protected _$containerWidth: number;

    constructor(options: ITreeTileCollectionOptions<S, T>) {
        options.addButtonVisible = false;
        super(options);
    }

    protected _createComposer(): itemsStrategy.Composer<S, TreeItem<Model>> {
        const composer = super._createComposer();

        composer.prepend(
            SearchStrategy,
            {
                display: this,
                dedicatedItemProperty: this._$dedicatedItemProperty,
                treeItemDecoratorModule: 'Controls/searchBreadcrumbsTile:TreeItemDecorator',
            },
            InvisibleStrategy
        );
        composer.prepend(
            RootSeparatorStrategy,
            {
                display: this,
            },
            InvisibleStrategy
        );

        return composer;
    }

    getContainerWidth(): number {
        return this._$containerWidth;
    }

    setContainerWidth(containerWidth: number): void {
        if (this._$containerWidth === containerWidth || containerWidth === undefined) {
            return;
        }
        this._$containerWidth = containerWidth;
        this._nextVersion();
        this._updateItemsProperty('setContainerWidth', this._$containerWidth, 'setContainerWidth');
    }

    createBreadcrumbsItem(options: { itemModule: string }): TreeTileCollectionItem {
        options.itemModule = 'Controls/searchBreadcrumbsTile:SearchBreadcrumbsTileItem';
        return this.createItem({
            ...options,
            containerWidth: this._$containerWidth,
            isReadonly: this._$searchNavigationMode === 'readonly',
            owner: this,
        }) as TreeTileCollectionItem;
    }

    createRootSeparator(options: { itemModule: string }): RootSeparatorItem {
        return this.createItem({
            ...options,
            template: 'Controls/tile:Separator',
            owner: this,
        }) as RootSeparatorItem;
    }
}

Object.assign(SearchTileCollection.prototype, {
    '[Controls/searchBreadcrumbsTile:SearchTileCollection]': true,
    _moduleName: 'Controls/searchBreadcrumbsTile:SearchTileCollection',
    _itemModule: 'Controls/treeTile:TreeTileCollectionItem',
    _$dedicatedItemProperty: '',
    _$searchNavigationMode: 'open',
    _$containerWidth: null,
});
