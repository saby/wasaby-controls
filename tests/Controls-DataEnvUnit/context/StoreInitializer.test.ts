import StoreInitializer from 'Controls-DataEnv/_context/StoreInitializer';
import { RecordSet } from 'Types/collection';
import 'Controls/dataFactory';
import 'Controls-DataEnv/dataFactory';

describe('Controls-DataEnv/context:StoreInitializer', () => {
    let setState;
    let currentState;
    beforeEach(() => {
        currentState = null;
        setState = (state) => {
            currentState = state;
        };
    });
    describe('createStore', () => {
        it('simple store', () => {
            const loadResults = {
                custom: true,
                list: {
                    items: new RecordSet({
                        rawData: [],
                        keyProperty: 'id',
                    }),
                },
            };
            const configs = {
                custom: {
                    dataFactoryName: 'Controls-DataEnv/dataFactory:Custom',
                    dataFactoryArguments: {},
                },
                list: {
                    dataFactoryName: 'Controls/dataFactory:List',
                    dataFactoryArguments: {
                        keyProperty: 'id',
                        parentProperty: 'parent',
                    },
                },
            };
            currentState = StoreInitializer(loadResults, configs, setState, {});
            expect(currentState.custom).toBeTruthy();
            const isSlice = currentState.list['[ISlice]'];
            expect(isSlice).toBeTruthy();
        });
        it('Store с очередями. Данные в сторе должны появляться поочередно по мере загрузки', async () => {
            let resolver1;
            let resolver2;
            const listResult = {
                items: new RecordSet({
                    rawData: [],
                    keyProperty: 'id',
                }),
            };
            const loadResults = {
                sync: true,
                order1: new Promise((resolve) => {
                    resolver1 = resolve;
                }),
                order2: new Promise((resolve) => {
                    resolver2 = resolve;
                }),
            };
            const configs = {
                sync: {
                    dataFactoryName: 'Controls-DataEnv/dataFactory:Custom',
                    dataFactoryArguments: {},
                },
                order1: {
                    dataFactoryName: 'Controls/dataFactory:List',
                    dataFactoryCreationOrder: 1,
                    dataFactoryArguments: {
                        keyProperty: 'id',
                        parentProperty: 'parent',
                    },
                },
                order2: {
                    dataFactoryName: 'Controls/dataFactory:List',
                    dataFactoryCreationOrder: 2,
                    dataFactoryArguments: {
                        keyProperty: 'id',
                        parentProperty: 'parent',
                    },
                },
            };
            let expectCallback;
            const setStateDecorate = (state) => {
                setState(state);
                expectCallback(state);
            };
            currentState = StoreInitializer(
                loadResults,
                configs,
                setStateDecorate,
                {}
            );
            expect(currentState.sync).toBeTruthy();
            expect(currentState.order1).toBeUndefined();

            expectCallback = () => {
                expect(currentState.order1.items).toBeInstanceOf(RecordSet);
                expect(currentState.order2).toBeUndefined();
            };
            resolver1(listResult);
            await loadResults.order1;

            expectCallback = () => {
                expect(currentState.order2.items).toBeInstanceOf(RecordSet);
            };
            resolver2(listResult);
            await loadResults.order2;
        });
    });
});
