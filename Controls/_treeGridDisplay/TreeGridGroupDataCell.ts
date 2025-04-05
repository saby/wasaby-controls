/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { Model } from 'Types/entity';
import { DEFAULT_GROUP_CELL_Z_INDEX, FIXED_GROUP_CELL_Z_INDEX } from 'Controls/gridDisplay';
import TreeGridDataCell, { ITreeGridDataCellOptions } from './TreeGridDataCell';
import type { IGroupNodeColumn } from 'Controls/treeGridRender';

export interface ITreeGridGroupDataCell extends ITreeGridDataCellOptions<Model> {
    isExpanded: boolean;
}

/**
 * Ячейка строки с данными, которая отображается в виде группы
 * @private
 */
export default class TreeGridGroupDataCell<T extends Model = Model> extends TreeGridDataCell<T> {
    readonly $TGGC: boolean;

    protected readonly _$column: IGroupNodeColumn;
    readonly _$isExpanded: boolean;

    readonly listInstanceName: string = 'controls-TreeGrid__group';

    // region Аспект "Ячейка группы"

    isExpanded(): boolean {
        return this._$isExpanded;
    }

    // endregion Аспект "Ячейка группы"

    getZIndex(): number {
        const defaultZIndex = DEFAULT_GROUP_CELL_Z_INDEX;
        return this._$isFixed ? Math.max(FIXED_GROUP_CELL_Z_INDEX, defaultZIndex) : defaultZIndex;
    }

    getVerticalStickyHeaderPosition(): string {
        return 'top';
    }

    getStickyHeaderMode(): string {
        return 'replaceable';
    }

    isNeedSubPixelArtifactFix(tmplSubPixelArtifactFixOption: boolean = false): boolean {
        return tmplSubPixelArtifactFixOption;
    }
}

Object.assign(TreeGridGroupDataCell.prototype, {
    $TGGC: true, // TreeGridGroupDataCell
    _moduleName: 'Controls/treeGrid:TreeGridGroupDataCell',
    _instancePrefix: 'tree-grid-group-data-cell-',
    _$isExpanded: null,
});
