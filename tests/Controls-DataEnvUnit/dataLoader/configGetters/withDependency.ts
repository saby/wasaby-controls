import { TDataConfigs } from 'Controls-DataEnv/dataFactory';

export default {
    getConfig(): TDataConfigs {
        return {
            factory: {
                dataFactoryName: 'Controls-DataEnvUnit/dataLoader/factories/withReturnArguments',
                dataFactoryArguments: {},
            },
        };
    },
};
