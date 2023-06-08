/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import CollectionItem from './CollectionItem';
import CompositeCollectionItem, {
    MODULE_NAME,
} from './CompositeCollectionItem';
import CompositeItem from './strategy/CompositeItem';
import PseudoParent from './strategy/PseudoParent';
import {
    Tree,
    ITreeCollectionOptions,
    RootSeparatorItem,
    RootSeparatorStrategy,
} from 'Controls/baseTree';
import { Model } from 'Types/entity';
import { ITreeTileCollectionOptions } from 'Controls/_treeTile/display/TreeTileCollection';
import { TemplateFunction } from 'UI/Base';
import { isEqual } from 'Types/object';
import { CrudEntityKey } from 'Types/source';
import { IItemActionsOptions } from 'Controls/itemActions';

export interface ICompositeViewConfig
    extends ITreeTileCollectionOptions,
        IItemActionsOptions {
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

    // В композитном списке поиск записей должен осуществляться без
    // использования фильтров. Пример - отметили запись во вложенном списке.
    getItemBySourceKey(key: string | number, withFilter: boolean = false): T {
        return super.getItemBySourceKey(key, withFilter);
    }

    protected _initializeUserStrategies() {
        super._initializeUserStrategies();
        this._userStrategies.unshift({
            strategy: PseudoParent,
            options: { display: this },
        });
        this._userStrategies.push({
            strategy: CompositeItem,
            options: { display: this },
        });
        this._userStrategies.push({
            strategy: RootSeparatorStrategy,
            options: {
                display: this,
                height: 'auto',
                itemPadding: this._$compositeViewConfig.itemPadding,
            },
        });
    }

    _initializeFilter(userFilter?: Function[]): void {
        super._initializeFilter(userFilter);

        const compositeNodesLevel = this._$compositeNodesLevel;
        this._$filter.push((contents, sourceIndex, item, collectionIndex) => {
            return (
                (item.isNode() && item.getLevel() < compositeNodesLevel) ||
                item[`[${MODULE_NAME}]`]
            );
        });
    }

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
            if (
                !item[
                    '[Controls/expandedCompositeTree:CompositeCollectionItem]'
                ]
            ) {
                return false;
            }

            return (
                item as unknown as CompositeCollectionItem
            ).isVisibleChildrenItem(key);
        });
    }

    createRootSeparator(options: { itemModule: string }): RootSeparatorItem {
        return this.createItem({
            ...options,
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
});
