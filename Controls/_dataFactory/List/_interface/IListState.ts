/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import { TVisibility } from 'Controls/marker';
import { RecordSet } from 'Types/collection';
import { Rpc } from 'Types/source';
import { IFilterItem } from 'Controls/filter';
import { NewSourceController as SourceController, Path } from 'Controls/dataSource';
import { ControllerClass as OperationsController } from 'Controls/operations';
import {
    ISortingOptions,
    ISourceOptions,
    IHierarchyOptions,
    INavigationOptions,
    INavigationSourceConfig,
    ISelectFieldsOptions,
    IHierarchySearchOptions,
    Direction,
    ISelectionCountModeOptions,
    ISelectionViewModeOptions,
    TSelectionType,
} from 'Controls/interface';
import { TViewMode, TKey, TFilter, ISelection } from 'Controls-DataEnv/interface';
import { IListAction } from 'Controls/actions';
import type { IColumn } from 'Controls/grid';

interface ICountConfig {
    rpc: Rpc;
    command: string;
    data: object;
}

export interface IErrorConfig {
    error: Error;
    direction?: Direction;
    loadKey?: TKey;
}

interface IListCompatibleState {
    sourceController?: SourceController;
    operationsController?: OperationsController;
    filterButtonItems?: IFilterItem[];
    listId?: string;
    data?: RecordSet;
}

/**
 * Интерфейс состояния списочного слайса.
 * @interface Controls/_dataFactory/List/_interface/IListState
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
 * @implements Controls/interface/IGroupedGrid
 * @implements Controls/interface:ISelectionViewMode
 * @ignoreEvents beforeSelectionChanged excludedKeysChanged selectedKeysChanged groupCollapsed groupExpanded expandedItemsChanged
 * @ignoreOptions groupTemplate trim dataLoadErrback dataLoadCallback
 * @public
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#filterDescription
 * @cfg {Array.<Controls/filter:IFilterItem>} Элементы структуры фильтров.
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#historyId
 * @cfg {String} Идентификатор, под которым будет сохранена история фильтра.
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#root
 * @cfg {Number|String} Идентификатор корневого узла. Значение опции root добавляется в фильтре в поле {@link Controls/interface:IHierarchy#parentProperty parentProperty}.
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#listActions
 * @cfg {Array<Controls/actions:IListActionOptions>} Текущий набор действий в списке. Подробнее в статье {@link /doc/platform/developmentapl/interface-development/controls/list/actions/new-operations/panel-and-list/ Связь панели действий и списка.}
 */

/**
 * @typedef {Object} ISelection
 * @property {Array.<String>} selected Отмеченные записи
 * @property {Array.<String>} excluded Исключенные из отметки записи
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#listCommandSelection
 * @cfg {ISelection} Объект с отметкой, который передаётся в команды ПМО при выполнении.
 * Подробнее в статье {@link /doc/platform/developmentapl/interface-development/controls/list/actions/new-operations/panel-and-list/ Связь панели действий и списка.}
 * @remark В некоторых сценариях объект с отметкой отличается от реальной отметки в списке.
 * Например, если в списке нет отмеченных записей, то команда должна применяться в записи, на которой стоит маркер.
 * Или после нажатия на кнопку 'Отобрать отмеченные' в ПМО, команды применяются к отобранным записям, даже если
 * в списке не стоит чекбоксов.
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#count
 * @cfg {null|Number|undefined} Количество выбранных записей в списке. null означает, что количество выбранных записей неопределено
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#isAllSelected
 * @cfg {boolean} Флаг, определяющий выбранны ли все записи в списке
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#countLoading
 * @cfg {boolean} Флаг, определяющий происходит ли в данный момент процесс загрузки счетчика
 */

/**
 * @typedef {Object} ISelectedCountConfig
 * @property {Types/_source/IRpc} rpc источник данных, поддерживающий RPC
 * @property {String} command Имя вызываемого метода
 * @property {Object} data Параметры вызываемого метода
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#selectedCountConfig
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
 * @name Controls/_dataFactory/List/_interface/IListState#operationsPanelVisible
 * @cfg {boolean} Флаг, определяющий открыта ли в данный момент панель массовых операций
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#viewMode
 * @cfg {String} Режим отображения списка
 * @default undefined
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#loading
 * @cfg {Boolean} Флаг, определяющий, идет ли в данный момент загрузка данных списка.
 * @default false
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#filterDetailPanelVisible
 * @cfg {Boolean} Флаг, определяющий, открыта ли в данный момент панель фильтров, связанная с данным слайсом списка.
 * @default false
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#items
 * @cfg {RecordSet} Данные списка.
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#breadCrumbsItems
 * @cfg {Path} Хлебные крошки списка.
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#breadCrumbsItemsWithoutBackButton
 * @cfg {Path} Хлебные крошки списка без учета кнопки назад.
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#backButtonCaption
 * @cfg {String} Заголовок кнопки назад. Составляется на основе хлебных крошек списка
 * @see breadCrumbsItems
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#displayProperty
 * @cfg {String} Имя свойства записи, значение которого отображается
 * @see items
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#error
 * @cfg {Error} Инстанс ошибки, произошедшей во время загрузки данных списка
 * @see items
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#expandedItems
 * @cfg {Array.<String>|undefined} Идентификаторы развернутых узлов в {@link Controls/tree:View дереве}.
 * @default undefined
 * @remark
 * Чтобы развернуть все элементы списка, параметр expandedItems должен быть задан как массив, содержащий один элемент — "null". В этом случае предполагается, что все данные будут загружены сразу.
 * Настройка не работает, если источник данных задан через {@link Types/source:Memory}.
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#multiSelectVisibility
 * @cfg {String} Видимость чекбоксов.
 * @variant visible Показать.
 * @variant hidden Скрыть.
 * @variant onhover Показывать при наведении.
 * @default onhover
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#supportSelection
 * @cfg {Boolean} Определяет, поддерживает ли метод, который вызывается для получения данных, параметр фильтрации {@link selection https://wi.sbis.ru/doc/platform/developmentapl/service-development/service-contract/logic/list/list-iterator/#selection}.
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#rootHistoryId
 * @cfg {String} Идентификатор, по которому на {@link /doc/platform/developmentapl/middleware/parameter_service/ Сервисе параметров} сохраняется текущий корень.
 * @remark Для корректной работы при удалении используйте действие "Удаление записей"
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#searchMisspellValue
 * @cfg {String} Значение строки поиска в правильной раскладке. Подробнее поиск со сменой раскладки описан в {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/search/change-layout/ Статье}
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#searchInputValue
 * @cfg {String} Значение строки поиска, которое отображается в поле поиска.
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#previousViewMode
 * @cfg {String} Режим отображения списка перед поиском
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#multiSelectVisibility
 * @cfg {String} Видимость чекбоксов.
 * @variant visible Показать.
 * @variant hidden Скрыть.
 * @variant onhover Показывать при наведении.
 * @default onhover
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#markerVisibility
 * @cfg {Controls/_marker/interface/IMarkerList/TVisibility.typedef} Режим отображения {@link /doc/platform/developmentapl/interface-development/controls/list/actions/marker/ маркера}.
 * @demo Controls-demo/list_new/Marker/Base/Index В примере опция markerVisibility установлена в значение "onactivated".
 * @default onactivated
 * @see markedKey
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#markedKey
 * @cfg {Types/source:ICrud#CrudEntityKey} Идентификатор элемента, который выделен {@link /doc/platform/developmentapl/interface-development/controls/list/actions/marker/ маркером}.
 * @demo Controls-demo/list_new/Marker/OnMarkedKeyChanged/Index
 * @see markerVisibility
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#propStorageId
 * @cfg {String} Идентификатор, по которому на {@link /doc/platform/developmentapl/middleware/parameter_service/ Сервисе параметров} сохраняется текущая сортировка.
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#listConfigStoreId
 * @cfg {String} Идентификатор сохраненного состояния списка. Будут сохранены при изменении: строка поиска, выделение, маркер, навигация.
 * @remark Состояние будет сохранено локально в браузере, после перезагрузки страницы оно восстановлено не будет.
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#searchStartingWith
 * @cfg {String}
 * Режим поиска в иерархическом проводнике.
 * * root Поиск происходит в {@link /doc/platform/developmentapl/interface-development/controls/list/explorer/navigation/root/ корне}.
 * * current Поиск происходит в текущем разделе.
 * @default 'root'
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#deepReload
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
 * @name Controls/_dataFactory/List/_interface/IListState#saveToUrl
 * @cfg {Boolean} Определяет, будут ли паметры фильтрации записаны в адресную строку браузера при их изменении
 * @default false
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#selectionType
 * @cfg {String} Тип записей, которые можно выбрать.
 * @default all
 * @variant node Только узлы доступны для выбора.
 * @variant leaf Только листья доступны для выбора.
 * @variant all Все типы записей доступны для выбора.
 */
export interface IListState
    extends ISourceOptions,
        ISelectFieldsOptions,
        IHierarchySearchOptions,
        IHierarchyOptions,
        ISortingOptions,
        INavigationOptions<INavigationSourceConfig>,
        IListCompatibleState,
        ISelectionCountModeOptions,
        ISelectionViewModeOptions {
    selectedKeys: TKey[];
    excludedKeys: TKey[];
    expandedItems?: TKey[];
    root?: TKey;
    rootHistoryId?: string;
    count?: number | null | void;
    showSelectedCount?: number | null;
    historyId?: string;
    isAllSelected: boolean;
    countLoading: boolean;
    selectedCountConfig?: ICountConfig;
    operationsPanelVisible?: boolean;
    searchMisspellValue?: string;
    searchInputValue?: string;
    filter: TFilter;
    filterDescription?: IFilterItem[];
    editorsViewMode?: string;
    viewMode?: TViewMode;
    previousViewMode?: TViewMode;
    fallbackImage?: string;
    loading: boolean;
    filterDetailPanelVisible?: boolean;
    command: string;
    items: RecordSet;
    breadCrumbsItems?: Path;
    breadCrumbsItemsWithoutBackButton?: Path;
    backButtonCaption?: string;
    multiSelectVisibility?: 'onhover' | 'hidden' | 'visible';
    markerVisibility?: TVisibility;
    markedKey?: TKey;
    listActions?: IListAction[];
    listCommandsSelection?: ISelection;
    activeElement?: TKey;
    displayProperty?: string;
    groupHistoryId?: string;
    errorConfig?: IErrorConfig;
    columns?: IColumn[];
    sliceOwnedByBrowser?: boolean;
    adaptiveSearchMode?: boolean;
    propStorageId?: string;
    listConfigStoreId?: string;
    searchStartingWith?: 'current' | 'root';
    deepReload?: boolean;
    deepScrollLoad?: boolean;
    saveToUrl?: boolean;
    selectionType?: TSelectionType;
}
