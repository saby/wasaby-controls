import { IDataFactory } from 'Controls/_dataFactory/interface/IDataFactory';
import { IListDataFactoryLoadResultCompatible } from './IListDataFactoryCompatible';
import { RecordSet } from 'Types/collection';
import { TArrayGroupId } from 'Controls/baseList';
import { IListDataFactoryArguments } from 'Controls/_dataFactory/List/_interface/IListDataFactoryArguments';

export type IListDataFactory = IDataFactory<IListDataFactoryLoadResult, IListDataFactoryArguments>;

export interface IListDataFactoryLoadResult
    extends IListDataFactoryArguments,
        IListDataFactoryLoadResultCompatible {
    data?: RecordSet;
    error?: Error;
    collapsedGroups?: TArrayGroupId;
}
