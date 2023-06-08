import {
    ISortingOptions,
    ISourceOptions,
    IHierarchyOptions,
    INavigationOptions,
    INavigationSourceConfig,
    IFilterOptions,
    IPropStorageOptions,
    ISearchOptions,
    ISelectFieldsOptions,
} from 'Controls/interface';
import type { IColumn } from 'Controls/grid';
import { IFilterItem } from 'Controls/filter';
import { TViewMode, TKey, TFilter } from 'Controls-DataEnv/interface';
import { IBaseDataFactoryArguments } from '../../interface/IDataFactory';
import { IListDataFactoryArgumentsCompatible } from './IListDataFactoryCompatible';

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
 * @implements Controls/interface:IFilter
 * @implements Controls/interface/IGroupedGrid
 * @implements Controls/interface:IPropStorage
 * @ignoreEvents beforeSelectionChanged excludedKeysChanged selectedKeysChanged
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
 * @name Controls/_dataFactory/List/_interface/IListDataFactoryArguments#root
 * @cfg {Number|String} Идентификатор корневого узла. Значение опции root добавляется в фильтре в поле {@link Controls/interface:IHierarchy/#parentProperty parentProperty}.
 */

/**
 * @name Controls/_dataFactory/List/_interface/IListDataFactoryArguments#listActions
 * @cfg {String} Имя модуля, который экспортирует набор экшенов для панели массовых операций.
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
 * @name Controls/_dataFactory/List/_interface/IListDataFactoryArguments#filterHistoryLoader
 * @cfg {Function} Функция для загрузки истории фильтров самостоятельно
 * @remark Рекомендуется использовать только в случае, когда параллельно с историей фильтров нужно получить что-то еще, например, организацию
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
        ISelectFieldsOptions,
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
    searchStartingWith?: 'root' | 'current';
    listActions?: string;
    multiSelectVisibility?: 'onhover' | 'hidden' | 'visible';
    hasChildrenProperty?: string;
    expandedItems?: TKey[];
    error?: Error;
    viewMode?: TViewMode;
    root?: TKey;
    displayProperty?: string;
    columns?: IColumn[];
    markedKey?: TKey;
    selectionViewMode?: 'selected' | 'all';
    // Режим адаптивного поиска, позволяет отображать результаты поиска в виде "searchTile" при переходе в поиск из
    // режимов "tile" или "composite".
    // Сделано опционально, чтобы точечно переводить реестры на данное поведение, а после проверки - уже перевести всех.
    // https://online.sbis.ru/opendoc.html?guid=c0348293-2158-44af-ac44-bbb2878f3f20&client=3
    adaptiveSearchMode?: boolean;
}
