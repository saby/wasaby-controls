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
 * Позволяет вывести данные в виде элементов плитки с горизонтальной прокруткой.
 * В отличие от обычной плитки ({@link Controls/tile:View}) в горзонтальной ориентации, элементы могут располагаться в несколько рядов.
 * Порядок элементов также отличается от обычной плитки, элементы располагаются поколоночно:
 * (1 3 5)
 * (2 4 6)
 * Размеры элементов ограничены минимальными и максимальными высотой и шириной.
 * В пределах этих ограничений, элементы растягиваются, стараясь максимально занять свободное пространство по ширине и высоте.
 * При нехватке места, плитки, наоборот, сжимаются до минимальных размеров.
 *
 * * Для горизонтальной прокрутки необходимо обернуть контрол в {@link Controls/scroll:Container Контейнер горизонтального скролла}.
 *
 * Дополнительная информация доступна по ссылкам:
 * - {@link https://online.sbis.ru/article/96562d8b-3f83-450e-adad-640b8cb8a0eb Спецификация}
 * @demo Controls-demo/adaptiveTile/WI/Index
 *
 * @extends Controls/list:View
 * @implements Controls/interface:IStoreId
 * @implements Controls/interface:IItemTemplateListProps
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
 * @see Controls/scroll/Container#scrollOrientation горизонтальный скролл
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
