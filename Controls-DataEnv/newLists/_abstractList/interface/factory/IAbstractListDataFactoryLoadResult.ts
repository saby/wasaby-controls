import type { IFilterDescriptionItem } from 'Controls-DataEnv/interface';
import type { IAbstractListState } from '../IAbstractListState';

/**
 * Интерфейс результата загрузки абстрактной фабрики данных списка.
 */
export interface IAbstractListDataFactoryLoadResult
    extends Partial<
        Pick<
            IAbstractListState,
            | 'viewMode'
            | 'itemsOrder'
            | 'error'
            | 'errorViewConfig'
            | 'sorting'
            | 'filterDescription'
            | 'filter'
        >
    > {
    historyItems?: IFilterDescriptionItem[];
    // По этому флагу платформа отличает новейшие списки от всех остальных.
    isLatestInteractorVersion: boolean;
}
