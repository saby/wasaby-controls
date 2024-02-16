/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import {
    ISortingOptions,
    ISourceOptions,
    IHierarchyOptions,
    INavigationOptions,
    INavigationSourceConfig,
    IFilterOptions,
    IPropStorageOptions,
    ISearchOptions,
    IHierarchySearchOptions,
    ISelectFieldsOptions,
    TSelectionType,
} from 'Controls/interface';
import type { IColumn } from 'Controls/grid';
import { IFilterItem } from 'Controls/filter';
import { IBaseDataFactoryArguments } from '../../interface/IDataFactory';
import { IListDataFactoryArgumentsCompatible } from './IListDataFactoryCompatible';
import type { TSelectionCountMode, ISelectionCountModeOptions } from 'Controls/interface';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { Form, TViewMode, TKey, TFilter } from 'Controls-DataEnv/interface';
import { TCollectionType } from 'Controls/dataFactory';

interface IFilterHistoryLoaderResult {
    filterButtonSource: IFilterItem[];
    filter: TFilter;
    historyItems: IFilterItem[];
}

/**
 * Интерфейс аргументов фабрики списка.
 * @interface Controls/_dataFactory/List/_interface/IListDataFactoryArguments
 * @implements Controls/interface/IPromisedSelectable
 * @implements Controls/interface:IHierarchy
 * @implements Controls/interface:ISearchValue
 * @implements Controls/interface:ISorting
 * @implements Controls/interface:INavigation
 * @implements Controls/interface:ISource
 * @implements Controls/interface:ISearch
 * @implements Controls/interface:IHierarchySearch
 * @implements Controls/interface:IFilter
 * @implements Controls/interface:IExpandedItems
 * @implements Controls-DataEnv/_dataFactory/interface/IBaseDataFactoryArguments
 * @implements Controls/interface/IGroupedGrid
 * @implements Controls/interface:IPropStorage
 * @ignoreEvents beforeSelectionChanged excludedKeysChanged selectedKeysChanged groupCollapsed groupExpanded expandedItemsChanged
 * @ignoreOptions childrenProperty dataLoadCallback dataLoadErrback groupProperty groupTemplate collapsedGroups dataLoadCallback dataLoadErrback trim
 * @public
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListDataFactoryArguments#filterDescription
 * @cfg {Array.<Controls/filter:IFilterItem>} Элементы структуры фильтров.
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListDataFactoryArguments#historyId
 * @cfg {String} Идентификатор, под которым будет сохранена история фильтра.
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListDataFactoryArguments#saveToUrl
 * @cfg {boolean} Включает запись в URL примененные фильтры
 * @default false
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListDataFactoryArguments#root
 * @cfg {Number|String} Идентификатор корневого узла. Значение опции root добавляется в фильтре в поле {@link Controls/interface:IHierarchy/parentProperty parentProperty}.
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListDataFactoryArguments#rootHistoryId
 * @cfg {String} Идентификатор, по которому на {@link /doc/platform/developmentapl/middleware/parameter_service/ Сервисе параметров} сохраняется текущий корень.
 * @remark Для корректной работы при удалении используйте действие "Удаление записей"
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListDataFactoryArguments#listActions
 * @cfg {String} Имя модуля, который экспортирует набор экшенов для панели массовых операций. Подробнее в статье {@link /doc/platform/developmentapl/interface-development/controls/list/actions/new-operations/panel-and-list/ Связь панели действий и списка.}
 */

/**
 * @typedef {Object} ISelectedCountConfig
 * @property {Types/_source/IRpc} rpc источник данных, поддерживающий RPC
 * @property {String} command Имя вызываемого метода
 * @property {Object} data Параметры вызываемого метода
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListDataFactoryArguments#selectedCountConfig
 * @cfg {ISelectedCountConfig} Конфигурация для получения счётчика отмеченных записей.
 * Для подсчёта счётчика будет вызван метод, указанный в поле command.
 * В метод будут переданы параметры из поля data, а так же filter c полем selection.
 * Если в data передан filter, то в filter будет добавлено поле selection.
 * В качестве результата работы метода ожидается Record c полем count, в котором должен лежать счётчик в виде числа.
 * @default undefined
 * @example
 * <pre class="brush: html">
 * // TypeScript
 * import {SbisService} from 'Types/source';
 *
 *
 *
 * private _getSelectedCountConfig() {
 *    return {
 *       rpc: new SbisService({
 *          endpoint: 'Employee'
 *       }),
 *       command: 'employeeCount',
 *       data: {
 *          filter: this._filter
 *       }
 *    }
 * }
 * </pre>
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListDataFactoryArguments#displayProperty
 * @cfg {String} Имя свойства записи, значение которого отображается
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListDataFactoryArguments#deepReload
 * @cfg {Boolean}
 * @description
 * Определяет, нужно ли выполнять перезагрузку с сохранением развернутых узлов.
 * Подробно про мультинавигацию можно прочесть в статьях:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/tree/node/managing-node-expand/#multi-navigation Перезагрузка дерева с сохранением развернутых узлов},
 * * {@link /doc/platform/developmentapl/service-development/service-contract/logic/list/contract/#request-navigation-page-multinavigation Контракт списочного контрола},
 * * {@link /doc/platform/developmentapl/service-development/service-contract/logic/list/navigate/multinavigation/ Множественная навигация в списочных контролах}.
 *
 * @remark
 * Перезагрузка выполняется с сохранением развернутых узлов, даже при изменении опций filter, source, sorting и тд.
 * В поле фильтра, указанное в parentProperty будет отправлен массив развернутых узлов.
 * Если в результате запроса для этих узлов будут присланы дочерние элементы, то узлы останутся развернутыми, иначе они будут свёрнуты.
 * **Примечание.** Постраничная навигация в запросе передается для корня и её параметр {@link Controls/_interface/INavigation/INavigationPageSourceConfig.typedef pageSize} необходимо применять для всех узлов.
 * @default false
 * @example
 * Пример списочного метода БЛ
 * <pre class="brush: python">
 * def Test.MultiRoot(ДопПоля, Фильтр, Сортировка, Навигация):
 *      rs = RecordSet(CurrentMethodResultFormat())
 *      if Навигация.Type() == NavigationType.ntMULTI_ROOT:
 *          nav_result = {}
 *          for id, nav in Навигация.Roots().items():
 *              # Запрашиваем данные по одному разделу.
 *              Фильтр.Раздел = id
 *              tmp_rs = Test.MultiRoot(ДопПоля, Фильтр, Сортировка, nav)
 *              # Склеиваем результаты.
 *              for rec in tmp_rs:
 *                  rs.AddRow(rec)
 *              # Формируем общий результат навигации по всем разделам.
 *              nav_result[ id ] = tmp_rs.nav_result
 *          rs.nav_result = NavigationResult(nav_result)
 *      else:
 *          # Тут обработка обычной навигации, например, вызов декларативного списка.
 *          rs = Test.DeclList(ДопПоля, Фильтр, Сортировка, Навигация)
 *      return rs
 * </pre>
 * @see Controls/interface:IBasePositionSourceConfig#multiNavigation
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListDataFactoryArguments#hasChildrenProperty
 * @cfg {String} Имя поля записи, в котором хранится информация о наличии дочерних элементов в узле {@link Controls/tree:View дерева}.
 * @remark
 * Для работы опции hasChildrenProperty установите опцию {@link expanderVisibility} в значение "hasChildren".
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListDataFactoryArguments#selectionType
 * @cfg {String} Тип записей, которые можно выбрать.
 * @default all
 * @variant node Только узлы доступны для выбора.
 * @variant leaf Только листья доступны для выбора.
 * @variant all Все типы записей доступны для выбора.
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListDataFactoryArguments#searchStartingWith
 * @cfg {String}
 * Режим поиска в иерархическом проводнике.
 * * root Поиск происходит в {@link /doc/platform/developmentapl/interface-development/controls/list/explorer/navigation/root/ корне}.
 * * current Поиск происходит в текущем разделе.
 * @default 'root'
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListDataFactoryArguments#viewMode
 * @cfg {Controls/_explorer/interface/IExplorer/TExplorerViewMode.typedef}
 * {@link /doc/platform/developmentapl/interface-development/controls/list/explorer/view-mode/ Режим отображения} иерархического проводника.
 * @default table Таблица.
 * @demo Controls-demo/explorerNew/Base/Index
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListDataFactoryArguments#nodeTypeProperty
 * @cfg {String} Имя свойства, содержащего информацию о типе узла.
 * @remark
 * Используется для отображения узлов в виде групп. (См. {@link Controls/treeGrid:IGroupNodeColumn Колонка списка с иерархической группировкой.})
 * Если в RecordSet в указанном свойстве с БЛ приходит значение 'group', то такой узел должен будет отобразиться как группа.
 * При любом другом значении узел отображается как обычно с учётом nodeProperty
 * @example
 * В следующем примере показано, как настроить список на использование узлов-групп
 * <pre class="brush: html">
 * <!-- WML -->
 * <Controls.treeGrid:View
 *    source="{{_source}}"
 *    nodeProperty="{{parent@}}"
 *    parentProperty="{{parent}}"
 *    nodeTypeProperty="customNodeType"/>
 * </pre>
 *
 * <pre class="brush: js">
 * // TypeScript
 * class MyControl extends Control<IControlOptions> {
 *    _source: new Memory({
 *        keyProperty: 'id',
 *        data: [
 *            {
 *                id: 1,
 *                customNodeType: 'group',
 *                'parent@': true,
 *                parent: null
 *            },
 *            {
 *                id: 2,
 *                customNodeType: null,
 *                ...
 *            },
 *            {
 *                id: 3,
 *                customNodeType: 'group',
 *                'parent@': true,
 *                parent: null
 *            },
 *        ]
 *    })
 * }
 * </pre>
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListDataFactoryArguments#markedKey
 * @cfg {Types/source:ICrud#CrudEntityKey} Идентификатор элемента, который выделен {@link /doc/platform/developmentapl/interface-development/controls/list/actions/marker/ маркером}.
 * @demo Controls-demo/list_new/Marker/OnMarkedKeyChanged/Index
 * @see markerVisibility
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListDataFactoryArguments#markerVisibility
 * @cfg {Controls/_marker/interface/IMarkerList/TVisibility.typedef} Режим отображения {@link /doc/platform/developmentapl/interface-development/controls/list/actions/marker/ маркера}.
 * @demo Controls-demo/list_new/Marker/Base/Index В примере опция markerVisibility установлена в значение "onactivated".
 * @default onactivated
 * @see markedKey
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListDataFactoryArguments#filterHistoryLoader
 * @cfg {Function} Функция для загрузки истории фильтров самостоятельно
 * @remark Рекомендуется использовать только в случае, когда параллельно с историей фильтров нужно получить что-то еще, например, организацию
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListDataFactoryArguments#expandedItems
 * @cfg {Array.<String>|undefined} Идентификаторы развернутых узлов в {@link Controls/tree:View дереве}.
 * @default undefined
 * @remark
 * Чтобы развернуть все элементы списка, параметр expandedItems должен быть задан как массив, содержащий один элемент — "null". В этом случае предполагается, что все данные будут загружены сразу.
 * Настройка не работает, если источник данных задан через {@link Types/source:Memory}.
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListDataFactoryArguments#multiSelectVisibility
 * @cfg {String} Видимость чекбоксов.
 * @variant visible Показать.
 * @variant hidden Скрыть.
 * @variant onhover Показывать при наведении.
 * @default onhover
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListDataFactoryArguments#groupHistoryId
 * @cfg {String} Идентификатор, по которому на {@link /doc/platform/developmentapl/middleware/parameter_service/ Сервисе параметров} сохраняется текущее {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/group/ состояние развернутости групп}.
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListDataFactoryArguments#selectionCountMode
 * @cfg {Controls/_interface/ISelectionCountModeOptions/TSelectionCountMode.typedef} Тип подсчитываемых записей.
 * @default all
 * @demo Controls-ListEnv-demo/OperationsPanel/SelectionCountMode/Index
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListDataFactoryArguments#recursiveSelection
 * @cfg {Boolean} Определяет, будут ли выбираться дочерние элементы при выборе папки.
 * @default true
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListDataFactoryArguments#saveToUrl
 * @cfg {Boolean} Определяет, будут ли паметры фильтрации записаны в адресную строку браузера при их изменении
 * @default false
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListDataFactoryArguments#singleExpand
 * @cfg {Boolean} Режим единого развернутого узла.
 * @remark
 * В дереве можно задать такое поведение, при котором единовременно может быть развернут только один узел в рамках одного уровня иерархии. При развертывании нового узла предыдущий будет автоматически сворачиваться.
 * @default false
 * @variant true
 * @variant false
 * @demo Controls-demo/treeGridNew/ReverseType/SingleExpand/Index
 */

export interface IListDataFactoryArguments
    extends IBaseDataFactoryArguments,
        IListDataFactoryArgumentsCompatible,
        ISourceOptions,
        INavigationOptions<INavigationSourceConfig>,
        IFilterOptions,
        ISortingOptions,
        IHierarchyOptions,
        Partial<ISearchOptions>,
        IHierarchySearchOptions,
        ISelectFieldsOptions,
        ISelectionCountModeOptions,
        IPropStorageOptions {
    filterDescription?: IFilterItem[];
    selectedKeys?: TKey[];
    excludedKeys?: TKey[];
    editorsViewMode?: string;
    historyId?: string;
    historyItems?: IFilterItem[];
    filterHistoryLoader?: (
        filterDescription: IFilterItem[],
        historyId: string
    ) => Promise<IFilterHistoryLoaderResult>;
    groupHistoryId?: string;
    listActions?: string;
    multiSelectVisibility?: 'onhover' | 'hidden' | 'visible';
    hasChildrenProperty?: string;
    expandedItems?: TKey[];
    collapsedItems?: TKey[];
    singleExpand?: boolean;
    error?: Error;
    viewMode?: TViewMode;
    root?: TKey;
    displayProperty?: string;
    columns?: IColumn[];
    markedKey?: TKey;
    markerVisibility?: 'visible' | 'hidden' | 'onactivated';
    // Режим адаптивного поиска, позволяет отображать результаты поиска в виде "searchTile" при переходе в поиск из
    // режимов "tile" или "composite".
    // Сделано опционально, чтобы точечно переводить реестры на данное поведение, а после проверки - уже перевести всех.
    // https://online.sbis.ru/opendoc.html?guid=c0348293-2158-44af-ac44-bbb2878f3f20&client=3
    adaptiveSearchMode?: boolean;
    selectionCountMode?: TSelectionCountMode;
    recursiveSelection?: boolean;
    searchValueTrim?: boolean;
    activeElement?: TKey;
    name?: string[];
    formDataSlice?: typeof Form.slice;
    deepReload?: boolean;
    deepScrollLoad?: boolean;
    nodeTypeProperty?: string;
    saveToUrl?: boolean;
    rootHistoryId?: string;
    selectionType?: TSelectionType;
    collectionType?: TCollectionType;
    moveMarkerOnScrollPaging?: boolean;
    markItemByExpanderClick?: boolean;
    operationsPanelVisible?: boolean;
}
