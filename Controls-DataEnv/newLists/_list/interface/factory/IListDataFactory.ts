import type { IDataFactory } from 'Controls-DataEnv/dataFactory';
import type { IListDataFactoryArguments } from './IListDataFactoryArguments';
import type { IListDataFactoryLoadResult } from './IListDataFactoryLoadResult';
import type { ListSlice } from '../../ListSlice';

/**
 * Интерфейс фабрики данных WEB списка.
 * @public
 */
export interface IListDataFactory
    extends IDataFactory<IListDataFactoryLoadResult, IListDataFactoryArguments, ListSlice> {}
