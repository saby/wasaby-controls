import { IControlOptions } from 'UI/Base';
import {
    IFilterOptions,
    ISourceOptions,
    INavigationOptions,
    ISelectorDialogOptions,
    TKey,
    IHierarchyOptions,
    INavigationSourceConfig,
} from 'Controls/interface';
import { IItemAction, IItemActionsOptions } from 'Controls/itemActions';
import { IColumn } from 'Controls/grid';
import { NewSourceController as SourceController } from 'Controls/dataSource';
import { IRouter } from 'Router/router';
import { IList } from 'Controls/list';

export interface IListEditorOptions
    extends IControlOptions,
        IFilterOptions,
        ISourceOptions,
        INavigationOptions<INavigationSourceConfig>,
        IItemActionsOptions,
        IList,
        IColumn,
        ISelectorDialogOptions,
        IHierarchyOptions {
    propertyValue: TKey[] | TKey;
    additionalTextProperty?: string;
    mainCounterProperty?: string;
    mainCounterTooltip?: string;
    additionalCounterTooltip?: string;
    imageProperty?: string;
    imageTemplateName?: string;
    imageTemplate?: string;
    multiSelect: boolean;
    historyId?: string;
    emptyKey: string;
    emptyText?: string;
    selectedAllKey: string;
    selectedAllText?: string;
    resetValue?: TKey[];
    sourceController?: SourceController;
    expandedItems?: TKey[];
    itemActions?: IItemAction[];
    editArrowClickCallback?: Function;
    markerStyle?: 'default' | 'primary';
    dragNDropProviderName?: string;
    deepReload?: boolean;
    itemActionVisibilityCallbackName?: string;
    titleTemplateName?: string;
    multiSelectVerticalAlign: string;
    Router: IRouter;
}
