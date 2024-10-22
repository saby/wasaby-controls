/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { IDataFactory } from 'Controls/_dataFactory/interface/IDataFactory';
import { IListDataFactoryLoadResultCompatible } from './IListDataFactoryCompatible';
import { RecordSet } from 'Types/collection';
import { TArrayGroupId } from 'Controls/baseList';
import { IListDataFactoryArguments } from 'Controls/_dataFactory/List/_interface/IListDataFactoryArguments';
import ListSlice from '../Slice';
import { IListState } from 'Controls/_dataFactory/List/_interface/IListState';
import type { ErrorViewConfig } from 'Controls/error';
import type { ControllerClass as OperationsController } from 'Controls/operations';

export type IListDataFactory = IDataFactory<
    IListDataFactoryLoadResult,
    IListDataFactoryArguments,
    ListSlice<IListState>
>;

export interface IListDataFactoryLoadResult
    extends IListDataFactoryArguments,
        IListDataFactoryLoadResultCompatible {
    data?: RecordSet;
    error?: Error;
    errorViewConfig?: ErrorViewConfig;
    collapsedGroups?: TArrayGroupId;
    operationsController?: OperationsController;
}
