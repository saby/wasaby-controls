/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { Model } from 'Types/entity';
import { ExpanderBlockComponent, getExpanderProps } from 'Controls/treeRender';
import { IBeforeContentRenderProps } from 'Controls/grid';
import type { TreeGridDataCell } from 'Controls/treeGridDisplay';

/**
 * Приватный компонент, добавляющий иерархический отступ
 * @private
 */
export function LevelPadding(props: IBeforeContentRenderProps) {
    const cell = props.cell as unknown as TreeGridDataCell<Model>;
    const item = cell.getOwner();

    const columnIndex = cell.getColumnIndex(false, false);

    const isFirstDataColumn = item.hasMultiSelectColumn() ? columnIndex === 1 : columnIndex === 0;
    const shouldDisplayExpander = item.shouldDisplayExpanderBlock('hasExpander');

    if (isFirstDataColumn && shouldDisplayExpander) {
        return <ExpanderBlockComponent {...getExpanderProps(props, item)} />;
    }

    return null;
}
