/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { TemplateFunction } from 'UICommon/base';
import { mixin } from 'Types/util';
import { GridFooterRow } from 'Controls/gridDisplay';
import { TSize } from 'Controls/interface';
import TreeGridDataRow from './TreeGridDataRow';

/**
 * Строка футера иерархической коллекции
 * @private
 */
export default class TreeGridFooterRow extends mixin<TreeGridDataRow, GridFooterRow>(
    TreeGridDataRow,
    GridFooterRow
) {
    readonly listElementName: string = 'footer';

    getTemplate(): TemplateFunction | string {
        return 'Controls/treeGrid:ItemTemplate';
    }

    setGridColumnsConfig(columns) {
        this._$gridColumnsConfig = columns;
        this._reinitializeColumns(true);
    }

    isNode(): boolean | null {
        return null;
    }

    getWithoutExpanderPadding(withoutExpanderPadding: boolean): boolean {
        return withoutExpanderPadding;
    }
}

Object.assign(TreeGridFooterRow.prototype, {
    '[Controls/treeGrid:TreeGridFooterRow]': true,
    _moduleName: 'Controls/treeGrid:TreeGridFooterRow',
    _instancePrefix: 'tree-grid-footer-row-',
    _cellModule: 'Controls/grid:GridFooterCell',
    _$displayExpanderPadding: true,
});
