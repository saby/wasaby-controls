/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import { NewSourceController } from 'Controls/dataSource';
import { ControllerClass as FilterController, IFilterItem } from 'Controls/filter';
import { ControllerClass as SearchController } from 'Controls/searchDeprecated';
import { ControllerClass as OperationsController } from 'Controls/operations';

/**
 * @name Controls/_dataFactory/List/_interface/IListDataFactoryArgumentsCompatible#listConfigStoreId
 * @cfg {String} Идентификатор сохраненного состояния списка (поиск, раскрытые элементы)
 */

export interface IListDataFactoryArgumentsCompatible {
    sourceController?: NewSourceController;
    filterController?: FilterController;
    filterButtonSource?: IFilterItem[];
    listConfigStoreId?: string;
    historySaveCallback?: (
        historyData: Record<string, unknown>,
        filterButtonItems: IFilterItem[]
    ) => void;
}

export interface IListDataFactoryLoadResultCompatible {
    sourceController?: NewSourceController;
    filterController?: FilterController;
    searchController?: SearchController;
    operationsController?: OperationsController;
}

export interface IFilterHistoryLoaderResultCompatible {
    filterButtonSource: IFilterItem;
}
