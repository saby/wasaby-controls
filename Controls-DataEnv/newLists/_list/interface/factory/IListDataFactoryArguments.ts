import { IAbstractListDataFactoryArguments } from 'Controls-DataEnv/abstractList';
import {
    ISourceOptions,
    IFilterOptions,
    type TKey,
    type IFilterDescriptionItem,
} from 'Controls-DataEnv/interface';
import {
    IHierarchyOptions,
    ISelectFieldsOptions,
    ISelectionCountModeOptions,
    IPrefetchOptions,
    IPropStorageOptions,
    TSortingOptionValue,
} from 'Controls-DataEnv/listTypes';
import { Form } from 'Controls-DataEnv/dataFactory';

import type { ISourceControllerOptions } from 'Controls/dataSource';

import type { IListSavedState } from '../IListSavedState';
import type { IListState } from '../IListState';

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
        IFilterOptions,
        IHierarchyOptions,
        ISelectFieldsOptions,
        ISelectionCountModeOptions,
        IPropStorageOptions,
        IPrefetchOptions,
        Partial<
            Pick<
                IListState,
                | 'selectAncestors'
                | 'selectDescendants'
                | 'selectionType'
                | 'recursiveSelection'
                | 'listConfigStoreId'
                | 'sourceController'
                | 'deepReload'
                | 'expanderVisibility'
                | 'nodeTypeProperty'
                | 'rootHistoryId'
                | 'groupHistoryId'
                | 'selectedCountConfig'
                | 'deepScrollLoad'
                | 'countFilterValue'
                | 'countFilterLinkedNames'
                | 'countFilterUserPeriods'
                | 'countFilterPeriodType'
                | 'error'
                | 'activeElement'
                | 'isMassSelectMode'
            >
        > {
    /**
     *
     */
    storedColumnsWidths?: string[];

    /**
     *
     */
    listSavedState?: IListSavedState;

    /**
     *
     */
    clearResult?: boolean;

    /**
     * Имя поля записи, в котором хранится информация о наличии дочерних элементов в узле дерева.
     * @remark
     * Для работы опции hasChildrenProperty установите опцию expanderVisibility в значение "hasChildren".
     */
    hasChildrenProperty?: string;

    /**
     *
     */
    supportSelection?: boolean;

    /**
     *
     */
    editorsViewMode?: string;

    // Режим адаптивного поиска, позволяет отображать результаты поиска в виде "searchTile" при переходе в поиск из
    // режимов "tile" или "composite".
    // Сделано опционально, чтобы точечно переводить реестры на данное поведение, а после проверки - уже перевести всех.
    // https://online.sbis.ru/opendoc.html?guid=c0348293-2158-44af-ac44-bbb2878f3f20&client=3
    /**
     *
     */
    adaptiveSearchMode?: boolean;

    /**
     *
     */
    moveMarkerOnScrollPaging?: boolean;

    /**
     *
     */
    countFilterValueConverter?: string;

    /**
     *
     */
    onSavedParamsLoaded?:
        | string
        | ((
              args: ISourceControllerOptions,
              params: TSavedParams
          ) => TSavedParams | Promise<TSavedParams>);

    /**
     *
     */
    name?: string[];

    /**
     *
     */
    formDataSlice?: typeof Form.slice;

    /**
     *
     */
    markItemByExpanderClick?: boolean;

    // Параметр используется в loadData для получения SourceController. Взят из IControllerOptions
    /**
     *
     */
    loadTimeout?: number;

    /**
     * @deprecated
     * В слайсах заменяется на filterDescription
     * */
    filterButtonSource?: IFilterDescriptionItem[];

    /**
     *
     */
    // FIXME: https://online.sbis.ru/opendoc.html?guid=f5e80392-e23c-4266-b4e5-cec270562c47&client=3
    fix1193265616?: boolean;

    /**
     *
     */
    // FIXME: https://online.sbis.ru/opendoc.html?guid=daefeb2b-82fd-47d3-bd70-f6ab0ced1e85&client=3
    task1186833531?: boolean;

    /**
     *
     */
    // FIXME: https://online.sbis.ru/opendoc.html?guid=b4a9ed7b-7a0f-4be3-898f-b69a7cf73402&client=3
    fix88221034174482?: boolean;

    /**
     *
     */
    // FIXME: https://online.sbis.ru/opendoc.html?guid=1506d9ba-ed11-419a-8443-7ee7b2f091af&client=3
    fix88221034303402?: boolean;
}
