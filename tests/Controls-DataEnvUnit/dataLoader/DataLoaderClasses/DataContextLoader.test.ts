import { DataContextLoader } from 'Controls-DataEnv/dataLoader';
//@ts-ignore;
import { wrapTimeout } from 'Core/PromiseLib/PromiseLib';

describe('Controls-DataEnv/dataLoader:DataContextLoader', () => {
    describe('getPendingPromisesInfo', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        test('Должна вернуться строка с перечислением зависших узлов контекста данных и объектов, которые зависли', async () => {
            const loader = new DataContextLoader({
                configs: {
                    //@ts-ignore
                    root: {
                        configs: {
                            pendingFactory: {
                                dataFactoryName:
                                    'Controls-DataEnvUnit/dataLoader/factories/withPendingPromise',
                            },
                        },
                        children: {
                            children: {
                                configs: {},
                            },
                            contextNode1: {
                                configs: {
                                    pendingFactory: {
                                        dataFactoryName:
                                            'Controls-DataEnvUnit/dataLoader/factories/withPendingPromise',
                                    },
                                },
                            },
                            contextNode2: {
                                configs: {
                                    pendingFactory: {
                                        dataFactoryName:
                                            'Controls-DataEnvUnit/dataLoader/factories/withPendingPromise',
                                    },
                                },
                                children: {},
                            },
                        },
                    },
                },
            });

            const loadPromise = loader.load();
            const result = wrapTimeout(loadPromise, 3000).catch((e: unknown) => {
                expect(loader.getPendingPromisesInfo()).toMatchSnapshot();
                return e;
            });

            jest.advanceTimersByTime(3000);

            return result;
        });
    });
});
