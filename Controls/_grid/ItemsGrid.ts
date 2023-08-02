/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import { isFullGridSupport } from 'Controls/display';
import { BaseControl, IItemsViewOptions, ItemsView as ListItemsView } from 'Controls/baseList';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import { default as GridView } from 'Controls/_grid/GridView';
import { GridControl } from './GridControl';
import { resolveViewControls } from './utils/ReactViewControlsResolver';
import type { IAbstractColumnScrollControl } from 'Controls/gridColumnScroll';
import { addPageDeps } from 'UI/Deps';

interface IItemsGridOptions extends IItemsViewOptions {
    isFullGridSupport: boolean;
}

/**
 * Контрол плоской {@link /doc/platform/developmentapl/interface-development/controls/list/grid/ таблицы}, который умеет работать без {@link /doc/platform/developmentapl/interface-development/controls/list/source/ источника данных}.
 * В качестве данных ожидает {@link Types/collection:RecordSet} переданный в опцию {@link Controls/list:IItemsView#items items}.
 *
 * @demo Controls-demo/gridNew/ItemsView/Base/Index
 *
 * @class Controls/grid:ItemsView
 * @extends Controls/list:ItemsView
 * @implements Controls/list:IItemsView
 * @implements Controls/list:IVirtualScroll
 * @implements Controls/list:IList
 * @implements Controls/interface:IItemPadding
 * @implements Controls/list:IClickableView
 * @implements Controls/interface/IGridItemTemplate
 * @implements Controls/interface/IGroupedGrid
 * @implements Controls/interface/IGridItemTemplate
 * @implements Controls/interface/IGroupedList
 * @implements Controls/interface:IMultiSelectable
 * @implements Controls/grid:IGridControl
 * @implements Controls/marker:IMarkerList
 * @implements Controls/itemActions:IItemActions
 * @implements Controls/_interface/ITrackedProperties
 *
 * @ignoremethods scrollToColumn scrollToLeft scrollToRight freezeHoveredItem unfreezeHoveredItems getItems reloadItem scrollToItem
 *
 * @public
 */
export default class ItemsGrid<
    TOptions extends IItemsGridOptions = IItemsGridOptions,
    TListControl extends BaseControl = BaseControl
> extends ListItemsView<TOptions, TListControl> {
    // region override base template props
    protected _viewName: Function = null;
    protected _viewTemplate: TListControl = GridControl;
    protected _viewModelConstructor: string = 'Controls/grid:GridCollection';
    // endregion

    protected _beforeMount(options: TOptions): void | Promise<void> {
        const superResult = super._beforeMount(options);

        // Динамически загруженные контролы подтянутся свои стили,
        // но не положат их в зависимости страницы.
        // Загрузка стилей будет происходить дважды: на сервере и на клиенте,
        // поэтому на клиенте будет скачок, когда отсутствующие стили подгрузятся.
        // Добавление стилей в зависимости страницы позволяет избежать второй загрузки.
        // Но нужно класть не стили, а всю либу, чтобы по графу зависимостей подтянулись
        // и статические в рамках той либы стили.
        if (!isFullGridSupport()) {
            addPageDeps(['Controls/gridIE']);
        }

        resolveViewControls(
            this,
            options,
            this._getWasabyView(),
            this._getWasabyViewControl()
        );
        return superResult;
    }

    protected _getWasabyView() {
        return isFullGridSupport() ? GridView : loadSync('Controls/gridIE:GridView')(GridView);
    }

    protected _getWasabyViewControl() {
        return this._viewTemplate;
    }

    protected _getColumnScrollSelectors() {
        // TODO: После переписывания таблиц на реакт это уйдет в Controls/_gridColumnScroll/GridControl.
        // Проверка нужна, т.к. wml заходит во все функции, даже те, которые обернуты в условие.
        if (isLoaded('Controls/gridColumnScroll')) {
            return loadSync<typeof import('Controls/gridColumnScroll')>('Controls/gridColumnScroll')
                .SELECTORS;
        }
    }

    horizontalScrollTo(position: number, smooth: boolean = false): void {
        (this._children.listControl as unknown as IAbstractColumnScrollControl).horizontalScrollTo(
            position,
            smooth
        );
    }

    static defaultProps: Partial<IItemsGridOptions> = {
        isFullGridSupport: isFullGridSupport(),
    };
}
