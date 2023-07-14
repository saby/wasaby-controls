/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import { ItemsView as TreeItemsView } from 'Controls/tree';
import { default as Render } from 'Controls/_columns/render/Columns';
import { IMarkerStrategyOptions } from 'Controls/_marker/interface';
import { MultiColumnStrategy } from 'Controls/marker';

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
 * @public
 */

export default class ItemsView extends TreeItemsView {
    protected _viewName: Function = Render;
    protected _viewModelConstructor: string = 'Controls/columns:ColumnsCollection';
    protected _markerStrategy: new (options: IMarkerStrategyOptions) => MultiColumnStrategy =
        MultiColumnStrategy;
    protected _itemsSelector: string = Render.itemsSelector;

    static defaultProps: object = {
        ...TreeItemsView.defaultProps,
        multiColumns: true,
        itemsContainerPadding: null,
    };
}
