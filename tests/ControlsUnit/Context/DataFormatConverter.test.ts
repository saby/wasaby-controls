import DataFormatConverter from 'Controls/_context/DataFormatConverter';

describe('Controls/_context/DataFormatConverter', () => {
    const actualListConfig = {
        list: {
            dataFactoryName: 'Controls/dataFactory:List',
            dataFactoryArguments: {
                keyProperty: 'key',
            },
        },
    };
    const oldCustomConfig = {
        custom: {
            type: 'custom',
            loadDataMethod: () => {
                return 2;
            },
        },
    };

    it('Проверяем, что пришел старый формат конфигурации', () => {
        expect(DataFormatConverter.isOldDataFormat(oldCustomConfig)).toBeTruthy();
        expect(DataFormatConverter.isOldDataFormat(actualListConfig)).toBeFalsy();
    });
    it('Конвертация результатов предзагрузки к новому формату конфигурации', () => {
        const value = {
            list: {
                type: 'list',
                keyProperty: 'key',
                dependencies: ['1'],
                afterLoadCallback: 'after',
            },
            custom: true,
            custom2: { property: 'value' },
        };
        const expectedConfigs = {
            list: {
                dataFactoryName: 'Controls/dataFactory:CompatibleList',
                dataFactoryArguments: value.list,
                dependencies: ['1'],
                afterLoadCallback: 'after',
            },
            custom: {
                dataFactoryName: 'Controls-DataEnv/dataFactory:CompatibleCustom',
                dataFactoryArguments: value.custom,
                afterLoadCallback: undefined,
                dependencies: [],
            },
            custom2: {
                dataFactoryName: 'Controls-DataEnv/dataFactory:CompatibleCustom',
                dataFactoryArguments: value.custom2,
                afterLoadCallback: undefined,
                dependencies: [],
            },
        };
        expect(DataFormatConverter.convertLoadResultsToFactory(value)).toEqual(expectedConfigs);
    });
});
