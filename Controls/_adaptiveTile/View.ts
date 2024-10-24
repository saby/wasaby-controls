/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */

import { View as BaseView } from 'Controls/list';
import { IAbstractListVirtualScrollControllerConstructor } from 'Controls/baseList';
import { default as AdaptiveTileView } from './render/AdaptiveTileView';
import AdaptiveTileControl from './AdaptiveTileControl';
import { HorizontalTileScrollController } from 'Controls/baseTile';

/**
 * Контрол "Адаптивная плитка".
 * Позволяет вывести данные в виде элементов плитки в несколько строк с горизонтальной прокруткой.
 * * Элементы плитки заполняют контейнер до фиксированной высоты, формируя столбец. Остальные элементы переносятся в следующий столбец и т.д.
 * * Для горизонтальной прокрутки необходимо обернуть контрол в {@link Controls/scroll:Container#scrollOrientation Контейнер горизонтального скролла}.
 *
 * Дополнительная информация доступна по ссылкам:
 * - {@link https://online.sbis.ru/article/96562d8b-3f83-450e-adad-640b8cb8a0eb Спецификация}
 * - {@link http://axure.tensor.ru/my.sbis/#p=%D0%B2%D0%B8%D0%B4%D0%B6%D0%B5%D1%82_%D0%BD%D0%BE%D0%B2%D0%BE%D1%81%D1%82%D0%B5%D0%B9&g=1 Макет}
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
 * @see Controls/tile:View "Плитка"
 * @see Controls/_tile/interface/ITile#orientation "Горизонтальная плитка"
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
