/**
 * @kaizen_zone 4368b094-41a4-40db-a0f9-b83257bd8251
 */
import { ItemsView as TreeItemsView } from 'Controls/tree';
import { default as Render } from 'Controls/_columns/render/Columns';
import { CompatibleMultiColumnMarkerStrategy as MultiColumnMarkerStrategy } from 'Controls/listAspects';

/**
 * Контрол {@link /doc/platform/developmentapl/interface-development/controls/list/columns/ многоколоночного списка}, который умеет работать без {@link /doc/platform/developmentapl/interface-development/controls/list/source/ источника данных}.
 * В качестве данных ожидает {@link Types/collection:RecordSet} переданный в опцию {@link Controls/list:IItemsView#items items}.
 *
 * @demo Controls-Templates-demo/UsingInList/Columns/Index
 *
 * @extends UI/Base:Control
 * @implements Controls/list:IItemsView
 * @implements Controls/interface:INavigation
 * @implements Controls/list:IList
 * @implements Controls/interface:IItemPadding
 * @implements Controls/itemActions:IItemActions
 * @implements Controls/interface:IDraggable
 * @implements Controls/interface/IGroupedList
 * @implements Controls/list:IClickableView
 * @implements Controls/list:IReloadableList
 * @implements Controls/list:IMovableList
 * @implements Controls/list:IRemovableList
 * @implements Controls/marker:IMarkerList
 * @implements Controls/interface:ITagStyle
 * @implements Controls/_columns/interface/IColumnsView
 *
 * @ignoreOptions sourceController deepReload collapsedItems expandedItems expanderVisibility expanderSize expanderPosition expandByItemClick expanderIcon expanderIconSize markItemByExpanderClick nodeFooterTemplate nodeFooterVisibilityCallback nodeMoreCaption singleExpand
 *
 * @public
 */

export default class ItemsView extends TreeItemsView {
    protected _viewName: Function = Render;
    protected _viewModelConstructor: string = 'Controls/columns:ColumnsCollection';
    protected _markerStrategy: typeof MultiColumnMarkerStrategy = MultiColumnMarkerStrategy;

    protected _beforeMount(options: unknown, context?: object, receivedState?: unknown): unknown {
        const result = super._beforeMount(options, context, receivedState);
        if (options.disableVirtualScroll !== false) {
            this._itemsSelector = Render.itemsSelector;
        }
        return result;
    }

    static defaultProps: object = {
        ...TreeItemsView.defaultProps,
        multiColumns: true,
        itemsContainerPadding: null,
    };
}
