import { DataConfigsLoader } from 'Controls-DataEnv/dataLoader';

describe('Controls-DataEnv/dataLoader:DataConfigsLoader', () => {
    describe('Валидация параметров загрузки', () => {
        it('Циклические зависимости между фабриками', async () => {
            const configs = {
                customLoader: {
                    dataFactoryName: 'Controls/dataFactory:Custom',
                    dependencies: ['customLoader2'],
                    dataFactoryArguments: {
                        loadDataMethod: () => {
                            return 1;
                        },
                    },
                },
                customLoader2: {
                    dataFactoryName: 'Controls/dataFactory:Custom',
                    dependencies: ['customLoader'],
                    dataFactoryArguments: {
                        loadDataMethod: () => {
                            return 1;
                        },
                    },
                },
            };
            await new DataConfigsLoader({
                configs,
                router: {},
            })
                .load()
                .catch((error) => {
                    expect(typeof error).toBe('string');
                });
        });

        it('Несуществующая зависимость у одной из фабрик', async () => {
            const configs = {
                customLoader: {
                    dataFactoryName: 'Controls/dataFactory:Custom',
                    dependencies: ['anotherLoaderKey'],
                    dataFactoryArguments: {
                        loadDataMethod: () => {
                            return 1;
                        },
                    },
                },
            };
            await new DataConfigsLoader({
                configs,
                router: {},
            })
                .load()
                .catch((error) => {
                    expect(typeof error).toBe('string');
                });
        });
    });

    describe('Загрузка', () => {
        it('Простая загрузка нескольких фабрик', async () => {
            const configs = {
                factory1: {
                    dataFactoryName:
                        'Controls-DataEnvUnit/dataLoader/factories/withReturnArguments',
                    dataFactoryArguments: {
                        loader: 1,
                    },
                },
                factory2: {
                    dataFactoryName:
                        'Controls-DataEnvUnit/dataLoader/factories/withReturnArguments',
                    dataFactoryArguments: {
                        loader: 2,
                    },
                },
            };

            const loadResults = await new DataConfigsLoader({
                configs,
                router: {},
            }).load();

            expect(loadResults.factory1.loader).toBe(1);
            expect(loadResults.factory2.loader).toBe(2);
        });

        it('Загрузка с зависимостями между фабриками', async () => {
            let dependencyCall = 0; // Защита от кейса что dependency загрузчик позовется два раза
            const configs = {
                customLoader: {
                    dependencies: ['customValue'],
                    dataFactoryName: 'Controls/dataFactory:Custom',
                    dataFactoryArguments: {
                        loadDataMethod: (args, results) => {
                            return Promise.resolve(results[0]);
                        },
                    },
                },
                customLoader2: {
                    dependencies: ['customLoader'],
                    dataFactoryName: 'Controls/dataFactory:Custom',
                    dataFactoryArguments: {
                        loadDataMethod: (args, results) => {
                            return Promise.resolve(results.customLoader);
                        },
                    },
                },
                customValue: {
                    dataFactoryName: 'Controls/dataFactory:Custom',
                    dataFactoryArguments: {
                        loadDataMethod: () => {
                            return Promise.resolve(++dependencyCall);
                        },
                    },
                },
            };
            const loadResults = await new DataConfigsLoader({
                configs,
                router: {},
            }).load();

            expect(loadResults).toEqual({
                customLoader: 1,
                customLoader2: 1,
                customValue: 1,
            });
        });

        it('Если один из загрузчиков возвращает ошибку, то она становится результатом загрузки, не влияя на остальные результаты', async () => {
            const configs = {
                factoryWithError: {
                    dataFactoryName: 'Controls-DataEnvUnit/dataLoader/factories/withError',
                },
                factoryWithResult: {
                    dataFactoryName:
                        'Controls-DataEnvUnit/dataLoader/factories/withReturnArguments',
                    dataFactoryArguments: {
                        result: 1,
                    },
                },
            };
            const loadResults = await new DataConfigsLoader({
                configs,
                router: {},
            }).load();

            expect(loadResults.factoryWithError).toBeInstanceOf(Error);
            expect(loadResults.factoryWithResult.result).toBe(1);
        });
    });
});
