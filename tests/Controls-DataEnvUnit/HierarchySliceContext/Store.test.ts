import FlatStoreConfig from './resources/storeConfigs/FlatStoreConfig';
import {
    simpleHierarchyConfig,
    hierarchyWithSameLevelKeys,
    hierarchyWithContextConfigFactory,
    hierarchyWithContextConfigHierarchyFactory,
    hierarchyWithDependencyConfigGetter,
} from './resources/storeConfigs/HierarchyStoreConfig';
import Store from 'Controls-DataEnv/_context/Store';
import { Slice } from 'Controls-DataEnv/slice';
import { TDataConfigs } from 'Controls-DataEnv/_dataFactory/interface/IDataConfig';

const DEFAULT_CHANGE_CALLBACK = () => {};

describe('Controls-DataEnv/_context/HierarchySliceContext/Store', () => {
    describe('Создание контекста', () => {
        it('При передаче плоского конфига без иерархии создается один узел контекста', () => {
            const store = new Store({
                configs: FlatStoreConfig.configs,
                loadResults: FlatStoreConfig.loadResults,
                onChange: DEFAULT_CHANGE_CALLBACK,
            });

            expect(store.getState().simpleElement).toBeInstanceOf(Slice);
        });
        it('Корректная передача loadResults в getSlicesConfig', () => {
            let resultsFromGetter = null;
            const storeLoadResults = {
                sliceFromFunction: {
                    result: true,
                },
            };

            function getSlicesConfig(loadResults: unknown): TDataConfigs {
                resultsFromGetter = loadResults;
                return {
                    sliceFromFunction: {
                        dataFactoryName:
                            'Controls-DataEnvUnit/context/testDataFactories/FactoryWithProxyValues',
                        dataFactoryArguments: {
                            argument: true,
                        },
                    },
                };
            }

            const store = new Store({
                configs: {},
                getSlicesConfig,
                loadResults: storeLoadResults,
                router: {},
                onChange: DEFAULT_CHANGE_CALLBACK,
            });
            expect(resultsFromGetter).toEqual(storeLoadResults);
        });

        it('При создании слайса с абстрактным классом должна падать ошибка', () => {
            const configs = {
                test: {
                    dataFactoryName:
                        'Controls-DataEnvUnit/context/testDataFactories/FactoryWithAbstractSlice',
                    dataFactoryArguments: {},
                },
            };
            expect.assertions(1);

            try {
                new Store({
                    onChange: DEFAULT_CHANGE_CALLBACK,
                    configs,
                    loadResults: {
                        test: '1',
                    },
                    router: {},
                });
            } catch (error) {
                expect(error.message)
                    .toEqual(`Controls-DataEnv/context.createSlice::slice с именем test не будет создан.
             В качестве слайса у фабрики ${configs.test.dataFactoryName} задан абстрактный класс Controls-DataEnv/slice:AbstractSlice.
             Создание экземпляра абстрактного класса невозможно. Используйте Controls-DataEnv/slice:Slice`);
            }
        });
        it('Создание контекста с иерархической структурой данных', () => {
            const store = new Store({
                dataConfigs: {
                    contextConfigs: simpleHierarchyConfig.contextConfigs,
                },
                router: {},
                onChange: DEFAULT_CHANGE_CALLBACK,
            });
            const elementFromThirdLevel = store.getElement('simpleElement', [
                'root',
                'firstGetter',
                'secondGetter',
                'thirdGetter',
            ]);
            expect(elementFromThirdLevel).toBeInstanceOf(Slice);
        });
        it('Создание контекста с иерархической структурой данных, в которой есть корни с одинаковым идентификатором', () => {
            const store = new Store({
                dataConfigs: {
                    contextConfigs: hierarchyWithSameLevelKeys.contextConfigs,
                },
                router: {},
                onChange: DEFAULT_CHANGE_CALLBACK,
            });
            const elementFromThirdLevel = store.getElement('simpleElement', [
                'root',
                'firstGetter',
                'firstGetter',
                'firstGetter',
            ]);
            expect(elementFromThirdLevel).toBeInstanceOf(Slice);
        });
        it('DataContext приходит корректно при вызове configGetterов.', () => {
            const store = new Store({
                dataConfigs: {
                    contextConfigs: hierarchyWithDependencyConfigGetter.contextConfigs,
                },
                router: {},
                onChange: DEFAULT_CHANGE_CALLBACK,
            });
            const dependencySlice = store.getElement('simpleElement', [
                'root',
                'userDependencyWidget',
            ]);
            expect(dependencySlice).toBeInstanceOf(Slice);
            expect(dependencySlice.state.userName).toBe('Петя');
        });
        describe('Создание контекста с getSlicesConfig', () => {
            it('Создаются слайсы по кофнигам из getSlicesConfig', () => {
                function getSlicesConfig(loadResults: unknown): IDataConfigs {
                    return {
                        sliceFromFunction: {
                            dataFactoryName:
                                'Controls-DataEnvUnit/context/testDataFactories/FactoryWithProxyValues',
                            dataFactoryArguments: {
                                argument: true,
                            },
                        },
                    };
                }

                const store = new Store({
                    configs: {},
                    getSlicesConfig,
                    loadResults: {
                        sliceFromFunction: {
                            result: true,
                        },
                    },
                    router: {},
                    onChange: DEFAULT_CHANGE_CALLBACK,
                });
                expect(store.getState().sliceFromFunction.state.config.argument).toBeTruthy();
                expect(store.getState().sliceFromFunction.state.loadResult.result).toBeTruthy();
            });

            it('getSlicesConfig с иерархической конфигуарацией контекста. Фабрики из функции должны быть добавлены в узел с названием из опции getSlicesConfigNodeName', () => {
                const store = new Store({
                    dataConfigs: {
                        contextConfigs: simpleHierarchyConfig.contextConfigs,
                    },
                    router: {},
                    getSlicesConfig(): IDataConfigs {
                        return {
                            sliceFromFunction: {
                                dataFactoryName:
                                    'Controls-DataEnvUnit/context/testDataFactories/FactoryWithProxyValues',
                                dataFactoryArguments: {
                                    argument: true,
                                },
                            },
                        };
                    },
                    getSlicesContextNodeName: 'firstGetter',
                    onChange: DEFAULT_CHANGE_CALLBACK,
                });
                const elementFromGetSlicesConfig = store.getElement('sliceFromFunction', [
                    'root',
                    'firstGetter',
                ]);

                expect(elementFromGetSlicesConfig).toBeInstanceOf(Slice);
            });
        });
    });

    describe('Фабрики данных с getContextConfig', () => {
        it('getContextConfig вернул объект с фабриками. Эти фабрики создаются в одном узле с исходной', () => {
            const store = new Store({
                dataConfigs: {
                    contextConfigs: hierarchyWithContextConfigFactory.contextConfigs,
                },
                router: {},
                onChange: DEFAULT_CHANGE_CALLBACK,
            });
            const elementFromGetContextConfig = store.getElement('firstFactory', ['root']);
            expect(elementFromGetContextConfig).toBeInstanceOf(Slice);
        });

        it('getContextConfig вернул иерархическую структуру контекста. Новые узлы должны создаться корректно. Родителем этих узлов является корень фабрики.', () => {
            const store = new Store({
                dataConfigs: {
                    contextConfigs: hierarchyWithContextConfigHierarchyFactory.contextConfigs,
                },
                router: {},
                onChange: DEFAULT_CHANGE_CALLBACK,
            });
            const elementFromGetContextConfig = store.getElement('firstFactory', ['root']);
            const elementFromChildrenTree = store.getElement('firstFactory', [
                'root',
                'firstChildren',
                'childrenTree',
            ]);
            expect(elementFromGetContextConfig).toBeInstanceOf(Slice);
            expect(elementFromChildrenTree).toBeInstanceOf(Slice);
        });
    });

    describe('Работа с элементом контекста', () => {
        it('createElementSync', () => {});
        it('createElementAsync', () => {});
        it('removeElement', () => {
            //todo
        });
    });

    describe('Обновление значения', () => {
        const configWithExtraValues = {
            search: {
                dataFactoryName: 'Controls-DataEnvUnit/context/testDataFactories/Search',
                dataFactoryArguments: {},
            },
            factoryWithSearch: {
                dataFactoryName:
                    'Controls-DataEnvUnit/context/testDataFactories/FactoryWithSearchValue',
                dataFactoryArguments: {
                    sliceExtraValues: [
                        {
                            propName: 'searchValue',
                            dependencyName: 'search',
                            dependencyPropName: 'searchValue',
                        },
                    ],
                },
            },
        };
        it('Слайс на глубоком уровне иерархии обновлен', () => {
            const store = new Store({
                dataConfigs: {
                    contextConfigs: simpleHierarchyConfig.contextConfigs,
                },
                router: {},
                onChange: DEFAULT_CHANGE_CALLBACK,
            });
            const elementFromThirdLevel = store.getElement('simpleElement', [
                'root',
                'firstGetter',
                'secondGetter',
                'thirdGetter',
            ]);
            elementFromThirdLevel?.setState({
                simpleValue: 4,
            });

            expect(elementFromThirdLevel.state.simpleValue).toBe(4);
        });

        it('extraValues передаются в initState и становятся частью состояния', () => {
            const store = new Store({
                configs: configWithExtraValues,
                loadResults: {
                    search: {},
                    factoryWithSearch: {},
                },
                router: {},
                onChange: () => {},
            });

            expect(store.getState().factoryWithSearch.searchValue).toBe('searchValueFromSearch');
        });

        it('При изменении одного слайса, обновляются зависимые слайсы', () => {
            const store = new Store({
                configs: configWithExtraValues,
                router: {},
                loadResults: {
                    search: {},
                    factoryWithSearch: {},
                },
                onChange: DEFAULT_CHANGE_CALLBACK,
            });

            const searchSlice = store.getElement('search', ['root']);
            searchSlice.setState({ searchValue: 'newSearchValue' });

            expect(store.getState().factoryWithSearch.searchValue).toBe('newSearchValue');
        });

        it('При изменении слайса, не меняя в нем зависимое состояние не обновляются зависимые слайсы', () => {
            const store = new Store({
                configs: configWithExtraValues,
                router: {},
                loadResults: {
                    search: {},
                    factoryWithSearch: {},
                },
                onChange: DEFAULT_CHANGE_CALLBACK,
            });

            expect(store.getState().factoryWithSearch.searchValue).toBe('searchValueFromSearch');
        });

        it('При изменении слайсов, сначала меняются родительские слайсы, а потом зависимые', () => {
            const changes: string[] = [];
            const sliceChanged = (name: string) => {
                changes.push(name);
            };
            const store = new Store({
                configs: configWithExtraValues,
                router: {},
                loadResults: {
                    search: {
                        onChangeState: sliceChanged,
                        name: 'search',
                    },
                    factoryWithSearch: {
                        onChangeState: sliceChanged,
                        name: 'factoryWithSearch',
                    },
                },
                onChange: DEFAULT_CHANGE_CALLBACK,
            });
            const searchSlice = store.getElement('search', ['root']);
            searchSlice.setState({ searchValue: 'newSearchValue' });
            expect(changes).toEqual(['search', 'factoryWithSearch']);
        });

        it('При циклических зависимостях в sliceExtraValues падает ошибка на этапе инициализация ноды контекста', () => {
            const configWithCircularDependencies = {
                config1: {
                    dataFactoryName: 'Controls-DataEnvUnit/context/testDataFactories/Search',
                    dataFactoryArguments: {
                        sliceExtraValues: [
                            {
                                propName: 'config',
                                dependencyName: 'config2',
                                dependencyPropName: 'searchValue',
                            },
                        ],
                    },
                },
                config2: {
                    dataFactoryName:
                        'Controls-DataEnvUnit/context/testDataFactories/FactoryWithSearchValue',
                    dataFactoryArguments: {
                        sliceExtraValues: [
                            {
                                propName: 'searchValue',
                                dependencyName: 'config1',
                                dependencyPropName: 'searchValue',
                            },
                        ],
                    },
                },
            };
            try {
                new Store({
                    onChange: DEFAULT_CHANGE_CALLBACK,
                    configs: configWithCircularDependencies,
                    loadResults: {
                        config1: {},
                        config2: {},
                    },
                    router: {},
                });
            } catch (error) {
                expect(error).toBeInstanceOf(Error);
            }
        });
    });
    describe('destroy контекста', () => {
        it('Все слайсы на всех уровнях иерархии контекста должны быть задестроены', () => {
            const store = new Store({
                dataConfigs: {
                    contextConfigs: simpleHierarchyConfig.contextConfigs,
                },
                router: {},
                onChange: DEFAULT_CHANGE_CALLBACK,
            });
            const elementFromThirdLevel = store.getElement('simpleElement', [
                'root',
                'firstGetter',
                'secondGetter',
                'thirdGetter',
            ]);
            expect(elementFromThirdLevel).toBeInstanceOf(Slice);
            store.destroy();
            expect(elementFromThirdLevel.isDestroyed()).toBeTruthy();
        });
    });
    describe('Работа с узлом контекста', () => {
        describe('createNodeSync', () => {});
        describe('createNodeAsync', () => {});
        describe('reloadElement', () => {
            it('Перезагрузка элемента', async () => {
                const store = new Store({
                    configs: FlatStoreConfig.configs,
                    loadResults: FlatStoreConfig.loadResults,
                    onChange: DEFAULT_CHANGE_CALLBACK,
                });

                const currentSlice = store.getState().simpleElement;
                expect(currentSlice).toBeInstanceOf(Slice);
                await store.reloadElement(['root'], 'simpleElement', {
                    simpleValue: 333,
                });
                expect(currentSlice.isDestroyed()).toBeTruthy();
                const newSLice = store.getState().simpleElement;
                expect(newSLice.state.simpleValue).toBe(333);
            });
            it('Перезагрузка элемента с фабрикой данных, имеющей getContextConfig. После перезагрузки пересоздаются элементы, порождаемые функцией.', async () => {
                const store = new Store({
                    dataConfigs: {
                        contextConfigs: hierarchyWithContextConfigHierarchyFactory.contextConfigs,
                    },
                    router: {},
                    onChange: DEFAULT_CHANGE_CALLBACK,
                });

                const currentSlice = store.getState().elementWithContextConfigTree;
                expect(currentSlice).toBeInstanceOf(Slice);
                const currentFirstNode = store.getNodeByPath(['root', 'firstChildren']);

                await store.reloadElement(['root'], 'elementWithContextConfigTree', {
                    firstChildren: true,
                });

                const newSlice = store.getState().elementWithContextConfigTree;

                expect(newSlice).toBeInstanceOf(Slice);

                expect(newSlice).not.toEqual(currentSlice);

                const secondNode = store.getNodeByPath(['root', 'firstChildren', 'childrenTree']);
                const newFirstNode = store.getNodeByPath(['root', 'firstChildren']);

                expect(currentFirstNode).not.toEqual(newFirstNode);
                expect(secondNode).toBeNull();
            });
        });
    });
});
