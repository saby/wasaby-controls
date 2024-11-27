/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */
import { ITileOptions, TileView } from 'Controls/tile';
import TreeTileCollectionItem from 'Controls/_treeTile/display/TreeTileCollectionItem';
import { SyntheticEvent } from 'UI/Vdom';
import TreeTileCollection from './display/TreeTileCollection';

export interface ITreeTileOptions extends ITileOptions {
    folderWidth: number;
}
/**
 * Представление иерархичекого плиточного контрола
 * @private
 */
export default class TreeTileView extends TileView {
    protected _listModel: TreeTileCollection;
    protected _options: ITreeTileOptions;
    protected _beforeUpdate(newOptions: ITreeTileOptions): void {
        super._beforeUpdate(newOptions);

        if (this._options.folderWidth !== newOptions.folderWidth) {
            this._listModel.setFolderWidth(newOptions.folderWidth);
        }
    }
    protected _notifyUpdateActions(item: TreeTileCollectionItem, event: SyntheticEvent): void {
        let itemWidth;
        if (item && this._options.actionMode === 'adaptive' && !!event) {
            // У папок адаптивное отображение операций над записью не поддерживается
            if (!item.isNode()) {
                itemWidth = this._calcTileItemWidth(event.target as HTMLElement);
            }
            this._notify('updateItemActionsOnItem', [item.getContents().getKey(), itemWidth], {
                bubbling: true,
            });
        }
    }
}
