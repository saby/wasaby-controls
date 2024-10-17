/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */
/**
 * @library
 * @private
 */

import { register } from 'Types/di';
import { TreeItemDecorator } from 'Controls/_searchBreadcrumbsTile/display/TreeItemDecorator';
import { SearchTileCollection } from 'Controls/_searchBreadcrumbsTile/display/SearchTileCollection';
import { SearchBreadcrumbsTileItem } from 'Controls/_searchBreadcrumbsTile/display/SearchBreadcrumbsTileItem';

import * as BreadcrumbsTileItemTemplate from 'wml!Controls/_searchBreadcrumbsTile/render/BreadcrumbsItem';

export { SearchTileCollection };
export { BreadcrumbsTileItemTemplate };
export { default as View } from './_searchBreadcrumbsTile/Search';

register('Controls/searchBreadcrumbsTile:TreeItemDecorator', TreeItemDecorator, {
    instantiate: false,
});
register('Controls/searchBreadcrumbsTile:SearchTileCollection', SearchTileCollection, {
    instantiate: false,
});
register('Controls/searchBreadcrumbsTile:SearchBreadcrumbsTileItem', SearchBreadcrumbsTileItem, {
    instantiate: false,
});
