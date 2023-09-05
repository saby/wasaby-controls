import { Slice } from 'Controls-DataEnv/slice';
import { IRouter } from 'Router/router';

type TExtraValue = [string, string];
export type TExtraValues = Record<string, TExtraValue>;
export interface IBaseDataFactoryArguments {
    loadDataTimeout?: number;
    sliceExtraValues?: TExtraValues;
}
interface ISliceConstructorProps<T, K, ExtraValues = Record<string, unknown>> {
    loadResult: T;
    config: K;
    onChange?: Function;
    extraValues?: ExtraValues;
}
/**
 * Интерфейс фабрики данных
 *
 * @interface Controls-DataEnv/_dataFactory/interface/IDataFactory
 * @public
 */

/**
 * Метод загрузки фабрики данных
 * @name Controls-DataEnv/_dataFactory/interface/IDataFactory#loadData
 * @function
 * @param {Object} dataFactoryArguments Аргументы фабрики данных
 * @param {Object} dependenciesResults Результаты загрузки зависимых фабрик данных
 * @return {Promise}
 */

/**
 * Метод для получения dataFactoryArguments.
 * Будет вызван до загрузки данных и перед созданием слайса.
 * @remark Рекомендуется использовать в случае, когда аргументы зависят от резульатов зависимых фабрик данных
 * @name Controls-DataEnv/_dataFactory/interface/IDataFactory#getDataFactoryArguments
 * @function
 * @param {Object} dataFactoryArguments Аргументы фабрики данных
 * @param {Object} dependenciesResults Результаты загрузки зависимых фабрик данных
 * @see {Controls-DataEnv/_dataFactory/interface/IDataConfig#dataFactoryArguments}
 * @return {Object}
 */

/**
 * @name Controls-DataEnv/_dataFactory/interface/IDataFactory#slice
 * @cfg {Slice} Слайс фабрики данных. Должен быть наследником от базового слайса Controls-dataEnv/Slice:Slice
 */

export interface IDataFactory<
    T = unknown,
    K extends IBaseDataFactoryArguments = IBaseDataFactoryArguments
> {
    slice: new (props: ISliceConstructorProps<T, K>) => Slice;
    getDataFactoryArguments?(
        dataFactoryArguments: Partial<K>,
        dependenciesResults: Record<string, unknown>,
        Router?: IRouter
    ): K;
    loadData(
        dataFactoryArguments: K,
        dependenciesResults?: Record<string, unknown>,
        Router?: IRouter
    ): Promise<T>;
}
