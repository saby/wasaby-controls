import { Memory } from 'Types/source';

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
