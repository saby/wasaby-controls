/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import { isFullGridSupport } from 'Controls/display';
import {
    BaseControl,
    IItemsViewOptions,
    ItemsView as ListItemsView,
} from 'Controls/baseList';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import * as GridView from 'Controls/_grid/GridView';
import GridViewTable from 'Controls/_grid/GridViewTable';
import { GridControl } from './GridControl';
import { resolveViewControls } from './utils/ReactViewControlsResolver';
import type { IAbstractColumnScrollControl } from 'Controls/gridColumnScroll';

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
 *
 * @ignoremethods scrollToColumn scrollToLeft scrollToRight beginAdd beginEdit commitEdit cancelEdit freezeHoveredItem unfreezeHoveredItems getItems reloadItem scrollToItem
 *
 * @public
 */
export default class ItemsGrid<
    TOptions extends IItemsGridOptions = IItemsGridOptions,
    TListControl extends BaseControl = BaseControl
> extends ListItemsView<TOptions, TListControl> {
    // region override base template props
    protected _viewName: Function = null;
    protected _viewTemplate: TControl = GridControl;
    protected _viewModelConstructor: string = 'Controls/grid:GridCollection';
    // endregion

    protected _beforeMount(options: TOptions): void | Promise<void> {
        const superResult = super._beforeMount(options);
        resolveViewControls(
            this,
            options,
            isFullGridSupport() ? GridView : GridViewTable,
            this._viewTemplate
        );
        return superResult;
    }

    protected _getColumnScrollSelectors() {
        // TODO: После переписывания таблиц на реакт это уйдет в Controls/_gridColumnScroll/GridControl.
        return loadSync<typeof import('Controls/gridColumnScroll')>(
            'Controls/gridColumnScroll'
        ).SELECTORS;
    }

    horizontalScrollTo(position: number, smooth: boolean = false): void {
        (
            this._children
                .listControl as unknown as IAbstractColumnScrollControl
        ).horizontalScrollTo(position, smooth);
    }

    static defaultProps: Partial<IItemsGridOptions> = {
        isFullGridSupport: isFullGridSupport(),
    };
}
