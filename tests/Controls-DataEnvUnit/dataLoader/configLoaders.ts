import { Memory } from 'Types/source';
import { Model } from 'Types/entity';

export const firstConfig = {
    getConfig(configGetterArguments) {
        return {
            data: {
                dataFactoryName: 'Controls-DataEnvUnit/dataLoader/configLoaders:factory',
                dataFactoryArguments: {
                    loaderName: configGetterArguments.loaderName,
                },
            },
        };
    },
};
export const secondConfig = {
    getConfig(configGetterArguments) {
        return {
            data: {
                dataFactoryName: 'Controls-DataEnvUnit/dataLoader/configLoaders:factory',
                dataFactoryArguments: {
                    loaderName: configGetterArguments.loaderName,
                },
            },
        };
    },
};

export const factory = {
    loadData(args) {
        return Promise.resolve(args.loaderName);
    },
};

export const RecordFactory = {
    loadData(args) {
        return Promise.resolve(
            new Model({
                rawData: {
                    Name: 'Вася',
                    SurName: 'Петров',
                },
            })
        );
    },
};

export const factoryWithError = {
    loadData(args) {
        return Promise.reject(new Error(`Какая-то ошибка из загрузчика ${args.loaderName}`));
    },
};

export const configWithError = {
    getConfig() {
        return {
            factoryWithError: {
                dataFactoryName: 'Controls-DataEnvUnit/dataLoader/configLoaders:factoryWithError',
                dataFactoryArguments: {
                    loaderName: 'error',
                },
            },
        };
    },
};

export const compatibleConfig = {
    getConfig(configGetterArguments) {
        return {
            custom: {
                type: 'custom',
                loadDataMethodArguments: {
                    ...configGetterArguments.customArgs,
                },
                loadDataMethod(args) {
                    return Promise.resolve(args);
                },
            },
            list: {
                type: 'list',
                source: new Memory({
                    keyProperty: 'id',
                    data: configGetterArguments.listArgs.items,
                }),
                keyProperty: 'id',
            },
        };
    },
};

export const asyncCompatibleConfig = {
    async getConfig(configGetterArguments) {
        return {
            custom: {
                type: 'custom',
                loadDataMethodArguments: {
                    ...configGetterArguments.customArgs,
                },
                loadDataMethod(args) {
                    return Promise.resolve(args);
                },
            },
            list: {
                type: 'list',
                source: new Memory({
                    keyProperty: 'id',
                    data: configGetterArguments.listArgs.items,
                }),
                keyProperty: 'id',
            },
        };
    },
};
export const asyncDataFactoryConfig = {
    async getConfig(configGetterArguments) {
        return {
            data: {
                dataFactoryName: 'Controls-DataEnvUnit/dataLoader/configLoaders:factory',
                dataFactoryArguments: {
                    loaderName: configGetterArguments.loaderName,
                },
            },
        };
    },
};

export const configWithUsingDataContext = {
    getConfig(configArguments, dataContext) {
        return {
            Data: {
                dataFactoryName: 'Controls-DataEnvUnit/dataLoader/configLoaders:factory',
                dataFactoryArguments: {
                    loaderName: dataContext.get(['User', 'Name']),
                },
            },
        };
    },
};

export const rootConfig = {
    getConfig(configArguments, dataContext) {
        return {
            User: {
                dataFactoryName: 'Controls-DataEnvUnit/dataLoader/configLoaders:RecordFactory',
                dataFactoryArguments: {},
            },
        };
    },
};
