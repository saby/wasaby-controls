import type { IDataFactory } from 'Controls-DataEnv/dataFactory';
import type { AbstractListSlice } from 'Controls-DataEnv/abstractList';
import type { IListDataFactoryArguments } from './IListDataFactoryArguments';
import type { IListDataFactoryLoadResult } from './IListDataFactoryLoadResult';

/**
 * Интерфейс фабрики данных WEB списка.
 */
export interface IListDataFactory
    extends IDataFactory<
        IListDataFactoryLoadResult,
        IListDataFactoryArguments,
        AbstractListSlice
    > {}
