import type { IBaseDataFactoryArguments } from 'Controls-DataEnv/dataFactory';
import type { TCollectionType } from '../../collection/types';
import type { IAbstractListState } from '../IAbstractListState';
import type { IFilterItem } from 'Controls/filter';

/**
 * Интерфейс аргументов абстрактной фабрики данных списка.
 */
export interface IAbstractListDataFactoryArguments
    extends IBaseDataFactoryArguments,
        Pick<IAbstractListState, 'items' | 'keyProperty'>,
        Partial<
            Pick<
                IAbstractListState,
                | 'selectedKeys'
                | 'excludedKeys'
                | 'root'
                | 'sliceOwnedByBrowser'
                | 'expandedItems'
                | 'collapsedItems'
                | 'singleExpand'
                | 'viewMode'
                | 'markedKey'
                | 'markerVisibility'
                | 'operationsPanelVisible'
                | 'operationsController'
                | 'itemsOrder'
                | 'nodeProperty'
                | 'parentProperty'
                | 'multiSelectVisibility'
                | 'displayProperty'
                | 'errorController'
                | 'sorting'
                | 'searchParam'
                | 'searchValue'
                | 'searchInputValue'
                | 'minSearchLength'
                | 'searchDelay'
                | 'searchStartingWith'
                | 'searchValueTrim'
                | 'searchNavigationMode'
                | 'filter'
            >
        > {
    collectionType?: TCollectionType;

    /**
     * Набор действий для панели массовых операций или имя модуля, который его экспортирует.
     *
     * Подробнее в статье {@link /doc/platform/developmentapl/interface-development/controls/list/actions/new-operations/panel-and-list/ "Связь панели массовых операций и списка".}
     */
    listActions?: string | unknown[];

    /**
     * Набор опций записей в списке или имя модуля, который его экспортирует.
     *
     * Подробнее в статье {@link /doc/platform/developmentapl/interface-development/controls/list/actions/item-actions/ "Конфигурация опций записей в списке".}
     */
    itemActions?: string | unknown[];

    // Только пока существует старая LoadData.
    // Это не для прикладного использования.
    // По этому флагу платформа отличает новейшие списки от всех остальных.
    // Должно быть удалено из аргументов и оставлено только в результатах фабрики.
    isLatestInteractorVersion?: boolean;

    filterDescription?: IFilterItem[];
    filterButtonSource?: IFilterItem[];
}
