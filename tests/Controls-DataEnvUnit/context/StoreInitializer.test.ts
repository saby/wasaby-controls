import Store from 'Controls-DataEnv/_context/Store';
import { RecordSet } from 'Types/collection';
import 'Controls/dataFactory';
import 'Controls-DataEnv/dataFactory';
import 'Controls-DataEnvUnit/context/testDataFactories/Search';
import 'Controls-DataEnvUnit/context/testDataFactories/FactoryWithSearchValue';
import { isEqual } from 'Types/object';

describe('Controls-DataEnv/context:Store', () => {
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
            const store = new Store({ loadResults, configs, onChange: setState });
            expect(store.getState().custom).toBeTruthy();
            const isSlice = store.getState().list['[ISlice]'];
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
            };
            const setStateDecorate = (state) => {
                setState(state);
                expectCallback(state);
            };
            const store = new Store({
                loadResults,
                configs,
                onChange: setStateDecorate,
            });
            expect(store.getState().sync).toBeTruthy();
            expect(store.getState().order1).toBeUndefined();

            const expectCallback = () => {
                expect(store.getState().order1.items).toBeInstanceOf(RecordSet);
                expect(store.getState().order2).toBeUndefined();
            };
            resolver1(listResult);
            await loadResults.order1;
        });
    });

    describe('slice с sliceExtraValues', () => {
        const configWithExtraValues = {
            search: {
                dataFactoryName: 'Controls-DataEnvUnit/context/testDataFactories/Search',
                dataFactoryArguments: {},
            },
            factoryWithSearch: {
                dataFactoryName:
                    'Controls-DataEnvUnit/context/testDataFactories/FactoryWithSearchValue',
                dataFactoryArguments: {
                    sliceExtraValues: {
                        searchValue: ['search', 'searchValue'],
                    },
                },
            },
        };
        it('extraValues передаются в initState и становятся частью состояния', () => {
            const store = new Store({
                configs: configWithExtraValues,
                loadResults: {
                    search: {},
                    factoryWithSearch: {},
                },
            });

            expect(store.getState().factoryWithSearch.searchValue).toBe('searchValueFromSearch');
            expect(store.getState().factoryWithSearch.extraSearchValue).toBe(
                'searchValueFromSearch'
            );
        });

        it('При изменении одного слайса, обновляются зависимые слайсы', () => {
            const store = new Store({
                configs: configWithExtraValues,
                loadResults: {
                    search: {},
                    factoryWithSearch: {},
                },
                onChange: () => {},
            });
            store.setState({
                search: {
                    searchValue: 'newSearchValue',
                },
            });

            expect(store.getState().factoryWithSearch.searchValue).toBe('newSearchValue');
        });

        it('При изменении слайсов, сначала меняются родительские слайсы, а потом зависимые', () => {
            const changes = [];
            const store = new Store({
                configs: configWithExtraValues,
                loadResults: {
                    search: {},
                    factoryWithSearch: {},
                },
                onChange: (newState) => {
                    Object.entries(newState).forEach(([key, value]) => {
                        if (!isEqual(value.state, state[key])) {
                            changes.push(key);
                        }
                    });
                    state = {
                        search: store.getState().search.state,
                        factoryWithSearch: store.getState().factoryWithSearch.state,
                    };
                },
            });
            let state = {
                search: store.getState().search.state,
                factoryWithSearch: store.getState().factoryWithSearch.state,
            };
            store.setState({
                search: {
                    searchValue: 'newSearchValue',
                },
                factoryWithSearch: {
                    extraSearchValue: 'extraValue',
                },
            });
            expect(changes).toEqual(['search', 'factoryWithSearch']);
        });
    });
});
