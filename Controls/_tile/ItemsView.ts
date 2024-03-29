/**
 * @kaizen_zone a366fb75-0c89-4edd-9ba7-43558b9859ce
 */
import {
    IAbstractListVirtualScrollControllerConstructor,
    ItemsView as BaseItemsView,
} from 'Controls/baseList';
import TileView, { ITileOptions } from 'Controls/_tile/TileView';
import { HorizontalTileScrollController } from 'Controls/baseTile';
import { executeSyncOrAsync } from 'UICommon/Deps';
import { Logger } from 'UI/Utils';

/**
 * Контрол {@link /doc/platform/developmentapl/interface-development/controls/list/tile/ плиточного списка}, который умеет работать без {@link /doc/platform/developmentapl/interface-development/controls/list/source/ источника данных}.
 * В качестве данных ожидает {@link Types/collection:RecordSet} переданный в опцию {@link Controls/list:IItemsView#items items}.
 *
 * @demo Controls-demo/tileNew/ItemsView/Base/Index
 * @implements Controls/list:IItemsView
 *
 * @class Controls/tile:ItemsView
 * @extends Controls/list:ItemsView
 * @implements Controls/list:IItemsView
 * @implements Controls/interface/IItemTemplate
 * @implements Controls/interface/IGroupedList
 * @implements Controls/interface:IMultiSelectable
 * @implements Controls/list:IVirtualScroll
 * @implements Controls/list:IList
 * @implements Controls/interface:IItemPadding
 * @implements Controls/list:IClickableView
 * @implements Controls/marker:IMarkerList
 * @implements Controls/itemActions:IItemActions
 * @implements Controls/tile:ITile
 *
 * @public
 */
export default class ItemsView extends BaseItemsView {
    protected _viewName: Function = TileView;
    protected _viewModelConstructor: string = 'Controls/tile:TileCollection';

    // TODO https://online.sbis.ru/opendoc.html?guid=a8fd8847-744d-41d4-82a2-802a0bb15395&client=3
    protected _task1187242805: boolean = false;

    protected _beforeMount(options: ITileOptions): Promise<void> | void {
        super._beforeMount(options);
        if (options.orientation === 'horizontal') {
            this._task1187242805 = true;
            if (!!options.groupProperty) {
                Logger.warn(
                    `${this._moduleName}: В горизонтальной плитке не поддерживается группировка. Проверьте конфигурацию контрола`
                );
            }
            return executeSyncOrAsync(['Controls/horizontalScroll'], () => {
                /**/
            });
        }
    }

    protected _getListVirtualScrollConstructor(
        options: ITileOptions
    ): IAbstractListVirtualScrollControllerConstructor {
        if (options.orientation === 'horizontal') {
            return HorizontalTileScrollController;
        }
        return super._getListVirtualScrollConstructor(options);
    }

    static defaultProps: object = {
        ...BaseItemsView.defaultProps,
        actionAlignment: 'vertical',
        actionCaptionPosition: 'none',
    };
}

/**
 * Конфигурация отступов между элементами плитки.
 * @name Controls/_tile/ItemsView#itemPadding
 * @cfg {Controls/_tile/interface/ITile/TileItemPadding.typedef}
 *
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
