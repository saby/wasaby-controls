import { IAbstractListState } from 'Controls-DataEnv/abstractList';
import { type IBaseSourceConfig, TSelectionCountMode } from 'Controls-DataEnv/listTypes';
import type { TViewMode, TKey } from 'Controls-DataEnv/interface';
import type { QuerySelectExpression, Rpc } from 'Types/source';
import type { RecordSet } from 'Types/collection';

import type { INavigationChanges } from 'Controls/dataSource';

import type * as IListStateParts from './IListStateParts';

/**
 * @property {Types/_source/IRpc} rpc источник данных, поддерживающий RPC
 * @property {String} command Имя вызываемого метода
 * @property {Object} data Параметры вызываемого метода
 */
export interface ISelectedCountConfig {
    rpc: Rpc;
    command: string;
    data: object;
}

/**
 * Интерфейс состояния списочного слайса.
 * @public
 */
export interface IListState
    extends IAbstractListState,
        IListStateParts.ISourceState,
        IListStateParts.ISearchState,
        IListStateParts.IOperationsPanelState,
        IListStateParts.IBreadcrumbsState,
        IListStateParts.ISelectionState {
    selectFields?: QuerySelectExpression;
    /**
     * Флаг, определяющий происходит ли в данный момент процесс загрузки счетчика
     */
    countLoading: boolean;
    activeElement?: TKey;
    /**
     * Определяет, будет ли установлен фокус в строке поиска
     */
    searchInputFocused: boolean;
    /**
     * Идентификатор, по которому на {@link /doc/platform/developmentapl/middleware/parameter_service/ Сервисе параметров} сохраняется текущий корень.
     * @remark Для корректной работы при удалении используйте действие "Удаление записей"
     */
    rootHistoryId?: string;
    listConfigStoreId?: string;
    listId?: string;
    showSelectedCount?: number | null;
    /**
     * Конфигурация для получения счётчика отмеченных записей.
     * Для подсчёта счётчика будет вызван метод, указанный в поле command.
     * В метод будут переданы параметры из поля data, а так же filter c полем selection.
     * Если в data передан filter, то в filter будет добавлено поле selection.
     * В качестве результата работы метода ожидается Record c полем count, в котором должен лежать счётчик в виде числа.
     */
    selectedCountConfig?: ISelectedCountConfig;
    selectionCountMode?: TSelectionCountMode;
    editorsViewMode?: string;
    /**
     * Режим отображения списка перед поиском
     */
    previousViewMode?: TViewMode;
    fallbackImage?: string;
    groupHistoryId?: string;
    adaptiveSearchMode?: boolean;
    /**
     * Идентификатор, по которому на {@link /doc/platform/developmentapl/middleware/parameter_service/ Сервисе параметров} сохраняется текущая сортировка.
     */
    propStorageId?: string;
    /**
     * Определяет, нужно ли выполнять перезагрузку с сохранением развернутых узлов.
     *
     * @remark
     * Перезагрузка выполняется с сохранением развернутых узлов, даже при изменении опций filter, source, sorting и тд.
     * В поле фильтра, указанное в parentProperty будет отправлен массив развернутых узлов.
     * Если в результате запроса для этих узлов будут присланы дочерние элементы, то узлы останутся развернутыми, иначе они будут свёрнуты.
     */
    deepReload?: boolean;
    deepScrollLoad?: boolean;
    nodeTypeProperty?: string;
    hasChildrenProperty?: string;
    expanderVisibility?: 'visible' | 'hasChildren';
    moveMarkerOnScrollPaging?: boolean;
    markItemByExpanderClick?: boolean;
    navigationChanges?: INavigationChanges;
    keepNavigation?: boolean;
    isThinInteractor?: boolean;
    ladderProperties?: string[];
    nodeHistoryId?: string;
    nodeHistoryType?: 'node' | 'group' | 'all';
    navigationSourceConfig?: IBaseSourceConfig;
    data?: RecordSet;
    // https://online.sbis.ru/opendoc.html?guid=f5e80392-e23c-4266-b4e5-cec270562c47&client=3
    fix1193265616?: boolean;
    // https://online.sbis.ru/opendoc.html?guid=b4a9ed7b-7a0f-4be3-898f-b69a7cf73402&client=3
    fix88221034174482?: boolean;
    // https://online.sbis.ru/opendoc.html?guid=1506d9ba-ed11-419a-8443-7ee7b2f091af&client=3
    fix88221034303402?: boolean;
}
