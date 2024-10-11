import { TDataConfigs } from 'Controls-DataEnv/_dataFactory/interface/IDataConfig';

export default {
    async loadData(dataFactoryArguments: unknown) {
        return dataFactoryArguments;
    },

    getContextConfig(): { configs: TDataConfigs; loadResults: Record<string, unknown> } {
        const tree = {
            name: 'firstChildren',
            configs: {
                firstFactory: {
                    dataFactoryName:
                        'Controls-DataEnvUnit/HierarchySliceContext/resources/dataFactories/SimpleDataFactory',
                    dataFactoryArguments: {
                        simpleValue: 1,
                    },
                },
                secondFactory: {
                    dataFactoryName:
                        'Controls-DataEnvUnit/HierarchySliceContext/resources/dataFactories/SimpleDataFactory',
                    dataFactoryArguments: {
                        simpleValue: 1,
                    },
                },
            },
            children: {
                childrenTree: {
                    configs: {
                        firstFactory: {
                            dataFactoryName:
                                'Controls-DataEnvUnit/HierarchySliceContext/resources/dataFactories/SimpleDataFactory',
                            dataFactoryArguments: {
                                simpleValue: 1,
                            },
                        },
                        secondFactory: {
                            dataFactoryName:
                                'Controls-DataEnvUnit/HierarchySliceContext/resources/dataFactories/SimpleDataFactory',
                            dataFactoryArguments: {
                                simpleValue: 1,
                            },
                        },
                    },
                    data: {
                        firstFactory: {
                            simpleValue: 1,
                        },
                        secondFactory: {
                            simpleValue: 1,
                        },
                    },
                },
            },
        };
        return tree;
    },
};
