import { IDataFactory } from '../interface/IDataFactory';
import { IBaseDataFactoryArguments } from '../interface/IBaseDataFactoryArguments';
import { IDataConfig } from '../interface/IDataConfig';
/**
 * Интерфейс аргументов фабрики переключаемых областей.
 * @interface Controls-DataEnv/_dataFactory/Area/IAreaDataFactory/IAreaDataFactoryArguments
 * @public
 */

/**
 * @name Controls-DataEnv/_dataFactory/Area/IAreaDataFactory/IAreaDataFactoryArguments#configs
 * @cfg {Controls-DataEnv/dataFactory.TDataConfigs} Описание фабрик данных для областей.
 */

/**
 * @name Controls-DataEnv/_dataFactory/Area/IAreaDataFactory/IAreaDataFactoryArguments#initialKeys
 * @cfg {Array<string>} Массив уникальных идентификаторов переключаемых областей, которые необходимо загрузить при первом построении.
 */
export interface IAreaDataFactoryArguments extends IBaseDataFactoryArguments {
    configs: Record<string, Record<string, IDataConfig>>;
    initialKeys: string[];
}

/**
 * Интерфейс результата загрузки фабрики переключаемых областей.
 * @interface Controls-DataEnv/_dataFactory/Area/IAreaDataFactory/IAreaDataFactoryResult
 * @public
 */
/**
 * @name Controls-DataEnv/_dataFactory/Area/IAreaDataFactory/IAreaDataFactoryResult#results
 * @cfg {Record<string, Record<string, unknown>>} Результаты загрузки данных каждой области
 */
export interface IAreaDataFactoryResult {
    results: Record<string, Record<string, Record<string, unknown>>>;
}

export type IAreaDataFactory = IDataFactory<IAreaDataFactoryResult, IAreaDataFactoryArguments>;
