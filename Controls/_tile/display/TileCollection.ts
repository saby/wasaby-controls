/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */
import TileCollectionItem from './TileCollectionItem';
import { Model } from 'Types/entity';
import {
    Collection,
    CollectionItem,
    ICollectionOptions,
    ItemsFactory,
    itemsStrategy,
    IItemsStrategy,
} from 'Controls/display';
import Tile from 'Controls/_tile/display/mixins/Tile';
import { mixin } from 'Types/util';
import { IOptions as ITileItemOptions } from './mixins/TileItem';
import InvisibleStrategy from './strategies/Invisible';
import { ITileAspectOptions } from '../TileView';
import AdditionalTileStrategy from 'Controls/_tile/display/strategies/Additional';
import GroupItem from './GroupItem';

export interface ITileCollectionOptions<
    S extends Model = Model,
    T extends TileCollectionItem<S> = TileCollectionItem<S>
> extends ICollectionOptions<S, T>,
        ITileAspectOptions {}

/**
 * Плиточная коллекция
 * @private
 */
export default class TileCollection<
    S extends Model = Model,
    T extends TileCollectionItem<S> = TileCollectionItem<S>
> extends mixin<Collection, Tile>(Collection, Tile) {
    protected _invisibleStrategy: IItemsStrategy<S, T> = InvisibleStrategy;
    constructor(options: ITileCollectionOptions<S, T>) {
        super(options);
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

    protected _getItemsFactory(): ItemsFactory<T> {
        const parent = super._getItemsFactory();

        return function TileItemsFactory(options: ITileItemOptions<S>): T {
            const params = this._getItemsFactoryParams(options);
            return parent.call(this, params);
        };
    }

    protected _initializeUserStrategies(): void {
        this._supportItemsSpacing = false;
        super._initializeUserStrategies();
    }

    protected _createComposer(): itemsStrategy.Composer<S, CollectionItem<Model>> {
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

Object.assign(TileCollection.prototype, {
    '[Controls/_tile/TileCollection]': true,
    _moduleName: 'Controls/tile:TileCollection',
    _itemModule: 'Controls/tile:TileCollectionItem',
});
