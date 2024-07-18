/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { TemplateFunction } from 'UI/Base';
import TreeGridNodeExtraItemCell from './TreeGridNodeExtraItemCell';

/**
 * Ячейка футера узла в иерархической таблице
 * @private
 */
export default class TreeGridNodeFooterCell extends TreeGridNodeExtraItemCell {
    readonly '[Controls/treeGrid:TreeGridNodeExtraItemCell]': boolean;

    readonly listInstanceName: string = 'controls-TreeGrid__node-footer';

    readonly listElementName: string = 'cell';

    getTemplate(): TemplateFunction | string {
        const hasRowTemplate = this._$isSingleColspanedCell && !!this._$owner.getRowTemplate();
        const customTemplate = hasRowTemplate
            ? this._$owner.getRowTemplate()
            : this._$column?.nodeHeaderTemplate;
        return customTemplate || 'Controls/treeGrid:NodeHeaderTemplate';
    }
}

Object.assign(TreeGridNodeFooterCell.prototype, {
    '[Controls/treeGrid:TreeGridNodeHeaderCell]': true,
    _moduleName: 'Controls/treeGrid:TreeGridNodeHeaderCell',
    _instancePrefix: 'tree-grid-node-footer-cell-',
});
