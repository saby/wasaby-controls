/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { CheckboxCell } from 'Controls/grid';
import TreeGridDataRow from './TreeGridDataRow';
import {
    TBorderVisibility,
    TShadowVisibility,
    TBorderStyle,
} from 'Controls/display';

/**
 * Ячейка иерархической коллекции, в которой отображается чекбокс множественного выбора
 * @private
 */
export default class TreeCheckboxCell<
    TOwner extends TreeGridDataRow = TreeGridDataRow
> extends CheckboxCell<null, TOwner> {
    getWrapperClasses(
        backgroundColorStyle: string,
        templateHighlightOnHover?: boolean,
        templateHoverBackgroundStyle?: string,
        shadowVisibility: TShadowVisibility = 'hidden',
        borderVisibility: TBorderVisibility = 'hidden',
        borderStyle: TBorderStyle = 'default'
    ): string {
        let classes = super.getWrapperClasses(
            backgroundColorStyle,
            templateHighlightOnHover,
            templateHoverBackgroundStyle,
            shadowVisibility,
            borderVisibility,
            borderStyle
        );

        if (this.getOwner().isDragTargetNode()) {
            classes +=
                ' controls-TreeGridView__dragTargetNode controls-TreeGridView__dragTargetNode_first';
        }

        return classes;
    }
}

Object.assign(TreeCheckboxCell.prototype, {
    '[Controls/_treeGrid/display/TreeCheckboxCell]': true,
    _moduleName: 'Controls/treeGrid:TreeCheckboxCell',
    _instancePrefix: 'tree-grid-checkbox-cell-',
    _$style: null,
});
