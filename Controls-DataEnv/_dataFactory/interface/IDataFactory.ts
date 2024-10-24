import { AbstractSlice, Slice } from 'Controls-DataEnv/slice';
import { IRouter } from 'Router/router';
import { IBaseDataFactoryArguments } from './IBaseDataFactoryArguments';
import { TDataConfigs, IDataConfigLoader } from './IDataConfig';

/**
 * @public
 */
export interface ISliceConstructorProps<T, K> {
    /**
     *
     */
    loadResult: T;
    /**
     *
     */
    config: K;
    /**
     *
     */
    onChange?: Function;
    /**
     *
     */
    name?: string;
    /**
     *
     */
    onInitError?: Function;
}

/**
 * @public
 */
export interface IHierarchyContextConfig {
    configs: Record<string, IDataConfigLoader>;
    loadResults: Record<string, Record<string, unknown>>;
}

/**
 * @public
 */
export interface IFlatContextConfig {
    configs: TDataConfigs;
    loadResults: Record<string, unknown>;
}

/**
 *
 */
export type TContextConfig = IHierarchyContextConfig | IFlatContextConfig;

/**
 * Интерфейс фабрики данных
 * Слайс фабрики данных. Должен быть наследником от базового слайса Controls-dataEnv/Slice:Slice
 * @public
 */
export interface IDataFactory<
    LoadResult = unknown,
    Arguments extends IBaseDataFactoryArguments = IBaseDataFactoryArguments,
    SliceConstructor extends AbstractSlice = Slice,
> {
    slice: new (props: ISliceConstructorProps<LoadResult, Arguments>) => SliceConstructor;

    /**
     * Метод для получения dataFactoryArguments.
     * Будет вызван до загрузки данных и перед созданием слайса.
     * @remark Рекомендуется использовать в случае, когда аргументы зависят от резульатов зависимых фабрик данных
     * @function
     * @param dataFactoryArguments Аргументы фабрики данных
     * @param dependenciesResults Результаты загрузки зависимых фабрик данных
     * @see {@link Controls-DataEnv/dataFactory/IDataConfig/Property/dataFactoryArguments}
     */
    getDataFactoryArguments?(
        dataFactoryArguments: Partial<Arguments> | undefined,
        dependenciesResults: Record<string | number | symbol, unknown> | undefined,
        Router?: IRouter
    ): Arguments;

    /**
     * Метод загрузки фабрики данных
     * @param dataFactoryArguments Аргументы фабрики данных
     * @param dependenciesResults Результаты загрузки зависимых фабрик данных
     */
    loadData(
        dataFactoryArguments: Arguments | undefined,
        dependenciesResults?: Record<string, unknown>,
        Router?: IRouter,
        _clearResult?: boolean,
        fabricId?: string
    ): Promise<LoadResult>;

    /**
     *
     */
    getContextConfig?(loadResult: LoadResult, dataFactoryArguments?: Arguments): TContextConfig;
}
