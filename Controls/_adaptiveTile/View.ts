/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */

import { View as BaseView } from 'Controls/list';
import { IAbstractListVirtualScrollControllerConstructor } from 'Controls/baseList';
import { default as AdaptiveTileView } from './render/AdaptiveTileView';
import AdaptiveTileControl from './AdaptiveTileControl';
import { HorizontalTileScrollController } from 'Controls/baseTile';

/**
 * Контрол "Адаптивная плитка" позволяет отображать данные из различных источников в виде элементов плитки и гибко располагать их внутри контейнера {@link Controls/scroll:Container#scrollOrientation горизонтального скролла} в одну или несколько строк. Размеры элементов, число строк и столбцов автоматически подстраиваются, чтобы максимально заполнить контейнер указанных размеров, количества записей и указанных ограничений на их высоту и ширину.
 * @demo Controls-demo/adaptiveTile/WI/Index
 *
 * @extends Controls/list:View
 * @implements Controls/interface:IStoreId
 * @implements Controls/interface/IItemTemplate
 * @implements Controls/interface/IPromisedSelectable
 * @implements Controls/interface/IContentTemplate
 * @implements Controls/interface:INavigation
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/list:IList
 * @implements Controls/interface:IItemPadding
 * @implements Controls/itemActions:IItemActions
 * @implements Controls/interface:IDraggable
 * @implements Controls/list:IClickableView
 * @implements Controls/marker:IMarkerList
 * @implements Controls/list:IVirtualScroll
 * @implements Controls/error:IErrorControllerOptions
 * @implements Controls/adaptiveTile:IAdaptiveTile
 *
 * @ignoreOptions filter navigation sorting selectedKeys excludedKeys multiSelectVisibility markerVisibility collapsedItems expandedItems hasChildrenProperty selectionType expanderVisibility expanderSize expanderPosition expandByItemClick expanderIcon expanderIconSize markItemByExpanderClick nodeFooterTemplate nodeFooterVisibilityCallback nodeMoreCaption singleExpand displayProperty groupHistoryId propStorageId parentProperty nodeProperty nodeHistoryType nodeHistoryId root nodeTypeProperty markedKey
 *
 * @public
 */

export default class View extends BaseView<AdaptiveTileControl> {
    protected _viewName: typeof AdaptiveTileView = AdaptiveTileView;
    protected _viewTemplate: typeof AdaptiveTileControl = AdaptiveTileControl;
    protected _viewModelConstructor: string | Function = null;
    protected _task1187242805: boolean = true;

    protected _getModelConstructor(): string | Function {
        return 'Controls/adaptiveTile:Collection';
    }

    protected _getListVirtualScrollConstructor(): IAbstractListVirtualScrollControllerConstructor {
        return HorizontalTileScrollController;
    }
}
