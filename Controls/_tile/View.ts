/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */
import {
    IAbstractListVirtualScrollControllerConstructor,
    View as List,
    TItemsViewReceivedState,
} from 'Controls/baseList';
import TileView, { ITileOptions } from './TileView';
import { HorizontalTileScrollController } from 'Controls/baseTile';
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
 * @extends Controls/list:View
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
 * @ignoreOptions filter navigation sorting selectedKeys excludedKeys multiSelectVisibility markerVisibility collapsedItems expandedItems hasChildrenProperty selectionType expanderVisibility expanderSize expanderPosition expandByItemClick expanderIcon expanderIconSize markItemByExpanderClick nodeFooterTemplate nodeFooterVisibilityCallback nodeMoreCaption singleExpand displayProperty groupHistoryId propStorageId parentProperty nodeProperty nodeHistoryType nodeHistoryId root nodeTypeProperty markedKey
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

    protected _beforeMount(
        options: ITileOptions,
        context?: object,
        receivedState?: TItemsViewReceivedState
    ): TItemsViewReceivedState {
        const result = super._beforeMount(options, context, receivedState);
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
        return result;
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
 * @cfg {Controls/_tile/interface/ITile/TileItemPadding.typedef} Конфигурация отступов между элементами плитки.
 * @demo Controls-demo/tileNew/ItemPadding/PaddingL/Index
 * @example
 * <pre class="brush: html; highlight: [4-8]">
 * <!-- WML -->
 * <Controls.tile:View storeId="listData" imageProperty="image">
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

/**
 * @name Controls/_tile/View#filter
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/context-data/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {Object} Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/ объекта фильтра}. Фильтр отправляется в запрос к источнику для получения данных.
 * @remark
 * При изменении фильтра важно передавать новый объект фильтра, изменение объекта по ссылке не приведет к желаемому результату.
 */

/**
 * @name Controls/_tile/View#navigation
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/context-data/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {Controls/interface:INavigationOptionValue} Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/navigation/ навигации} в {@link /doc/platform/developmentapl/interface-development/controls/list/ списке}.
 */

/**
 * @name Controls/_tile/View#sorting
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/context-data/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {Array.<Controls/_interface/ISorting/TSorting.typedef>} Конфигурация {@link /doc/platform/developmentapl/interface-development/controls/list/sorting/ сортировки}.
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
 * @name Controls/_tile/View#source
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/context-data/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {Types/source:ICrud|Types/source:ICrudPlus} Объект реализующий интерфейс {@link Types/source:ICrud}, необходимый для работы с источником данных.
 * @remark
 * Более подробно об источниках данных вы можете почитать {@link /doc/platform/developmentapl/interface-development/data-sources/ здесь}.
 */

/**
 * @name Controls/_tile/View#keyProperty
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/context-data/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {String} Имя поля записи, в котором хранится {@link /docs/js/Types/entity/applied/PrimaryKey/ первичный ключ}.
 * @remark Например, идентификатор может быть первичным ключом записи в базе данных.
 * Если keyProperty не задан, то значение будет взято из source.
 */
/**
 * @name Controls/_tile/View#selectedKeys
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/context-data/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {Array.<Number|String>} Набор ключей {@link /doc/platform/developmentapl/interface-development/controls/list/actions/multiselect/select/#all выбранных элементов}.
 */

/**
 * @name Controls/_tile/View#excludedKeys
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/context-data/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {Array.<Number|String>} Набор ключей {@link /doc/platform/developmentapl/interface-development/controls/list/actions/multiselect/select/#excluded-keys исключенных элементов}.
 */

/**
 * @name Controls/_tile/View#multiSelectVisibility
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/context-data/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
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

/**
 * @name Controls/_tile/View#markerVisibility
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/context-data/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {Controls/_marker/interface/IMarkerList/TVisibility.typedef} Режим отображения {@link /doc/platform/developmentapl/interface-development/controls/list/actions/marker/ маркера}.
 * @demo Controls-demo/list_new/Marker/Base/Index В примере опция markerVisibility установлена в значение "onactivated".
 * @default onactivated
 * @see markedKey
 * @see markedKeyChanged
 * @see beforeMarkedKeyChanged
 * @see Controls/list:IListNavigation#moveMarkerOnScrollPaging
 */

/**
 * @name Controls/_tile/View#displayProperty
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/context-data/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {String} Имя поля записи, содержимое которого будет отображаться по умолчанию.
 * @default title
 */

/**
 * @name Controls/_tile/View#groupHistoryId
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/context-data/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
 * @cfg {String} Идентификатор, по которому на {@link /doc/platform/developmentapl/middleware/parameter_service/ Сервисе параметров} сохраняется текущее {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/group/ состояние развернутости групп}.
 */

/**
 * @name Controls/_tile/View#markedKey
 * @deprecated Следует указать опцию {@link Controls/_interface/IStoreId#storeId storeId}, а также настроить предзагрузку. См {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/context-data/new-data-store/list-slice/ Слайс для работы со списочными компонентами}.
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
 * @name Controls/_tile/View#footerTemplate
 * @cfg {TemplateFunction|String} Пользовательский шаблон отображения подвала контрола.
 * В опцию можно передавать сконфигурированный базовый шаблон {@link Controls/list:FooterTemplate}.
 *
 * В области видимости доступны следующие опции:
 * * item - Элемент футера из списочной коллекции
 * * subPixelArtifactFix - Опция для решения проблемы с промежутками между стики-элементами на IPad.
 * * pixelRatioBugFix - Опция для решения проблемы с промежутками между стики-элементами на IPad.
 * * needItemActionsSpacing - Требуется ли добавлять специальный отступ для операций над записью.
 */
