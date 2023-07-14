/**
 * @kaizen_zone a366fb75-0c89-4edd-9ba7-43558b9859ce
 */
/**
 * Библиотека контролов, которые реализуют иерархический список, отображающийся в виде плитки.
 * @library Controls/treeTile
 * @includes ITreeTile Controls/_treeTile/interface/ITreeTile
 * @includes FolderTemplate Controls/_treeTile/interface/FolderTemplate
 * @public
 */

import View from 'Controls/_treeTile/View';
import TreeTileView, {
    ITreeTileOptions as ITreeTileViewOptions,
} from 'Controls/_treeTile/TreeTileView';
import TreeTileCollection, {
    ITreeTileCollectionOptions,
} from 'Controls/_treeTile/display/TreeTileCollection';
import TreeTileCollectionItem from 'Controls/_treeTile/display/TreeTileCollectionItem';
import InvisibleTreeTileItem from 'Controls/_treeTile/display/InvisibleTreeTileItem';
import { default as ItemsView } from 'Controls/_treeTile/ItemsView';
import { register } from 'Types/di';
import { default as FolderTemplate } from 'Controls/_treeTile/render/Folder';
import TreeTileItemActions from 'Controls/_treeTile/itemActions/Control';
import { default as InvisibleStrategy } from './_treeTile/display/strategy/Invisible';
import { HorizontalTileScrollController } from 'Controls/tile';

export {
    View,
    ItemsView,
    TreeTileView,
    FolderTemplate,
    TreeTileItemActions,
    TreeTileCollection,
    TreeTileCollectionItem,
    ITreeTileCollectionOptions,
    InvisibleStrategy,
    ITreeTileViewOptions,
    HorizontalTileScrollController,
};

register('Controls/treeTile:TreeTileCollection', TreeTileCollection, {
    instantiate: false,
});
register('Controls/treeTile:TreeTileCollectionItem', TreeTileCollectionItem, {
    instantiate: false,
});
register('Controls/treeTile:InvisibleTreeTileItem', InvisibleTreeTileItem, {
    instantiate: false,
});
