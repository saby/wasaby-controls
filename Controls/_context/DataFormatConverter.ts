import { TDataConfigs } from 'Controls-DataEnv/dataFactory';

const COMPATIBLE_MAP_TYPE = {
    list: 'Controls/dataFactory:CompatibleList',
    custom: 'Controls-DataEnv/dataFactory:CompatibleCustom',
    area: 'Controls-DataEnv/dataFactory:CompatibleArea',
};

export default class DataFormatConverter {
    static isOldDataFormat(configs: object): boolean {
        return Object.values(configs).some((config) => {
            return !config.dataFactoryName;
        });
    }

    static convertLoadResultsToFactory(
        loadResults: object,
        configs?: TDataConfigs
    ): TDataConfigs {
        const dataConfigs = {};
        Object.entries(loadResults).forEach(([key, value]) => {
            const valueIsObject = value instanceof Object;
            let factory = valueIsObject && value.dataFactoryName;
            if (!factory) {
                const isAvailableType =
                    valueIsObject &&
                    value.type &&
                    !!COMPATIBLE_MAP_TYPE[value.type];
                factory = isAvailableType
                    ? COMPATIBLE_MAP_TYPE[value.type]
                    : COMPATIBLE_MAP_TYPE.custom;
            }
            const config = configs && configs[key];
            const configWithFactoryFormat =
                config &&
                !DataFormatConverter.isOldDataFormat({ [key]: config });
            const valueWithFactoryFormat =
                valueIsObject &&
                !DataFormatConverter.isOldDataFormat({ [key]: value });
            if (configWithFactoryFormat || valueWithFactoryFormat) {
                dataConfigs[key] = config ? configs[key] : value;
            } else {
                dataConfigs[key] = {
                    dataFactoryName: factory,
                    dataFactoryArguments: value,
                    afterLoadCallback: valueIsObject
                        ? value.afterLoadCallback
                        : undefined,
                    dependencies:
                        valueIsObject && value.dependencies
                            ? value.dependencies
                            : [],
                };
            }
        });
        return dataConfigs;
    }
}
