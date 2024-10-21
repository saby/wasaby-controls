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
 * @includes ITreeGrid Controls/_treeGrid/interface/ITreeGrid
 * @includes IColumn Controls/_treeGrid/interface/IColumn
 * @includes IGroupNodeColumn Controls/_treeGrid/interface/IGroupNodeColumn
 * @includes ItemTemplate Controls/_treeGrid/interface/ItemTemplate
 * @includes NodeFooterTemplate Controls/_treeGrid/interface/NodeFooterTemplate
 * @includes NodeHeaderTemplate Controls/_treeGrid/interface/NodeHeaderTemplate
 * @includes TGroupNodeVisibility Controls/_treeGrid/interface/ITreeGrid/TGroupNodeVisibility
 * @public
 */

import { default as View } from 'Controls/_treeGrid/TreeGrid';
import { default as ItemsView } from 'Controls/_treeGrid/ItemsTreeGrid';

// compatibility
export {
    ReactTreeGridView as TreeGridView,
    ReactTreeGridView as TreeGridViewTable,
} from 'Controls/_treeGrid/view/View';

export { ReactTreeGridView, getRowComponent } from 'Controls/_treeGrid/view/View';
export {
    default as RowComponent,
    getCleanCellComponent,
    getCompatibleCellComponent,
    getDirtyCellComponentContentRender,
} from 'Controls/_treeGrid/row/RowComponent';

import { CompatibleNodeExtraItemCellComponent as NodeFooterTemplate } from 'Controls/_treeGrid/compatibleLayer/NodeExtraItemCellComponent';
import { CompatibleNodeExtraItemCellComponent as NodeHeaderTemplate } from 'Controls/_treeGrid/compatibleLayer/NodeExtraItemCellComponent';
import { CompatibleTreeGridRowComponent as ItemTemplate } from 'Controls/_treeGrid/compatibleLayer/RowComponent';
import 'Controls/baseTreeGrid';

export { View, ItemsView, ItemTemplate, NodeFooterTemplate, NodeHeaderTemplate };

export {
    BaseTreeControlComponent,
    TOldBaseTreeControlCompatibility,
    ExpanderConnectedComponent,
} from 'Controls/baseTree';

import { IGroupNodeColumn } from 'Controls/_treeGrid/interface/IGroupNodeColumn';
import ITreeGrid, { TGroupNodeViewMode } from 'Controls/_treeGrid/interface/ITreeGrid';
import { IColumn } from 'Controls/_treeGrid/interface/IColumn';
import {
    TreeGridControl,
    ITreeGridOptions,
    ITreeGridControlOptions,
} from 'Controls/_treeGrid/TreeGridControl';

export {
    TreeGridDataRow,
    TreeGridDataCell,
    TreeGridNodeHeaderRow,
    TreeGridNodeFooterRow,
    TreeGridNodeExtraItemCell,
    TreeGridGroupDataRow,
    TreeGridGroupDataCell,
    TreeGridHeaderRow,
    ITreeGridHeaderRowOptions,
    TreeGridResultsRow,
    GroupColumnTemplate,
    TGetTreeRowPropsCallback,
    TreeGridCollection,
    ITreeGridCollectionOptions,
} from 'Controls/baseTreeGrid';

export {
    ITreeGrid,
    TreeGridControl,
    ITreeGridControlOptions,
    IColumn,
    IGroupNodeColumn,
    TGroupNodeViewMode,
    ITreeGridOptions,
};
