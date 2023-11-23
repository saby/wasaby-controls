import { TKey } from 'Controls-DataEnv/interface';
/**
 * Интерфейс для описания элемента предзагрузки
 *
 * @interface Controls-DataEnv/_dataFactory/interface/IDataConfig
 * @public
 */

/**
 * @name Controls-DataEnv/_dataFactory/interface/IDataConfig#dataFactoryName
 * @cfg {string} Имя модуля, содержащее описание фабрики данных
 */

/**
 * @name Controls-DataEnv/_dataFactory/interface/IDataConfig#dataFactoryArguments
 * @cfg {Object} Аргументы для фабрики данных. Будут переданы в функцию загрузки и в конструктор слайса. Базовые аргументы фабрик описаны {@link Controls-DataEnv/_dataFactory/interface/IBaseDataFactoryArguments тут}
 */

/**
 * @name Controls-DataEnv/_dataFactory/interface/IDataConfig#dependencies
 * @cfg {Array<string>} Набор зависимых загрузчиков. Результаты загрузчиков будут переданы третьим аргументом в функцию загрузки.
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

/**
 * @name Controls-DataEnv/_dataFactory/interface/IDataConfig#afterLoadCallback
 * @cfg {string} Имя модуля, который содержит callback, вызываемый после загрзки данных.
 * В аргументы будет передан результат загрузки
 */

/**
 * @name Controls-DataEnv/_dataFactory/interface/IDataConfig#dataFactoryCreationOrder
 * @cfg {Number} Очередь создания фабрики. Очередь можно использовать для оптимизации отрисовки контента, группируя данные в разные очереди.
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
import { IBaseDataFactoryArguments } from './IBaseDataFactoryArguments';

export type TDataConfigs<T = unknown> = Record<TKey, IDataConfig<T>>;

export interface IDataConfigLoader {
    configGetter: string;
    configGetterArguments?: Record<string, unknown>;
    configGetterArgumentsArray?: unknown[];
}

export interface IOldDataConfig {
    type: 'custom' | 'list' | 'area';
    dependencies?: string[];
    afterLoadCallback?: string;
    loadDataTimeout?: number;
    loadTimeout?: number;

    [key: string]: unknown;
}

export type TOldDataConfigs = Record<string, IOldDataConfig>;

export type TGetConfigResult = TDataConfigs | TOldDataConfigs;

export type TConfigGetterModule<TArguments = unknown> =
    | {
          getConfig(args: TArguments): TGetConfigResult | Promise<TGetConfigResult>;
      }
    | Function;

export interface IDataConfig<T extends IBaseDataFactoryArguments = IBaseDataFactoryArguments> {
    dataFactoryName: string;
    dataFactoryArguments: T;
    dataFactoryCreationOrder?: number;
    dependencies?: string[];
    afterLoadCallback?: string;
}
