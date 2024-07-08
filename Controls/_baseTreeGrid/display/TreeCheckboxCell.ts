/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import { CheckboxCell } from 'Controls/baseGrid';
import TreeGridDataRow from './TreeGridDataRow';
import { TBorderVisibility, TShadowVisibility, TBorderStyle } from 'Controls/display';

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
    '[Controls/_baseTreeGrid/display/TreeCheckboxCell]': true,
    _moduleName: 'Controls/treeGrid:TreeCheckboxCell',
    _instancePrefix: 'tree-grid-checkbox-cell-',
    _$style: null,
});
