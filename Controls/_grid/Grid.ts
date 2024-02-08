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
import type { EdgeState, TScrollIntoViewAlign } from 'Controls/columnScrollReact';
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
 * @ignoreOptions filter navigation sorting selectedKeys excludedKeys multiSelectVisibility markerVisibility displayProperty groupHistoryId markedKey
 *
 * @public
 * @demo Controls-demo/gridNew/Base/Index
 */

export default class Grid<TControl extends GridControl = GridControl> extends List<TControl> {
    protected _viewTemplate: TControl = GridControl;
    protected _useReactScrollContexts: boolean = false;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    protected _beforeMount(options: IGridOptions, ...args: unknown[]): Promise<void> | void {
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

    horizontalScrollToElement(
        element: HTMLElement,
        align?: TScrollIntoViewAlign,
        smooth?: boolean
    ): void {
        (
            this._children.listControl as unknown as IAbstractColumnScrollControl
        ).horizontalScrollToElement(element, align, smooth);
    }

    scrollToLeft(smooth?: boolean): void {
        (this._children.listControl as unknown as IAbstractColumnScrollControl).scrollToLeft(
            smooth
        );
    }

    scrollToRight(smooth?: boolean): void {
        (this._children.listControl as unknown as IAbstractColumnScrollControl).scrollToRight(
            smooth
        );
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
 * @cfg {Boolean} Видимость ресайзера ширин колонок.
 * @name Controls/_grid/Grid#resizerVisibility
 * @remark
 * После включения можно настроить {@link /docs/js/Controls/grid/IColumn/options/maxWidth/ maxWidth} и {@link /docs/js/Controls/grid/IColumn/options/minWidth/ minWidth}
 * @demo Controls-demo/gridNew/ResizerVisibility/Index
 * @see Controls/_grid/display/interface/IColumn#maxWidth
 * @see Controls/_grid/display/interface/IColumn#minWidth
 */

/**
 * @event Controls/_grid/Grid#sortingChanged Происходит при смене сортировки таблицы.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Array.<Controls/_interface/ISorting/TSorting.typedef>} sorting Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/sorting/ сортировки}.
 */

/**
 * @name Controls/_grid/Grid#filter
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {Object} Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/ объекта фильтра}. Фильтр отправляется в запрос к источнику для получения данных.
 * @remark
 * При изменении фильтра важно передавать новый объект фильтра, изменение объекта по ссылке не приведет к желаемому результату.
 */

/**
 * @name Controls/_grid/Grid#navigation
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {Controls/interface:INavigationOptionValue} Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/ навигации} в {@link /doc/platform/developmentapl/interface-development/controls/list/ списке}.
 */

/**
 * @name Controls/_grid/Grid#sorting
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {Array.<Controls/_interface/ISorting/TSorting.typedef>} Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/sorting/ сортировки}.
 * @demo Controls-demo/gridNew/Sorting/SortingButton/Index
 * @remark
 * Допустимы значения направления сортировки ASC/DESC.
 *
 * * В таблицах можно изменять сортировку нажатием кнопки сортировки в конкретной ячейке заголовкв таблицы. Для этого нужно в {@link /doc/platform/developmentapl/interface-development/controls/list/grid/header/ конфигурации ячейки шапки} задать свойство {@link Controls/grid:IHeaderCell#sortingProperty sortingProperty}.
 * Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/grid/header/sorting/ здесь}
 *
 * * При отсутствии заголовков в реестре можно воспользоваться кнопкой открытия меню сортировки. Для этого нужно добавить на страницу и настроить контрол {@link Controls/sorting:Selector}.
 * Подробнее читайте {@link /doc/platform/developmentapl/interface-development/controls/list/sorting/table/ здесь}
 *
 * Выбранную сортировку можно сохранять. Для этого используют опцию {@link Controls/grid:IPropStorage#propStorageId propStorageId}.
 */

/**
 * @name Controls/_grid/Grid#source
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {Types/source:ICrud|Types/source:ICrudPlus} Объект реализующий интерфейс {@link Types/source:ICrud}, необходимый для работы с источником данных.
 * @remark
 * Более подробно об источниках данных вы можете почитать {@link /doc/platform/developmentapl/interface-development/data-sources/ здесь}.
 */

/**
 * @name Controls/_grid/Grid#keyProperty
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {String} Имя поля записи, в котором хранится {@link /docs/js/Types/entity/applied/PrimaryKey/ первичный ключ}.
 * @remark Например, идентификатор может быть первичным ключом записи в базе данных.
 * Если keyProperty не задан, то значение будет взято из source.
 */
/**
 * @name Controls/_grid/Grid#selectedKeys
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {Array.<Number|String>} Набор ключей {@link /doc/platform/developmentapl/interface-development/controls/list/actions/multiselect/select/#all выбранных элементов}.
 */

/**
 * @name Controls/_grid/Grid#excludedKeys
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {Array.<Number|String>} Набор ключей {@link /doc/platform/developmentapl/interface-development/controls/list/actions/multiselect/select/#excluded-keys исключенных элементов}.
 */

/**
 * @name Controls/_grid/Grid#displayProperty
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {String} Имя поля записи, содержимое которого будет отображаться по умолчанию.
 * @default title
 */

/**
 * @name Controls/_grid/Grid#groupHistoryId
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {String} Идентификатор, по которому на {@link /doc/platform/developmentapl/middleware/parameter_service/ Сервисе параметров} сохраняется текущее {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/group/ состояние развернутости групп}.
 */

/**
 * @name Controls/_grid/Grid#markedKey
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {Types/source:ICrud#CrudEntityKey} Идентификатор элемента, который выделен {@link /doc/platform/developmentapl/interface-development/controls/list/actions/marker/ маркером}.
 * @remark
 * Если сделан bind на эту опцию, но она передана изначально в значении undefined,
 * то установка маркера работает аналогично тому, как если бы bind не был задан (по внутреннему состоянию контрола).
 * @demo Controls-demo/list_new/Marker/OnMarkedKeyChanged/Index
 * @see markerVisibility
 * @see markedKeyChanged
 * @see beforeMarkedKeyChanged
 * @see Controls/list:IListNavigation#moveMarkerOnScrollPaging
 */

/**
 * @name Controls/_grid/Grid#multiSelectVisibility
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {String} Видимость {@link /doc/platform/developmentapl/interface-development/controls/list/actions/multiselect/ чекбоксов}.
 * @variant visible Показать.
 * @variant hidden Скрыть.
 * @variant onhover Показывать при наведении.
 * @default hidden
 * @remark
 * В режиме onhover логика работы следующая:
 * * На Touch-устройствах чекбокс и место под него будет скрыто до тех пор, пока по любой записи не сделают свайп вправо
 * * На Desktop устройствах отображается место под чекбокс, но при наведении на запись отображается сам чекбокс.
 * @demo Controls-demo/list_new/MultiSelect/MultiSelectVisibility/OnHover/Index
 * @see multiSelectAccessibilityProperty
 * @see multiSelectPosition
 */
