import { loadSync, isLoaded, loadAsync } from 'WasabyLoader/ModulesLoader';
import {
    IDataConfig,
    TConfigGetterModule,
    TDataConfigs,
    TOldDataConfigs,
    TGetConfigResult,
    IOldDataConfig,
    IDataNodeConfigGetter,
} from './interface/IDataConfig';
import { addPageDeps } from 'UI/Deps';
import { logger as Logger } from 'Application/Env';
import { DataContext } from 'Controls-DataEnv/dataContext';

const ERROR_MODULE = 'Controls-DataEnv/dataFactory:DataConfigResolver';

const DEFAULT_COMPATIBLE_FACTORY = 'list';

const COMPATIBLE_FACTORIES = {
    list: 'Controls/dataFactory:CompatibleList',
    custom: 'Controls-DataEnv/dataFactory:CompatibleCustom',
    area: 'Controls-DataEnv/dataFactory:CompatibleArea',
};

type TCompatibleFactoryAlias = 'list' | 'area' | 'custom';

async function loadModule<TModule>(moduleName: string): Promise<TModule | undefined> {
    try {
        const module = await loadAsync<TModule>(moduleName);
        addPageDeps([moduleName]);
        return module;
    } catch (error: unknown) {
        if (error instanceof Error) {
            Logger.error(`${ERROR_MODULE} Ошибка при загрузке модуля ${moduleName}`, 0, error);
        }
    }
}

/**
 * Возвращает настройку для конкретного модуля
 * @param module
 * @param config
 * @param dataContext
 * @param path
 * @private
 */
export function callGetConfig(
    module: TConfigGetterModule,
    config: IDataNodeConfigGetter,
    dataContext?: DataContext,
    path?: string[]
): TGetConfigResult {
    const configGetter = module instanceof Function ? module : module.getConfig;
    let getterArguments = config.configGetterArgumentsArray || [config.configGetterArguments];
    getterArguments = [...getterArguments];
    getterArguments.push(dataContext?.getAPI(path || []));
    return configGetter.apply(null, getterArguments);
}

/**
 * Класс для работы с описанием фабрик данных
 * Реализует логику конвертации форматов и получение конфигурации с configGetter'ов
 * @private
 */
export default class DataConfigResolver {
    static getConfigFromLoaderSync(
        config: IDataNodeConfigGetter,
        dataContext?: DataContext,
        configPath: string[] = []
    ): TDataConfigs {
        //@ts-ignore
        if (config.isResolvedConfigGetter) {
            // TODO: удалить после проработки слоя совместимости
            // https://online.sbis.ru/opendoc.html?guid=014b4858-e010-42ab-955d-b322cc1a876f&client=3
            //@ts-ignore;
            return DataConfigResolver.normalizeConfigs(config.configGetter as TGetConfigResult);
        }
        if (!isLoaded(config.configGetter)) {
            throw new Error(
                `${ERROR_MODULE}::configGetter с именем ${config.configGetter} не загружен`
            );
        } else {
            const getConfigModuleResult = loadSync<TConfigGetterModule>(config.configGetter);
            if (!getConfigModuleResult) {
                throw new Error(
                    `${ERROR_MODULE} Модуль ${config.configGetter} ничего не экспортирует`
                );
            } else {
                return DataConfigResolver.normalizeConfigs(
                    callGetConfig(
                        getConfigModuleResult,
                        config,
                        dataContext,
                        configPath
                    ) as Awaited<TGetConfigResult>
                );
            }
        }
    }

    static isDataFactory(dataConfig: object): boolean {
        return Object.values(dataConfig).every((config) => {
            return config.hasOwnProperty('dataFactoryName');
        });
    }

    static isDataConfigs(v: any): v is TDataConfigs {
        return DataConfigResolver.isDataFactory(v);
    }

    static normalizeConfigs(configs: TDataConfigs | TOldDataConfigs): TDataConfigs {
        const result: TDataConfigs = {};

        Object.entries(configs).forEach(([key, oldConfig]) => {
            if (!DataConfigResolver.isDataFactory([oldConfig])) {
                result[key] = DataConfigResolver.convertToDataConfig(oldConfig);
            } else {
                result[key] = oldConfig;
            }
        });

        return result;
    }

    static convertToDataConfig(config: IOldDataConfig): IDataConfig {
        const factoryArgs = config;
        const type = config.type || DEFAULT_COMPATIBLE_FACTORY;
        return {
            dataFactoryName: COMPATIBLE_FACTORIES[type],
            dataFactoryArguments: {
                ...factoryArgs,
                loadDataTimeout: factoryArgs.loadDataTimeout || factoryArgs.loadTimeout,
            },
            dependencies: config.dependencies,
            afterLoadCallback: config.afterLoadCallback,
        };
    }

    static async loadConfigGetter(
        config: IDataNodeConfigGetter,
        dataContext?: DataContext
    ): Promise<TDataConfigs> {
        const module = await loadModule<TConfigGetterModule>(config.configGetter);
        let dataConfigs = {};

        if (!module) {
            throw new Error(`${ERROR_MODULE}:: Не удалось загрузить модуль ${config.configGetter}`);
        } else {
            const getConfigResult = callGetConfig(module, config, dataContext);
            const isAsyncConfigGetter = !!getConfigResult.then;

            if (isAsyncConfigGetter) {
                dataConfigs = await getConfigResult;
            } else {
                dataConfigs = getConfigResult;
            }

            if (DataConfigResolver.isDataFactory(dataConfigs)) {
                if (isAsyncConfigGetter) {
                    throw new Error(
                        `${ERROR_MODULE} Метод для получения конфига у модуля ${config.configGetter} должен быть синхронным, загрузка с асинхронным методом невозможна`
                    );
                }
            } else {
                dataConfigs = DataConfigResolver.normalizeConfigs(dataConfigs as TOldDataConfigs);
            }
        }
        return dataConfigs;
    }

    static isOldDataFormat(configs: object): boolean {
        return Object.values(configs).some((config) => {
            return !config.dataFactoryName;
        });
    }

    static convertLoadResultsToFactory(loadResults: object, configs?: TDataConfigs): TDataConfigs {
        const dataConfigs: TDataConfigs = {};
        Object.entries(loadResults).forEach(([key, value]) => {
            const valueIsObject = value instanceof Object;
            let factory = valueIsObject && value.dataFactoryName;
            if (!factory) {
                const isAvailableType =
                    valueIsObject &&
                    value.type &&
                    !!COMPATIBLE_FACTORIES[value.type as TCompatibleFactoryAlias];
                factory = isAvailableType
                    ? COMPATIBLE_FACTORIES[value.type as TCompatibleFactoryAlias]
                    : COMPATIBLE_FACTORIES.custom;
            }
            const config = configs && configs[key];
            const configWithFactoryFormat =
                config && !DataConfigResolver.isOldDataFormat({ [key]: config });
            const valueWithFactoryFormat =
                valueIsObject && !DataConfigResolver.isOldDataFormat({ [key]: value });
            const customKey = valueIsObject && value.key;
            if (configWithFactoryFormat || valueWithFactoryFormat) {
                dataConfigs[customKey || key] = config ? configs[key] : value;
            } else {
                dataConfigs[customKey || key] = {
                    dataFactoryName: factory,
                    dataFactoryArguments: value,
                    afterLoadCallback: valueIsObject ? value.afterLoadCallback : undefined,
                    dependencies: valueIsObject && value.dependencies ? value.dependencies : [],
                };
            }

            if (customKey) {
                dataConfigs[key] = dataConfigs[customKey];
            }
        });
        return dataConfigs;
    }

    static resolveRootDeps(
        configLoaderResults: Record<string, TDataConfigs>,
        extraValuesType: 'load' | 'slice'
    ): Record<string, string[]> {
        const deps: Record<string, string[]> = {};
        for (const [configLoaderName, configLoaderResult] of Object.entries(configLoaderResults)) {
            for (const [, dataConfig] of Object.entries(configLoaderResult)) {
                const dataConfigDeps = DataConfigResolver.calcAllDependencies(
                    dataConfig,
                    extraValuesType
                );
                const rootDeps: string[] = [];
                dataConfigDeps.forEach((dep) => {
                    if (!configLoaderResult.hasOwnProperty(dep)) {
                        rootDeps.push(dep);
                    }
                });
                if (rootDeps.length) {
                    deps[configLoaderName] = rootDeps;
                }
            }
        }

        return deps;
    }

    static calcAllDependencies(config: IDataConfig, extraValuesType: 'load' | 'slice'): string[] {
        let dependencies = config.dependencies || [];
        const dataFactoryArguments = config.dataFactoryArguments || {};
        const extraValues =
            extraValuesType === 'load'
                ? dataFactoryArguments.loaderExtraValues
                : dataFactoryArguments.sliceExtraValues;
        if (extraValues) {
            const extraDependencies = extraValues.map(({ dependencyName }) => {
                return dependencyName;
            });
            dependencies = dependencies.concat(
                extraDependencies.filter((extraDep) => !dependencies.includes(extraDep))
            );
        }
        return dependencies;
    }
}
