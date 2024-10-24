/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { GridHeader } from 'Controls/gridDisplay';
import TreeGridHeaderRow, { ITreeGridHeaderRowOptions } from './TreeGridHeaderRow';

/**
 * Заголовок иерархической таблицы
 * @private
 */
export default class TreeGridHeader extends GridHeader {
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
            (row as unknown as TreeGridHeaderRow).setDisplayExpanderPadding(displayExpanderPadding);
        });
    }

    protected _getRowsFactory(): (options: ITreeGridHeaderRowOptions) => TreeGridHeaderRow {
        const superFactory = super._getRowsFactory();
        const self = this;

        return function (options: ITreeGridHeaderRowOptions) {
            options.expanderSize = self._$expanderSize;
            options.displayExpanderPadding = self._$displayExpanderPadding;
            return superFactory.call(self, options);
        };
    }

    getExpanderVisibility(): string {
        return this.getOwner().getExpanderVisibility();
    }

    hasNodeWithChildren(): boolean {
        return this.getOwner().hasNodeWithChildren();
    }

    getExpanderIcon(): string {
        return this.getOwner().getExpanderIcon();
    }
}

Object.assign(TreeGridHeader.prototype, {
    'Controls/treeGrid:TreeGridHeader': true,
    _moduleName: 'Controls/treeGrid:TreeGridHeader',
    _instancePrefix: 'tree-grid-header-',
    _rowModule: 'Controls/treeGrid:TreeGridHeaderRow',
    _cellModule: 'Controls/treeGrid:TreeGridHeaderCell',
    _$expanderSize: 'default',
    _$displayExpanderPadding: true,
});