/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
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
                treeItemDecoratorModule:
                    'Controls/searchBreadcrumbsTile:TreeItemDecorator',
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

    createBreadcrumbsItem(options: {
        itemModule: string;
    }): TreeTileCollectionItem {
        options.itemModule =
            'Controls/searchBreadcrumbsTile:SearchBreadcrumbsTileItem';
        return this.createItem({
            ...options,
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
});
