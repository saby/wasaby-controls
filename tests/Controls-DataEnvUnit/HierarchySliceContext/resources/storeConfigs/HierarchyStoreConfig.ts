import { TDataConfigs } from 'Controls-DataEnv/dataFactory';
import 'Controls-DataEnvUnit/HierarchySliceContext/resources/dataFactories/DataFactoryWithGetContextConfig';

export const simpleConfigGetter = {
    getConfig(): TDataConfigs {
        return {
            simpleElement: {
                dataFactoryName:
                    'Controls-DataEnvUnit/HierarchySliceContext/resources/dataFactories/SimpleDataFactory',
                dataFactoryArguments: {},
            },
        };
    },
};

export const dependencyConfigGetter = {
    getConfig(configArguments, dataContext: { getValue(path: string[]): unknown }): TDataConfigs {
        return {
            simpleElement: {
                dataFactoryName:
                    'Controls-DataEnvUnit/HierarchySliceContext/resources/dataFactories/withSliceArgumentsOnState',
                dataFactoryArguments: {
                    userName: dataContext.getValue(['User', 'name']),
                },
            },
        };
    },
};

export const simpleHierarchyConfig = {
    contextConfigs: {
        configGetter:
            'Controls-DataEnvUnit/HierarchySliceContext/resources/storeConfigs/HierarchyStoreConfig:simpleConfigGetter',
        configGetterArguments: {},
        data: {
            simpleElement: {},
        },
        children: {
            firstGetter: {
                configGetter:
                    'Controls-DataEnvUnit/HierarchySliceContext/resources/storeConfigs/HierarchyStoreConfig:simpleConfigGetter',
                configGetterArguments: {},
                data: {
                    simpleElement: {},
                },
                children: {
                    secondGetter: {
                        configGetter:
                            'Controls-DataEnvUnit/HierarchySliceContext/resources/storeConfigs/HierarchyStoreConfig:simpleConfigGetter',
                        configGetterArguments: {},
                        data: {
                            simpleElement: {},
                        },
                        children: {
                            thirdGetter: {
                                configGetter:
                                    'Controls-DataEnvUnit/HierarchySliceContext/resources/storeConfigs/HierarchyStoreConfig:simpleConfigGetter',
                                configGetterArguments: {},
                                data: {
                                    simpleElement: {
                                        value: 'simpleElementValue',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};

export const hierarchyWithSameLevelKeys = {
    contextConfigs: {
        configGetter:
            'Controls-DataEnvUnit/HierarchySliceContext/resources/storeConfigs/HierarchyStoreConfig:simpleConfigGetter',
        configGetterArguments: {},
        data: {
            simpleElement: {},
        },
        children: {
            firstGetter: {
                configGetter:
                    'Controls-DataEnvUnit/HierarchySliceContext/resources/storeConfigs/HierarchyStoreConfig:simpleConfigGetter',
                configGetterArguments: {},
                data: {
                    simpleElement: {},
                },
                children: {
                    firstGetter: {
                        configGetter:
                            'Controls-DataEnvUnit/HierarchySliceContext/resources/storeConfigs/HierarchyStoreConfig:simpleConfigGetter',
                        configGetterArguments: {},
                        data: {
                            simpleElement: {},
                        },
                        children: {
                            firstGetter: {
                                configGetter:
                                    'Controls-DataEnvUnit/HierarchySliceContext/resources/storeConfigs/HierarchyStoreConfig:simpleConfigGetter',
                                configGetterArguments: {},
                                data: {
                                    simpleElement: {},
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};
export const hierarchyWithContextConfigFactory = {
    contextConfigs: {
        configs: {
            elementWithContextConfig: {
                dataFactoryName:
                    'Controls-DataEnvUnit/HierarchySliceContext/resources/dataFactories/DataFactoryWithGetContextConfig',
            },
        },
    },
};

export const hierarchyWithContextConfigHierarchyFactory = {
    contextConfigs: {
        configs: {
            elementWithContextConfig: {
                dataFactoryName:
                    'Controls-DataEnvUnit/HierarchySliceContext/resources/dataFactories/DataFactoryWithGetContextConfig',
            },
            elementWithContextConfigTree: {
                dataFactoryName:
                    'Controls-DataEnvUnit/HierarchySliceContext/resources/dataFactories/DataFactoryWithGetContextConfigTree',
            },
        },
    },
};

export const hierarchyWithDependencyConfigGetter = {
    contextConfigs: {
        configs: {
            User: {
                dataFactoryName:
                    'Controls-DataEnvUnit/HierarchySliceContext/resources/dataFactories/SimpleDataFactory',
                dataFactoryArguments: {
                    simpleValue: 1,
                },
            },
        },
        data: {
            User: {
                name: 'Петя',
            },
        },
        children: {
            userDependencyWidget: {
                configGetter:
                    'Controls-DataEnvUnit/HierarchySliceContext/resources/storeConfigs/HierarchyStoreConfig:dependencyConfigGetter',
                dependencies: ['User'],
                data: {
                    simpleElement: { value: 1 },
                },
            },
        },
    },
};
