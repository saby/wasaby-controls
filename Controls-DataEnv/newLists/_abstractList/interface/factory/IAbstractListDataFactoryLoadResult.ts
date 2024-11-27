import type { IFilterItem } from 'Controls/filter';
import { IAbstractListState } from '../IAbstractListState';

/**
 * Интерфейс результата загрузки абстрактной фабрики данных списка.
 */
export interface IAbstractListDataFactoryLoadResult
    extends Partial<
        Pick<
            IAbstractListState,
            'viewMode' | 'itemsOrder' | 'error' | 'errorViewConfig' | 'sorting'
        >
    > {
    // По этому флагу платформа отличает новейшие списки от всех остальных.
    isLatestInteractorVersion: boolean;

    filterDescription?: IFilterItem[];
    filterButtonSource?: IFilterItem[];
}
