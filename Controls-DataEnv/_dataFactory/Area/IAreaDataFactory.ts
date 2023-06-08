import {
    IBaseDataFactoryArguments,
    IDataFactory,
} from '../interface/IDataFactory';
import { IDataConfig } from '../interface/IDataConfig';
import { TKey } from 'Controls-DataEnv/interface';

export interface IAreaDataFactoryArguments extends IBaseDataFactoryArguments {
    configs: Record<TKey, Record<TKey, IDataConfig>>;
    initialKeys: string[];
}

interface IAreaState {
    config: Record<TKey, IDataConfig>;
    results: Record<TKey, Record<TKey, Record<TKey, unknown>>>;
}

export interface IAreaDataFactoryResult extends IAreaState {
    load?: (state: IAreaState, key: string) => Promise<unknown>;
}

export type IAreaDataFactory = IDataFactory<
    IAreaDataFactoryResult,
    IAreaDataFactoryArguments
>;
