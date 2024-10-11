/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
/**
 * Библиотека списка, отображаемого в режиме поиска в иерархическом проводнике.
 * @library
 * @public
 * @includes SearchBreadcrumbsItemTemplate Controls/_searchBreadcrumbsGrid/render/ItemTemplate
 */
import { register } from 'Types/di';
import SearchGridCollection from 'Controls/_searchBreadcrumbsGrid/display/SearchGridCollection';
import SearchGridDataRow from 'Controls/_searchBreadcrumbsGrid/display/SearchGridDataRow';
import SearchGridDataCell from 'Controls/_searchBreadcrumbsGrid/display/SearchGridDataCell';
import BreadcrumbsItemRow from 'Controls/_searchBreadcrumbsGrid/display/BreadcrumbsItemRow';
import BreadcrumbsItemCell from 'Controls/_searchBreadcrumbsGrid/display/BreadcrumbsItemCell';
import SearchSeparatorRow from 'Controls/_searchBreadcrumbsGrid/display/SearchSeparatorRow';
import SearchSeparatorCell from 'Controls/_searchBreadcrumbsGrid/display/SearchSeparatorCell';

import {
    ReactSearchBreadcrumbsTreeGridView as SearchView,
    ReactSearchBreadcrumbsTreeGridView as SearchViewTable,
} from 'Controls/_searchBreadcrumbsGrid/view/View';

import { ReactSearchBreadcrumbsTreeGridView } from 'Controls/_searchBreadcrumbsGrid/view/View';
import SearchGridControl from 'Controls/_searchBreadcrumbsGrid/SearchGridControl';
import { default as SearchBreadcrumbsItemTemplate } from 'Controls/_searchBreadcrumbsGrid/compatibleLayer/SearchBreadcrumbsCellComponent';
import { default as SearchBreadcrumbsPathComponent } from 'Controls/_searchBreadcrumbsGrid/cleanRender/PathComponent';
import { SearchSeparatorComponent } from 'Controls/_searchBreadcrumbsGrid/cleanRender/cell/SearchSeparatorCellComponent';
import TreeGridItemDecorator from 'Controls/_searchBreadcrumbsGrid/display/TreeGridItemDecorator';

// OLD RENDER
import View from 'Controls/_searchBreadcrumbsGrid/Search';

export {
    View,
    ReactSearchBreadcrumbsTreeGridView,
    SearchGridControl,
    SearchView,
    SearchViewTable,
    SearchGridCollection,
    BreadcrumbsItemRow,
    SearchSeparatorRow,
    SearchBreadcrumbsPathComponent,
    SearchBreadcrumbsItemTemplate,
    SearchSeparatorComponent,
    SearchSeparatorComponent as SearchSeparatorTemplate,
};

register('Controls/searchBreadcrumbsGrid:SearchGridCollection', SearchGridCollection, {
    instantiate: false,
});
register('Controls/searchBreadcrumbsGrid:SearchGridDataRow', SearchGridDataRow, {
    instantiate: false,
});
register('Controls/searchBreadcrumbsGrid:SearchGridDataCell', SearchGridDataCell, {
    instantiate: false,
});
register('Controls/searchBreadcrumbsGrid:BreadcrumbsItemRow', BreadcrumbsItemRow, {
    instantiate: false,
});
register('Controls/searchBreadcrumbsGrid:BreadcrumbsItemCell', BreadcrumbsItemCell, {
    instantiate: false,
});
register('Controls/searchBreadcrumbsGrid:SearchSeparatorRow', SearchSeparatorRow, {
    instantiate: false,
});
register('Controls/searchBreadcrumbsGrid:SearchSeparatorCell', SearchSeparatorCell, {
    instantiate: false,
});
register('Controls/searchBreadcrumbsGrid:TreeGridItemDecorator', TreeGridItemDecorator, {
    instantiate: false,
});
