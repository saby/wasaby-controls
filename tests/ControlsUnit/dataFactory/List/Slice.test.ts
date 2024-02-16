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
import { Memory, HierarchicalMemory, DataSet } from 'Types/source';
import 'Controls/search';
import 'Controls/operations';
import 'Controls/list';
import { NewSourceController, saveControllerState, getControllerState } from 'Controls/dataSource';
import 'ControlsUnit/dataFactory/List/resources/listActions';
import { FilterHistory } from 'Controls/filter';
// требуется, т.к. loadData не вызывается и никто не подгружает либу с коллекцией
import 'Controls/treeGrid';

class CountSource {
    call(): Promise<DataSet> {
        const result = new DataSet({
            rawData: {
                count: 1,
            },
        });
        return Promise.resolve(result);
    }

    getAdapter(): string {
        return 'adapter.json';
    }
}

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
        'parent@': true,
        hasChildren: true,
    },
    {
        key: 1,
        title: 'Sasha',
        parent: 0,
        'parent@': null,
        hasChildren: false,
    },
    {
        key: 2,
        title: 'Dmitry',
        parent: 0,
        'parent@': null,
        hasChildren: false,
    },
    {
        key: 3,
        title: 'Склад',
        parent: null,
        'parent@': true,
        hasChildren: true,
    },
    {
        key: 4,
        title: 'Michail',
        parent: 3,
        'parent@': null,
        hasChildren: false,
    },
    {
        key: 5,
        title: 'Платформа',
        parent: null,
        'parent@': null,
        hasChildren: false,
    },
    {
        key: 6,
        title: 'Контролы',
        parent: 0,
        'parent@': true,
        hasChildren: true,
    },
    {
        key: 7,
        title: 'Алексей',
        parent: 6,
        'parent@': null,
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
    describe('Инициализация', () => {
        it('Если указан listConfigStoreId, то поиск, выделение, развернутые узлы, и маркер вычитываются из локального состояния', () => {
            saveControllerState('demo', {
                markedKey: 'savedMarkedKey',
                searchValue: 'savedSearchValue',
                excludedKeys: ['savedExcludedKeys'],
                selectedKeys: ['savedSelectedKeys'],
                expandedItems: ['savedExpandedItems'],
            });
            const slice = new ListSlice({
                loadResult: {
                    markedKey: '1',
                    searchValue: 'searchValue',
                    selectedKeys: [],
                    excludedKeys: [],
                },
                config: {
                    listConfigStoreId: 'demo',
                    source: getHierarchyMemory(),
                    parentProperty: 'parent',
                    items: new RecordSet(),
                    searchParam: 'search',
                },
                onChange: () => {},
            });
            expect(slice.state.expandedItems).toEqual(['savedExpandedItems']);
            expect(slice.state.searchValue).toEqual('savedSearchValue');
            expect(slice.state.excludedKeys).toEqual(['savedExcludedKeys']);
            expect(slice.state.selectedKeys).toEqual(['savedSelectedKeys']);
            expect(slice.state.markedKey).toEqual('savedMarkedKey');
        });

        describe('Инициализация поиска', () => {
            it('Состояние поиска не инициализируется без searchParam', () => {
                const slice = new ListSlice({
                    loadResult: {
                        markedKey: '1',
                        searchValue: 'searchValue',
                        selectedKeys: [],
                        excludedKeys: [],
                    },
                    config: {
                        source: getHierarchyMemory(),
                        parentProperty: 'parent',
                        items: new RecordSet(),
                        searchValue: 'searchValue',
                        searchNavigationMode: 'expand',
                        searchDelay: 300,
                        searchStartingWith: 'root',
                        searchValueTrim: true,
                    },
                    onChange: () => {},
                });
                const state = slice.state;
                expect(state.searchParam).toBeUndefined();
                expect(state.searchValue).toBeUndefined();
                expect(state.searchDelay).toBeUndefined();
                expect(state.searchValueTrim).toBeUndefined();
                expect(state.searchStartingWith).toBeUndefined();
            });

            it('Инициализация состояния поиска при наличии searchParam', () => {
                const slice = new ListSlice({
                    loadResult: {
                        markedKey: '1',
                        searchValue: 'searchValue',
                        selectedKeys: [],
                        excludedKeys: [],
                    },
                    config: {
                        source: getHierarchyMemory(),
                        parentProperty: 'parent',
                        items: new RecordSet(),
                        searchValue: 'searchValue',
                        searchNavigationMode: 'expand',
                        searchDelay: 300,
                        searchStartingWith: 'root',
                        searchValueTrim: true,
                        searchParam: 'search',
                    },
                    onChange: () => {},
                });
                const state = slice.state;
                expect(state.searchParam).toBe('search');
                expect(state.searchValue).toBe('searchValue');
                expect(state.searchDelay).toBe(300);
                expect(state.searchValueTrim).toBeTruthy();
                expect(state.searchStartingWith).toBe('root');
            });
        });

        describe('Инициализация действий и мультивыбора', () => {
            it('Если указаны listActions, то в состоянии они должны быть массивом действий', () => {
                const listActionsModule = 'ControlsUnit/dataFactory/List/resources/listActions';
                const slice = new ListSlice({
                    loadResult: {
                        markedKey: '1',
                        searchValue: 'searchValue',
                        selectedKeys: [],
                        excludedKeys: [],
                    },
                    config: {
                        source: getHierarchyMemory(),
                        parentProperty: 'parent',
                        items: new RecordSet(),
                        listActions: listActionsModule,
                    },
                    onChange: () => {},
                });
                const state = slice.state;
                expect(state.listActions).toEqual([
                    {
                        actionName: 'test',
                    },
                ]);
            });
        });

        describe('Инициализация активного элемента', () => {
            it('Если указан activeElement, то берем его', () => {
                const slice = new ListSlice({
                    loadResult: {
                        selectedKeys: [],
                        excludedKeys: [],
                    },
                    config: {
                        source: getHierarchyMemory(),
                        parentProperty: 'parent',
                        items: new RecordSet(),
                        activeElement: 1,
                    },
                    onChange: () => {},
                });
                const state = slice.state;
                expect(state.activeElement).toBe(1);
            });
            it('Если явно не указан activeElement и нет в мета-данных, то берем ключ первого элемента', () => {
                const slice = new ListSlice({
                    loadResult: {
                        selectedKeys: [],
                        excludedKeys: [],
                        items: new RecordSet({
                            rawData: [
                                {
                                    key: 2,
                                },
                            ],
                            keyProperty: 'key',
                        }),
                    },
                    config: {
                        source: getHierarchyMemory(),
                        parentProperty: 'parent',
                    },
                    onChange: () => {},
                });
                const state = slice.state;
                expect(state.activeElement).toBe(2);
            });

            it('Если явно не указан activeElement и есть в метаданных, то берем его', () => {
                const items = new RecordSet({
                    rawData: [
                        {
                            key: 2,
                        },
                    ],
                    keyProperty: 'key',
                });
                items.setMetaData({
                    navigation: new RecordSet({
                        keyProperty: 'key',
                        rawData: [
                            {
                                key: 3,
                            },
                        ],
                    }),
                });
                const slice = new ListSlice({
                    loadResult: {
                        selectedKeys: [],
                        excludedKeys: [],
                        items,
                    },
                    config: {
                        source: getHierarchyMemory(),
                        parentProperty: 'parent',
                    },
                    onChange: () => {},
                });
                const state = slice.state;
                expect(state.activeElement).toBe(3);
            });
        });
    });
    describe('Тесты protected метода _dataLoaded', () => {
        interface ICustomListSliceWithDataLoadCallback extends IListState {
            dataLoadCallbackCount: number;
            dataLoadedReturnPromise: boolean;
            nodeDataLoadCallbackCount: number;
        }

        class CustomListSliceWithDataLoadCallback extends ListSlice<ICustomListSliceWithDataLoadCallback> {
            protected _initState(
                loadResult: IListLoadResult,
                config: IListDataFactoryArguments & { dataLoadedReturnPromise: boolean }
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
    describe('Поиск', () => {
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

        it('После поиска не должно сбрасываться состояние searchInputValue, если оно менялось, пока выполнялся запрос', () => {
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
                        searchParam: 'testSearchParam',
                    },
                    loadResult: {
                        items,
                    },
                });

                slice.search('test');
                expect(slice.state.searchInputValue).toEqual('test');

                slice.setSearchInputValue('testPlus');
                expect(slice.state.searchInputValue).toEqual('testPlus');
            }).then((state: IListState) => {
                expect(state.searchValue).toEqual('test');
                expect(state.searchInputValue).toEqual('testPlus');
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

                slice.changeRoot(1);
            }).then((state: IListState) => {
                expect(state.expandedItems).toEqual([2, 1]);
            });
        });

        it('Вызов поиска без searchParam приводит к ошибке в runtime', () => {
            const source = new Memory();
            const items = new RecordSet();
            const onChange = () => {};
            const slice = new ListSlice({
                onChange,
                config: {
                    source,
                },
                loadResult: {
                    items,
                },
            });
            expect.assertions(1);
            try {
                slice.search('searchValue');
            } catch (error) {
                expect(error.message).toEqual(
                    'ListSlice::Не указан searchParam в слайсе списка. Поиск не будет запущен'
                );
            }
        });

        it('Значение для строки поиска должно обновиться синхронно, если обновили стейт, влияющий на загрузку', () => {
            const source = new Memory();
            const items = new RecordSet();
            const onChange = () => {};
            const slice = new ListSlice({
                onChange,
                config: {
                    source,
                    searchInputValue: 'test',
                    searchValue: 'test',
                },
                loadResult: {
                    items,
                },
            });

            slice.setState({
                filter: {
                    newFilterField: 'newFilterValue',
                },
                searchValue: '',
                searchInputValue: '',
            });
            expect(slice.state.loading).toBeTruthy();
            expect(slice.state.searchInputValue).toEqual('');
        });
    });

    describe('Смена вида списка (viewMode)', () => {
        it('Если статика вида списка загружена, то изменение произойдет одновременно с загрузкой статики', () => {
            return new Promise((resolve) => {
                const source = new Memory();
                const items = new RecordSet();
                const onChange = (state) => {
                    if (state.viewMode === 'tile') {
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
                const initViewMode = slice.state.viewMode;
                slice.setState({
                    viewMode: 'tile',
                });
                expect(slice.state.viewMode).toEqual(initViewMode);
            }).then((state: IListState) => {
                expect(state.viewMode).toEqual('tile');
            });
        });

        it('Если статика загружена, то изменение происходит синхронно', () => {
            const source = new Memory();
            const items = new RecordSet();
            const onChange = () => {};
            const slice = new ListSlice({
                onChange,
                config: {
                    source,
                },
                loadResult: {
                    items,
                },
            });
            slice.setViewMode('list');
            expect(slice.state.viewMode).toBe('list');
        });
    });

    describe('reloadItem', () => {
        it('Запись должна обновиться при перезагрузке', async () => {
            const source = getMemory();
            const items = new RecordSet({
                rawData: [{ ...flatData[0], name: 'wrongName' }],
                keyProperty: 'key',
            });
            const onChange = () => {};
            const slice = new ListSlice({
                onChange,
                config: {
                    source,
                    keyProperty: 'key',
                },
                loadResult: {
                    items,
                },
            });
            await slice.reloadItem(flatData[0].key);
            expect(slice.state.items.at(0).get('name')).toEqual('Sasha');
        });
    });

    describe("Тесты на изменение recordSet'a в слайсе", () => {
        describe("Изменение expandedItems при изменении recordSet'a", () => {
            it('При удалнии узла, ключ должен удалиться из expandedItems', () => {
                const source = new Memory();
                const items = new RecordSet({
                    rawData: [...hierarchyItems],
                    keyProperty: 'key',
                });
                const onChange = () => {};
                const slice = new ListSlice({
                    onChange,
                    config: {
                        source,
                        parentProperty: 'parent',
                        nodeProperty: 'parent@',
                        collectionType: 'TreeGrid',
                        keyProperty: 'key',
                    },
                    loadResult: {
                        items,
                        expandedItems: [0],
                        collapsedItems: [],
                    },
                });

                expect(slice.state.expandedItems).toStrictEqual([0]);

                slice.state.items.remove(slice.state.items.getRecordById(0));
                expect(slice.state.expandedItems).toStrictEqual([]);
            });

            // Не факт, что это правильно, но так работают все деревья на сайте
            it("При перезагрузке, expandedItems не должен измениться, даже если записей в recordSet'e нет", async () => {
                const source = new Memory();
                const items = new RecordSet({
                    rawData: [...hierarchyItems],
                    keyProperty: 'key',
                });
                const onChange = () => {};
                const slice = new ListSlice({
                    onChange,
                    config: {
                        source,
                        parentProperty: 'parent',
                        nodeProperty: 'parent@',
                        collectionType: 'TreeGrid',
                        keyProperty: 'key',
                    },
                    loadResult: {
                        items,
                        expandedItems: [0],
                        collapsedItems: [],
                    },
                });

                expect(slice.state.expandedItems).toStrictEqual([0]);

                await slice.load(void 0, void 0, void 0, true);
                expect(slice.state.items.getCount()).toStrictEqual(0);
                expect(slice.state.expandedItems).toStrictEqual([0]);
            });
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

            slice.changeRoot(3);
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

            slice.changeRoot(3);
        }).then((state: IListState) => {
            expect(state.root).toEqual(3);
            expect(state.breadCrumbsItems.length).toEqual(1);
        });
    });
});

describe('Тесты поиска', () => {
    it('Сброс поиска после иницилизации с searchValue в конфиге', () => {
        return new Promise((resolve) => {
            const onChange = (state) => {
                if (!!state.searchValue) {
                    expect(state.root).toBe(null);
                    resolve(true);
                }
            };
            const slice = new ListSlice({
                loadResult: {
                    searchValue: 'searchValue',
                },
                config: {
                    source: getHierarchyMemory(),
                    parentProperty: 'parent',
                    items: new RecordSet(),
                    searchValue: 'searchValue',
                    searchParam: 'search',
                },
                onChange,
            });

            slice.resetSearch();
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

            slice.changeRoot(3);
        }).then((state: IListState) => {
            expect(state.sourceController.getNavigation().sourceConfig.position).toEqual(null);
        });
    });
});

describe('Тесты изменения markedKey при смене root', () => {
    let slice: ListSlice;
    let onSliceChange: (state: IListState) => void;

    function getSlice(cfg?: object, reset?: boolean): ListSlice {
        const source = getHierarchyMemory();
        const items = new RecordSet();
        const onChange = (state) => {
            onSliceChange?.(state);
        };
        if (!slice || reset) {
            slice = new ListSlice({
                onChange,
                config: {
                    root: null,
                    source,
                    ...cfg,
                    ...hierarchyOptions,
                },
                loadResult: {
                    items,
                },
            });
        }
        return slice;
    }

    it('Проваливание в папку', () => {
        slice = getSlice({
            markedKey: 3,
        });
        return new Promise((resolve) => {
            onSliceChange = (state) => {
                if (state.root === 3) {
                    resolve(state);
                }
            };
            slice.setState({
                root: 3,
            });
        }).then((state: IListState) => {
            expect(state.markedKey).toEqual(null);
        });
    });
    it('Выход из папки в корень', () => {
        slice = getSlice();
        return new Promise((resolve) => {
            onSliceChange = (state) => {
                if (state.root === null) {
                    resolve(state);
                }
            };
            // Из папки 3 вернулись в корень.
            slice.setRoot(null);
        }).then((state: IListState) => {
            expect(state.markedKey).toEqual(3);
        });
    });
    it('Выход из папки в корень, если маркер установлен вручную', () => {
        slice = getSlice(
            {
                root: 3,
            },
            true
        );
        return new Promise((resolve) => {
            onSliceChange = (state) => {
                if (state.root === null) {
                    resolve(state);
                }
            };
            // Вернулись в корень.
            slice.setState({
                root: null,
                markedKey: 5, // Вручную выставили маркер
            });
        }).then((state: IListState) => {
            expect(state.markedKey).toEqual(5);
        });
    });
    it('Выход из папки в корень, при отсутствии BreadCrumbs', () => {
        slice = getSlice(
            {
                source: getMemory(),
                root: 3,
            },
            true
        );
        return new Promise((resolve) => {
            onSliceChange = (state) => {
                if (state.root === null) {
                    resolve(state);
                }
            };
            // Из папки 3 вернулись в корень.
            slice.setRoot(null);
        }).then((state: IListState) => {
            expect(state.markedKey).toEqual(3);
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

    it('Во время метода load можно менять стейт, который не влияет на загрузку данных', () => {
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

            slice.setState({ markedKey: 'test' });
        }).then((state: IListState) => {
            expect(state.markedKey).toEqual('test');
            expect(state.loading).toBeFalsy();
        });
    });

    it('Вызов метода load c фильтром', () => {
        const filter = { department: 'SocialNetwork' };
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

            slice.load(void 0, null, filter);
        }).then((state: IListState) => {
            expect(state.items.getCount()).toEqual(1);
            expect(state.sourceController.getFilter()).toEqual(filter);
        });
    });
});

describe('Фильтрация', () => {
    it('При изменении фильтра должна произойти перезагрузка с новым фильтром', () => {
        return new Promise((resolve) => {
            const onChange = (state) => {
                if (state.items.getVersion() > 0) {
                    resolve(state);
                }
            };
            const slice = new ListSlice({
                loadResult: {
                    items: new RecordSet({
                        rawData: flatData,
                        keyProperty: 'key',
                    }),
                },
                config: {
                    source: getMemory(),
                    keyProperty: 'key',
                    filter: {},
                },
                onChange,
            });
            slice.setFilter({
                title: 'Платформа',
            });
            expect(slice.state.loading).toBeTruthy();
            expect(slice.state.filter).toEqual({});
        }).then((state: IListState) => {
            expect(state.loading).toBeFalsy();
            expect(state.filter.title).toBe('Платформа');
        });
    });
    it('Открытие и закрытие панели фильтров', () => {
        const source = getHierarchyMemory();
        const items = new RecordSet();
        const onChange = () => {};
        const sliceConfig = {
            source,
            ...hierarchyOptions,
            filterDescription: [],
        };
        const sliceLoadResult = {
            items,
        };
        const slice = new ListSlice({
            onChange,
            config: sliceConfig,
            loadResult: sliceLoadResult,
        });

        slice.openFilterDetailPanel();
        expect(slice.state.filterDetailPanelVisible).toBeTruthy();
        slice.closeFilterDetailPanel();
        expect(slice.state.filterDetailPanelVisible).toBeFalsy();
    });
    it('Применение структуры фильтров с историей', () => {
        return new Promise((resolve) => {
            jest.spyOn(FilterHistory, 'update').mockImplementation();
            const source = getHierarchyMemory();
            const items = new RecordSet();
            const onChange = (state) => {
                if (state.filter.test === 1) {
                    resolve(state);
                }
            };
            const sliceConfig = {
                source,
                ...hierarchyOptions,
                filterDescription: [
                    {
                        name: 'test',
                        value: null,
                        resetValue: null,
                    },
                ],
                historyId: 'demo',
            };
            const sliceLoadResult = {
                items,
            };
            const slice = new ListSlice({
                onChange,
                config: sliceConfig,
                loadResult: sliceLoadResult,
            });

            slice.applyFilterDescription([
                {
                    name: 'test',
                    value: 1,
                    resetValue: null,
                },
            ]);
        }).then((newState: IListState) => {
            expect(newState.filter.test).toBe(1);
            expect(newState.filterDescription).toEqual([
                {
                    name: 'test',
                    value: 1,
                    resetValue: null,
                },
            ]);
            expect(FilterHistory.update).toHaveBeenCalled();
        });
    });
    it('Сброс структуры фильтров с историей', () => {
        return new Promise((resolve) => {
            jest.spyOn(FilterHistory, 'update').mockImplementation();
            const source = getHierarchyMemory();
            const items = new RecordSet();
            const onChange = (state) => {
                if (state.filter.test === null) {
                    resolve(state);
                }
            };
            const sliceConfig = {
                source,
                ...hierarchyOptions,
                historyId: 'demo',
                filterDescription: [
                    {
                        name: 'test',
                        value: 1,
                        resetValue: null,
                    },
                ],
            };
            const sliceLoadResult = {
                items,
            };
            const slice = new ListSlice({
                onChange,
                config: sliceConfig,
                loadResult: sliceLoadResult,
            });

            slice.resetFilterDescription();
        }).then((newState: IListState) => {
            expect(newState.filter.test).toBe(null);
            expect(FilterHistory.update).toHaveBeenCalled();
        });
    });
});

describe('listConfigStoreId', () => {
    it('При изменении выделения, поиска, маркера или развернутых узлов происходит сохранение состояния в стор', () => {
        return new Promise((resolve) => {
            const slice = new ListSlice({
                loadResult: {
                    markedKey: '1',
                    searchValue: 'searchValue',
                    selectedKeys: [],
                    excludedKeys: [],
                },
                config: {
                    listConfigStoreId: 'demo',
                    source: getHierarchyMemory(),
                    parentProperty: 'parent',
                    items: new RecordSet(),
                    searchParam: 'search',
                },
                onChange: (state) => {
                    if (state.markedKey === 'savedMarkedKey') {
                        resolve(state);
                    }
                },
            });
            slice.setState({
                expandedItems: ['savedExpandedItems'],
                searchValue: 'savedSearchValue',
                excludedKeys: ['savedExcludedKeys'],
                selectedKeys: ['savedSelectedKeys'],
                markedKey: 'savedMarkedKey',
            });
        }).then(() => {
            const state: Partial<IListState> = getControllerState('demo') as IListState;
            expect(state.expandedItems).toEqual(['savedExpandedItems']);
            expect(state.searchValue).toEqual('savedSearchValue');
            expect(state.excludedKeys).toEqual(['savedExcludedKeys']);
            expect(state.selectedKeys).toEqual(['savedSelectedKeys']);
            expect(state.markedKey).toEqual('savedMarkedKey');
        });
    });
});

describe('Счетчик отмеченных записей', () => {
    it('Асинхронный способ подсчета записей (selectionContConfig)', () => {
        return new Promise((resolve) => {
            const slice = new ListSlice({
                loadResult: {
                    selectedKeys: [],
                    excludedKeys: [],
                },
                config: {
                    source: getHierarchyMemory(),
                    parentProperty: 'parent',
                    items: new RecordSet(),
                    selectedCountConfig: {
                        rpc: new CountSource(),
                        command: 'demoCall',
                    },
                },
                onChange: (state) => {
                    if (state.countLoading === false) {
                        resolve(state);
                    }
                },
            });
            slice.setSelectionCount(null, false);
            expect(slice.state.countLoading).toBeTruthy();
        }).then((state: IListState) => {
            expect(state.count).toBe(1);
            expect(state.countLoading).toBeFalsy();
        });
    });
    it('Синхронный способ подсчета записей', () => {
        const source = getHierarchyMemory();
        const items = new RecordSet();
        const onChange = () => {};
        const sliceConfig = {
            source,
            ...hierarchyOptions,
        };
        const sliceLoadResult = {
            items,
        };
        const slice = new ListSlice({
            onChange,
            config: sliceConfig,
            loadResult: sliceLoadResult,
        });

        slice.setSelectionCount(1, true);
        expect(slice.state.count).toBe(1);
        expect(slice.state.isAllSelected).toBeTruthy();
    });
});

describe('destroy', () => {
    it('Должен вызываться базовый класс', () => {
        const source = getHierarchyMemory();
        const items = new RecordSet();
        const onChange = () => {};
        const sliceConfig = {
            source,
            ...hierarchyOptions,
            historyId: 'demo',
            filterDescription: [
                {
                    name: 'test',
                    value: 1,
                    resetValue: null,
                },
            ],
        };
        const sliceLoadResult = {
            items,
        };
        const slice = new ListSlice({
            onChange,
            config: sliceConfig,
            loadResult: sliceLoadResult,
        });

        slice.destroy();
        expect(slice.isDestroyed()).toBeTruthy();
    });
});

describe('reload', () => {
    it('reload должен выполнить перезагрузку и обновить items на стейте', async () => {
        const source = getMemory();
        const items = new RecordSet();
        const onChange = () => {};
        const sliceConfig = {
            source,
        };
        const sliceLoadResult = {
            items,
        };
        const slice = new ListSlice({
            onChange,
            config: sliceConfig,
            loadResult: sliceLoadResult,
        });

        const reloadPromise = slice.reload();
        expect(slice.state.loading).toBeTruthy();

        expect((await reloadPromise).getCount()).toBe(flatData.length);
    });

    it('повторный вызов метода reload должен отменить предыдущую загрузку, если она выполняется', async () => {
        const source = getMemory();
        const items = new RecordSet();
        const onChange = () => {};
        const sliceConfig = {
            source,
        };
        const sliceLoadResult = {
            items,
        };
        const slice = new ListSlice({
            onChange,
            config: sliceConfig,
            loadResult: sliceLoadResult,
        });

        const firstReloadPromise = slice.reload();
        expect(slice.state.loading).toBeTruthy();

        const secondReloadPromise = slice.reload();
        expect(slice.state.loading).toBeTruthy();

        try {
            await firstReloadPromise;
        } catch (error) {
            expect(error.isCanceled).toBeTruthy();
        }

        expect((await secondReloadPromise).getCount()).toBe(flatData.length);
    });

    it('Вызов reload с параметром keepNavigation должен сохранять навигацию при перезагрузке', async () => {
        const source = getMemory();
        const items = new RecordSet({
            rawData: [...flatData.slice(0, 1)],
            keyProperty: 'key',
        });
        const onChange = () => {};
        const slice = new ListSlice({
            onChange,
            config: {
                source,
                navigation: getPagingNavigation(false, 1, false),
            },
            loadResult: {
                items,
            },
        });

        expect(slice.state.items.getCount()).toBe(1);

        await slice.load('down');
        expect(slice.state.items.getCount()).toBe(2);

        await slice.reload(null, true);
        expect(slice.state.items.getCount()).toBe(2);
    });

    it('Вызов reload в момент, когда уже идёт загрузка. Стейт loading из-за отмены предыдущей загрузки не должен сбрасываться', async () => {
        return new Promise((resolve) => {
            const source = getMemory();
            const items = new RecordSet({
                keyProperty: 'id',
                rawData: flatData,
            });
            const onChange = (state) => {
                if (state.filter.key === 1) {
                    resolve(expect(slice.state.loading).toBeFalsy());
                }
            };
            const slice = new ListSlice({
                onChange,
                config: {
                    source,
                },
                loadResult: {
                    items,
                },
            });

            slice.setState({ filter: { key: 1 } });
            expect(slice.state.loading).toBeTruthy();

            slice.reload();
            expect(slice.state.loading).toBeTruthy();
        });
    });
});

describe('collapse', () => {
    it('Сворачивание узла, должно сворачивать так же дочерние развёрнутые узлы', () => {
        const source = getMemory();
        const items = new RecordSet({
            rawData: [...hierarchyItems],
            keyProperty: 'key',
        });
        const onChange = () => {};
        const slice = new ListSlice({
            onChange,
            config: {
                source,
                parentProperty: 'parent',
                nodeProperty: 'parent@',
                collectionType: 'TreeGrid',
            },
            loadResult: {
                items,
                expandedItems: [null],
                collapsedItems: [],
            },
        });

        slice.collapse(0);
        expect(slice.state.collapsedItems).toStrictEqual([0, 6]);
    });
});
