/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { GridHeaderRow, IGridHeaderCellOptions } from 'Controls/grid';
import TreeGridHeaderCell, { ITreeGridHeaderCellOptions } from './TreeGridHeaderCell';

export interface ITreeGridHeaderRowOptions extends IGridHeaderCellOptions {
    displayExpanderPadding?: boolean;
    expanderSize?: string;
}

/**
 * Строка заголовка иерархической таблицы
 * @private
 */
export default class TreeGridHeaderRow extends GridHeaderRow<null> {
    /**
     * Признак, означающий что нужно рисовать отступ вместо экспандеров
     * @protected
     */
    protected _$displayExpanderPadding: boolean;

    /**
     * Размер экспандера
     */
    protected _$expanderSize: string;

    readonly listInstanceName: string = 'controls-TreeGrid';

    readonly listElementName: string = 'header';

    // region DisplayExpanderPadding

    setDisplayExpanderPadding(displayExpanderPadding: boolean): void {
        if (this._$displayExpanderPadding !== displayExpanderPadding) {
            this._$displayExpanderPadding = displayExpanderPadding;

            this._updateColumnsDisplayExpanderPadding(displayExpanderPadding);

            this._nextVersion();
        }
    }

    protected _updateColumnsDisplayExpanderPadding(displayExpanderPadding: boolean): void {
        // После пересчета displayExpanderPadding _$columnItems могут быть не созданы, т.к. они создаются лениво
        if (this._$columnItems) {
            this._$columnItems.forEach((cell) => {
                if (cell instanceof TreeGridHeaderCell) {
                    cell.setDisplayExpanderPadding(displayExpanderPadding);
                }
            });
        }
    }

    // endregion DisplayExpanderPadding

    getColumnsFactory(
        staticOptions?: object
    ): (options: ITreeGridHeaderCellOptions) => TreeGridHeaderCell {
        const superFactory = super.getColumnsFactory();
        const self = this;

        return function (options: ITreeGridHeaderCellOptions) {
            options.displayExpanderPadding = self._$displayExpanderPadding;
            options.expanderSize = self._$expanderSize;
            return superFactory.call(self, options);
        };
    }
}

Object.assign(TreeGridHeaderRow.prototype, {
    'Controls/treeGrid:TreeGridHeaderRow': true,
    _moduleName: 'Controls/treeGrid:TreeGridHeaderRow',
    _instancePrefix: 'tree-grid-header-row-',
    _cellModule: 'Controls/treeGrid:TreeGridHeaderCell',
    _$displayExpanderPadding: true,
    _$expanderSize: 'default',
});
