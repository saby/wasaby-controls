import { TDataConfigs } from 'Controls-DataEnv/_dataFactory/interface/IDataConfig';

export default {
    async loadData(dataFactoryArguments: unknown) {
        return dataFactoryArguments;
    },

    getContextConfig(): { configs: TDataConfigs; loadResults: Record<string, unknown> } {
        const configs = {
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
        };
        const loadResults = {
            firstFactory: {
                loadResult: 1,
            },
            secondFactory: {
                loadResult: 2,
            },
        };

        return {
            configs,
            loadResults,
        };
    },
};
