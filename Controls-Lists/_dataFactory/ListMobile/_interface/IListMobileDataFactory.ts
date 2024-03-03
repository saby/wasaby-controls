import type { IDataFactory, IListDataFactoryLoadResult } from 'Controls/dataFactory';
import type { IListMobileDataFactoryArguments } from './IListMobileDataFactoryArguments';
import type { default as IListSlice } from '../Slice';

export type IListMobileDataFactory = IDataFactory<
    IListDataFactoryLoadResult,
    IListMobileDataFactoryArguments,
    IListSlice
>;
