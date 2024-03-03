import { IFilterItem, IPrefetchParams } from 'Controls/filter';

/**
 * Результат загрузки фабрики фильтра
 */
export interface IFilterLoadResult {
    filterDescription: IFilterItem[];
}

/**
 * Аргументы фабрики фильтра
 */
export interface IFilterArguments {
    historyId?: string;
    filterDescription: IFilterItem[];
    saveToUrl?: boolean;
    propStorageId?: string;
    historyItems?: IFilterItem[];
    prefetchParams?: IPrefetchParams;
    historySaveMode?: string;
    editorsViewMode?: string;
}

/**
 * Состояние слайса фильтра
 */
export interface IFilterState {
    filterDescription: IFilterItem[];
    historyId: string;
    saveToUrl: boolean;
    filterDetailPanelVisible: boolean;
}
