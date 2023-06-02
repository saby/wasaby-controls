/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { GridTableHeader } from 'Controls/grid';
import TreeGridHeaderRow, {
    ITreeGridHeaderRowOptions,
} from './TreeGridHeaderRow';

/**
 * Заголовок в иерархической таблице, которая не поддерживает grid.
 * @private
 */
export default class TreeGridTableHeader extends GridTableHeader {
    /**
     * Размер экспандера
     */
    protected _$expanderSize: string;

    /**
     * Признак, означающий что нужно рисовать отступ вместо экспандеров
     * @protected
     */
    protected _$displayExpanderPadding: boolean;

    setDisplayExpanderPadding(displayExpanderPadding: boolean): void {
        this._$rows.forEach((row) => {
            (row as TreeGridHeaderRow).setDisplayExpanderPadding(
                displayExpanderPadding
            );
        });
    }

    protected _getRowsFactory(): (
        options: ITreeGridHeaderRowOptions
    ) => TreeGridHeaderRow {
        const superFactory = super._getRowsFactory();
        const self = this;

        return function(options: ITreeGridHeaderRowOptions) {
            options.expanderSize = self._$expanderSize;
            options.displayExpanderPadding = self._$displayExpanderPadding;
            return superFactory.call(self, options);
        };
    }
}

Object.assign(TreeGridTableHeader.prototype, {
    'Controls/treeGrid:TreeGridHeader': true,
    'Controls/treeGrid:TreeGridTableHeader': true,
    _moduleName: 'Controls/treeGrid:TreeGridTableHeader',
    _instancePrefix: 'tree-grid-table-header-',
    _rowModule: 'Controls/treeGrid:TreeGridTableHeaderRow',
    _$expanderSize: 'default',
    _$displayExpanderPadding: true,
});
