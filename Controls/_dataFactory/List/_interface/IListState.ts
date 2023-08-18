/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import { TVisibility } from 'Controls/marker';
import { RecordSet } from 'Types/collection';
import { Rpc } from 'Types/source';
import { ControllerClass as FilterController, IFilterItem } from 'Controls/filter';
import { ControllerClass as SearchController } from 'Controls/search';
import { NewSourceController as SourceController, Path } from 'Controls/dataSource';
import { ControllerClass as OperationsController } from 'Controls/operations';
import {
    ISortingOptions,
    ISourceOptions,
    IHierarchyOptions,
    INavigationOptions,
    INavigationSourceConfig,
    ISelectFieldsOptions,
    ISearchOptions,
    Direction,
    ISelectionCountModeOptions,
} from 'Controls/interface';
import { TViewMode, TKey, TFilter } from 'Controls-DataEnv/interface';
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
    filterController?: FilterController;
    searchController?: SearchController;
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
 * @implements Controls/interface:IFilter
 * @implements Controls/interface/IGroupedGrid
 * @ignoreEvents beforeSelectionChanged excludedKeysChanged selectedKeysChanged
 * @ignoreOptions groupTemplate
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
 * @cfg {Number|String} Идентификатор корневого узла. Значение опции root добавляется в фильтре в поле {@link Controls/interface:IHierarchy/parentProperty parentProperty}.
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListState#listActions
 * @cfg {Array<Controls/actions:IListActionOptions>} Набор экшенов для панели массовых операций.
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
export interface IListState
    extends ISourceOptions,
        ISelectFieldsOptions,
        ISearchOptions,
        IHierarchyOptions,
        ISortingOptions,
        INavigationOptions<INavigationSourceConfig>,
        IListCompatibleState,
        ISelectionCountModeOptions {
    selectedKeys: TKey[];
    excludedKeys: TKey[];
    expandedItems?: TKey[];
    root?: TKey;
    rootHistoryId?: string;
    count?: number | null | void;
    historyId?: string;
    isAllSelected: boolean;
    countLoading: boolean;
    selectedCountConfig?: ICountConfig;
    operationsPanelVisible?: boolean;
    selectionViewMode?: string;
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
}
