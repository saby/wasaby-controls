/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
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
import SearchView from 'Controls/_searchBreadcrumbsGrid/SearchView';
import SearchViewTable from 'Controls/_searchBreadcrumbsGrid/SearchViewTable';
import View from 'Controls/_searchBreadcrumbsGrid/Search';
import SearchGridControl from 'Controls/_searchBreadcrumbsGrid/SearchGridControl';
import * as SearchBreadcrumbsItemTemplate from 'Controls/_searchBreadcrumbsGrid/render/ItemTemplate';
import * as SearchBreadcrumbsPathComponent from 'Controls/_searchBreadcrumbsGrid/render/PathComponent';
import SearchSeparatorComponent from 'Controls/_searchBreadcrumbsGrid/render/SearchSeparatorComponent';
import TreeGridItemDecorator from 'Controls/_searchBreadcrumbsGrid/display/TreeGridItemDecorator';

export {
    View,
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
