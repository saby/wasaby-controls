/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { IDataFactory, IListDataFactoryLoadResult } from 'Controls/dataFactory';
import type { IListMobileDataFactoryArguments } from './IListMobileDataFactoryArguments';
import type { default as IListSlice } from '../Slice';

/**
 * Интерфейс фабрики данных
 *
 * @interface Controls-Lists/_dataFactory/ListMobile/_interface/IListMobileDataFactory
 * @public
 */
export type IListMobileDataFactory = IDataFactory<
    IListDataFactoryLoadResult,
    IListMobileDataFactoryArguments,
    IListSlice
>;
