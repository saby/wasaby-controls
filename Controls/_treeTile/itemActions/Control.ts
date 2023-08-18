/**
 * @kaizen_zone a366fb75-0c89-4edd-9ba7-43558b9859ce
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
