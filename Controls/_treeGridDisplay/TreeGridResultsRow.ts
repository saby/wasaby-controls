/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { mixin } from 'Types/util';
import { GridResultsRow } from 'Controls/gridDisplay';
import TreeGridDataRow from './TreeGridDataRow';

/**
 * Строка заголовка иерархической таблицы
 * @private
 */
export default class TreeGridResultsRow extends mixin<TreeGridDataRow, GridResultsRow>(
    TreeGridDataRow,
    GridResultsRow
) {
    readonly listElementName: string = 'results';

    isNode(): boolean | null {
        return null;
    }

    getWithoutExpanderPadding(withoutExpanderPadding: boolean): boolean {
        if (withoutExpanderPadding !== undefined || this._$resultsPosition !== 'top') {
            return withoutExpanderPadding;
        }
        // Убираем отступ под экспандер для колонки, у которой в итогах есть хлебная крошка.
        return (
            this._$columnsConfig[0].breadcrumbsOptions?.withoutBreadcrumbs ||
            this._$columnsConfig[0].breadcrumbsOptions?.withoutBackButton
        );
    }
}

Object.assign(TreeGridResultsRow.prototype, {
    'Controls/treeGrid:TreeGridResultsRow': true,
    _moduleName: 'Controls/treeGrid:TreeGridResultsRow',
    _instancePrefix: 'tree-grid-results-row-',
    _cellModule: 'Controls/grid:GridResultsCell',
    _$displayExpanderPadding: true,
    _$expanderSize: 'default',
});
