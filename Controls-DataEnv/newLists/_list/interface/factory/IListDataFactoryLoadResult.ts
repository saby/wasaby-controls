import type { IAbstractListDataFactoryLoadResult } from 'Controls-DataEnv/abstractList';
import { TFilter } from 'Controls-DataEnv/interface';
import { INavigationOptions, INavigationSourceConfig } from 'Controls-DataEnv/listTypes';
import { IListState } from '../IListState';

/**
 * Интерфейс результата загрузки фабрики данных WEB списка.
 */
export interface IListDataFactoryLoadResult
    extends IAbstractListDataFactoryLoadResult,
        INavigationOptions<INavigationSourceConfig>,
        Partial<
            Pick<
                IListState,
                | 'items'
                | 'expandedItems'
                | 'root'
                | 'data'
                | 'error'
                | 'errorController'
                | 'errorViewConfig'
                | 'operationsController'
                | 'sourceController'
                | 'loading'
                | 'markedKey'
                | 'source'
                | 'keyProperty'
            >
        > {
    /**
     *
     */
    type?: string;

    /**
     *
     */
    collapsedGroups?: (string | number)[];

    /**
     *
     */
    storedColumnsWidths?: string[];

    /**
     *
     */
    filter: TFilter;
}
