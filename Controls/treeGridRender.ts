/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
/**
 * Библиотека компонентов дерева с колонками (Иерархической таблицы).
 * - {@link Controls/treeGrid:View Контрол "Дерево с колонками"}
 * - {@link Controls/treeGrid:ItemsView Контрол "Дерево с колонками, работающее по RecordSet"}
 * См. также:
 * * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/context-data/new-data-store/list-slice/ Слайс для работы со списочными компонентами}
 * * {@link https://wi.sbis.ru/docs/js/Controls/dataFactory/IListDataFactoryArguments/?v=24.4100 Конфигурация фабрики данных}
 * * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/list/tree-column/ Руководство разработчика}
 * * {@link https://n.sbis.ru/article/6e50961f-e043-469e-8146-9c60fd26e556 Спецификация дерева}
 * * {@link https://n.sbis.ru/article/d670a81f-95ae-4aff-9deb-abedbada6f50 Спецификация таблицы}
 * @library Controls/treeGrid
 * @includes ITreeGrid Controls/_treeGridRender/interface/ITreeGrid
 * @includes IColumn Controls/_treeGridRender/interface/IColumn
 * @includes IGroupNodeColumn Controls/_treeGridRender/interface/IGroupNodeColumn
 * @includes ItemTemplate Controls/_treeGridRender/interface/ItemTemplate
 * @includes NodeFooterTemplate Controls/_treeGridRender/interface/NodeFooterTemplate
 * @includes NodeHeaderTemplate Controls/_treeGridRender/interface/NodeHeaderTemplate
 * @includes TGroupNodeVisibility Controls/_treeGridRender/interface/ITreeGrid/TGroupNodeVisibility
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

import { CompatibleNodeExtraItemCellComponent as NodeFooterTemplate } from 'Controls/_treeGridRender/cL/cell/NodeExtraItem';
import { CompatibleNodeExtraItemCellComponent as NodeHeaderTemplate } from 'Controls/_treeGridRender/cL/cell/NodeExtraItem';
import { CompatibleTreeGridRowComponent as ItemTemplate } from 'Controls/_treeGridRender/cL/row/Data';

export { ItemTemplate, NodeFooterTemplate, NodeHeaderTemplate };

import { IGroupNodeColumn } from 'Controls/_treeGridRender/interface/IGroupNodeColumn';
import ITreeGrid, {
    TGroupNodeViewMode,
    IOptions as ITreeGridOptions,
} from 'Controls/_treeGridRender/interface/ITreeGrid';
import { IColumn } from 'Controls/_treeGridRender/interface/IColumn';

import {
    ITreeRowComponentProps,
    ITreeRowProps,
    ITreeCellComponentProps,
    TGetTreeRowPropsCallback,
} from 'Controls/_treeGridRender/cell/content/ExpanderWrapper';

export {
    ITreeGrid,
    ITreeGridOptions,
    IColumn,
    IGroupNodeColumn,
    TGroupNodeViewMode,
    TGetTreeRowPropsCallback,
    CellRenderWithExpander,
    ITreeRowComponentProps,
    ITreeRowProps,
    ITreeCellComponentProps,
};
