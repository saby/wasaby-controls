import type { IDataFactory } from 'Controls-DataEnv/dataFactory';
import type { AbstractListSlice } from 'Controls-DataEnv/abstractList';
import type { IListDataFactoryArguments } from './IListDataFactoryArguments';
import type { IListDataFactoryLoadResult } from './IListDataFactoryLoadResult';

export interface IListDataFactory
    extends IDataFactory<
        IListDataFactoryLoadResult,
        IListDataFactoryArguments,
        AbstractListSlice
    > {}
