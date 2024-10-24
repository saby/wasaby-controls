import { DataContext } from 'Controls-DataEnv/dataContext';
import { TDataConfigs } from 'Controls-DataEnv/dataFactory';

export default {
    getConfig(
        configGetterArguments: Record<string, unknown>,
        dataContext: DataContext
    ): TDataConfigs {
        return {
            factory: {
                dataFactoryName: 'Controls-DataEnvUnit/dataLoader/factories/withReturnArguments',
                dataFactoryArguments: {},
            },
        };
    },
};
