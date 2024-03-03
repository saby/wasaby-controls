/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import { IBaseLoadDataConfig } from './IDataLoadProvider';
import {
  INavigationOptions,
  INavigationSourceConfig,
  ISourceOptions,
  ISuggestFooterTemplate,
  TFilter,
  TKey,
  TSortingOptionValue,
} from 'Controls/interface';
import { IFilterItem } from 'Controls/filter';
import { ControllerClass as FilterController } from 'Controls/filterOld';
import { RecordSet } from 'Types/collection';
import NewSourceController from 'Controls/_dataSource/Controller';

interface IFilterHistoryLoaderResult {
    filterButtonSource: IFilterItem[];
    filter: TFilter;
    historyItems: IFilterItem[];
}

export interface ILoadDataConfig
    extends IBaseLoadDataConfig,
        ISourceOptions,
        INavigationOptions<INavigationSourceConfig> {
    id?: string;
    type?: 'list';
    sorting?: TSortingOptionValue;
    sourceController?: NewSourceController;
    filterController?: FilterController;
    filter?: TFilter;
    filterButtonSource?: IFilterItem[];
    fastFilterSource?: object[];
    historyId?: string;
    groupHistoryId?: string;
    nodeHistoryId?: string;
    historyItems?: IFilterItem[];
    propStorageId?: string;
    root?: string;
    parentProperty?: string;
    expandedItems?: TKey[];
    searchParam?: string;
    searchValue?: string;
    filterHistoryLoader?: (
        filterButtonSource: object[],
        historyId: string
    ) => Promise<IFilterHistoryLoaderResult>;
    error?: Error;
    historySaveCallback?: (
        historyData: Record<string, unknown>,
        filterButtonItems: IFilterItem[]
    ) => void;
    minSearchLength?: number;
    searchDelay?: number;
    items?: RecordSet;
    loadTimeout?: number;
    actions?: boolean;
    nodeProperty?: string;
    displayProperty?: string;
    hasChildrenProperty?: string;
    footerTemplate?: ISuggestFooterTemplate;
}
