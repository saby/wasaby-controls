/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import { IListDataFactoryLoadResultCompatible } from './IListDataFactoryCompatible';
import { RecordSet } from 'Types/collection';
import { TArrayGroupId } from 'Controls/baseList';
import type { ErrorViewConfig } from 'Controls/error';
import type { ControllerClass as OperationsController } from 'Controls/operations';
import {
    IListDataFactoryLoadResult as IListDataFactoryLoadResultBase,
    IListDataFactory,
} from 'Controls-DataEnv/currentList';

export { IListDataFactory };

export interface IListDataFactoryLoadResult
    extends IListDataFactoryLoadResultBase,
        IListDataFactoryLoadResultCompatible {
    data?: RecordSet;
    error?: Error;
    errorViewConfig?: ErrorViewConfig;
    collapsedGroups?: TArrayGroupId;
    operationsController?: OperationsController;
}
