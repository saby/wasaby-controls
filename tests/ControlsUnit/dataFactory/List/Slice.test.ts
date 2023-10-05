import {
    ListSlice,
    IListState,
    IListLoadResult,
    IListDataFactoryArguments,
} from 'Controls/dataFactory';
import { RecordSet } from 'Types/collection';
import {
    Direction,
    INavigationOptionValue,
    INavigationPageSourceConfig,
    TKey,
} from 'Controls/interface';
import { Memory, HierarchicalMemory } from 'Types/source';
import 'Controls/search';
import 'Controls/operations';
import { NewSourceController } from 'Controls/dataSource';

const flatData = [
    {
        key: 0,
        name: 'Sasha',
        department: 'Platform',
    },
    {
        key: 1,
        name: 'Sergey',
        department: 'Platform',
    },
    {
        key: 2,
        name: 'Maksimka',
        department: 'SocialNetwork',
    },
];

const hierarchyItems = [
    {
        key: 0,
        title: 'Интерфейсный фреймворк',
        parent: null,
        hasChildren: true,
    },
    {
        key: 1,
        title: 'Sasha',
        parent: 0,
        hasChildren: false,
    },
    {
        key: 2,
        title: 'Dmitry',
        parent: 0,
        hasChildren: false,
    },
    {
        key: 3,
        title: 'Склад',
        parent: null,
        hasChildren: true,
    },
    {
        key: 4,
        title: 'Michail',
        parent: 3,
        hasChildren: false,
    },
    {
        key: 5,
        title: 'Платформа',
        parent: null,
        hasChildren: false,
    },
];

const hierarchyOptions = {
    parentProperty: 'parent',
};

function getHierarchyMemory(additionalOptions: object = {}): HierarchicalMemory {
    const options = {
        data: hierarchyItems,
        keyProperty: 'key',
        ...hierarchyOptions,
    };
    return new HierarchicalMemory({ ...options, ...additionalOptions });
}

function getMemory(): Memory {
    return new Memory({
        data: flatData,
        keyProperty: 'key',
    });
}

function getPagingNavigation(
    hasMore: boolean = false,
    pageSize: number = 1,
    multiNavigation: boolean = false
): INavigationOptionValue<INavigationPageSourceConfig> {
    return {
        source: 'page',
        sourceConfig: {
            multiNavigation,
            pageSize,
            page: 0,
            hasMore,
        },
    };
}

describe('Controls/dataFactory:ListSlice', () => {
    describe('Тесты protected метода _dataLoaded', () => {
        interface ICustomListSliceWithDataLoadCallback extends IListState {
            dataLoadCallbackCount: number;
            dataLoadedReturnPromise: boolean;
            nodeDataLoadCallbackCount: number;
        }

        class CustomListSliceWithDataLoadCallback extends ListSlice<ICustomListSliceWithDataLoadCallback> {
            protected _initState(
                loadResult: IListLoadResult,
                config: IListDataFactoryArguments
            ): ICustomListSliceWithDataLoadCallback {
                const state = super._initState(loadResult, config);
                state.dataLoadCallbackCount = 0;
                state.nodeDataLoadCallbackCount = 0;
                state.dataLoadedReturnPromise = config.dataLoadedReturnPromise;
                return state;
            }

            protected _dataLoaded(
                items: RecordSet,
                direction: Direction,
                nextState: ICustomListSliceWithDataLoadCallback,
                key: TKey
            ):
                | ICustomListSliceWithDataLoadCallback
                | Promise<ICustomListSliceWithDataLoadCallback> {
                if (nextState.dataLoadedReturnPromise) {
                    return new Promise((resolve) => {
                        nextState.dataLoadCallbackCount += 1;
                        resolve(nextState);
                    });
                } else {
                    nextState.dataLoadCallbackCount += 1;
                    return nextState;
                }
            }

            protected _nodeDataLoaded(
                items: RecordSet,
                key: TKey,
                direction: Direction,
                nextState: ICustomListSliceWithDataLoadCallback
            ):
                | Partial<ICustomListSliceWithDataLoadCallback>
                | Promise<Partial<ICustomListSliceWithDataLoadCallback>> {
                nextState.nodeDataLoadCallbackCount += 1;
                return nextState;
            }
        }

        it('_dataLoaded вызывается после загрузки данных', () => {
            return new Promise((resolve) => {
                const source = new Memory();
                const items = new RecordSet();
                const itemsVersion = items.getVersion();
                const onChange = (state) => {
                    if (itemsVersion !== state.items.getVersion()) {
                        resolve(expect(state.dataLoadCallbackCount).toEqual(1));
                    }
                };
                const slice = new CustomListSliceWithDataLoadCallback({
                    onChange,
                    config: {
                        source,
                        dataLoadedReturnPromise: false,
                    },
                    loadResult: {
                        items,
                    },
                });

                slice.setFilter({ someFilterField: 'someFilterValue' });
            });
        });

        it('_dataLoaded вызывается после вызова метода load', () => {
            return new Promise((resolve) => {
                const source = new Memory();
                const items = new RecordSet();
                const itemsVersion = items.getVersion();
                const onChange = (state) => {
                    if (itemsVersion !== state.items.getVersion()) {
                        resolve(expect(state.dataLoadCallbackCount).toEqual(1));
                    }
                };
                const slice = new CustomListSliceWithDataLoadCallback({
                    onChange,
                    config: {
                        source,
                        dataLoadedReturnPromise: false,
                    },
                    loadResult: {
                        items,
                    },
                });

                slice.load('down');
            });
        });

        it('_dataLoaded вернул Promise', () => {
            return new Promise((resolve) => {
                const source = new Memory();
                const items = new RecordSet();
                const itemsVersion = items.getVersion();
                const onChange = (state) => {
                    if (itemsVersion !== state.items.getVersion()) {
                        resolve(expect(state.dataLoadCallbackCount).toEqual(1));
                    }
                };
                const slice = new CustomListSliceWithDataLoadCallback({
                    onChange,
                    config: {
                        source,
                        dataLoadedReturnPromise: true,
                    },
                    loadResult: {
                        items,
                    },
                });

                slice.load('down');
            });
        });

        it('При загрузке узла вызывается _nodeDataLoaded', () => {
            return new Promise((resolve) => {
                const source = new Memory();
                const items = new RecordSet();
                const itemsVersion = items.getVersion();
                const onChange = (state) => {
                    if (itemsVersion !== state.items.getVersion()) {
                        resolve(expect(state.nodeDataLoadCallbackCount).toEqual(1));
                        resolve(expect(state.dataLoadCallbackCount).toEqual(0));
                    }
                };
                const slice = new CustomListSliceWithDataLoadCallback({
                    onChange,
                    config: {
                        source,
                        dataLoadedReturnPromise: false,
                    },
                    loadResult: {
                        items,
                    },
                });

                slice.load('down', 'testKey');
            });
        });
    });

    describe('Тесты поиска', () => {
        it('Вызов метод search с опцией searchStartingWith: "root"', () => {
            return new Promise((resolve) => {
                const source = new Memory();
                const items = new RecordSet();
                const itemsVersion = items.getVersion();
                const onChange = (state) => {
                    if (itemsVersion !== state.items.getVersion()) {
                        resolve(state);
                    }
                };
                const slice = new ListSlice({
                    onChange,
                    config: {
                        source,
                        dataLoadedReturnPromise: false,
                        searchParam: 'testSearchParam',
                    },
                    loadResult: {
                        items,
                    },
                });

                slice.search('test');
            }).then((state: IListState) => {
                expect(state.searchValue).toEqual('test');
                expect(state.filter[state.searchParam]).toEqual('test');
            });
        });

        it('При поиске узлы должны сворачиваться, если не задана опция deepReload', () => {
            return new Promise((resolve) => {
                const source = getMemory();
                const items = new RecordSet({
                    keyProperty: 'id',
                    rawData: flatData,
                });
                const itemsVersion = items.getVersion();
                const onChange = (state) => {
                    if (itemsVersion !== state.items.getVersion() || items !== state.items) {
                        resolve(state);
                    }
                };
                const slice = new ListSlice({
                    onChange,
                    config: {
                        source,
                        dataLoadedReturnPromise: false,
                        searchParam: 'name',
                        navigation: getPagingNavigation(false, 3, true),
                    },
                    loadResult: {
                        items,
                        expandedItems: [1, 2, 3],
                        deepReload: false,
                    },
                });

                slice.search('Sasha');
            }).then((state: IListState) => {
                expect(state.expandedItems).toEqual([]);
                expect(state.sourceController.getExpandedItems()).toEqual([]);
                expect(state.items.getCount()).toEqual(1);
                expect(state.items.at(0).get('name')).toEqual('Sasha');
            });
        });

        it('Вызов метода search c тем же searchValue, что и на стейте', async () => {
            const source = new Memory();
            const items = new RecordSet();
            let stateChanged;
            const slice = new ListSlice({
                onChange: () => {
                    stateChanged = true;
                },
                config: {
                    source,
                    dataLoadedReturnPromise: false,
                    searchParam: 'testSearchParam',
                    searchValue: 'test',
                },
                loadResult: {
                    items,
                },
            });

            expect(slice.state.searchValue).toEqual('test');

            slice.search('test');
            expect(slice.state.loading).toBeTruthy();

            // Если данные уже загружаются по строке,
            // то повторный вызов search не должен вызвать перезагрузку и изменение состояния
            stateChanged = false;
            slice.search('test');
            expect(stateChanged).toBeFalsy();
            expect(slice.state.loading).toBeTruthy();
        });

        it('Изменение стейта searchValue не должно вызывать перезагрузку, если не задан searchParam', async () => {
            const source = new Memory();
            const items = new RecordSet();
            const slice = new ListSlice({
                onChange: () => {},
                config: {
                    source,
                    dataLoadedReturnPromise: false,
                    searchValue: '',
                },
                loadResult: {
                    items,
                },
            });

            slice.setState({ searchValue: 'test' });
            expect(slice.state.loading).toBeFalsy();
        });

        it('Изменение viewMode и searchValue, если не задан searchParam', async () => {
            return new Promise((resolve) => {
                const source = new Memory();
                const items = new RecordSet();
                const itemsVersion = items.getVersion();
                const onChange = (state) => {
                    if (itemsVersion !== state.items.getVersion()) {
                        resolve(state);
                    }
                };
                const slice = new ListSlice({
                    onChange,
                    config: {
                        source,
                        searchValue: '',
                    },
                    loadResult: {
                        items,
                    },
                });

                slice.setState({
                    searchValue: 'test',
                    viewMode: 'search',
                    filter: { newFilterField: 'test' },
                });
            }).then((state: IListState) => {
                expect(state.searchValue).toEqual('test');
                expect(state.viewMode).toEqual('search');
            });
        });

        it('Установка корня в режиме поиска с опцией searchNavigationMode: "expand"', async () => {
            return new Promise((resolve) => {
                const items = new RecordSet({
                    rawData: [
                        {
                            key: 0,
                            title: 'leaf',
                            parent: 1,
                        },
                        {
                            key: 1,
                            title: 'node',
                            parent: 2,
                        },
                        {
                            key: 2,
                            title: 'node in root',
                            parent: null,
                        },
                    ],
                    keyProperty: 'key',
                });
                const source = new Memory();
                const onChange = (state) => {
                    if (!state.items.getCount()) {
                        resolve(state);
                    }
                };
                const slice = new ListSlice({
                    onChange,
                    config: {
                        source,
                        parentProperty: 'parent',
                        root: null,
                        searchParam: 'title',
                        searchValue: 'test',
                        searchNavigationMode: 'expand',
                    },
                    loadResult: {
                        items,
                    },
                });

                slice.setRoot(1);
            }).then((state: IListState) => {
                expect(state.expandedItems).toEqual([2, 1]);
            });
        });
    });

    describe('Тесты изменения корня (стейта root)', () => {
        it('Изменение корня', () => {
            return new Promise((resolve) => {
                const source = getHierarchyMemory();
                const items = new RecordSet();
                const onChange = (state) => {
                    if (state.root === 3) {
                        resolve(state);
                    }
                };
                const slice = new ListSlice({
                    onChange,
                    config: {
                        source,
                        ...hierarchyOptions,
                    },
                    loadResult: {
                        items,
                    },
                });

                slice.setRoot(3);
            }).then((state: IListState) => {
                expect(state.root).toEqual(3);
                expect(state.breadCrumbsItems.length).toEqual(1);
            });
        });

        it('Изменение корня с опцией searchStartingWith: "root"', () => {
            return new Promise((resolve) => {
                const source = getHierarchyMemory();
                const items = new RecordSet();
                const onChange = (state) => {
                    if (state.root === 3) {
                        resolve(state);
                    }
                };
                const slice = new ListSlice({
                    onChange,
                    config: {
                        source,
                        ...hierarchyOptions,
                        searchStartingWith: 'root',
                        searchParam: 'testSearchParam',
                    },
                    loadResult: {
                        items,
                    },
                });

                slice.setRoot(3);
            }).then((state: IListState) => {
                expect(state.root).toEqual(3);
                expect(state.breadCrumbsItems.length).toEqual(1);
            });
        });
    });

    describe('Тесты изменения viewMode при adaptiveSearchMode', () => {
        function getSlice(onChange: Function, viewMode: string): ListSlice {
            const source = getHierarchyMemory();
            const items = new RecordSet();
            return new ListSlice({
                onChange,
                config: {
                    source,
                    ...hierarchyOptions,
                    searchStartingWith: 'root',
                    searchParam: 'testSearchParam',
                    adaptiveSearchMode: true,
                    viewMode,
                },
                loadResult: {
                    items,
                },
            });
        }

        it('Изменение viewMode tile / searchTile', () => {
            return new Promise((resolve) => {
                let previousState = null;
                let i = 0;
                const onChange = (state) => {
                    if (previousState.searchValue !== state.searchValue && !!state.searchValue) {
                        // 1. Сюда попадаем после поиска
                        expect(state.viewMode).toEqual('searchTile');
                        resolve(++i);
                    }
                };
                const slice = getSlice(onChange, 'tile');
                previousState = slice.state;
                slice.search('test');
            }).then((countOfChanges) => {
                // Проверяем, что произошли все тестируемые изменения в слайсах
                expect(countOfChanges).toBe(1);
            });
        });

        it('Изменение viewMode search / searchTile и сброс поиска', () => {
            return new Promise((resolve) => {
                let previousState = null;
                let i = 0;
                const onChange = (state) => {
                    if (previousState.searchValue !== state.searchValue) {
                        if (!!state.searchValue) {
                            // 1. Сюда попадаем после поиска
                            expect(state.viewMode).toEqual('search');
                            expect(state.previousViewMode).toEqual('table');
                            previousState = state;
                            i++;
                        } else if (!!previousState.searchValue) {
                            // 3. Сюда попадаем после сброса поиска
                            expect(state.viewMode).toEqual('tile');
                            resolve(++i);
                        }
                    } else if (previousState.viewMode !== state.viewMode) {
                        // 2. Сюда попадаем после смены viewMode
                        expect(state.viewMode).toEqual('searchTile');
                        expect(state.previousViewMode).toEqual('tile');
                        previousState = state;
                        i++;
                    }
                };
                const slice = getSlice(onChange, 'table');
                previousState = slice.state;
                slice.search('test');
                slice.setViewMode('tile');
                slice.resetSearch();
            }).then((countOfChanges) => {
                // Проверяем, что произошли все тестируемые изменения в слайсах
                expect(countOfChanges).toBe(3);
            });
        });

        it('Изменение viewMode searchTile / search и сброс поиска', () => {
            return new Promise((resolve) => {
                let previousState = null;
                let i = 0;
                const onChange = (state) => {
                    if (previousState.searchValue !== state.searchValue) {
                        if (!!state.searchValue) {
                            // 1. Сюда попадаем после поиска
                            expect(state.viewMode).toEqual('searchTile');
                            expect(state.previousViewMode).toEqual('tile');
                            previousState = state;
                            i++;
                        } else if (!!previousState.searchValue) {
                            // 3. Сюда попадаем после сброса поиска
                            expect(state.viewMode).toEqual('table');
                            resolve(++i);
                        }
                    } else if (previousState.viewMode !== state.viewMode) {
                        // 2. Сюда попадаем после смены viewMode
                        expect(state.viewMode).toEqual('search');
                        expect(state.previousViewMode).toEqual('table');
                        previousState = state;
                        i++;
                    }
                };
                const slice = getSlice(onChange, 'tile');
                previousState = slice.state;
                slice.search('test');
                slice.setViewMode('table');
                slice.resetSearch();
            }).then((countOfChanges) => {
                // Проверяем, что произошли все тестируемые изменения в слайсах
                expect(countOfChanges).toBe(3);
            });
        });
    });

    describe('Тесты изменения navigation.position при смене root', () => {
        it('Проваливание в папку', () => {
            return new Promise((resolve) => {
                const source = getHierarchyMemory();
                const items = new RecordSet();
                const onChange = (state) => {
                    if (state.root === 3) {
                        resolve(state);
                    }
                };
                const slice = new ListSlice({
                    onChange,
                    config: {
                        source,
                        navigation: {
                            source: 'position',
                            view: 'infinity',
                            sourceConfig: {
                                position: 3,
                                direction: 'forward',
                                field: 'key',
                                limit: 10,
                            },
                        },
                        ...hierarchyOptions,
                    },
                    loadResult: {
                        items,
                    },
                });

                slice.setRoot(3);
            }).then((state: IListState) => {
                expect(state.sourceController.getNavigation().sourceConfig.position).toEqual(null);
            });
        });
    });

    describe('Открытие и закрытие ПМО', () => {
        it('При открытии ПМО чекбоксы видны, маркер видим', () => {
            const source = getHierarchyMemory();
            const items = new RecordSet();
            const slice = new ListSlice({
                onChange: () => {},
                config: {
                    source,
                    ...hierarchyOptions,
                    searchStartingWith: 'root',
                    searchParam: 'testSearchParam',
                },
                loadResult: {
                    items,
                },
                listActions: [],
            });
            slice.openOperationsPanel();
            expect(slice.state.operationsPanelVisible).toBeTruthy();
            expect(slice.state.markerVisibility).toBe('visible');
            expect(slice.state.multiSelectVisibility).toBe('visible');
        });
        it('При закрытии ПМО чекбокс по ховеру, выделение сбрасывается', () => {
            const source = getHierarchyMemory();
            const items = new RecordSet();
            const slice = new ListSlice({
                onChange: () => {},
                config: {
                    source,
                    ...hierarchyOptions,
                    searchStartingWith: 'root',
                    searchParam: 'testSearchParam',
                },
                loadResult: {
                    items,
                },
                listActions: [],
            });
            slice.openOperationsPanel();
            slice.setState({
                selectedKeys: [1],
                excludedKeys: [1],
            });
            slice.closeOperationsPanel();
            expect(slice.state.operationsPanelVisible).toBeFalsy();
            expect(slice.state.selectedKeys).toEqual([]);
            expect(slice.state.excludedKeys).toEqual([]);
            expect(slice.state.multiSelectVisibility).toBe('hidden');
        });
        it('При выделении в списке открывается ПМО', () => {
            const source = getHierarchyMemory();
            const items = new RecordSet();
            const slice = new ListSlice({
                onChange: () => {},
                config: {
                    source,
                    ...hierarchyOptions,
                    searchStartingWith: 'root',
                    searchParam: 'testSearchParam',
                    listActions: [],
                },
                loadResult: {
                    items,
                },
            });
            slice.setState({
                selectedKeys: [1],
                excludedKeys: [1],
            });
            expect(slice.state.operationsPanelVisible).toBeTruthy();
            expect(slice.state.selectedKeys).toEqual([1]);
            expect(slice.state.excludedKeys).toEqual([1]);
            expect(slice.state.multiSelectVisibility).toBe('visible');
        });
    });

    describe('Изменение sourceController', () => {
        it('Изменение sourceController и опции root', () => {
            let newSourceController;
            return new Promise((resolve) => {
                const source = getHierarchyMemory();
                const items = new RecordSet();
                const onChange = (state) => {
                    if (state.root === 3) {
                        resolve(state);
                    }
                };
                const sliceConfig = {
                    source,
                    ...hierarchyOptions,
                    searchStartingWith: 'root',
                    searchParam: 'testSearchParam',
                    root: 1,
                };
                const sliceLoadResult = {
                    items,
                };
                const slice = new ListSlice({
                    onChange,
                    config: sliceConfig,
                    loadResult: sliceLoadResult,
                });

                newSourceController = new NewSourceController({
                    ...sliceConfig,
                    source: getHierarchyMemory(),
                });
                slice.setState({
                    sourceController: newSourceController,
                    root: 3,
                });
            }).then((state: IListState) => {
                expect(state.sourceController).toEqual(newSourceController);
                expect(state.sourceController.getRoot()).toEqual(3);
                expect(state.sourceController.getItems().getCount()).toEqual(1);
                expect(state.sourceController.getItems().at(0).get('parent')).toEqual(state.root);
            });
        });
    });

    describe('Тесты метода load', () => {
        it('Вызов метода load без аргументов', () => {
            return new Promise((resolve) => {
                const source = getMemory();
                const items = new RecordSet({
                    rawData: flatData.slice(0, 2),
                    keyProperty: 'key',
                });
                const itemsVersion = items.getVersion();
                const onChange = (state) => {
                    if (itemsVersion !== state.items.getVersion()) {
                        resolve(state);
                    }
                };
                const sliceConfig = {
                    source,
                    filter: {
                        department: 'Platform',
                    },
                };
                const sliceLoadResult = {
                    items,
                };
                const slice = new ListSlice({
                    onChange,
                    config: sliceConfig,
                    loadResult: sliceLoadResult,
                });

                slice.load();
                expect(slice.state.loading).toBeTruthy();
            }).then((state: IListState) => {
                expect(state.filter).toEqual({ department: 'Platform' });
                expect(state.loading).toBeFalsy();
            });
        });

        it('Вызов метода load c фильтром', () => {
            return new Promise((resolve) => {
                const source = getMemory();
                const items = new RecordSet({
                    rawData: flatData.slice(0, 2),
                    keyProperty: 'key',
                });
                const itemsVersion = items.getVersion();
                const onChange = (state) => {
                    if (itemsVersion !== state.items.getVersion()) {
                        resolve(state);
                    }
                };
                const sliceConfig = {
                    source,
                    filter: {
                        department: 'Platform',
                    },
                };
                const sliceLoadResult = {
                    items,
                };
                const slice = new ListSlice({
                    onChange,
                    config: sliceConfig,
                    loadResult: sliceLoadResult,
                });

                slice.load(void 0, null, { department: 'SocialNetwork' });
            }).then((state: IListState) => {
                expect(state.items.getCount()).toEqual(1);
            });
        });
    });
});
