/**
 * @kaizen_zone a366fb75-0c89-4edd-9ba7-43558b9859ce
 */
import { IAbstractListVirtualScrollControllerConstructor, View as List } from 'Controls/baseList';
import TileView, { ITileOptions } from './TileView';
import { HorizontalTileScrollController } from 'Controls/baseTile';
import { executeSyncOrAsync } from 'UICommon/Deps';
import { Logger } from 'UI/Utils';

/**
 * Контрол "Плитка" позволяет отображать данные из различных источников в виде элементов плитки и располагать несколько элементов в одну строку. Контрол поддерживает широкий набор возможностей, позволяющих разработчику максимально гибко настраивать отображение данных.
 * @remark
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2FExplorer%2FDemo демо-пример}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/tile/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_tile.less переменные тем оформления tile}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_list.less переменные тем оформления}
 *
 *
 * @class Controls/_tile/View
 * @extends Controls/list:View
 * @implements Controls/interface:ISource
 * @implements Controls/interface:IStoreId
 * @implements Controls/interface/IItemTemplate
 * @implements Controls/interface/IPromisedSelectable
 * @implements Controls/interface/IContentTemplate
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
 * @implements Controls/error:IErrorControllerOptions
 *
 *
 * @public
 */

/*
 * List in which items are displayed as tiles. Can load data from data source.
 * <a href="/materials/DemoStand/app/Controls-demo%2FExplorer%2FDemo">Demo examples</a>.
 * The detailed description and instructions on how to configure the control you can read <a href='/doc/platform/developmentapl/interface-development/controls/list/tile/'>here</a>.
 *
 * @class Controls/_tile/View
 * @extends Controls/list:View
 * @implements Controls/interface:ISource
 * @implements Controls/interface/IItemTemplate
 * @implements Controls/interface/IPromisedSelectable
 * @implements Controls/interface/IGroupedList
 * @implements Controls/interface:INavigation
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/list:IList
 * @implements Controls/itemActions:IItemActions
 * @implements Controls/interface:ISorting
 * @implements Controls/interface:IHierarchy
 * @implements Controls/tree:ITree
 * @implements Controls/interface:IDraggable
 * @mixes Controls/List/interface/ITile
 * @implements Controls/list:IClickableView
 * @implements Controls/marker:IMarkerList
 *
 * @implements Controls/list:IVirtualScroll
 *
 *
 * @author Авраменко А.С.
 * @public
 */

export default class View extends List {
    protected _viewName: TileView = TileView;
    protected _listVirtualScrollControllerConstructor: IAbstractListVirtualScrollControllerConstructor;

    // FIXME: У плитки нет TileControl, а базовый не знает какой ориентации
    //  его скролл-контроллер, разным ориентациям нужны разные параметры контента (высота/ширина).
    //  Данная опция подсказывает BaseControl, что обновить нужно ширину. будет поправлено по задаче.
    //  https://online.sbis.ru/opendoc.html?guid=a8fd8847-744d-41d4-82a2-802a0bb15395&client=3
    protected _task1187242805: boolean = false;

    protected _beforeMount(options: ITileOptions): Promise<void> | void {
        this._viewModelConstructor = this._getModelConstructor();
        this._listVirtualScrollControllerConstructor =
            this._getListVirtualScrollConstructor(options);
        if (options.orientation === 'horizontal') {
            this._task1187242805 = true;
            if (!!options.groupProperty) {
                Logger.warn(
                    `${this._moduleName}: В горизонтальной плитке не поддерживается группировка. Проверьте конфигурацию контрола`
                );
            }
        }
    }

    protected _beforeUpdate(options: ITileOptions): void {
        super._beforeUpdate(options);
        // TODO: Придумать, как организовать реактивность контроллера скролла:
        // https://online.sbis.ru/opendoc.html?guid=9fcbec3d-7740-47a1-8405-91baabb7e17b
        // BaseControl начинает обновление раньше, чем коллекция и вьюха, поэтому, контроллек будет инициализирован по
        // старому состоянию коллекции, а новые индексы отложатся на следующий цикл.
        // if (options.orientation !== this._options.orientation) {
        //     this._task1187242805 = options.orientation === 'horizontal';
        //     this._listVirtualScrollControllerConstructor = this._getListVirtualScrollConstructor(options);
        // }
    }

    protected _getModelConstructor(): string {
        return 'Controls/tile:TileCollection';
    }

    protected _getListVirtualScrollConstructor(
        options: ITileOptions
    ): IAbstractListVirtualScrollControllerConstructor {
        if (options.orientation === 'horizontal') {
            return HorizontalTileScrollController;
        }
        return super._getListVirtualScrollConstructor(options);
    }

    static getDefaultOptions(): object {
        return {
            actionAlignment: 'vertical',
            actionCaptionPosition: 'none',
            itemsContainerPadding: null,
            orientation: 'vertical',
            multiColumns: true,
        };
    }
}

/**
 * @name Controls/_tile/View#itemPadding
 * @cfg {String}
 * @demo Controls-demo/tileNew/ItemPadding/PaddingS/Index
 * @example
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.tile:View source="{{_viewSource}}" imageProperty="image">
 *    <ws:itemPadding
 *       top="s"
 *       bottom="s"
 *       left="s"
 *       right="s"/>
 * </Controls.tile:View>
 * </pre>
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/tile/paddings/#item-padding руководство разработчика}
 */

/**
 * @name Controls/_tile/View#itemPadding
 * @cfg {Controls/_tile/interface/ITile/TileItemPadding.typedef} Конфигурация отступов между элементами плитки.
 * @demo Controls-demo/tileNew/ItemPadding/Index
 * @example
 * <pre class="brush: html; highlight: [4-8]">
 * <!-- WML -->
 * <Controls.tile:View source="{{_viewSource}}" imageProperty="image">
 *    <ws:itemPadding
 *       top="l"
 *       bottom="l"
 *       left="l"
 *       right="l"/>
 * </Controls.tile:View>
 * </pre>
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/tile/paddings/#item-padding руководство разработчика}
 */
