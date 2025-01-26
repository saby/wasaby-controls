/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { IListMobileDataFactoryArguments } from './IListMobileDataFactoryArguments';
import type {
    IAbstractListDataFactory,
    IAbstractListDataFactoryLoadResult,
} from 'Controls-DataEnv/abstractList';
import type { ListMobileSlice } from '../../Slice';

/**
 * Интерфейс фабрики данных
 */
export type IListMobileDataFactory = IAbstractListDataFactory<
    IAbstractListDataFactoryLoadResult,
    IListMobileDataFactoryArguments,
    ListMobileSlice
>;
