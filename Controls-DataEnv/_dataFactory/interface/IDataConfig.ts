import { IBaseDataFactoryArguments } from './IBaseDataFactoryArguments';

/**
 *
 * @private
 */
export type TDataConfigs = Record<string, IDataConfig>;

/**
 *
 * @private
 */
export type IDataConfigLoader = IDataNodeConfigGetter;
/**
 *
 * @private
 */
export type IDataContextConfigs = (IDataConfigLoader | IDataNodeConfigs) & {
    name?: string;
    children?: Record<string, IDataContextConfigs>;
};

/**
 *
 * @private
 */
export interface IDataNodeProps {
    parentId?: string;
    dependencies?: string[];
    data?: Record<string, unknown>;
}

/**
 *
 * @param value
 * @private
 */
export function isDataNodeConfigGetter(value: any): value is IDataNodeConfigGetter {
    return value instanceof Object && !!value.configGetter;
}

/**
 *
 * @param value
 * @private
 */
export function isDataNodeConfigs(value: any): value is IDataNodeConfigGetter {
    return value instanceof Object && !!value.configs;
}

/**
 *
 * @private
 */
export interface IDataNodeConfigGetter extends IDataNodeProps {
    configGetter: string;
    configGetterArguments?: Record<string, unknown>;
    configGetterArgumentsArray?: unknown[];
}

/**
 *
 * @private
 */
export interface IDataNodeConfigs extends IDataNodeProps {
    configs: TDataConfigs;
}

/**
 *
 * @private
 */
export interface IOldDataConfig {
    type: 'custom' | 'list' | 'area';
    dependencies?: string[];
    afterLoadCallback?: string;
    loadDataTimeout?: number;
    loadTimeout?: number;

    [key: string]: unknown;
}

/**
 *
 * @private
 */
export type TOldDataConfigs = Record<string, IOldDataConfig>;
/**
 *
 * @private
 */
export type TGetConfigResult = TDataConfigs | TOldDataConfigs;
/**
 *
 * @private
 */
export type TConfigGetterModule<TArguments = unknown> =
    | {
          getConfig(args: TArguments): TGetConfigResult | Promise<TGetConfigResult>;
      }
    | Function;

/**
 * Интерфейс для описания элемента предзагрузки
 * @public
 */
export interface IDataConfig<T extends IBaseDataFactoryArguments = IBaseDataFactoryArguments> {
    /**
     * Имя модуля, содержащее описание фабрики данных
     */
    dataFactoryName: string;
    /**
     * Аргументы для фабрики данных. Будут переданы в функцию загрузки и в конструктор слайса. Базовые аргументы фабрик описаны {@link Controls-DataEnv/_dataFactory/interface/IBaseDataFactoryArguments тут}
     */
    dataFactoryArguments?: T;
    /**
     * Очередь создания фабрики. Очередь можно использовать для оптимизации отрисовки контента, группируя данные в разные очереди.
     * @default 0
     * @example
     * <pre class="brush: js">
     *   // Группируем фабрики в три очереди.
     *   // В таком случае будет созадан сначала firstLoader, затем одновременно secondLoader и thirdLoader, последним будет создан fourthLoader
     *   const factoryWithOrder = {
     *      firstLoader: {
     *          dataFactoryName: 'MyFirstFactoryModuleName',
     *          dataFactoryArguments: {
     *              myArgument: true
     *          }
     *      },
     *      secondLoader: {
     *          dataFactoryName: 'MySecondFactoryModuleName',
     *          dataFactoryArguments: {
     *              myArgument: true
     *          },
     *          dataFactoryCreationOrder: 1
     *      },
     *      thirdLoader: {
     *          dataFactoryName: 'MyThirdFactoryModuleName,
     *          dataFactoryArguments: {},
     *          dataFactoryCreationOrder: 1
     *      }
     *      fourthLoader: {
     *          dataFactoryName: 'MyFourthFactoryModuleName,
     *          dataFactoryArguments: {},
     *          dataFactoryCreationOrder: 2
     *      }
     *   }
     * </pre
     */
    dataFactoryCreationOrder?: number;
    /**
     * Набор зависимых загрузчиков. Результаты загрузчиков будут переданы третьим аргументом в функцию загрузки.
     * @example
     * <pre class="brush: js">
     *   // При такой конфигурации результат загрузки firstLoader будет передан в загрузку второго - secondLoader
     *   const data = {
     *      firstLoader: {
     *          dataFactoryName: 'MyFirstFactoryModuleName',
     *          dataFactoryArguments: {
     *              myArgument: true
     *          }
     *      },
     *      secondLoader: {
     *          dataFactoryName: 'MySecondFactoryModuleName',
     *          dataFactoryArguments: {
     *              myArgument: true
     *          },
     *          dependencies: ['firstLoader']
     *      }
     *   }
     *   //  Загрузчик firstLoader
     *   loadData(dataFactoryArguments: object, depResults): Promise<unknown> {
     *       const firstLoaderResult = depResults.firstLoader;
     *   }
     * </pre>
     */
    dependencies?: string[];
    /**
     * Имя модуля, который содержит callback, вызываемый после загрзки данных.
     * В аргументы будет передан результат загрузки
     */
    afterLoadCallback?: string;
}
