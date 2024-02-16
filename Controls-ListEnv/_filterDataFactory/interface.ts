import { IFilterItem, IPrefetchParams } from 'Controls/filter';

export interface IFilterLoadResult {
    filterDescription: IFilterItem[];
}

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

export interface IFilterState {
    filterDescription: IFilterItem[];
    historyId: string;
    saveToUrl: boolean;
    filterDetailPanelVisible: boolean;
}
