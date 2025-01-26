import { Loader } from 'Controls-DataEnv/dataLoader';

describe('Controls-DataEnv/dataLoader:Loader', () => {
    describe('loadByConfigs', () => {
        it('Загрузка с ошибкой в одной из фабрик', async () => {
            const config = {
                configWithError: {
                    configGetter: 'Controls-DataEnvUnit/dataLoader/configLoaders:configWithError',
                    configGetterArguments: {},
                },
            };
            const loadResult = await Loader.loadByConfigs(config);
            expect(loadResult.loadResults.configWithError.factoryWithError).toBeInstanceOf(Error);
        });
        it('Простая загрузка', async () => {
            const config = {
                firstData: {
                    configGetter: 'Controls-DataEnvUnit/dataLoader/configLoaders:firstConfig',
                    configGetterArguments: {
                        loaderName: 'firstData',
                    },
                },
                secondData: {
                    configGetter: 'Controls-DataEnvUnit/dataLoader/configLoaders:firstConfig',
                    configGetterArguments: {
                        loaderName: 'secondData',
                    },
                },
            };
            const loadResult = await Loader.loadByConfigs(config);
            expect(loadResult.loadResults).toEqual({
                firstData: {
                    data: 'firstData',
                },
                secondData: {
                    data: 'secondData',
                },
            });
        });

        it('Совместимость. Синхронный getConfig со старой конфигурацией должен сконвертироваться и загрузить', async () => {
            const config = {
                compatibleData: {
                    configGetter: 'Controls-DataEnvUnit/dataLoader/configLoaders:compatibleConfig',
                    configGetterArguments: {
                        customArgs: {
                            customResult: true,
                        },
                        listArgs: {
                            items: [{ id: 'firstItem' }],
                        },
                    },
                },
            };
            const loadConfigsResults = await Loader.loadByConfigs(config);
            const loadResult = loadConfigsResults.loadResults;
            expect(loadResult.compatibleData.custom).toEqual({
                customResult: true,
            });
            expect(loadResult.compatibleData.list.items.at(0).getRawData()).toEqual({
                id: 'firstItem',
            });
        });
        it('Совместимость. Асинхронный getConfig со старой конфигурацией должен сконвертироваться и загрузить', async () => {
            const config = {
                compatibleData: {
                    configGetter:
                        'Controls-DataEnvUnit/dataLoader/configLoaders:asyncCompatibleConfig',
                    configGetterArguments: {
                        customArgs: {
                            customResult: true,
                        },
                        listArgs: {
                            items: [{ id: 'firstItem' }],
                        },
                    },
                },
            };
            const loadConfigsResults = await Loader.loadByConfigs(config);
            const loadResult = loadConfigsResults.loadResults;
            expect(loadResult.compatibleData.custom).toEqual({
                customResult: true,
            });
            expect(loadResult.compatibleData.list.items.at(0).getRawData()).toEqual({
                id: 'firstItem',
            });
        });
        it('Совместимость. Асинхронный getConfig со старой конфигурацией должен сконвертироваться и загрузить', async () => {
            const config = {
                compatibleData: {
                    configGetter:
                        'Controls-DataEnvUnit/dataLoader/configLoaders:asyncCompatibleConfig',
                    configGetterArguments: {
                        customArgs: {
                            customResult: true,
                        },
                        listArgs: {
                            items: [{ id: 'firstItem' }],
                        },
                    },
                },
            };
            const loadConfigsResults = await Loader.loadByConfigs(config);
            const loadResult = loadConfigsResults.loadResults;
            expect(loadResult.compatibleData.custom).toEqual({
                customResult: true,
            });
            expect(loadResult.compatibleData.list.items.at(0).getRawData()).toEqual({
                id: 'firstItem',
            });
        });
    });
});
