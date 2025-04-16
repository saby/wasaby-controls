/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */
import { ITileItemActionsOptions, TileItemActions } from 'Controls/tile';
import TreeTileCollectionItem from 'Controls/_treeTile/display/TreeTileCollectionItem';

export default class TreeTileItemActions<
    TItem extends TreeTileCollectionItem = TreeTileCollectionItem
> extends TileItemActions<TreeTileCollectionItem> {
    protected _canShowActions: boolean = false;

    protected _beforeMount(options: ITileItemActionsOptions<TItem>): void {
        super._beforeMount(options);
        this._canShowActions = this._item.isNode();
    }
}
