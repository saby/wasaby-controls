import { IAbstractListState } from 'Controls-DataEnv/abstractList';
import { type IBaseSourceConfig, TSelectionCountMode } from 'Controls-DataEnv/listTypes';
import type { TViewMode, TKey } from 'Controls-DataEnv/interface';
import type { QuerySelectExpression, Rpc } from 'Types/source';
import type { RecordSet } from 'Types/collection';

import type { INavigationChanges, TListStateProps } from 'Controls/dataSource';

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
    /**
     *
     */
    selectFields?: QuerySelectExpression;

    /**
     *
     */
    activeElement?: TKey;

    /**
     * Флаг, определяющий происходит ли в данный момент процесс загрузки счетчика
     */
    countLoading: boolean;

    /**
     * Определяет, будет ли установлен фокус в строке поиска
     */
    searchInputFocused: boolean;

    /**
     * Идентификатор, по которому на {@link /doc/platform/developmentapl/middleware/parameter_service/ Сервисе параметров} сохраняется текущий корень.
     * @remark Для корректной работы при удалении используйте действие "Удаление записей"
     */
    rootHistoryId?: string;

    /**
     * Идентификатор сохраненного состояния списка (поиск, раскрытые узлы, отметка и т.д.).
     * Используйте, если:
     * - вам необходимо сохранить состояние списка при SPA переходе на другую страницу
     * - вам нужно синхронизировать часть состояния между списками на разных вкладках. Например,
     *   сделать сохранение поиска при переключении между двумя вкладками.
     * @remark
     * Состояние хранится в рамках жизни страницы, т.е. открытие страницы в новой вкладке и
     * перезагрузка страницы приведут к потере сохраённого состояния.
     */
    listConfigStoreId?: string;
    /**
     * Поля состояния списка, которые будут сохраняться в оперативную память.
     * Используйте, если вам необходимо сохранить определённые состояния списка при SPA переходе на другую вкладку.
     * @example
     * В следующем примере демонстрируется конфигурация фабрик для списков,
     * для которых будет синхронизироваться значение поиска, даже если они находятся на разных вкладках.
     * <pre class="brush: js;">
     * const myFirstListFactoryConfig = {
     *     dataFactoryName: 'Controls/dataFactory:List',
     *     dataFactoryArguments: {
     *         source: new SbisService(...),
     *         searchParam: 'title',
     *         listConfigStoreId: 'myListConfigStoreId',
     *         listConfigStorePropsNames: ['searchValue']
     *     }
     * }
     *
     * const myFirstListFactoryConfig = {
     *     dataFactoryName: 'Controls/dataFactory:List',
     *     dataFactoryArguments: {
     *         source: new SbisService(...),
     *         searchParam: 'city',
     *         listConfigStoreId: 'myListConfigStoreId',
     *         listConfigStorePropsNames: ['searchValue']
     *     }
     * }
     * </pre>
     * @see listConfigStoreId
     */
    listConfigStorePropsNames?: TListStateProps;

    /**
     *
     */
    listId?: string;

    /**
     *
     */
    showSelectedCount?: number | null;

    /**
     * Конфигурация для получения счётчика отмеченных записей.
     * Для подсчёта счётчика будет вызван метод, указанный в поле command.
     * В метод будут переданы параметры из поля data, а так же filter c полем selection.
     * Если в data передан filter, то в filter будет добавлено поле selection.
     * В качестве результата работы метода ожидается Record c полем count, в котором должен лежать счётчик в виде числа.
     */
    selectedCountConfig?: ISelectedCountConfig;

    /**
     *
     */
    selectionCountMode?: TSelectionCountMode;

    /**
     *
     */
    editorsViewMode?: string;

    /**
     * Режим отображения списка перед поиском
     */
    previousViewMode?: TViewMode;

    /**
     *
     */
    fallbackImage?: string;

    /**
     * Идентификатор, по которому на {@link /doc/platform/developmentapl/middleware/parameter_service/ Сервисе параметров} сохраняется текущее {@link /doc/platform/developmentapl/interface-development/controls/list/grouping/group/ состояние развернутости групп}.
     */
    groupHistoryId?: string;

    /**
     *
     */
    adaptiveSearchMode?: boolean;

    /**
     * Идентификатор, по которому на {@link /doc/platform/developmentapl/middleware/parameter_service/ Сервисе параметров} сохраняется текущая сортировка.
     */
    propStorageId?: string;

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

    /**
     * Имя свойства, содержащего информацию о типе узла.
     * @remark
     * Используется для отображения узлов в виде групп. (См. {@link Controls/treeGrid:IGroupNodeColumn Колонка списка с иерархической группировкой.})
     * Если в RecordSet в указанном свойстве с БЛ приходит значение 'group', то такой узел должен будет отобразиться как группа.
     * При любом другом значении узел отображается как обычно с учётом nodeProperty
     */
    nodeTypeProperty?: string;

    /**
     *
     */
    hasChildrenProperty?: string;

    /**
     *
     */
    expanderVisibility?: 'visible' | 'hasChildren';

    /**
     *
     */
    moveMarkerOnScrollPaging?: boolean;

    /**
     *
     */
    markItemByExpanderClick?: boolean;

    /**
     *
     */
    navigationChanges?: INavigationChanges;

    /**
     *
     */
    keepNavigation?: boolean;

    /**
     *
     */
    ladderProperties?: string[];

    /**
     *
     */
    nodeHistoryId?: string;

    /**
     *
     */
    nodeHistoryType?: 'node' | 'group' | 'all';

    /**
     *
     */
    navigationSourceConfig?: IBaseSourceConfig;

    /**
     *
     */
    data?: RecordSet;

    /**
     * @private
     */
    // FIXME: https://online.sbis.ru/opendoc.html?guid=f5e80392-e23c-4266-b4e5-cec270562c47&client=3
    fix1193265616?: boolean;

    /**
     * @private
     */
    // FIXME: https://online.sbis.ru/opendoc.html?guid=b4a9ed7b-7a0f-4be3-898f-b69a7cf73402&client=3
    fix88221034174482?: boolean;

    /**
     * @private
     */
    // FIXME: https://online.sbis.ru/opendoc.html?guid=1506d9ba-ed11-419a-8443-7ee7b2f091af&client=3
    fix88221034303402?: boolean;

    /**
     * @private
     * Поле используемое в BaseControl для определения необходимости сохранения позиции при перезагрузке
     * */
    keepNavigationSliceReloadId?: number;

    /**
     * @private
     * Приватное поле используемое в listWebReduces/source
     * */
    _loadItemsToDirectionPromiseResolver?: Function | undefined;
}
