import {
    ListSlice,
    IListState,
    IListLoadResult,
    IListDataFactoryArguments,
} from 'Controls/dataFactory';
import { RecordSet } from 'Types/collection';
import { Direction } from 'Controls/interface';
import { Memory, HierarchicalMemory } from 'Types/source';
import 'Controls/search';

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

describe('Controls/dataFactory:ListSlice', () => {
    describe('Тесты protected метода _dataLoaded', () => {
        interface ICustomListSliceWithDataLoadCallback extends IListState {
            dataLoadCallbackCount: number;
            dataLoadedReturnPromise: boolean;
        }

        class CustomListSliceWithDataLoadCallback extends ListSlice<ICustomListSliceWithDataLoadCallback> {
            protected _initState(
                loadResult: IListLoadResult,
                config: IListDataFactoryArguments
            ): ICustomListSliceWithDataLoadCallback {
                const state = super._initState(loadResult, config);
                state.dataLoadCallbackCount = 0;
                state.dataLoadedReturnPromise = config.dataLoadedReturnPromise;
                return state;
            }
            protected _dataLoaded(
                items: RecordSet,
                direction: Direction,
                nextState: ICustomListSliceWithDataLoadCallback
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
    });

    describe('Тесты поиска (методы search/resetSearch)', () => {
        it('search с опцией searchStartingWith: "root"', () => {
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
                    searchValue: 'test'
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
});
