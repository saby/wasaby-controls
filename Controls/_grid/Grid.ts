/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';

import { View as List } from 'Controls/baseList';

import { default as GridView } from 'Controls/_grid/GridView';
import { isFullGridSupport } from 'Controls/display';
import { IOptions as IGridOptions } from './display/mixins/Grid';
import { GridControl } from './GridControl';
import { resolveViewControls } from './utils/ReactViewControlsResolver';
import type { EdgeState } from 'Controls/columnScrollReact';
import type { IAbstractColumnScrollControl } from 'Controls/gridColumnScroll';
import { addPageDeps } from 'UI/Deps';

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
 * @extends Controls/list:View
 * @implements Controls/interface:ISource
 * @implements Controls/interface:IStoreId
 * @implements Controls/interface:IItemTemplate
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
 * @implements Controls/_interface/ITrackedProperties
 *
 * @public
 * @demo Controls-demo/gridNew/Base/Index
 */

export default class Grid<TControl extends GridControl = GridControl> extends List<TControl> {
    protected _viewTemplate: TControl = GridControl;
    protected _useReactScrollContexts: boolean = false;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    protected _beforeMount(
        options: IGridOptions,
        ...args: unknown[]
    ): Promise<void> | void {
        const superArgs = [options, ...args] as unknown as Parameters<List['_beforeMount']>;
        const superMountResult = super._beforeMount(...superArgs);

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
            this._getWasabyViewControl(),
            this._getReactViewControl()
        );
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return superMountResult;
    }

    protected _getWasabyView() {
        return isFullGridSupport() ? GridView : loadSync('Controls/gridIE:GridView')(GridView);
    }

    protected _getWasabyViewControl() {
        return GridControl;
    }

    protected _getReactViewControl() {
        return this._getWasabyViewControl();
    }

    protected _onColumnScrollEdgeStateChanged(edgesState: [EdgeState, EdgeState]): void {
        this._notifyCallback('columnScrollEdgeStateChanged', [edgesState]);
    }

    protected _getColumnScrollSelectors() {
        // TODO: После переписывания таблиц на реакт это уйдет в Controls/_gridColumnScroll/GridControl.
        // Проверка нужна, т.к. wml заходит во все функции, даже те, которые обернуты в условие.
        if (isLoaded('Controls/gridColumnScroll')) {
            return loadSync<typeof import('Controls/gridColumnScroll')>('Controls/gridColumnScroll')
                .SELECTORS;
        }
    }

    protected _getModelConstructor(): string {
        return 'Controls/grid:GridCollection';
    }

    horizontalScrollTo(position: number, smooth: boolean = false): void {
        (this._children.listControl as unknown as IAbstractColumnScrollControl).horizontalScrollTo(
            position,
            smooth
        );
    }

    horizontalScrollToElement(element: HTMLElement): void {
        (this._children.listControl as unknown as IAbstractColumnScrollControl).horizontalScrollToElement(
            element
        );
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
 * @cfg {Controls/_interface/IItemPadding/IPadding}
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

/**
 * @event Происходит при смене сортировки таблицы.
 * @name Controls/_grid/Grid#sortingChanged
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Array.<Controls/_interface/ISorting/TSorting.typedef>} sorting Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/sorting/ сортировки}.
 */
