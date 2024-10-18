import DataFactoryLoader from 'Controls-DataEnv/_dataLoader/DataFactoryLoader';

describe('Controls-DataEnv/dataLoader:DataFactoryLoader', () => {
    it('Вызов afterLoadCallback после загрузки данных', async () => {
        const loader = new DataFactoryLoader({
            router: {},
            config: {
                dataFactoryName: 'Controls-DataEnvUnit/dataLoader/factories/withReturnArguments',
                dataFactoryArguments: {
                    result: 1,
                },
                afterLoadCallback: 'Controls-DataEnvUnit/dataLoader/factories/afterLoadCallback',
            },
        });
        const loadResult = await loader.load();

        expect(loadResult.afterLoadCallback).toBeTruthy();
    });
});
