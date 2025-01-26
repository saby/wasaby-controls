import {
    ISelectFieldsOptions,
    IFilterOptions,
    ISortingOptions,
    IHierarchyOptions,
    IGroupingOptions,
    ISourceOptions,
    IPromiseSelectableOptions,
    INavigationOptions,
    INavigationSourceConfig,
    TKey,
    IItemsOptions,
    IExpandedItemsOptions,
} from 'Controls/interface';
import type { IFilterDescriptionItem } from 'Controls/filter';
import { ISavedParamsConfig } from './getSavedParams';

export interface ISourceControllerProps
    extends IFilterOptions,
        ISortingOptions,
        IHierarchyOptions,
        IGroupingOptions,
        ISourceOptions,
        IPromiseSelectableOptions,
        INavigationOptions<INavigationSourceConfig>,
        ISelectFieldsOptions,
        IItemsOptions,
        Pick<IExpandedItemsOptions, 'expandedItems'>,
        ISavedParamsConfig {
    dataLoadErrback?: Function;
    dataLoadCallback?: Function;
    nodeLoadCallback?: Function;
    root?: TKey;
    deepReload?: boolean;
    collapsedGroups?: TKey[];
    navigationParamsChangedCallback?: Function;
    loadTimeout?: number;
    deepScrollLoad?: boolean;
    nodeTypeProperty?: string;
    error?: Error;
    displayProperty?: string;
    hasChildrenProperty?: string;
    childrenProperty?: string;
    listConfigStoreId?: string;
    storeId?: string;
    historyItems?: IFilterDescriptionItem[];
    filterDescription?: IFilterDescriptionItem[];

    observeMetaData?: boolean;
    id?: string;
    task1183145150?: boolean;
}
