/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { TemplateFunction } from 'UICommon/base';
import { mixin } from 'Types/util';
import { GridResultsRow } from 'Controls/baseGrid';
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

    getTemplate(): TemplateFunction | string {
        return 'Controls/treeGrid:ItemTemplate';
    }

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
