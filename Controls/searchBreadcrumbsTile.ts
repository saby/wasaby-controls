/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
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
