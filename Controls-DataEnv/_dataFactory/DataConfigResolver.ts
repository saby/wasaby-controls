import { loadSync, isLoaded, loadAsync } from 'WasabyLoader/ModulesLoader';
import {
    IDataConfig,
    IDataConfigLoader,
    TConfigGetterModule,
    TDataConfigs,
    TOldDataConfigs,
    TGetConfigResult,
    IOldDataConfig,
} from './interface/IDataConfig';
import { addPageDeps } from 'UI/Deps';
import { Logger } from 'UI/Utils';

const ERROR_MODULE = 'Controls-DataEnv/dataFactory:DataConfigResolver';

const DEFAULT_COMPATIBLE_FACTORY = 'list';

const COMPATIBLE_FACTORIES = {
    list: 'Controls/dataFactory:CompatibleList',
    custom: 'Controls-DataEnv/dataFactory:CompatibleCustom',
    area: 'Controls-DataEnv/dataFactory:CompatibleArea',
};

async function loadModule<TModule>(moduleName: string): Promise<TModule> {
    try {
        const module = await loadAsync<TModule>(moduleName);
        addPageDeps([moduleName]);
        return module;
    } catch (error) {
        Logger.error(`${ERROR_MODULE} Ошибка при загрузке модуля ${moduleName}`, 0, error);
        return error;
    }
}

export default class DataConfigResolver {
    static getConfigFromLoaderSync(config: IDataConfigLoader): TDataConfigs {
        if (!isLoaded(config.configGetter)) {
            throw new Error(
                `${ERROR_MODULE}::configGetter с именем ${config.configGetter} не загружен`
            );
        } else {
            const getConfigModule = loadSync<TConfigGetterModule>(config.configGetter);
            if (!getConfigModule.getConfig) {
                throw new Error(
                    `${ERROR_MODULE} У модуля ${config.configGetter} отсутствует обязательный метод getConfig`
                );
            } else {
                const configs = getConfigModule.getConfig(config.configGetterArguments);
                return DataConfigResolver.normalizeConfigs(configs as Awaited<TGetConfigResult>);
            }
        }
    }

    static isDataFactory(dataConfig: object): boolean {
        return Object.values(dataConfig).every((config) => {
            return config.hasOwnProperty('dataFactoryName');
        });
    }

    static normalizeConfigs(configs: TDataConfigs | TOldDataConfigs): TDataConfigs {
        let result = {};

        if (!DataConfigResolver.isDataFactory(configs)) {
            Object.entries(configs).forEach(([key, oldConfig]) => {
                result[key] = DataConfigResolver.convertToDataConfig(oldConfig);
            });
        } else {
            result = configs as TDataConfigs;
        }

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

    static async loadConfigGetter(config: IDataConfigLoader): Promise<TDataConfigs> {
        const module = await loadModule<TConfigGetterModule>(config.configGetter);
        let dataConfigs;

        if (!module.getConfig) {
            throw new Error(
                `${ERROR_MODULE} У модуля ${config.configGetter} отсутствует обязательный метод getConfig`
            );
        } else {
            const getConfigResult = module.getConfig(config.configGetterArguments);
            const isAsyncConfigGetter = !!getConfigResult.then;

            if (isAsyncConfigGetter) {
                dataConfigs = await getConfigResult;
            } else {
                dataConfigs = getConfigResult;
            }

            if (DataConfigResolver.isDataFactory(dataConfigs)) {
                if (isAsyncConfigGetter) {
                    throw new Error(
                        `${ERROR_MODULE} Метод getConfig у модуля ${config.configGetter} должен быть синхронным, загрузка с асинхронным getConfig невозможна`
                    );
                }
            } else {
                dataConfigs = DataConfigResolver.normalizeConfigs(dataConfigs as TOldDataConfigs);
            }
        }
        return dataConfigs;
    }

    static convertLoadResultsToFactory(loadResults: object, configs?: TDataConfigs): TDataConfigs {
        const dataConfigs = {};
        Object.entries(loadResults).forEach(([key, value]) => {
            const valueIsObject = value instanceof Object;
            let factory = valueIsObject && value.dataFactoryName;
            if (!factory) {
                const isAvailableType =
                    valueIsObject && value.type && !!COMPATIBLE_FACTORIES[value.type];
                factory = isAvailableType
                    ? COMPATIBLE_FACTORIES[value.type]
                    : COMPATIBLE_FACTORIES.custom;
            }
            const config = configs && configs[key];
            const configWithFactoryFormat =
                config && !DataConfigResolver.isDataFactory({ [key]: config });
            const valueWithFactoryFormat =
                valueIsObject && !DataConfigResolver.isDataFactory({ [key]: value });
            if (configWithFactoryFormat || valueWithFactoryFormat) {
                dataConfigs[key] = config ? configs[key] : value;
            } else {
                dataConfigs[key] = {
                    dataFactoryName: factory,
                    dataFactoryArguments: value,
                    afterLoadCallback: valueIsObject ? value.afterLoadCallback : undefined,
                    dependencies: valueIsObject && value.dependencies ? value.dependencies : [],
                };
            }
        });
        return dataConfigs;
    }

    static resolveRootDeps(
        configLoaderResults: Record<string, TDataConfigs>,
        extraValuesType: 'load' | 'slice'
    ): Record<string, string[]> {
        const deps = {};
        for (const [configLoaderName, configLoaderResult] of Object.entries(configLoaderResults)) {
            for (const [, dataConfig] of Object.entries(configLoaderResult)) {
                const dataConfigDeps = DataConfigResolver.calcAllDependencies(
                    dataConfig,
                    extraValuesType
                );
                const rootDeps = [];
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
