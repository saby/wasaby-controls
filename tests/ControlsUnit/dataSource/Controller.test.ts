import { NewSourceController, ISourceControllerOptions } from 'Controls/dataSource';
import { Memory, PrefetchProxy, DataSet, HierarchicalMemory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { adapter } from 'Types/entity';
import {
    INavigationPageSourceConfig,
    INavigationOptionValue,
    INavigationSourceConfig,
} from 'Controls/interface';
import { default as groupUtil } from 'Controls/_dataSource/GroupUtil';

const filterByEntries = (item, filter): boolean => {
    return filter.entries ? filter.entries.get('marked').includes(String(item.get('key'))) : true;
};

const filterByRoot = (item, filter): boolean => {
    return item.get('parent') === filter.parent;
};

const items = [
    {
        key: 0,
        title: 'Sasha',
    },
    {
        key: 1,
        title: 'Dmitry',
    },
    {
        key: 2,
        title: 'Aleksey',
    },
    {
        key: 3,
        title: 'Aleksey',
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

function getMemory(additionalOptions: object = {}): Memory {
    const options = {
        data: items,
        keyProperty: 'key',
    };
    return new Memory({ ...options, ...additionalOptions });
}

function getPrefetchProxy(): PrefetchProxy {
    return new PrefetchProxy({
        target: getMemory(),
        data: {
            query: new DataSet({
                rawData: items.slice(0, 2),
                keyProperty: 'key',
            }),
        },
    });
}

function getControllerOptions(): ISourceControllerOptions {
    return {
        source: getMemory(),
        filter: {},
        keyProperty: 'key',
    };
}

function getControllerWithHierarchyOptions(): ISourceControllerOptions {
    return {
        source: getMemoryWithHierarchyItems(),
        parentProperty: 'parent',
        filter: {},
        keyProperty: 'key',
    };
}

function getMemoryWithHierarchyItems(): Memory {
    return new Memory({
        data: hierarchyItems,
        keyProperty: 'key',
        filter: filterByEntries,
    });
}

function getPagingNavigation(
    hasMore: boolean = false,
    pageSize: number = 1
): INavigationOptionValue<INavigationPageSourceConfig> {
    return {
        source: 'page',
        sourceConfig: {
            pageSize,
            page: 0,
            hasMore,
        },
    };
}

const sourceWithError = new Memory();
sourceWithError.query = () => {
    const error = new Error();
    error.processed = true;
    return Promise.reject(error);
};

function getControllerWithHierarchy(additionalOptions: object = {}): NewSourceController {
    return new NewSourceController({
        ...getControllerWithHierarchyOptions(),
        ...additionalOptions,
    });
}

function getController(additionalOptions: object = {}): NewSourceController {
    return new NewSourceController({
        ...getControllerOptions(),
        ...additionalOptions,
    });
}

describe('Controls/dataSource:SourceController', () => {
    describe('getState', () => {
        it('getState after create controller', () => {
            const root = 'testRoot';
            const parentProperty = 'testParentProperty';
            let hierarchyOptions;
            let controller;
            let controllerState;

            hierarchyOptions = {
                root,
                parentProperty,
            };
            controller = new NewSourceController(hierarchyOptions);
            controllerState = controller.getState();
            expect(controllerState.parentProperty === parentProperty).toBeTruthy();
            expect(controllerState.root === root).toBeTruthy();
            expect(!controllerState.keyProperty).toBeTruthy();

            hierarchyOptions = {
                parentProperty,
                source: new Memory({
                    keyProperty: 'testKeyProperty',
                }),
            };
            controller = new NewSourceController(hierarchyOptions);
            controllerState = controller.getState();
            expect(controllerState.parentProperty === parentProperty).toBeTruthy();
            expect(controllerState.root === null).toBeTruthy();
            expect(controllerState.keyProperty === 'testKeyProperty').toBeTruthy();
        });

        it('without expandedItems in options', () => {
            const controller = getControllerWithHierarchy();
            controller.setExpandedItems(['testKey1']);
            expect(!controller.getState().expandedItems).toBeTruthy();
        });

        it('expandedItems in options', () => {
            const controller = getControllerWithHierarchy({
                expandedItems: [],
            });
            controller.setExpandedItems(['testKey1']);
            expect(controller.getState().expandedItems).toEqual(['testKey1']);
        });
    });

    describe('load', () => {
        it('load with parentProperty', async () => {
            const controller = getControllerWithHierarchy();
            const loadedItems = await controller.load();
            expect((loadedItems as RecordSet).getCount() === 6).toBeTruthy();
        });

        it('load with direction "down"', async () => {
            const controller = getController();
            await controller.load('down');
            expect(controller.getItems().getCount() === 4).toBeTruthy();
        });

        it('load without direction', async () => {
            const controller = getControllerWithHierarchy({
                navigation: getPagingNavigation(),
            });
            await controller.reload();
            await controller.load(undefined, 3);
            expect(controller.hasLoaded(3)).toBeTruthy();

            await controller.load();
            expect(!controller.hasLoaded(3)).toBeTruthy();
        });

        it('load call while loading', async () => {
            const controller = getController();
            let loadPromiseWasCanceled = false;

            const promiseCanceled = controller.load().catch(() => {
                loadPromiseWasCanceled = true;
            });

            await controller.load();
            await promiseCanceled;
            expect(loadPromiseWasCanceled).toBeTruthy();
        });

        it('load call while preparing filter', async () => {
            const navigation = getPagingNavigation();
            let navigationParamsChangedCallbackCalled = false;
            const options = { ...getControllerOptions(), navigation };
            options.navigationParamsChangedCallback = () => {
                navigationParamsChangedCallbackCalled = true;
            };
            const controller = getController(options);

            const reloadPromise = controller.reload();
            controller.cancelLoading();
            await expect(reloadPromise).rejects.toThrow('Unknown reason');
            expect(!navigationParamsChangedCallbackCalled).toBeTruthy();
        });

        it('load with parentProperty and selectedKeys', async () => {
            let controller = getControllerWithHierarchy({
                selectedKeys: [0],
                excludedKeys: [],
            });
            let loadedItems = await controller.load();
            expect((loadedItems as RecordSet).getCount() === 1).toBeTruthy();

            controller = getControllerWithHierarchy({
                selectedKeys: [0],
            });
            loadedItems = await controller.load();
            expect((loadedItems as RecordSet).getCount() === 1).toBeTruthy();
        });

        it('load with prefetchProxy in options', async () => {
            const controller = getController({
                source: getPrefetchProxy(),
                navigation: {
                    source: 'page',
                    sourceConfig: {
                        pageSize: 2,
                        hasMore: false,
                    },
                },
            });

            let loadedItems = await controller.load();
            expect((loadedItems as RecordSet).getCount() === 2).toBeTruthy();
            expect((loadedItems as RecordSet).at(0).get('title') === 'Sasha').toBeTruthy();

            loadedItems = await controller.load('down');
            expect((loadedItems as RecordSet).getCount() === 2).toBeTruthy();
            expect((loadedItems as RecordSet).at(0).get('title') === 'Aleksey').toBeTruthy();
        });

        it('load call with direction update items', async () => {
            const controller = getController({
                navigation: {
                    source: 'page',
                    sourceConfig: {
                        pageSize: 2,
                        hasMore: false,
                    },
                },
            });

            await controller.load();
            expect(controller.getItems().getCount() === 2).toBeTruthy();
            expect(controller.getItems().at(0).get('title') === 'Sasha').toBeTruthy();

            await controller.load('down');
            expect(controller.getItems().getCount() === 4).toBeTruthy();
            expect(controller.getItems().at(2).get('title') === 'Aleksey').toBeTruthy();
        });

        it('load with root in arguments and deepReload, expandedItems in options', async () => {
            const controller = getController({
                navigation: {
                    source: 'page',
                    sourceConfig: {
                        pageSize: 2,
                        hasMore: false,
                    },
                },
                source: new Memory({
                    keyProperty: 'key',
                    data: hierarchyItems,
                    filter: filterByRoot,
                }),
                parentProperty: 'parent',
                deepReload: true,
                expandedItems: [3],
            });

            await controller.load(null, 0);
            expect(controller.getItems().getCount() === 2).toBeTruthy();

            await controller.load('down');
            expect(controller.getItems().getCount() === 3).toBeTruthy();
        });

        it('load with multiNavigation', async () => {
            const pageSize = 3;
            const allItemsCount = 4;
            const navigation = getPagingNavigation(false, pageSize);
            navigation.sourceConfig.multiNavigation = true;
            const controller = getController({
                ...getControllerOptions(),
                navigation,
            });
            const loadedItems = await controller.reload();
            expect((loadedItems as RecordSet).getCount() === pageSize).toBeTruthy();

            await controller.load('down');
            expect(controller.getItems().getCount() === allItemsCount).toBeTruthy();

            await controller.reload();
            expect(controller.getItems().getCount() === pageSize).toBeTruthy();

            await controller.reload({
                multiNavigation: true,
            } as INavigationSourceConfig);
            expect(controller.getItems().getCount() === pageSize).toBeTruthy();

            await controller.reload({
                page: 0,
                pageSize,
            });
            expect(controller.getItems().getCount() === pageSize).toBeTruthy();
        });

        it('load with multiNavigation and parentProperty', async () => {
            const pageSize = 3;
            const navigation = getPagingNavigation(false, pageSize);
            navigation.sourceConfig.multiNavigation = true;
            const controller = getControllerWithHierarchy({ navigation });
            const loadedItems = await controller.reload();
            expect((loadedItems as RecordSet).getCount() === pageSize).toBeTruthy();
            await controller.reload();
            expect(controller.getItems().getCount() === pageSize).toBeTruthy();
        });

        it('load with multiNavigation and without expandedItems', async () => {
            const pageSize = 3;
            const navigation = getPagingNavigation(false, pageSize);
            navigation.sourceConfig.multiNavigation = true;
            const controller = getController({
                ...getControllerOptions(),
                navigation,
            });
            const loadedItems = await controller.reload();
            expect((loadedItems as RecordSet).getCount() === pageSize).toBeTruthy();
            expect(controller.hasMoreData('down')).toBeTruthy();
        });

        it('load with multiNavigation, parentProperty, expandedItems as [null]', async () => {
            const pageSize = 3;
            const navigation = getPagingNavigation(false, pageSize);
            navigation.sourceConfig.multiNavigation = true;
            const controller = getControllerWithHierarchy({
                navigation,
                expandedItems: [null],
            });
            const loadedItems = await controller.reload();
            expect((loadedItems as RecordSet).getCount() === pageSize).toBeTruthy();
            await controller.reload();
            expect(controller.getItems().getCount() === pageSize).toBeTruthy();
        });

        it('load direction: down with multinavigation and expandedItems: [null]', () => {
            const navigation = getPagingNavigation(false);
            navigation.sourceConfig.multiNavigation = true;
            const controller = getControllerWithHierarchy({
                navigation,
                expandedItems: [null],
            });
            const items = new RecordSet();
            const navRecordSet = new RecordSet({
                keyProperty: 'id',
                rawData: [
                    {
                        id: 'Приход',
                        nav_result: 10,
                    },
                    {
                        id: 'Расход',
                        nav_result: 0,
                    },
                ],
            });
            items.setMetaData({ more: navRecordSet });
            controller.setItems(items);
            expect(controller.hasLoaded('Приход')).toBeTruthy();
            expect(controller.hasLoaded('Расход')).toBeTruthy();

            controller.load('down');
            expect(controller.hasLoaded('Приход')).toBeTruthy();
            expect(controller.hasLoaded('Расход')).toBeTruthy();
        });

        it('load with dataLoadCallback in options', async () => {
            let dataLoadCallbackCalled = false;
            const controller = getController({
                dataLoadCallback: () => {
                    dataLoadCallbackCalled = true;
                },
            });
            await controller.load();
            expect(dataLoadCallbackCalled).toBeTruthy();
        });

        it('load with dataLoadCallback from setter', async () => {
            let dataLoadCallbackCalled = false;
            const controller = getController();
            controller.setDataLoadCallback(() => {
                dataLoadCallbackCalled = true;
            });
            await controller.load();
            expect(dataLoadCallbackCalled).toBeTruthy();
        });

        it('load any root with dataLoadCallback from setter', async () => {
            let dataLoadCallbackCalled = false;
            const controller = getController();
            controller.setDataLoadCallback(() => {
                dataLoadCallbackCalled = true;
            });
            await controller.load(null, 'testRoot');
            expect(!dataLoadCallbackCalled).toBeTruthy();

            await controller.load('down', 'testRoot');
            expect(!dataLoadCallbackCalled).toBeTruthy();
        });

        it('dataLoadCallback from setter returns promise', async () => {
            const controller = getController();
            let promiseResolver;

            const promise = new Promise((resolve) => {
                promiseResolver = resolve;
            });
            controller.setDataLoadCallback(() => {
                return promise;
            });
            const reloadPromise = controller.reload().then(() => {
                expect(controller.getItems().getCount() === 4).toBeTruthy();
            });
            promiseResolver();
            await reloadPromise;
        });

        it('load with nodeLoadCallback in options', async () => {
            let nodeLoadCallbackCalled = false;
            const controller = getController({
                nodeLoadCallback: () => {
                    nodeLoadCallbackCalled = true;
                },
            });
            await controller.load();
            expect(!nodeLoadCallbackCalled).toBeTruthy();

            await controller.load(void 0, 'testRoot');
            expect(nodeLoadCallbackCalled).toBeTruthy();

            nodeLoadCallbackCalled = false;
            await controller.load('down', 'testRoot');
            expect(nodeLoadCallbackCalled).toBeTruthy();
        });

        it('load with direction returns error', () => {
            const navigation = getPagingNavigation();
            let options = { ...getControllerOptions(), navigation };
            const controller = getController(options);
            return controller.reload().then(() => {
                expect(controller.getItems().getCount() === 1).toBeTruthy();
                // mock error
                const originSource = controller._options.source;
                options = { ...options };
                options.source = sourceWithError;
                controller.updateOptions(options);

                return controller.load('down').catch(() => {
                    expect(controller.getItems().getCount() === 1).toBeTruthy();
                    expect(controller.getLoadError() instanceof Error).toBeTruthy();

                    // return originSource
                    options = { ...options };
                    options.source = originSource;
                    controller.updateOptions(options);
                    return controller.load('down').then(() => {
                        expect(controller.getItems().getCount() === 2).toBeTruthy();
                    });
                });
            });
        });

        it('load timeout error', () => {
            const options = getControllerOptions();
            options.loadTimeout = 1;
            options.source.query = () => {
                return new Promise((resolve) => {
                    setTimeout(resolve, 1000);
                });
            };
            const controller = getController(options);
            return controller.load().catch((error) => {
                expect(error.status).toStrictEqual(504);
            });
        });

        it('load with selectFields', async () => {
            const options = getControllerOptions();
            options.selectFields = ['key'];
            const controller = getController(options);
            await controller.reload();
            expect(controller.getItems().at(0).get('key') !== undefined).toBeTruthy();
            expect(controller.getItems().at(0).get('title') === undefined).toBeTruthy();
        });

        it('load with selectFields and navigation', async () => {
            const options = getControllerOptions();
            options.navigation = getPagingNavigation();
            options.selectFields = ['key'];
            const controller = getController(options);
            await controller.reload();
            expect(controller.getItems().at(0).get('key') !== undefined).toBeTruthy();
            expect(controller.getItems().at(0).get('title') === undefined).toBeTruthy();
        });

        it('dataLoad event', async () => {
            const options = getControllerOptions();
            const controller = getController(options);
            let dataLoadEventFired = false;
            await controller.reload();

            controller.subscribe('dataLoad', () => {
                dataLoadEventFired = true;
            });

            await controller.load();
            expect(dataLoadEventFired).toBeTruthy();

            dataLoadEventFired = false;
            await controller.load('down', 'testKey');
            expect(!dataLoadEventFired).toBeTruthy();
        });

        it('should merge metaData on load with direction "down"', async () => {
            const initMeta = { foo: 'bar' };
            const additionalMeta = { bar: 'foo' };
            const rs = new RecordSet({
                rawData: items,
                keyProperty: 'key',
            });
            rs.setMetaData(initMeta);

            const source = getMemory();
            jest.spyOn(source, 'query')
                .mockClear()
                .mockImplementation(
                    jest.fn(() => {
                        return Promise.resolve(rs.clone());
                    })
                );
            const controller = getController({
                source,
            });
            controller.setItems(rs.clone());
            rs.setMetaData(additionalMeta);

            await controller.load('down');

            const lastResult = controller.getItems();

            expect(initMeta).not.toEqual(lastResult.getMetaData());
            expect(lastResult.getMetaData()).toEqual({
                ...initMeta,
                ...additionalMeta,
            });
        });

        it('should merge metaData on load with direction "up"', async () => {
            const initMeta = { foo: 'bar' };
            const additionalMeta = { bar: 'foo' };
            const rs = new RecordSet({
                rawData: items,
                keyProperty: 'key',
            });
            rs.setMetaData(initMeta);

            const source = getMemory();
            jest.spyOn(source, 'query')
                .mockClear()
                .mockImplementation(
                    jest.fn(() => {
                        return Promise.resolve(rs.clone());
                    })
                );
            const controller = getController({
                source,
            });
            controller.setItems(rs.clone());
            rs.setMetaData(additionalMeta);

            await controller.load('up');

            const lastResult = controller.getItems();

            expect(initMeta).not.toEqual(lastResult.getMetaData());
            expect(lastResult.getMetaData()).toEqual({
                ...initMeta,
                ...additionalMeta,
            });
        });

        it('load with childrenProperty', async () => {
            const source = getMemory();
            const childItems = new RecordSet({
                rawData: [{ id: '4' }],
                keyProperty: 'id',
            });
            jest.spyOn(source, 'query')
                .mockClear()
                .mockImplementation(
                    jest.fn(() => {
                        return Promise.resolve(childItems.clone());
                    })
                );

            const hierarchyOptions = {
                ...getControllerWithHierarchyOptions(),
                childrenProperty: 'children',
                source,
            };
            const controller = new NewSourceController(hierarchyOptions);
            const items = new RecordSet({
                keyProperty: 'id',
                rawData: [
                    {
                        id: '0',
                        children: new RecordSet({
                            keyProperty: 'id',
                            rawData: [{ id: '2' }, { id: '3' }],
                        }),
                    },
                    {
                        id: '1',
                        children: new RecordSet({
                            keyProperty: 'id',
                        }),
                    },
                ],
            });
            controller.setItems(items);
            await controller.load(undefined, 1);
            expect(items.getRecordById(1).get('children').getCount()).toEqual(1);
        });

        it('load with addItemsAfterLoad: false', async () => {
            const controller = getControllerWithHierarchy();
            await controller.load(undefined, 'testRoot', undefined, false);
            expect(controller.hasLoaded('testRoot')).toBeFalsy();
        });
    });

    describe('cancelLoading', () => {
        it('query is canceled after cancelLoading', async () => {
            const controller = getController();

            const loadPromise = controller.load();
            expect(controller.isLoading()).toBeTruthy();

            controller.cancelLoading();
            await expect(loadPromise).rejects.toThrow('Unknown reason');
            expect(!controller.isLoading()).toBeTruthy();
        });
    });

    describe('updateOptions', () => {
        it('updateOptions with root', async () => {
            const controller = getControllerWithHierarchy();
            let options = { ...getControllerWithHierarchyOptions() };
            let isChanged;
            options.root = 'testRoot';

            isChanged = controller.updateOptions(options);
            expect(controller._root === 'testRoot').toBeTruthy();
            expect(isChanged).toBeTruthy();

            options = { ...options };
            options.root = undefined;
            isChanged = controller.updateOptions(options);
            expect(controller._root === 'testRoot').toBeTruthy();
            expect(!isChanged).toBeTruthy();
        });

        it('updateOptions with navigationParamsChangedCallback', async () => {
            let isNavigationParamsChangedCallbackCalled = false;
            const navigation = getPagingNavigation();
            const controller = getController({
                navigation,
            });
            await controller.reload();
            expect(!isNavigationParamsChangedCallbackCalled).toBeTruthy();

            controller.updateOptions({
                ...getControllerOptions(),
                navigation,
                navigationParamsChangedCallback: () => {
                    isNavigationParamsChangedCallbackCalled = true;
                },
            });
            await controller.reload();
            expect(isNavigationParamsChangedCallbackCalled).toBeTruthy();

            controller.updateOptions({
                ...getControllerOptions(),
                navigation: getPagingNavigation(),
            });
            isNavigationParamsChangedCallbackCalled = false;
            await controller.reload();
            expect(isNavigationParamsChangedCallbackCalled).toBeTruthy();
        });

        it('updateOptions with new sorting', async () => {
            let controllerOptions = getControllerOptions();
            controllerOptions.sorting = [{ testField: 'DESC' }];
            const controller = getController(controllerOptions);

            // the same sorting
            controllerOptions = { ...controllerOptions };
            controllerOptions.sorting = [{ testField: 'DESC' }];
            expect(!controller.updateOptions(controllerOptions)).toBeTruthy();

            // another sorting
            controllerOptions = { ...controllerOptions };
            controllerOptions.sorting = [{ testField: 'ASC' }];
            expect(controller.updateOptions(controllerOptions)).toBeTruthy();

            // sorting is plain object
            controllerOptions = { ...controllerOptions };
            controllerOptions.sorting = { testField: 'ASC' };
            expect(controller.updateOptions(controllerOptions)).toBeTruthy();

            controllerOptions = { ...controllerOptions };
            delete controllerOptions.sorting;
            expect(!controller.updateOptions(controllerOptions)).toBeTruthy();
        });

        it('updateOptions with new filter', async () => {
            let controllerOptions = getControllerOptions();
            controllerOptions.filter = [{ filed1: 'value1' }];
            const controller = getController(controllerOptions);

            // the same filter
            controllerOptions = { ...controllerOptions };
            controllerOptions.filter = [{ filed1: 'value1' }];
            expect(!controller.updateOptions(controllerOptions)).toBeTruthy();

            // another filter
            controllerOptions = { ...controllerOptions };
            controllerOptions.filter = [{ field2: 'value2' }];
            expect(controller.updateOptions(controllerOptions)).toBeTruthy();
        });
    });

    describe('expandedItems in options', () => {
        it('updateOptions with expandedItems', async () => {
            const controller = getControllerWithHierarchy();
            let options = { ...getControllerWithHierarchyOptions() };

            options.expandedItems = [];
            controller.updateOptions(options);
            expect(controller.getExpandedItems()).toEqual([]);

            options = { ...options };
            options.expandedItems = ['testRoot'];
            controller.updateOptions(options);
            expect(controller.getExpandedItems()).toEqual(['testRoot']);

            options = { ...options };
            delete options.expandedItems;
            controller.updateOptions(options);
            expect(controller.getExpandedItems()).toEqual(['testRoot']);

            options = { ...options };
            options.expandedItems = ['testRoot2'];
            controller.setExpandedItems(['testRoot2']);
            expect(!controller.updateOptions(options)).toBeTruthy();
        });

        it('reset expandedItems on options change', async () => {
            let options = { ...getControllerWithHierarchyOptions() };
            options.expandedItems = ['testRoot'];
            const controller = getControllerWithHierarchy(options);

            expect(controller.getExpandedItems()).toEqual(['testRoot']);

            options = { ...options };
            controller.updateOptions(options);
            // Если проставлен флаг deepReload, то expandedItems не сбросятся
            expect(controller.getExpandedItems()).toEqual(['testRoot']);

            // флаг deepReload сбросится только после перезагрузки
            await controller.reload();

            options = { ...options };
            options.root = 'testRoot';
            controller.updateOptions(options);
            expect(controller.getExpandedItems()).toEqual([]);

            controller.setExpandedItems(['testRoot']);
            options = { ...options };
            options.filter = { newFilterField: 'newFilterValue' };
            controller.updateOptions(options);
            expect(controller.getExpandedItems()).toEqual([]);

            options = { ...options };
            options.deepReload = true;
            controller.updateOptions(options);
            controller.setExpandedItems(['testRoot']);
            options = { ...options };
            options.root = 'testRoot2';
            controller.updateOptions(options);
            expect(controller.getExpandedItems()).toEqual([]);
        });

        it('expandedItems is [null]', async () => {
            let options = { ...getControllerWithHierarchyOptions() };
            options.source = new Memory({
                data: hierarchyItems,
                keyProperty: 'key',
                filter: filterByRoot,
            });
            options.expandedItems = [null];
            options.root = null;
            const controller = getController(options);

            expect(controller.getExpandedItems()).toEqual([null]);

            options = { ...options };
            options.filter = { newFilterField: 'newFilterValue' };
            controller.updateOptions(options);
            expect(controller.getExpandedItems()).toEqual([null]);

            await controller.reload();
            expect(controller.getItems().getCount() === 3).toBeTruthy();
        });

        it('resetCollapsedNodes', async () => {
            const pageSize = 2;
            const navigation = getPagingNavigation(false, pageSize);

            navigation.sourceConfig.multiNavigation = true;

            const controller = getControllerWithHierarchy({
                navigation,
                expandedItems: [0],
            });

            await controller.reload();

            expect(controller.getItems().getCount()).toBe(pageSize);

            const newExpandedItems = [];
            controller.resetCollapsedNodes(newExpandedItems);
            controller.setExpandedItems(newExpandedItems);

            expect(controller.getItems().getCount()).toBe(1);
        });
    });

    it('error in options', () => {
        const sourceControllerOptions = getControllerOptions();
        sourceControllerOptions.error = new Error();
        const sourceController = new NewSourceController(sourceControllerOptions);
        expect(sourceController.getLoadError() instanceof Error).toBeTruthy();
    });

    describe('reload', () => {
        it('reload should recreate navigation controller', async () => {
            const controller = getController({
                navigation: getPagingNavigation(false),
            });
            const itemsRS = await controller.reload();
            controller.setItems(itemsRS as RecordSet);

            const controllerDestroyStub = jest
                .spyOn(controller._navigationController, 'destroy')
                .mockClear()
                .mockImplementation();
            await controller.reload();
            expect(controllerDestroyStub).toHaveBeenCalledTimes(1);
        });

        it('reload with parentProperty and multiNavigation in config', async () => {
            const pageSize = 2;
            const allItemsCount = 4;
            const navigation = getPagingNavigation(false, pageSize);
            navigation.sourceConfig.multiNavigation = true;
            const controller = getControllerWithHierarchy({ navigation });

            await controller.reload();
            await controller.load('down');
            expect(controller.getItems().getCount() === allItemsCount).toBeTruthy();

            await controller.reload();
            expect(controller.getItems().getCount() === pageSize).toBeTruthy();
        });

        it('should set metaData on reload', async () => {
            const initMeta = { foo: 'bar' };
            const reloadMeta = {
                foo: 'test',
                bar: 'foo',
            };
            const rs = new RecordSet({
                rawData: items,
                keyProperty: 'key',
            });
            rs.setMetaData(initMeta);

            const source = getMemory();
            jest.spyOn(source, 'query')
                .mockClear()
                .mockImplementation(
                    jest.fn(() => {
                        return Promise.resolve(rs.clone());
                    })
                );
            const controller = getController({
                source,
            });

            rs.setMetaData(reloadMeta);

            const lastResult = (await controller.reload()) as RecordSet;
            expect(initMeta).not.toEqual(lastResult.getMetaData());
            expect(lastResult.getMetaData()).toEqual(reloadMeta);
        });
    });

    describe('setItems', () => {
        it('navigationController is recreated on setItems', () => {
            const controller = getController({
                navigation: getPagingNavigation(true),
            });
            controller.setItems(
                new RecordSet({
                    rawData: items,
                    keyProperty: 'key',
                })
            );
            const controllerDestroyStub = jest
                .spyOn(controller._navigationController, 'destroy')
                .mockClear()
                .mockImplementation();

            controller.setItems(
                new RecordSet({
                    rawData: items,
                    keyProperty: 'key',
                })
            );
            expect(controllerDestroyStub).toHaveBeenCalledTimes(1);
        });

        it('navigation is updated before assign items', () => {
            const controller = getController({
                navigation: getPagingNavigation(true),
            });
            controller.setItems(
                new RecordSet({
                    rawData: items,
                    keyProperty: 'key',
                })
            );
            const controllerItems = controller.getItems();

            let hasMoreResult;
            controllerItems.subscribe('onCollectionChange', () => {
                hasMoreResult = controller.hasMoreData('down');
            });

            let newControllerItems = controllerItems.clone();
            newControllerItems.setMetaData({
                more: false,
            });
            controller.setItems(newControllerItems);
            expect(!hasMoreResult).toBeTruthy();

            newControllerItems = controllerItems.clone();
            newControllerItems.setMetaData({
                more: true,
            });
            controller.setItems(newControllerItems);
            expect(hasMoreResult).toBeTruthy();
        });

        describe('different items format', () => {
            it('items with same format', () => {
                const controller = getController();
                const items = new RecordSet({
                    adapter: new adapter.Sbis(),
                    rawData: {
                        d: [['1']],
                        s: [{ n: 'testName', t: 'string' }],
                    },
                    format: [{ name: 'testName', type: 'string' }],
                    keyProperty: 'id',
                });
                const itemsWithSameFormat = new RecordSet({
                    adapter: new adapter.Sbis(),
                    rawData: {
                        d: [['1']],
                        s: [{ n: 'testName', t: 'string' }],
                    },
                    format: [{ name: 'testName', type: 'string' }],
                    keyProperty: 'id',
                });

                controller.setItems(items);
                controller.setItems(itemsWithSameFormat);
                expect(controller.getItems() === items).toBeTruthy();
            });

            it('items with different format', () => {
                const items = new RecordSet({
                    adapter: new adapter.Sbis(),
                    rawData: {
                        d: [['1']],
                        s: [{ n: 'testName', t: 'string' }],
                    },
                    format: [{ name: 'testName', type: 'string' }],
                    keyProperty: 'id',
                });
                const otherItems = new RecordSet({
                    adapter: new adapter.Sbis(),
                    rawData: {
                        d: [['1']],
                        s: [{ n: 'testName2', t: 'string' }],
                    },
                    format: [{ name: 'testName2', type: 'string' }],
                    keyProperty: 'id',
                });
                const controller = getController();

                controller.setItems(items);
                controller.setItems(otherItems);
                expect(controller.getItems() === otherItems).toBeTruthy();
            });

            it('empty items', () => {
                const items = new RecordSet({
                    adapter: new adapter.Sbis(),
                    rawData: {
                        d: [],
                        s: [],
                    },
                    format: [],
                    keyProperty: 'id',
                });
                const otherItems = new RecordSet({
                    adapter: new adapter.Sbis(),
                    rawData: {
                        d: [['1']],
                        s: [{ n: 'testName2', t: 'string' }],
                    },
                    format: [{ name: 'testName2', type: 'string' }],
                    keyProperty: 'id',
                });
                const controller = getController();

                controller.setItems(items);
                controller.setItems(otherItems);
                expect(controller.getItems() === items).toBeTruthy();
            });
        });

        it('setItems with multinavigation', () => {
            const navigation = getPagingNavigation(true);
            navigation.sourceConfig.multiNavigation = true;
            const controller = getControllerWithHierarchy({ navigation });
            const items = new RecordSet();
            const navRecordSet = new RecordSet({
                keyProperty: 'id',
                rawData: [
                    {
                        id: 'Приход',
                        nav_result: true,
                    },
                    {
                        id: 'Расход',
                        nav_result: false,
                    },
                ],
            });
            items.setMetaData({ more: navRecordSet });
            controller.setItems(items);
            expect(controller.hasLoaded('Приход')).toBeTruthy();
            expect(controller.hasLoaded('Расход')).toBeTruthy();
        });
    });

    describe('getKeyProperty', () => {
        it('keyProperty from source', () => {
            const options = {
                source: new Memory({
                    keyProperty: 'testKeyProperty',
                }),
            };
            const sourceController = new NewSourceController(options);
            expect(sourceController.getKeyProperty() === 'testKeyProperty').toBeTruthy();
        });

        it('keyProperty in options', () => {
            const options = {
                source: new Memory(),
                keyProperty: 'testKeyProperty',
            };
            const sourceController = new NewSourceController(options);
            expect(sourceController.getKeyProperty() === 'testKeyProperty').toBeTruthy();
        });

        it('keyProperty from PrefetchProxy source', () => {
            const source = new Memory({
                keyProperty: 'testKeyProperty',
            });
            const options = {
                source: new PrefetchProxy({
                    target: source,
                }),
            };
            const sourceController = new NewSourceController(options);
            expect(sourceController.getKeyProperty() === 'testKeyProperty').toBeTruthy();
        });
    });

    describe('hasMoreData', () => {
        it('hasMoreData for root', async () => {
            const controller = getController({
                navigation: getPagingNavigation(false),
            });
            await controller.reload();
            expect(controller.hasMoreData('down')).toBeTruthy();
        });

        it('hasMoreData for not loaded folder', () => {
            const controller = getController({
                navigation: getPagingNavigation(false),
            });
            expect(!controller.hasMoreData('down', 'anyFolderKey')).toBeTruthy();
            expect(!controller.hasLoaded('anyFolderKey')).toBeTruthy();
        });

        it('hasMoreData after update metaData in RecordSet', async () => {
            const controller = getController({
                navigation: getPagingNavigation(false),
                observeMetaData: true,
            });
            await controller.reload();
            expect(controller.hasMoreData('down')).toBeTruthy();

            controller.getItems().setMetaData({ more: 0 });
            expect(!controller.hasMoreData('down')).toBeTruthy();
        });
    });

    describe('hasLoaded', () => {
        it('hasLoaded without navigation, but all items loaded', async () => {
            const source = new Memory({
                data: hierarchyItems,
                keyProperty: 'key',
                filter: () => {
                    return true;
                },
            });
            const controller = getControllerWithHierarchy({ source });
            await controller.reload();
            expect(controller.hasLoaded(0)).toBeTruthy();
        });

        it('hasLoaded with navigation', async () => {
            const controller = getController({
                navigation: getPagingNavigation(false),
            });
            expect(!controller.hasLoaded('anyFolderKey')).toBeTruthy();
        });

        it('hasLoaded with hasChildrenProperty', async () => {
            const controller = getControllerWithHierarchy({
                hasChildrenProperty: 'hasChildren',
                root: null,
                source: new HierarchicalMemory({
                    data: hierarchyItems,
                    keyProperty: 'key',
                    parentProperty: 'parent',
                }),
            });
            await controller.reload();
            expect(!controller.hasLoaded(0)).toBeTruthy();
            expect(controller.hasLoaded(5)).toBeTruthy();
        });
    });

    describe('collapsedGroups', () => {
        it('initialize with groupHistoryId', async () => {
            const storedCollapsedGroups = ['testCollapsedGroup1', 'testCollapsedGroup2'];
            jest.spyOn(groupUtil, 'restoreCollapsedGroups')
                .mockClear()
                .mockImplementation(() => {
                    return Promise.resolve(storedCollapsedGroups);
                });
            const controller = await getController({
                source: getMemory({
                    filter: (item, filter) => {
                        return filter.myFilterField;
                    },
                }),
                filter: {
                    myFilterField: 'myFilterFieldValue',
                },
                groupProperty: 'groupProperty',
                groupHistoryId: 'groupHistoryId',
            });

            expect(controller.getCollapsedGroups()).toBeTruthy();
            jest.restoreAllMocks();
        });

        it('update with new groupHistoryId', async () => {
            const storedCollapsedGroups = ['testCollapsedGroup1', 'testCollapsedGroup2'];
            jest.spyOn(groupUtil, 'restoreCollapsedGroups')
                .mockClear()
                .mockImplementation((storeKey: string) => {
                    return Promise.resolve(
                        storeKey === 'newGroupHistoryId' ? storedCollapsedGroups : undefined
                    );
                });
            const controller = getController({
                source: getMemory({
                    filter: (item, filter) => {
                        return filter.myFilterField;
                    },
                }),
                filter: {
                    myFilterField: 'myFilterFieldValue',
                },
                groupProperty: 'groupProperty',
                groupHistoryId: 'groupHistoryId',
            });

            const options = getControllerOptions();
            await controller.updateOptions({
                ...options,
                groupHistoryId: 'newGroupHistoryId',
            });
            expect(controller.getCollapsedGroups()).toBeTruthy();
            jest.restoreAllMocks();
        });
    });

    describe('setRoot', () => {
        it('root is changed after setRoot', () => {
            const controller = getController();
            controller.setRoot('testRoot');
            expect(controller.getRoot() === 'testRoot').toBeTruthy();
        });

        it('rootChanged event fired on setRoot', () => {
            let rootChangedEventFired = false;
            const controller = getController();
            controller.subscribe('rootChanged', () => {
                rootChangedEventFired = true;
            });

            controller.setRoot('testRoot');
            expect(rootChangedEventFired).toBeTruthy();

            // same root
            rootChangedEventFired = false;
            controller.setRoot('testRoot');
            expect(!rootChangedEventFired).toBeTruthy();
        });
    });

    describe('itemsChanged event', () => {
        it('itemsChanged on reload', async () => {
            const controller = getController();
            let itemsChangedEventFired;
            controller.subscribe('itemsChanged', () => {
                itemsChangedEventFired = true;
            });
            await controller.reload();
            expect(itemsChangedEventFired).toBeTruthy();
        });

        it('itemsChanged on load', async () => {
            const controller = getController();
            let rootFromEvent;
            controller.subscribe('itemsChanged', (event, items, root) => {
                rootFromEvent = root;
            });
            await controller.load('down', 'testRoot');
            expect(rootFromEvent === 'testRoot').toBeTruthy();
        });
    });

    describe('sorting', () => {
        it('sorting changed after setSorting call', async () => {
            const controller = getController();
            controller.setSorting([
                {
                    key: 'DESC',
                },
            ]);
            await controller.reload();
            expect(controller.getItems().at(0).get('key') === 3).toBeTruthy();
        });

        it('sorting in options', async () => {
            const controller = getController({
                sorting: [
                    {
                        key: 'DESC',
                    },
                ],
            });
            await controller.reload();
            expect(controller.getItems().at(0).get('key') === 3).toBeTruthy();

            controller.setSorting([
                {
                    key: 'ASC',
                },
            ]);
            await controller.reload();
            expect(controller.getItems().at(0).get('key') === 0).toBeTruthy();
        });
    });

    describe('reloadItem', () => {
        it('reload item should update item', async () => {
            const controller = getController();
            controller.setItems(
                new RecordSet({
                    rawData: [
                        {
                            key: 0,
                            title: 'testTitle',
                        },
                    ],
                    keyProperty: 'id',
                })
            );

            await controller.reloadItem(0);
            expect(controller.getItems().at(0).get('title') === 'Sasha').toBeTruthy();
            expect(!controller.isLoading()).toBeTruthy();
        });

        it('reload item with query method and dataLoadCallback', async () => {
            let dataLoadCallbackCalled = false;
            const dataLoadCallback = () => {
                dataLoadCallbackCalled = true;
            };
            const controller = getController({ dataLoadCallback });
            controller.setItems(
                new RecordSet({
                    rawData: [
                        {
                            key: 0,
                            title: 'testTitle',
                        },
                    ],
                    keyProperty: 'id',
                })
            );

            await controller.reloadItem(0, { method: 'query' });
            expect(dataLoadCallbackCalled).toBeTruthy();
            expect(!controller.isLoading()).toBeTruthy();
        });

        it('sourceController не должен падать, если перезагружаемый элемент был удалён, пока шла перезагрузка', async () => {
            const controller = getController();
            const items = new RecordSet({
                rawData: [
                    {
                        key: 0,
                        title: 'testTitle',
                    },
                ],
                keyProperty: 'id',
            });
            controller.setItems(items);

            const reloadItemPromise = controller.reloadItem(0);
            controller.getItems().removeAt(0);
            await reloadItemPromise;
            expect(controller.getItems().getCount()).toBe(0);
        });

        it('sourceController не должен падать, если перезагружаемый элемент был перемещён, пока шла перезагрузка', async () => {
            const controller = getController();
            const items = new RecordSet({
                rawData: [
                    {
                        key: 0,
                        title: 'testTitle',
                    },
                    {
                        key: 1,
                        title: 'testTitle2',
                    },
                ],
                keyProperty: 'id',
            });
            controller.setItems(items);

            const reloadItemPromise = controller.reloadItem(0);
            controller.getItems().move(0, 1);
            await reloadItemPromise;
            expect(controller.getItems().at(1).get('title')).toBe('Sasha');
            expect(controller.getItems().at(0).get('title')).toBe('testTitle2');
        });
    });

    describe('update', () => {
        it('source reject on update', async () => {
            const options = getControllerOptions();
            options.source.update = () => {
                return Promise.reject(new Error());
            };
            const controller = getController(options);
            await controller.reload();

            const notifyStub = jest.spyOn(controller, '_notify').mockClear().mockImplementation();
            await controller.update(controller.getItems().at(0)).catch((error) => {
                return error;
            });

            expect(notifyStub).toBeTruthy();
        });
    });
});
