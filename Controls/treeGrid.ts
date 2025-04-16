/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
/**
 * Библиотека компонентов дерева с колонками (Иерархической таблицы).
 * <ul>
 *     <li>{@link Controls/treeGrid:View Контрол "Дерево с колонками"}</li>
 *     <li>{@link Controls/treeGrid:ItemsView Контрол "Дерево с колонками, работающее по RecordSet"}</li>
 * </ul>
 *
 * См. также:
 * <ul>
 *     <li>{@link /doc/platform/developmentapl/interface-development/context-data/new-data-store/list-slice/ Слайс для работы со списочными компонентами}</li>
 *     <li>{@link /docs/js/Controls/dataFactory/IListDataFactoryArguments/?v=24.4100 Конфигурация фабрики данных}</li>
 *     <li>{@link /doc/platform/developmentapl/interface-development/controls/list/tree-column/ Руководство разработчика}</li>
 *     <li>{@link https://n.sbis.ru/article/6e50961f-e043-469e-8146-9c60fd26e556 Спецификация дерева}</li>
 *     <li>{@link https://n.sbis.ru/article/d670a81f-95ae-4aff-9deb-abedbada6f50 Спецификация таблицы}</li>
 * </ul>
 *
 * @library Controls/treeGrid
 * @includes ItemTemplate Controls/_treeGridRender/interface/ItemTemplate
 * @includes NodeFooterTemplate Controls/_treeGridRender/interface/NodeFooterTemplate
 * @includes NodeHeaderTemplate Controls/_treeGridRender/interface/NodeHeaderTemplate
 * @public
 */

import 'Controls/treeGridDisplay';

export * from 'Controls/treeGridRender';
export {
    ItemTemplate,
    NodeFooterTemplate,
    NodeHeaderTemplate,
    IColumn,
    IGroupNodeColumn,
    ITreeGrid,
    TGroupNodeVisibility,
    IColumnConfig,
    INodeHeaderConfig,
    INodeFooterConfig,
    IRowProps,
    INodeFooterCellProps,
    TGroupNodeViewMode,
    TGetRowPropsCallback,
    IItemProps,
    INodeFooterTemplateProps,
    INodeHeaderTemplateProps,
} from 'Controls/treeGridRender';

export { ExpanderConnectedComponent } from 'Controls/treeRender';

export { default as View } from 'Controls/_treeGrid/TreeGrid';
export { default as ItemsView } from 'Controls/_treeGrid/ItemsTreeGrid';
export {
    TreeGridControl,
    ITreeGridOptions,
    ITreeGridControlOptions,
} from 'Controls/_treeGrid/TreeGridControl';

export { BaseTreeControlComponent, TOldBaseTreeControlCompatibility } from 'Controls/baseTree';

export {
    TreeGridCollection,
    ITreeGridCollectionOptions,
    TreeGridDataRow,
    TreeGridDataCell,
    TreeGridNodeFooterRow,
    TreeGridNodeHeaderRow,
    TreeGridNodeExtraItemCell,
    TreeGridGroupDataRow,
    TreeGridGroupDataCell,
    TreeGridResultsRow,
    TreeGridHeaderRow,
    ITreeGridHeaderRowOptions,
    TreeGridNodeFooterCell,
    TreeGridNodeHeaderCell,
} from 'Controls/treeGridDisplay';
