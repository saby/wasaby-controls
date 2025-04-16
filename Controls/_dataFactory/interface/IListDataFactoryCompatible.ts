/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { NewSourceController } from 'Controls/dataSource';
import { IFilterItem } from 'Controls/filter';
import { ControllerClass as FilterController } from 'Controls/filterOld';
import { ControllerClass as SearchController } from 'Controls/searchDeprecated';
import { ControllerClass as OperationsController } from 'Controls/operations';
import {
    IListDataFactoryArguments,
    IListDataFactoryLoadResult,
} from 'Controls-DataEnv/currentList';

/**
 * @name Controls/_dataFactory/List/_interface/IListDataFactoryArgumentsCompatible#listConfigStoreId
 * @cfg {String} Идентификатор сохраненного состояния списка (поиск, раскрытые элементы)
 */

export interface IListDataFactoryArgumentsCompatible {
    sourceController?: NewSourceController;
    filterController?: FilterController;
    listConfigStoreId?: string;
    historySaveCallback?: (
        historyData: Record<string, unknown>,
        filterButtonItems: IFilterItem[]
    ) => void;
    isSelectorPopup?: boolean;
}

export interface IListDataFactoryLoadResultCompatible extends IListDataFactoryLoadResult {
    sourceController?: NewSourceController;
    filterController?: FilterController;
    searchController?: SearchController;
    operationsController?: OperationsController;
}

export interface IFilterHistoryLoaderResultCompatible {
    filterButtonSource: IFilterItem;
}

export interface ICompatibleListDataFactoryArguments
    extends IListDataFactoryArguments,
        IListDataFactoryArgumentsCompatible {}
