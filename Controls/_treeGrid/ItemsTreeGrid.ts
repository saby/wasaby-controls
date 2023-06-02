/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { Logger } from 'UI/Utils';
import { CrudEntityKey } from 'Types/source';
import { IItemsViewOptions } from 'Controls/baseList';
import { isFullGridSupport } from 'Controls/display';
import { resolveViewControls, ItemsView as ItemsGrid } from 'Controls/grid';
import { TreeGridControl } from './TreeGridControl';
import TreeGridView from 'Controls/_treeGrid/TreeGridView';
import TreeGridViewTable from 'Controls/_treeGrid/TreeGridViewTable';
import { IOptions as ITreeGridOptions } from 'Controls/_treeGrid/interface/ITreeGrid';

/**
 * Опции для контрола {@link Controls/treeGrid:ItemsView}
 *
 * @public
 */
export interface IItemsTreeGridOptions
    extends IItemsViewOptions,
        ITreeGridOptions {}

/**
 * Контрол древовидной {@link /doc/platform/developmentapl/interface-development/controls/list/tree-column/ таблицы}, который умеет работать без {@link /doc/platform/developmentapl/interface-development/controls/list/source/ источника данных}.
 * В качестве данных ожидает {@link Types/collection:RecordSet} переданный в опцию {@link Controls/list:IItemsView#items items}.
 *
 * @demo Controls-demo/treeGridNew/ItemsView/Base/Index
 *
 * @class Controls/treeGrid:ItemsView
 * @extends Controls/grid:ItemsView
 * @implements Controls/list:IItemsView
 * @implements Controls/list:IVirtualScroll
 * @implements Controls/list:IList
 * @implements Controls/interface:IItemPadding
 * @implements Controls/list:IClickableView
 * @implements Controls/interface/IGridItemTemplate
 * @implements Controls/interface/IGroupedGrid
 * @implements Controls/interface/IGridItemTemplate
 * @implements Controls/interface:IHierarchy
 * @implements Controls/interface/IGroupedList
 * @implements Controls/interface:IMultiSelectable
 * @implements Controls/marker:IMarkerList
 * @implements Controls/itemActions:IItemActions
 * @implements Controls/grid:IGridControl
 * @implements Controls/tree:ITree
 *
 * @public
 */
export default class ItemsTreeGrid extends ItemsGrid<
    IItemsTreeGridOptions,
    TreeGridControl
> {
    // region override base template props
    protected _viewName: Function = null;
    protected _viewTemplate: Function = TreeGridControl;
    protected _viewModelConstructor: string =
        'Controls/treeGrid:TreeGridCollection';
    // endregion

    // region implement ITreeGrid
    readonly '[Controls/_treeGrid/interface/ITreeGrid]': true;
    // endregion

    // region life circle hooks
    protected _beforeMount(
        options: IItemsTreeGridOptions
    ): void | Promise<void> {
        if (options.groupProperty && options.nodeTypeProperty) {
            Logger.error(
                'Нельзя одновременно задавать группировку через ' +
                    'groupProperty и через nodeTypeProperty.',
                this
            );
        }

        const superResult = super._beforeMount(options);

        resolveViewControls(
            this,
            options,
            isFullGridSupport() ? TreeGridView : TreeGridViewTable,
            TreeGridControl
        );

        return superResult;
    }
    // endregion

    // region proxy methods to list control
    toggleExpanded(key: CrudEntityKey): void {
        this._listControl.toggleExpanded(key).then();
    }
    goToPrev(): Model {
        return this._children.listControl.goToPrev();
    }
    goToNext(): Model {
        return this._children.listControl.goToNext();
    }
    // endregion
}
