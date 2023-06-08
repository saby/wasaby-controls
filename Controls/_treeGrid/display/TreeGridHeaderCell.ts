/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { GridHeaderCell, IGridHeaderCellOptions } from 'Controls/grid';

export interface ITreeGridHeaderCellOptions extends IGridHeaderCellOptions {
    displayExpanderPadding?: boolean;
    expanderSize?: string;
}

/**
 * Ячейка строки заголовка иерархической таблицы
 * @private
 */
export default class TreeGridHeaderCell extends GridHeaderCell<null> {
    /**
     * Признак, означающий что нужно рисовать отступ вместо экспандеров
     * @protected
     */
    protected _$displayExpanderPadding: boolean;

    /**
     * Размер экспандера
     */
    protected _$expanderSize: string;

    readonly listInstanceName: string = 'controls-TreeGrid__header';

    readonly listElementName: string = 'cell';

    // region DisplayExpanderPadding

    setDisplayExpanderPadding(displayExpanderPadding: boolean): void {
        if (this._$displayExpanderPadding !== displayExpanderPadding) {
            this._$displayExpanderPadding = displayExpanderPadding;
            this._nextVersion();
        }
    }

    // endregion DisplayExpanderPadding

    getContentClasses(): string {
        let result = super.getContentClasses();

        // Отступ поэ экспандер добавляется для первой колонки, если нет MultiSelect,
        // И для второй колонки, если есть multiSelect
        if (
            ((this.isFirstColumn() && !this.isMultiSelectColumn()) ||
                (this.getColumnIndex() === 1 && this._$owner.hasMultiSelectColumn())) &&
            this._$displayExpanderPadding &&
            !(
                this._$column.isBreadCrumbs ||
                this._$column.templateOptions?.withoutBackButton === false ||
                this._$column.templateOptions?.withoutBreadcrumbs === false
            )
        ) {
            const expanderSize = this._$expanderSize || 'default';
            result += ` controls-TreeView__expanderPadding-${expanderSize}`;
        }

        return result;
    }
}

Object.assign(TreeGridHeaderCell.prototype, {
    'Controls/treeGrid:TreeGridHeaderCell': true,
    _moduleName: 'Controls/treeGrid:TreeGridHeaderCell',
    _instancePrefix: 'tree-grid-header-cell-',
    _$displayExpanderPadding: true,
    _$expanderSize: 'default',
});
