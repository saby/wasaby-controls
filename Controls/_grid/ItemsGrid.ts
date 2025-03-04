/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import { isFullGridSupport } from 'Controls/display';
import { IItemsViewOptions, ItemsView as ListItemsView } from 'Controls/baseList';
import { isLoaded, loadSync } from 'WasabyLoader/ModulesLoader';
import { GridView } from 'Controls/gridRender';
import { GridControl, IGridControlOptions } from './GridControl';
import { resolveViewControls } from './utils/ReactViewControlsResolver';
import type { IAbstractColumnScrollControl } from 'Controls/gridColumnScroll';
import { addPageDeps } from 'UI/Deps';

export interface IItemsGridOptions extends IItemsViewOptions, IGridControlOptions {
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
 * @implements Controls/interface:IMultiSelectable
 * @implements Controls/grid:IGridControl
 * @implements Controls/marker:IMarkerList
 * @implements Controls/itemActions:IItemActions
 * @implements Controls/_interface/ITrackedProperties
 *
 * @ignoremethods scrollToColumn scrollToLeft scrollToRight freezeHoveredItem unfreezeHoveredItems getItems reloadItem groupTemplate
 *
 * @public
 */
export default class ItemsGrid<
    TOptions extends IItemsGridOptions = IItemsGridOptions,
    TListControl extends GridControl = GridControl,
> extends ListItemsView<TOptions, TListControl> {
    // region override base template props
    protected _viewName: Function = null;
    protected _viewTemplate: TListControl = GridControl;
    protected _viewModelConstructor: string = 'Controls/grid:GridCollection';

    // endregion

    protected _beforeMount(
        options: IItemsGridOptions,
        ...args: unknown[]
    ): ReturnType<ListItemsView['_beforeMount']> {
        const superArgs = [options, ...args] as unknown as Parameters<
            ListItemsView['_beforeMount']
        >;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const superResult = super._beforeMount(...superArgs);

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

        resolveViewControls(this, options, this._getWasabyView(), this._getWasabyViewControl());
        return superResult;
    }

    protected _getWasabyView() {
        return GridView;
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

    horizontalScrollToElement(element: HTMLElement, align, smooth): void {
        (
            this._children.listControl as unknown as IAbstractColumnScrollControl
        ).horizontalScrollToElement(element, align, smooth);
    }

    static defaultProps: Partial<IItemsGridOptions> = {
        isFullGridSupport: isFullGridSupport(),
    };
}

/**
 * @name Controls/grid:ItemsView#footerTemplate
 * @deprecated Следует использовать {@link https://n.sbis.ru/wasaby/knowledge?article=efaebc77-0882-46cc-999b-26838fe150f6&published=true&mode=readList реакт подход к рендеру таблиц}
 * @cfg {TemplateFunction|String} Пользовательский шаблон отображения подвала контрола.
 * В опцию необходимо передавать сконфигурированный базовый шаблон {@link Controls/grid:FooterTemplate}.
 *
 * В области видимости доступны следующие опции:
 * * item - Элемент футера из списочной коллекции
 * * subPixelArtifactFix - Опция для решения проблемы с промежутками между стики-элементами на IPad.
 * * pixelRatioBugFix - Опция для решения проблемы с промежутками между стики-элементами на IPad.
 * * needItemActionsSpacing - Требуется ли добавлять специальный отступ для операций над записью.
 * * containerSize - Размер контейнера при пустом представлении
 * * style - Стиль отображения, master или default
 * * backgroundStyle - стиль заливки для стики элементов
 * @demo Controls-demo/gridNew/Footer/FooterTemplate/Index
 */

/**
 * @name Controls/grid:ItemsView#itemTemplate
 * @deprecated Следует использовать {@link https://n.sbis.ru/wasaby/knowledge?article=efaebc77-0882-46cc-999b-26838fe150f6&published=true&mode=readList реакт подход к рендеру таблиц}
 * @cfg {String|TemplateFunction} Шаблон отображения элемента.
 * @default undefined
 * @markdown
 * @remark
 * Позволяет установить пользовательский шаблон отображения элемента (**именно шаблон**, а не контрол!). При установке шаблона **ОБЯЗАТЕЛЕН** вызов базового шаблона {@link Controls/grid:ItemTemplate}. Шаблон Controls/grid:ItemTemplate поддерживает {@link Controls/grid:ItemTemplate параметры}, с помощью которых можно изменить отображение элемента.
 *
 * В разделе "Примеры" показано как с помощью директивы {@link /doc/platform/developmentapl/interface-development/ui-library/template-engine/#ws-partial ws:partial} задать пользовательский шаблон. Также в опцию itemTemplate можно передавать и более сложные шаблоны, которые содержат иные директивы, например {@link /doc/platform/developmentapl/interface-development/ui-library/template-engine/#ws-if ws:if}. В этом случае каждая ветка вычисления шаблона должна заканчиваться директивой ws:partial, которая встраивает Controls/grid:ItemTemplate.
 *
 * Дополнительно о работе с шаблоном вы можете прочитать в {@link /doc/platform/developmentapl/interface-development/controls/list/grid/item/ руководстве разработчика}.
 * @example
 * В следующем примере показано, как изменить параметры шаблона.
 * <pre class="brush: html">
 * <Controls.grid:View>
 *    <ws:itemTemplate>
 *       <ws:partial template="Controls/grid:ItemTemplate" highlightOnHover="{{false}}" />
 *    </ws:itemTemplate>
 * </Controls.grid:View>
 * </pre>
 * @demo Controls-demo/gridNew/ItemTemplate/NoHighlight/Index
 * @see Controls/interface/IGridItemTemplate#itemTemplateProperty
 * @see Controls/grid:ItemTemplate
 */

/**
 * @name Controls/grid:ItemsView#groupTemplate
 * @deprecated Следует использовать {@link https://n.sbis.ru/wasaby/knowledge?article=efaebc77-0882-46cc-999b-26838fe150f6&published=true&mode=readList реакт подход к рендеру таблиц}
 * @cfg {String|TemplateFunction} Шаблон отображения {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/visual/ заголовка группы}.
 * @default undefined
 * @remark
 * Конфигурация визуального представления группировки задаётся в опции groupTemplate путём настройки шаблона группировки {@link Controls/grid:GroupTemplate}.
 * @demo Controls-demo/gridNew/Grouped/Custom/Index
 * @example
 * <pre class="brush: html">
 * <Controls.grid:View>
 *    <ws:groupTemplate>
 *       <ws:partial template="Controls/grid:GroupTemplate"
 *          separatorVisibility="{{false}}"
 *          expanderVisible="{{false}}"
 *          textAlign="left"
 *          scope="{{groupTemplate}}">
 *          <ws:contentTemplate>
 *             <ws:if data="{{contentTemplate.item.contents === 'nonexclusive'}}">Неисключительные права</ws:if>
 *             <ws:if data="{{contentTemplate.item.contents === 'works'}}">Работы</ws:if>
 *          </ws:contentTemplate>
 *       </ws:partial>
 *    </ws:groupTemplate>
 * </Controls.grid:View>
 * </pre>
 * @see groupHistoryId
 * @see collapsedGroups
 * @see groupExpanded
 * @see groupCollapsed
 * @see groupProperty
 */

/**
 * Пользовательский шаблон отображения контрола без элементов.
 * @name Controls/grid:ItemsView#emptyTemplate
 * @deprecated Следует использовать {@link https://n.sbis.ru/wasaby/knowledge?article=efaebc77-0882-46cc-999b-26838fe150f6&published=true&mode=readList реакт подход к рендеру таблиц}
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
 * * {@link /doc/platform/developmentapl/interface-development/saby-design/help-system/pages/ подсказки на пустых страницах}
 * @deprecated Следует использовать {@link https://n.sbis.ru/wasaby/knowledge?article=efaebc77-0882-46cc-999b-26838fe150f6&published=true&mode=readList реакт подход к рендеру таблиц}
 */
