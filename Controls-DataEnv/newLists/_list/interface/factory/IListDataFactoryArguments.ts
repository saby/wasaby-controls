import { IAbstractListDataFactoryArguments } from 'Controls-DataEnv/abstractList';
import {
    ISourceOptions,
    IFilterOptions,
    type TKey,
    type IFilterDescriptionItem,
} from 'Controls-DataEnv/interface';
import {
    INavigationOptions,
    INavigationSourceConfig,
    IHierarchyOptions,
    ISelectFieldsOptions,
    ISelectionCountModeOptions,
    IPrefetchOptions,
    IPropStorageOptions,
    TSelectionType,
    TSortingOptionValue,
    IUserPeriod,
} from 'Controls-DataEnv/listTypes';
import { Form } from 'Controls-DataEnv/dataFactory';

import type { NewSourceController, ISourceControllerOptions } from 'Controls/dataSource';

import type { IListSavedState } from '../IListSavedState';
import type { ISelectedCountConfig } from '../IListState';

/**
 * Сохраненные параметры сортировки/фильтрации
 * */
export interface TSavedParams {
    sorting?: TSortingOptionValue;
    countFilterValue?: number;
    root?: TKey;
}

/**
 * Интерфейс аргументов фабрики списка.
 */
export interface IListDataFactoryArguments
    extends IAbstractListDataFactoryArguments,
        ISourceOptions,
        INavigationOptions<INavigationSourceConfig>,
        IFilterOptions,
        IHierarchyOptions,
        ISelectFieldsOptions,
        ISelectionCountModeOptions,
        IPropStorageOptions,
        IPrefetchOptions {
    storedColumnsWidths?: Record<string, string>;
    listSavedState?: IListSavedState;
    clearResult?: boolean;
    sourceController?: NewSourceController;
    expanderVisibility?: 'visible' | 'hasChildren';
    listConfigStoreId?: string;
    /**
     * Имя поля записи, в котором хранится информация о наличии дочерних элементов в узле дерева.
     * @remark
     * Для работы опции hasChildrenProperty установите опцию expanderVisibility в значение "hasChildren".
     */
    hasChildrenProperty?: string;
    /**
     * Имя свойства, содержащего информацию о типе узла.
     * @remark
     * Используется для отображения узлов в виде групп. (См. {@link Controls/treeGrid:IGroupNodeColumn Колонка списка с иерархической группировкой.})
     * Если в RecordSet в указанном свойстве с БЛ приходит значение 'group', то такой узел должен будет отобразиться как группа.
     * При любом другом значении узел отображается как обычно с учётом nodeProperty
     */
    nodeTypeProperty?: string;
    /**
     * Идентификатор, по которому на {@link /doc/platform/developmentapl/middleware/parameter_service/ Сервисе параметров} сохраняется текущий корень.
     * @remark Для корректной работы при удалении используйте действие "Удаление записей"
     */
    rootHistoryId?: string;
    /**
     * Идентификатор, по которому на {@link /doc/platform/developmentapl/middleware/parameter_service/ Сервисе параметров} сохраняется текущее {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/group/ состояние развернутости групп}.
     */
    groupHistoryId?: string;
    supportSelection?: boolean;
    /**
     * Конфигурация для получения счётчика отмеченных записей.
     * Для подсчёта счётчика будет вызван метод, указанный в поле command.
     * В метод будут переданы параметры из поля data, а так же filter c полем selection.
     * Если в data передан filter, то в filter будет добавлено поле selection.
     * В качестве результата работы метода ожидается Record c полем count, в котором должен лежать счётчик в виде числа.
     */
    selectedCountConfig?: ISelectedCountConfig;
    /**
     * Определяет, будут ли выбираться дочерние элементы при выборе папки.
     */
    recursiveSelection?: boolean;
    /**
     * Тип записей, которые можно выбрать.
     */
    selectionType?: TSelectionType;
    isMassSelectMode?: boolean;
    selectAncestors?: boolean;
    selectDescendants?: boolean;
    editorsViewMode?: string;
    // Режим адаптивного поиска, позволяет отображать результаты поиска в виде "searchTile" при переходе в поиск из
    // режимов "tile" или "composite".
    // Сделано опционально, чтобы точечно переводить реестры на данное поведение, а после проверки - уже перевести всех.
    // https://online.sbis.ru/opendoc.html?guid=c0348293-2158-44af-ac44-bbb2878f3f20&client=3
    adaptiveSearchMode?: boolean;
    /**
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
     */
    deepReload?: boolean;
    /**
     * Флаг, позволяющий запрашивать дочерние узлы при подгрузке по скроллу.
     * @remark
     * Опция необходима для подгрузки дерева с раскрытыми узлами по скроллу. При этом необходимо с БЛ линейно
     * возвращать строго отсортированные данные дерева с раскрытыми узлами.
     */
    deepScrollLoad?: boolean;
    moveMarkerOnScrollPaging?: boolean;
    /**
     * Выбранное значение {@link Controls-ListEnv/CountFilter фильтра по счетчикам}.
     */
    countFilterValue?: string | Date[];
    /**
     * Связные фильтры для {@link Controls-ListEnv/CountFilter фильтра по счетчикам}. При изменении выбранного значения контрола "Фильтр по счетчикам" у этих фильтров будет изменено поле filter.
     */
    countFilterLinkedNames?: string[];
    /**
     * Функция обратного вызова для получения значения фильтра после выбора из {@link Controls-ListEnv/CountFilter фильтра по счетчикам}.
     * Данную функцию необходимо использовать в случае, если значение поставляемое контролом
     * по каким то причинам не подходит для запроса к источнику данных. Например, метод БЛ
     * не поддерживает фильтрацию по массиву дат и ожидает значения в двух полях фильтра.
     */
    countFilterValueConverter?: string;
    /**
     * Пользовательские периоды для {@link Controls-ListEnv/CountFilter фильтра по счетчикам}, будут добавлены как пункты меню.
     * Для каждого пользовательского периода необходимо задать функцию получения периода getValueFunctionName
     */
    countFilterUserPeriods?: IUserPeriod[];
    /**
     * Тип выбираемого периода для {@link Controls-ListEnv/CountFilter фильтра по счетчикам}
     * @variant current за текущий период
     * @variant last за последний период
     */
    countFilterPeriodType?: string;
    error?: Error;
    activeElement?: TKey;
    onSavedParamsLoaded?:
        | string
        | ((
              args: ISourceControllerOptions,
              params: TSavedParams
          ) => TSavedParams | Promise<TSavedParams>);
    name?: string[];
    formDataSlice?: typeof Form.slice;
    markItemByExpanderClick?: boolean;
    // Параметр используется в loadData для получения SourceController. Взят из IControllerOptions
    loadTimeout?: number;
    /**
     * @deprecated
     * В слайсах заменяется на filterDescription
     * */
    filterButtonSource?: IFilterDescriptionItem[];
    // https://online.sbis.ru/opendoc.html?guid=f5e80392-e23c-4266-b4e5-cec270562c47&client=3
    fix1193265616?: boolean;

    // https://online.sbis.ru/opendoc.html?guid=daefeb2b-82fd-47d3-bd70-f6ab0ced1e85&client=3
    task1186833531?: boolean;
}
