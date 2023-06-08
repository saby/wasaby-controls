/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import TreeGridDataCell from './TreeGridDataCell';
import {
    COLUMN_SCROLL_JS_SELECTORS,
    DRAG_SCROLL_JS_SELECTORS,
} from 'Controls/columnScroll';
import { TemplateFunction } from 'UI/Base';
import TreeGridNodeExtraRow from './TreeGridNodeExtraRow';

/**
 * Ячейка дополнительного элемента узла в иерархической таблице
 * @private
 */
export default class TreeGridNodeExtraItemCell extends TreeGridDataCell<null> {
    readonly '[Controls/treeGrid:TreeGridNodeExtraItemCell]': boolean;

    readonly listInstanceName: string = 'controls-TreeGrid__node-extra-item';

    readonly listElementName: string = 'cell';

    getTemplate(): TemplateFunction | string {
        return this._$column.template;
    }

    isMoreButton(): boolean {
        return !!(this.getOwner() as TreeGridNodeExtraRow).needMoreButton();
    }

    shouldRenderHasMoreButton(): boolean {
        // Первая колонка учитывая застиканную лесенку и множественный выбор
        const isFirstColumn =
            this.getColumnIndex(false, false) ===
            +this._$owner.hasMultiSelectColumn();
        return this.isMoreButton() && isFirstColumn;
    }

    isFirstColumn(): boolean {
        return this.getColumnIndex(false, false) === 0;
    }

    getWrapperClasses(): string {
        let classes = `controls-TreeGrid__node-extraItem__wrapper ${this._getColumnSeparatorClasses()}`;
        if (this._$owner.hasNewColumnScroll()) {
            classes += ` ${DRAG_SCROLL_JS_SELECTORS.NOT_DRAG_SCROLLABLE}`;
        } else if (this._$owner.hasColumnScroll()) {
            classes += ` ${this._getColumnScrollWrapperClasses()} controls-TreeGrid__node-extraItem__fixed`;
        }
        return classes;
    }

    getContentClasses(params: { hasContent: boolean }): string {
        const rowSeparatorSize = this._$owner.getRowSeparatorSize();

        let classes = `controls-TreeGrid__nodeExtraItemContent_rowSeparatorSize-${rowSeparatorSize}`;

        if (!(this._$owner.hasMultiSelectColumn() && this.isFirstColumn())) {
            classes +=
                ' controls-TreeGrid__nodeExtraItem-cell__content controls-TreeGrid__nodeExtraItemContent';
        } else {
            classes += ` controls-Grid__row-cell-checkbox-${this.getStyle()}`;
        }

        if (params.hasContent || this.isMoreButton()) {
            classes += ' controls-TreeGrid__nodeExtraItem-cell_withContent';

            if (this.getOwner().isFullGridSupport()) {
                classes += ' controls-TreeGrid__nodeExtraItemContent__baseline';
            }
        }

        if (!this._$owner.hasMultiSelectColumn() && this.isFirstColumn()) {
            classes += ` controls-TreeGrid__nodeExtraItemContent_spacingLeft-${this._$owner.getLeftPadding()}`;
        }

        if (this.isLastColumn()) {
            classes += ` controls-TreeGrid__nodeExtraItemContent_spacingRight-${this._$owner.getRightPadding()}`;
        }

        return classes;
    }

    getRelativeCellWrapperClasses(): string {
        let classes = super.getRelativeCellWrapperClasses();

        if (this.isMoreButton()) {
            classes += ' controls-TreeGrid__nodeExtraItemContent__baseline';
        }

        return classes;
    }
}

Object.assign(TreeGridNodeExtraItemCell.prototype, {
    '[Controls/treeGrid:TreeGridNodeExtraItemCell]': true,
    _moduleName: 'Controls/treeGrid:TreeGridNodeExtraItemCell',
    _instancePrefix: 'tree-grid-node-extra-item-cell-',
});
