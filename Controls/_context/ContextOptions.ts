/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
/**
 * Context field for container options
 * @deprecated Класс устарел
 * @class Controls/_context/ContextOptions
 * @private
 */
import type { ISourceControllerState, NewSourceController } from 'Controls/dataSource';
import {
    INavigationOptionValue,
    INavigationSourceConfig,
    TFilter,
    TKey,
    ISortingOptions,
} from 'Controls/interface';
import { RecordSet } from 'Types/collection';
import { CrudEntityKey } from 'Types/source';
import { ControllerClass as OperationsController } from 'Controls/operations';
import { ControllerClass as FilterController } from 'Controls/filter';
import {ListSlice} from 'Controls/dataFactory';
import { TConfigLoadResult } from 'Controls-DataEnv/dataLoader';

export interface IContextOptionsValue extends ISortingOptions {
    newLayout?: boolean; // до 3100 для OnlinePage/_base/View/Content.ts и Layout/_browsers/Browser/Tabs.ts
    items?: RecordSet;
    source?: unknown;
    keyProperty?: TKey;
    filter?: TFilter;
    sourceController?: NewSourceController;
    navigation?: INavigationOptionValue<INavigationSourceConfig>;
    listsConfigs?: ISourceControllerState[];
    areaConfigs?: {
        [key: string]: ISourceControllerState[];
    };
    listsSelectedKeys?: TKey[];
    listsExcludedKeys?: TKey[];
    contrastBackground?: boolean;
    newDesign?: boolean;
    groupProperty?: string;
    parentProperty?: string;
    operationsController: OperationsController;
    expandedItems: CrudEntityKey[];
    dragControlId: string;
    filterController?: FilterController;
    activeElement?: CrudEntityKey;
    prefetchData: Record<string, TConfigLoadResult>;
}

export interface IContextValue extends IContextOptionsValue {
    getStoreData<T>(storeId: TKey | TKey[]): T;
    [storeId: string]: ListSlice | unknown;
}
