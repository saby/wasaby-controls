import {
    ISelectFieldsOptions,
    IFilterOptions,
    ISortingOptions,
    IHierarchyOptions,
    IGroupingOptions,
    ISourceOptions,
    IPromiseSelectableOptions,
    INavigationOptions,
    TKey,
    IItemsOptions,
    IExpandedItemsOptions,
} from 'Controls/interface';

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
        Pick<IExpandedItemsOptions, 'expandedItems'> {
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
    propStorageId?: string;

    observeMetaData?: boolean;
    id?: string;
    task1183145150?: boolean;
}
