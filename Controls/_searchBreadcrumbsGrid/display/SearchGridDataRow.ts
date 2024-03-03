/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
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
