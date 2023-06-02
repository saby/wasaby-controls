import { IBaseDataFactoryArguments, IDataFactory } from '../interface/IDataFactory';
import { IDataConfig } from '../interface/IDataConfig';
import { TKey } from 'Controls-DataEnv/interface';

export interface IAreaDataFactoryArguments extends IBaseDataFactoryArguments {
    configs: Record<TKey, Record<TKey, IDataConfig>>;
    initialKeys: string[];
}

export interface IAreaDataFactoryResult {
    results: Record<TKey, Record<TKey, Record<TKey, unknown>>>;
}

export type IAreaDataFactory = IDataFactory<IAreaDataFactoryResult, IAreaDataFactoryArguments>;
