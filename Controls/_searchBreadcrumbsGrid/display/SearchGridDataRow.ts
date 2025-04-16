/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { Model } from 'Types/entity';
import { TreeGridDataRow } from 'Controls/treeGrid';

export default class SearchGridDataRow<S extends Model = Model> extends TreeGridDataRow<S> {
    shouldDisplayExpanderBlock(): boolean {
        // Для детей хлебной крошки должен рисоваться всегда один отступ
        return !this.getParent().isRoot();
    }

    getExpanderIcon(expanderIcon?: string): string {
        return 'none';
    }
}

Object.assign(SearchGridDataRow.prototype, {
    '[Controls/searchBreadcrumbsGrid:SearchGridDataRow]': true,
    _cellModule: 'Controls/searchBreadcrumbsGrid:SearchGridDataCell',
    _moduleName: 'Controls/searchBreadcrumbsGrid:SearchGridDataRow',
    _instancePrefix: 'search-grid-row-',
    _$displayExpanderPadding: false,
});
