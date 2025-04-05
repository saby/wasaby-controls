import type { IDataFactory } from 'Controls-DataEnv/dataFactory';
import type { AbstractListSlice } from '../../AbstractListSlice';
import type { IAbstractListDataFactoryArguments } from './IAbstractListDataFactoryArguments';
import type { IAbstractListDataFactoryLoadResult } from './IAbstractListDataFactoryLoadResult';

/**
 * Интерфейс абстрактной фабрики данных списка.
 * Слайс фабрики данных должен быть наследником от абстрактного Controls-DataEnv/abstractList:AbstractListSlice
 */
export interface IAbstractListDataFactory<
    TLoadResult extends IAbstractListDataFactoryLoadResult = IAbstractListDataFactoryLoadResult,
    TArguments extends IAbstractListDataFactoryArguments = IAbstractListDataFactoryArguments,
    TSlice extends AbstractListSlice = AbstractListSlice,
> extends IDataFactory<TLoadResult, TArguments, TSlice> {}
