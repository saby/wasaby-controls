/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
/**
 * Библиотека компонентов, необходимых для рендера дерева с колонками (Иерархической таблицы).
 * @library
 * @includes IColumn Controls/treeGridRender:IColumn
 * @includes IGroupNodeColumn Controls/treeGridRender:IGroupNodeColumn
 * @includes ItemTemplate Controls/_treeGridRender/interface/ItemTemplate
 * @includes NodeFooterTemplate Controls/_treeGridRender/interface/NodeFooterTemplate
 * @includes NodeHeaderTemplate Controls/_treeGridRender/interface/NodeHeaderTemplate
 * @public
 */

// compatibility
export {
    ReactTreeGridView as TreeGridView,
    ReactTreeGridView as TreeGridViewTable,
} from 'Controls/_treeGridRender/View';

export { ReactTreeGridView, getRowComponent } from 'Controls/_treeGridRender/View';
export {
    default as RowComponent,
    getCleanCellComponent,
    getCompatibleCellComponent,
} from 'Controls/_treeGridRender/row/Data';
export {
    IRowProps,
    TGetRowPropsCallback,
    TGetRowPropsCallback as TGetTreeRowPropsCallback,
} from 'Controls/_treeGridRender/interface/IRowComponent';

import { CompatibleNodeExtraItemCellComponent as NodeFooterTemplate } from 'Controls/_treeGridRender/cL/cell/NodeExtraItem';
import { CompatibleNodeExtraItemCellComponent as NodeHeaderTemplate } from 'Controls/_treeGridRender/cL/cell/NodeExtraItem';
import { CompatibleTreeGridRowComponent as ItemTemplate } from 'Controls/_treeGridRender/cL/row/Data';

export { ItemTemplate, NodeFooterTemplate, NodeHeaderTemplate };

export {
    default as ITreeGrid,
    TGroupNodeViewMode,
    IOptions as ITreeGridOptions,
    TGroupNodeVisibility,
    ITreeGridCompatibleProps,
    ITreeGridExtraItemsProps,
} from 'Controls/_treeGridRender/interface/ITreeGrid';
export {
    IGroupNodeConfig,
    ICompatibleTreeGridColumnConfig as IColumn,
    ITreeGridColumnConfig as IColumnConfig,
    ITreeGridColumnConfig as IGroupNodeColumn,
} from 'Controls/_treeGridRender/interface/ITreeGridColumnConfig';

export { INodeFooterCellProps, INodeFooterConfig, INodeHeaderConfig } from 'Controls/gridRender';
