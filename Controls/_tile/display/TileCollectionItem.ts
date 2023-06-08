/**
 * @kaizen_zone a366fb75-0c89-4edd-9ba7-43558b9859ce
 */
import { CollectionItem, ICollectionItemOptions } from 'Controls/display';
import { Model } from 'Types/entity';
import { mixin } from 'Types/util';
import TileItem from 'Controls/_tile/display/mixins/TileItem';
import { ITileAspectOptions } from '../TileView';

export interface ITileCollectionItemOptions
    extends ICollectionItemOptions,
        ITileAspectOptions {}

/**
 * Элемент плиточной коллекции
 * @extends Controls/display:CollectionItem
 * @mixes Controls/_tile/display/mixins/TileItem
 * @private
 */
export default class TileCollectionItem<T extends Model = Model> extends mixin<
    CollectionItem,
    TileItem
>(CollectionItem, TileItem) {
    readonly listInstanceName: string = 'controls-Tile';

    readonly listElementName: string = 'item';

    setActive(active: boolean, silent?: boolean): void {
        // TODO This is copied from TileViewModel, but there must be a better
        // place for it. For example, somewhere in ItemActions container
        if (!active && this.isActive() && this.isHovered()) {
            this.getOwner().setHoveredItem(null);
        }
        super.setActive(active, silent);
    }

    setHovered(hovered: boolean, silent?: boolean): void {
        if (!hovered && this.isHovered() && this.SupportItemActions) {
            this.setCanShowActions(false);
        }
        super.setHovered(hovered, silent);
    }

    getMultiSelectClasses(): string {
        let classes = this._getMultiSelectBaseClasses();
        classes +=
            ' controls-TileView__checkbox controls-TileView__checkbox_top js-controls-TileView__withoutZoom';

        return classes;
    }
}

Object.assign(TileCollectionItem.prototype, {
    '[Controls/_tile/TileCollectionItem]': true,
    _moduleName: 'Controls/tile:TileCollectionItem',
    _instancePrefix: 'tile-item-',
});
