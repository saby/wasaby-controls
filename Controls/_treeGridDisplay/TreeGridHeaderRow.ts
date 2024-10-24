/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { TemplateFunction } from 'UICommon/base';
import { mixin } from 'Types/util';
import { GridHeaderRow, IGridHeaderCellOptions } from 'Controls/gridDisplay';
import TreeGridDataRow from './TreeGridDataRow';

export interface ITreeGridHeaderRowOptions extends IGridHeaderCellOptions {
    displayExpanderPadding?: boolean;
    expanderSize?: string;
}

/**
 * Строка заголовка иерархической таблицы
 * @private
 */
export default class TreeGridHeaderRow extends mixin<TreeGridDataRow, GridHeaderRow>(
    TreeGridDataRow,
    GridHeaderRow
) {
    readonly listElementName: string = 'header';

    constructor(options: object) {
        super(options);
        this._$columnsWidths = [];
        this._shadowVisibility = this.hasMoreDataUp() ? 'initial' : 'visible';
    }

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
        if (withoutExpanderPadding !== undefined) {
            return withoutExpanderPadding;
        }
        // Убираем отступ под экспандер для колонки, у которой в шапке есть хлебная крошка.
        return (
            this._$columnsConfig[0].isBreadCrumbs ||
            this._$columnsConfig[0].templateOptions?.withoutBackButton === false ||
            this._$columnsConfig[0].templateOptions?.withoutBreadcrumbs === false
        );
    }
}

Object.assign(TreeGridHeaderRow.prototype, {
    '[Controls/treeGrid:TreeGridHeaderRow]': true,
    _moduleName: 'Controls/treeGrid:TreeGridHeaderRow',
    _instancePrefix: 'tree-grid-header-row-',
    _cellModule: 'Controls/grid:GridHeaderCell',
    _$displayExpanderPadding: true,
    _$expanderSize: 'default',
});
