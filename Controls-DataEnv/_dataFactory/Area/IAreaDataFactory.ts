import { IDataFactory } from '../interface/IDataFactory';
import { IBaseDataFactoryArguments } from '../interface/IBaseDataFactoryArguments';
import { IDataConfig } from '../interface/IDataConfig';

/**
 * Интерфейс аргументов фабрики переключаемых областей.
 * @public
 */
export interface IAreaDataFactoryArguments extends IBaseDataFactoryArguments {
    /**
     * Описание фабрик данных для областей.
     */
    configs: Record<string, Record<string, IDataConfig>>;
    /**
     * Массив уникальных идентификаторов переключаемых областей, которые необходимо загрузить при первом построении.
     */
    initialKeys: string[];
}

/**
 * Интерфейс результата загрузки фабрики переключаемых областей.
 * @public
 */
export interface IAreaDataFactoryResult {
    /**
     * Результаты загрузки данных каждой области
     */
    results: Record<string, Record<string, Record<string, unknown>>>;
}

/**
 *
 */
export type IAreaDataFactory = IDataFactory<IAreaDataFactoryResult, IAreaDataFactoryArguments>;
