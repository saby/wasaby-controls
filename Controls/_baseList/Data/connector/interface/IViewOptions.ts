/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { Model } from 'Types/entity';
import { RecordSet } from 'Types/collection';
import type { IMarkerListOptions } from 'Controls/marker';
import {
    IExpandedItemsOptions,
    IFilterOptions,
    IGroupingOptions,
    IHierarchyOptions,
    IHierarchySearchOptions,
    INavigation,
    IPromiseSelectableOptions,
    ISearchOptions,
    ISelectFieldsOptions,
    ISelectionCountModeOptions,
    ISelectionTypeOptions,
    ISortingOptions,
    ISourceOptions,
    TItemsOrder,
    TKey,
} from 'Controls/interface';
import { NewSourceController as SourceController } from 'Controls/dataSource';
import type { IColumn, IHeaderCell } from 'Controls/grid';
import type { TExplorerViewMode } from 'Controls/explorer';

/**
 * Интерфейс опций View.
 *
 * FIXME: Этот интерфейс должен порождаться самой View, а здесь экспортироваться.
 *  Типы полей интерфейса не должны пересекаться с типами полей стейта интерактора.
 *  Вместо этого, оба должны ссылаться на один общий тип, например из Controls/baseList.
 *
 *  @private
 */
export interface IViewOptions
    extends ISortingOptions,
        IPromiseSelectableOptions,
        IHierarchyOptions,
        ISourceOptions,
        IFilterOptions,
        IExpandedItemsOptions,
        ISelectionTypeOptions,
        ISearchOptions,
        IHierarchySearchOptions,
        ISelectFieldsOptions,
        IMarkerListOptions,
        ISelectionCountModeOptions,
        IGroupingOptions {
    sourceController: SourceController;
    root: TKey;
    breadCrumbsItems: Model[];
    loading: boolean;
    items: RecordSet;
    columns?: IColumn[];
    header?: IHeaderCell[];
    viewMode?: TExplorerViewMode;
    multiSelectVisibility?: string;
    backButtonCaption?: string;
    displayProperty?: string;
    navigation?: INavigation;
    expanderVisibility?: 'hasChildren' | 'visible';
    hasChildrenProperty: string;
    deepReload?: boolean;
    singleExpand?: boolean;
    nodeTypeProperty?: string;
    order?: TItemsOrder;
}
