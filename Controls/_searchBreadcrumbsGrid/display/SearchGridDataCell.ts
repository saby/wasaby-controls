/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { Model } from 'Types/entity';
import { TreeGridDataCell } from 'Controls/treeGrid';

export default class SearchGridDataCell<S extends Model> extends TreeGridDataCell<S> {}

Object.assign(SearchGridDataCell.prototype, {
    '[Controls/searchBreadcrumbsGrid:SearchGridDataCell]': true,
    _moduleName: 'Controls/searchBreadcrumbsGrid:SearchGridDataCell',
    _instancePrefix: 'search-grid-data-cell-',
});
