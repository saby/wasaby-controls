/**
 * @kaizen_zone a366fb75-0c89-4edd-9ba7-43558b9859ce
 */
import { View as TileView } from 'Controls/tile';
import { BaseTreeControl as TreeControl } from 'Controls/baseTree';
import { TemplateFunction } from 'UI/Base';
import TreeTileView from './TreeTileView';

/**
 * Контрол "Иерархическая плитка" позволяет отображать данные из различных источников
 * в виде элементов плитки с иерархией и располагать несколько элементов в одну строку.
 * Контрол поддерживает широкий набор возможностей, позволяющих разработчику
 * максимально гибко настраивать отображение данных.
 *
 * @extends Controls/list:View
 * @implements Controls/interface:ISource
 * @implements Controls/interface/IItemTemplate
 * @implements Controls/interface/IPromisedSelectable
 * @implements Controls/list:IContentTemplate
 * @implements Controls/interface/IGroupedList
 * @implements Controls/interface:INavigation
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/list:IList
 * @implements Controls/interface:IItemPadding
 * @implements Controls/itemActions:IItemActions
 * @implements Controls/interface:IHierarchy
 * @implements Controls/tree:ITree
 * @implements Controls/interface:IDraggable
 * @implements Controls/tile:ITile
 * @implements Controls/list:IClickableView
 * @implements Controls/marker:IMarkerList
 * @implements Controls/list:IVirtualScroll
 * @mixes Controls/treeTile:ITreeTile
 *
 * @public
 * @demo Controls-demo/treeTileNew/Default/Index
 */

export default class View extends TileView {
    protected _viewName: TemplateFunction = TreeTileView;
    protected _viewTemplate: TemplateFunction = TreeControl;

    protected _getModelConstructor(): string {
        return 'Controls/treeTile:TreeTileCollection';
    }
}
