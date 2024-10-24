/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import TreeGridDataCell from './TreeGridDataCell';
import { TemplateFunction } from 'UI/Base';
import TreeGridNodeExtraRow from './TreeGridNodeExtraRow';
import type { ICellComponentProps, IRowComponentProps } from 'Controls/gridReact';

/**
 * Ячейка дополнительного элемента узла в иерархической таблице
 * @private
 */
export default class TreeGridNodeExtraItemCell extends TreeGridDataCell<null> {
    readonly '[Controls/treeGrid:TreeGridNodeExtraItemCell]': boolean;

    readonly listInstanceName: string = 'controls-TreeGrid__node-extra-item';

    readonly listElementName: string = 'cell';

    isMoreButton(): boolean {
        return !!(this.getOwner() as TreeGridNodeExtraRow).shouldDisplayMoreButton();
    }

    shouldRenderHasMoreButton(): boolean {
        // Первая колонка учитывая застиканную лесенку и множественный выбор
        const isFirstColumn =
            this.getColumnIndex(false, false) === +this._$owner.hasMultiSelectColumn();
        return this.isMoreButton() && isFirstColumn;
    }

    isFirstColumn(): boolean {
        return this.getColumnIndex(false, false) === 0;
    }

    shouldDisplayEditArrow(): boolean {
        return false;
    }
}

Object.assign(TreeGridNodeExtraItemCell.prototype, {
    '[Controls/treeGrid:TreeGridNodeExtraItemCell]': true,
    _moduleName: 'Controls/treeGrid:TreeGridNodeExtraItemCell',
    _instancePrefix: 'tree-grid-node-extra-item-cell-',
});
