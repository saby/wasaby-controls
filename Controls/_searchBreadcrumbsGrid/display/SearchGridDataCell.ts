/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { Model } from 'Types/entity';
import { TreeGridDataCell } from 'Controls/treeGrid';

export default class SearchGridDataCell<
    S extends Model
> extends TreeGridDataCell<S> {}

Object.assign(SearchGridDataCell.prototype, {
    '[Controls/searchBreadcrumbsGrid:SearchGridDataCell]': true,
    _moduleName: 'Controls/searchBreadcrumbsGrid:SearchGridDataCell',
    _instancePrefix: 'search-grid-data-cell-',
});
