/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import { loadSync } from 'WasabyLoader/ModulesLoader';

import { View as List } from 'Controls/baseList';

import * as GridView from 'Controls/_grid/GridView';
import GridViewTable from 'Controls/_grid/GridViewTable';
import { isFullGridSupport } from 'Controls/display';
import { IOptions as IGridOptions } from './display/mixins/Grid';
import { GridControl } from './GridControl';
import { resolveViewControls } from './utils/ReactViewControlsResolver';
import type {EdgeState} from 'Controls/columnScrollReact';
import type { IAbstractColumnScrollControl } from 'Controls/gridColumnScroll';

/**
 * Контрол "Таблица" позволяет отображать данные из различных источников в виде таблицы.
 * Контрол поддерживает широкий набор возможностей, позволяющих разработчику максимально гибко настраивать отображение данных.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_grid.less переменные тем оформления grid}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_list.less переменные тем оформления list}
 *
 * @class Controls/_grid/Grid
 * @extends Controls/list:View
 * @implements Controls/interface:ISource
 * @implements Controls/interface:IStoreId
 * @implements Controls/interface/IPromisedSelectable
 * @implements Controls/interface:INavigation
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/list:IList
 * @implements Controls/interface:IItemPadding
 * @implements Controls/itemActions:IItemActions
 * @implements Controls/grid:IGridControl
 * @implements Controls/interface:IDraggable
 * @implements Controls/interface/IGroupedGrid
 * @implements Controls/interface/IGridItemTemplate
 * @implements Controls/grid:IPropStorage
 * @implements Controls/grid:IEditableGrid
 * @implements Controls/marker:IMarkerList
 * @implements Controls/error:IErrorControllerOptions
 *
 * @public
 * @demo Controls-demo/gridNew/Base/Index
 */

/*
 * Table-looking list. Can load data from data source.
 * The detailed description and instructions on how to configure the control you can read <a href='/doc/platform/developmentapl/interface-development/controls/list/'>here</a>.
 * List of examples:
 * <ul>
 *    <li><a href="/materials/DemoStand/app/Controls-demo%2FList%2FGrid%2FEditableGrid">How to configure editing in your list</a>.</li>
 * </ul>
 *
 * @class Controls/_grid/Grid
 * @extends Controls/list:View
 * @implements Controls/interface:ISource
 * @implements Controls/interface/IPromisedSelectable
 * @implements Controls/interface/IGroupedGrid
 * @implements Controls/interface:INavigation
 * @implements Controls/interface:IFilterChanged
 * @implements Controls/list:IList
 * @implements Controls/itemActions:IItemActions
 * @implements Controls/interface:ISorting
 * @implements Controls/grid:IGridControl
 * @implements Controls/interface/IGridItemTemplate
 * @implements Controls/interface:IDraggable
 * @implements Controls/grid:IPropStorage
 * @implements Controls/grid:IEditableGrid
 * @implements Controls/marker:IMarkerList
 *
 *
 * @public
 * @author Авраменко А.С.
 * @demo Controls-demo/gridNew/Base/Index
 */

export default class Grid<
    TControl extends GridControl = GridControl
> extends List<TControl> {
    protected _viewTemplate: TControl = GridControl;
    protected _useReactScrollContexts: boolean = false;

    protected _beforeMount(options: IGridOptions): Promise<void> | void {
        super._beforeMount(options);
        this._useScrollContexts = !!options.newColumnScroll;
        this._onColumnScrollEdgeStateChanged = this._onColumnScrollEdgeStateChanged.bind(this);

        let result;
        // https://online.sbis.ru/opendoc.html?guid=455ee9d5-641d-4db2-a8cf-7f5b3b59577e
        // Асинхронность будет удалена при удалении старого скролла.
        if (options.newColumnScroll && !options.task1185938417) {
            result = Promise.resolve().then(() => {
                return import('Controls/horizontalScroll');
            });
        }
        resolveViewControls(
            this,
            options,
            isFullGridSupport() ? GridView : GridViewTable,
            GridControl
        );

        return result;
    }

    protected _onColumnScrollEdgeStateChanged(edgesState: [EdgeState, EdgeState]): void {
        this._notifyCallback('columnScrollEdgeStateChanged', [edgesState]);
    }

    protected _getColumnScrollSelectors() {
        // TODO: После переписывания таблиц на реакт это уйдет в Controls/_gridColumnScroll/GridControl.
        return loadSync<typeof import('Controls/gridColumnScroll')>(
            'Controls/gridColumnScroll'
        ).SELECTORS;
    }

    protected _getModelConstructor(): string {
        return 'Controls/grid:GridCollection';
    }

    horizontalScrollTo(position: number, smooth: boolean = false): void {
        (
            this._children
                .listControl as unknown as IAbstractColumnScrollControl
        ).horizontalScrollTo(position, smooth);
    }

    scrollToLeft(): void {
        this._children.listControl.scrollToLeft();
    }

    scrollToRight(): void {
        this._children.listControl.scrollToRight();
    }

    scrollToColumn(columnIndex: number): void {
        this._children.listControl.scrollToColumn(columnIndex);
    }
}

Grid.getDefaultOptions = () => {
    return {
        stickyHeader: true,
        stickyResults: true,
        stickyColumnsCount: 1,
        rowSeparatorSize: null,
        columnSeparatorSize: null,
        isFullGridSupport: isFullGridSupport(),
        itemsContainerPadding: {
            top: 'default',
            bottom: 'default',
            left: 'default',
            right: 'default',
        },
    };
};

/**
 * @name Controls/_grid/Grid#itemPadding
 * @cfg {Controls/_interface/IItemPadding/ItemPadding.typedef}
 * @demo Controls-demo/gridNew/ItemPaddingNull/Index
 */

/**
 * @name Controls/_grid/Grid#multiSelectPosition
 * @cfg {String}
 * @demo Controls-demo/gridNew/Multiselect/CustomPosition/Index
 */

/**
 * Пользовательский шаблон отображения контрола без элементов.
 * @name Controls/_grid/Grid#emptyTemplate
 * @cfg {TemplateFunction|String}
 * @demo Controls-demo/gridNew/EmptyGrid/WithHeader/Index
 * @default undefined
 * @example
 * В следующем примере показана настройка шаблона отображения для пустого плоского списка.
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.grid:View source="{{_viewSource}}" columns="{{_columns}}">
 *     <ws:emptyTemplate>
 *         <ws:partial template="Controls/grid:EmptyTemplate" topSpacing="xl" bottomSpacing="m">
 *             <ws:contentTemplate>No data available!</ws:contentTemplate>
 *         </ws:partial>
 *     </ws:emptyTemplate>
 * </Controls.grid:View>
 * </pre>
 * @remark
 * Подробнее о настройка контрола без элементов читайте в соответствующих статьях для:
 *
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/list/empty/ плоского списка}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/grid/empty/ таблицы}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/tree/empty/ дерева}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/tree-column/empty/ дерева c колонками}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/tile/empty/ плитки}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/explorer/empty/ иерархического проводника}
 * * {@link /doc/platform/developmentapl/interface-development/controls/extends/help-system/pages/ подсказки на пустых страницах}
 */
