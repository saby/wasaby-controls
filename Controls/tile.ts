/**
 * @kaizen_zone a366fb75-0c89-4edd-9ba7-43558b9859ce
 */
/**
 * Библиотека контролов, которые реализуют список, отображающийся в виде плитки.
 * @library
 * @includes IBaseItemTemplate Controls/_tile/interface/IBaseItemTemplate
 * @includes ItemTemplate Controls/_tile/interface/ItemTemplate
 * @includes MediumTemplate Controls/_tile/interface/IMediumTemplate
 * @includes ITile Controls/_tile/interface/ITile
 * @includes SmallItemTemplate Controls/_tile/interface/ISmallTemplate
 * @includes PreviewTemplate Controls/_tile/interface/IPreviewTemplate
 * @includes RichTemplate Controls/_tile/interface/IRichTemplate
 * @includes AdditionalTemplate Controls/_tile/interface/AdditionalTemplate
 * @public
 */

import { register } from 'Types/di';

import { default as View } from 'Controls/_tile/View';
import { default as ItemTemplate } from 'Controls/_tile/render/items/DefaultWrapper';
import { default as SmallItemTemplate } from 'Controls/_tile/render/items/Small';
import { default as MediumTemplate } from 'Controls/_tile/render/items/Medium';
import { default as PreviewTemplate } from 'Controls/_tile/render/items/Preview';
import { default as RichTemplate } from 'Controls/_tile/render/items/Rich';
import AdditionalItemTemplate from 'Controls/_tile/render/items/Additional';
import InvisibleItemTemplate from 'Controls/_tile/render/items/Invisible';

import { default as ActionsMenu } from 'Controls/_tile/itemActions/Menu';
import {
    getImageUrl,
    getImageSize,
    getImageClasses,
    getImageRestrictions,
    getItemSize,
} from 'Controls/_tile/utils/imageUtil';

import TileCollection, {
    ITileCollectionOptions,
} from 'Controls/_tile/display/TileCollection';
import TileCollectionItem, {
    ITileCollectionItemOptions,
} from 'Controls/_tile/display/TileCollectionItem';
import InvisibleTileItem from 'Controls/_tile/display/InvisibleTileItem';
import GroupItem from 'Controls/_tile/display/GroupItem';
import AdditionalTileItem, {
    IAdditionalTileItemOptions,
    TAdditionalContentSize,
} from 'Controls/_tile/display/AdditionalTileItem';
import Tile from 'Controls/_tile/display/mixins/Tile';
import TileItem, {
    ITileItemProps,
} from 'Controls/_tile/display/mixins/TileItem';
import InvisibleStrategy, {
    COUNT_INVISIBLE_ITEMS,
} from 'Controls/_tile/display/strategies/Invisible';
import AdditionalTileStrategy from 'Controls/_tile/display/strategies/Additional';
import TileView from 'Controls/_tile/TileView';
import { ITileOptions } from 'Controls/_tile/TileView';
import ItemsView from 'Controls/_tile/ItemsView';
import Scroller from 'Controls/_tile/Scroller';
import InvisibleItem from 'Controls/_tile/display/mixins/InvisibleItem';
import TileItemActions, {
    ITileItemActionsOptions,
} from 'Controls/_tile/itemActions/Control';
import { ImageComponent } from 'Controls/_tile/render/itemComponents/Image';
import Separator from 'Controls/_tile/render/itemComponents/Separator';
import { HorizontalTileScrollController } from 'Controls/baseTile';

export {
    View,
    ItemsView,
    TileView,
    ItemTemplate,
    SmallItemTemplate,
    MediumTemplate,
    PreviewTemplate,
    RichTemplate,
    AdditionalItemTemplate,
    InvisibleItemTemplate,
    ActionsMenu,
    TileCollection,
    ITileCollectionOptions,
    TileCollectionItem,
    ITileCollectionItemOptions,
    Tile as TileMixin,
    TileItem as TileItemMixin,
    InvisibleItem,
    InvisibleTileItem,
    InvisibleStrategy,
    AdditionalTileStrategy,
    AdditionalTileItem,
    IAdditionalTileItemOptions,
    TAdditionalContentSize,
    GroupItem,
    COUNT_INVISIBLE_ITEMS,
    TileItemActions,
    ITileItemActionsOptions,
    ITileOptions,
    getImageUrl,
    getImageSize,
    getImageClasses,
    getImageRestrictions,
    getItemSize,
    ITileItemProps,
    ImageComponent,
    Separator,
    Scroller,
    HorizontalTileScrollController,
};

export { TImagePosition } from 'Controls/_tile/interface/IRichTemplate';

export {
    TTileItem,
    TActionMode,
    TGradientType,
    TTitlePosition,
    TContentPosition,
    TImageViewMode,
    TShadowVisibility,
    TTitleStyle,
} from 'Controls/_tile/display/mixins/TileItem';

register('Controls/tile:TileCollection', TileCollection, {
    instantiate: false,
});
register('Controls/tile:TileCollectionItem', TileCollectionItem, {
    instantiate: false,
});
register('Controls/tile:InvisibleTileItem', InvisibleTileItem, {
    instantiate: false,
});
register('Controls/tile:AdditionalTileItem', AdditionalTileItem, {
    instantiate: false,
});
register('Controls/tile:GroupItem', GroupItem, { instantiate: false });
