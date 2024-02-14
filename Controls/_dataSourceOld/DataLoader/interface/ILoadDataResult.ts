/**
 * @kaizen_zone 997e2040-c20b-4857-8580-c283c4b85f85
 */
import { ILoadDataConfig } from 'Controls/_dataSource/DataLoader/interface/ILoadDataConfig';
import { RecordSet } from 'Types/collection';
import NewSourceController from 'Controls/_dataSource/Controller';
import { ControllerClass as FilterController } from 'Controls/filter';
// eslint-disable-next-line deprecated-anywhere
import { ControllerClass as SearchController } from 'Controls/searchDeprecated';
import { ControllerClass as OperationsController } from 'Controls/operations';
import { PrefetchProxy } from 'Types/source';
import { TArrayGroupId } from 'Controls/list';

export interface ILoadDataResult extends ILoadDataConfig {
    data?: RecordSet;
    error?: Error;
    sourceController?: NewSourceController;
    filterController?: FilterController;
    searchController?: SearchController;
    collapsedGroups?: TArrayGroupId;
    source: PrefetchProxy;
    operationsController?: OperationsController;
}
