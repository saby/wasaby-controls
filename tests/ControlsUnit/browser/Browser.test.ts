import { IBrowserOptions, IListConfiguration } from 'Controls/browser';
import { default as Browser } from 'Controls/_browser/Browser';
import { Memory, PrefetchProxy, DataSet } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { detection } from 'Env/Env';
import { adapter } from 'Types/entity';
import { NewSourceController, getControllerState } from 'Controls/dataSource';
import { ControllerClass as SearchController } from 'Controls/search';
import {
    ControllerClass as FilterController,
    IFilterControllerOptions,
} from 'Controls/filter';
import 'Controls/searchBreadcrumbsGrid';
import * as clone from 'Core/core-clone';

type TPartialListConfiguration = Partial<IListConfiguration>;

const browserData = [
    {
        id: 0,
        name: 'Sasha',
    },
    {
        id: 1,
        name: 'Aleksey',
    },
    {
        id: 2,
        name: 'Dmitry',
    },
];

const browserHierarchyData = [
    {
        key: 0,
        title: 'Интерфейсный фреймворк',
        parent: null,
    },
    {
        key: 1,
        title: 'Sasha',
        parent: 0,
    },
    {
        key: 2,
        title: 'Dmitry',
        parent: null,
    },
];

const eventMock = {
    stopPropagation: () => {
        return void 0;
    },
    preventDefault: () => {
        return void 0;
    },
};

function getBrowserOptions(): Partial<IBrowserOptions> {
    return {
        minSearchLength: 3,
        source: new Memory({
            keyProperty: 'id',
            data: browserData,
        }),
        searchParam: 'name',
        filter: {},
        keyProperty: 'id',
    };
}

function getBrowserOptionsHierarchy(): Partial<IBrowserOptions> {
    return {
        ...getBrowserOptions(),
        parentProperty: 'parent',
        source: new Memory({
            keyProperty: 'id',
            data: browserHierarchyData,
        }),
    };
}

function getBrowser(options: object = {}): Browser {
    const brow = new Browser(options);
    // это сделано для того, чтобы ручные вызовы _forceUpdate не заваливали консоль ошибками
    jest.spyOn(brow, '_forceUpdate').mockClear().mockImplementation();
    return brow;
}

async function getBrowserWithMountCall(options: object = {}): Promise<Browser> {
    const brow = getBrowser(options);
    await brow._beforeMount(options);
    brow.saveOptions(options);
    brow._afterMount(options);
    return brow;
}

function getListsOptions(): TPartialListConfiguration[] {
    const browserOptions = getBrowserOptions();
    return [
        {
            id: 'list',
            ...browserOptions,
        },
        {
            id: 'list2',
            ...browserOptions,
        },
    ];
}

describe('Controls/browser:Browser', () => {
    describe('_beforeMount', () => {
        describe('init states on beforeMount', () => {
            it('root', async () => {
                let options = getBrowserOptions();
                const browser = getBrowser(options);

                await browser._beforeMount(options);
                expect(browser._root === null).toBeTruthy();

                options = { ...options };
                options.root = 'testRoot';
                await browser._beforeMount(options);
                expect(browser._root === 'testRoot').toBeTruthy();
            });

            it('viewMode', async () => {
                let options = getBrowserOptions();
                const browser = getBrowser(options);

                await browser._beforeMount(options);
                expect(browser._viewMode === undefined).toBeTruthy();

                options = { ...options };
                options.viewMode = 'table';
                await browser._beforeMount(options);
                expect(browser._viewMode === 'table').toBeTruthy();
            });

            it('items', async () => {
                const options = getBrowserOptions();
                const browser = getBrowser(options);

                await browser._beforeMount(options);
                expect(browser._items.getCount() === 3).toBeTruthy();
            });

            it('searchValue/inputSearchValue', async () => {
                let options = getBrowserOptions();
                const browser = getBrowser(options);

                await browser._beforeMount(options);
                expect(browser._searchValue === '').toBeTruthy();
                expect(browser._inputSearchValue === '').toBeTruthy();

                options = { ...options };
                options.searchValue = 'tes';
                await browser._beforeMount(options);
                expect(browser._searchValue === 'tes').toBeTruthy();
                expect(browser._inputSearchValue === 'tes').toBeTruthy();
                expect(browser._viewMode === 'search').toBeTruthy();
            });

            it('source returns error', async () => {
                const options = getBrowserOptions();
                options.source.query = () => {
                    const error = new Error();
                    error.processed = true;
                    return Promise.reject(error);
                };
                const browser = getBrowser(options);
                await browser._beforeMount(options);
                expect(
                    browser._contextState.source === options.source
                ).toBeTruthy();
            });

            it('_beforeMount with receivedState and dataLoadCallback', async () => {
                const receivedState = {
                    data: new RecordSet(),
                    historyItems: [
                        {
                            name: 'filterField',
                            value: 'filterValue',
                            textValue: 'filterTextValue',
                        },
                    ],
                };
                const options = getBrowserOptions();
                let dataLoadCallbackCalled = false;

                options.filterButtonSource = [
                    {
                        name: 'filterField',
                        value: '',
                        textValue: '',
                    },
                ];
                options.dataLoadCallback = () => {
                    dataLoadCallbackCalled = true;
                };
                options.filter = {};
                const browser = getBrowser(options);
                await browser._beforeMount(options, {}, [receivedState]);
                browser.saveOptions(options);

                expect(dataLoadCallbackCalled).toBeTruthy();
                expect(browser._filter).toEqual({ filterField: 'filterValue' });
            });

            it('_beforeMount without receivedState and historyItems in options', async () => {
                const options = getBrowserOptions();
                options.filterButtonSource = [
                    {
                        name: 'filterField',
                        value: '',
                        textValue: '',
                    },
                ];
                options.historyItems = [
                    {
                        name: 'filterField',
                        value: 'historyValue',
                    },
                ];
                options.filter = {};
                const browser = getBrowser(options);
                await browser._beforeMount(options, {});
                browser.saveOptions(options);
                expect(browser._filter).toEqual({
                    filterField: 'historyValue',
                });
            });

            describe('sourceController on mount', () => {
                it('sourceController in options', async () => {
                    const options = getBrowserOptions();
                    const sourceController = new NewSourceController(options);
                    options.sourceController = sourceController;
                    const browser = getBrowser(options);
                    await browser._beforeMount(options);
                    expect(
                        browser._getSourceController() === sourceController
                    ).toBeTruthy();
                });
            });

            describe('init expandedItems', () => {
                it('with receivedState', async () => {
                    const receivedState = {
                        data: new RecordSet(),
                        historyItems: [],
                    };
                    const options = getBrowserOptions();
                    options.expandedItems = [1];
                    const browser = getBrowser(options);
                    await browser._beforeMount(options, {}, [receivedState]);
                    expect(browser._contextState.expandedItems).toEqual([1]);
                    expect(
                        browser._getSourceController().getExpandedItems()
                    ).toEqual([1]);
                });

                it('without receivedState', async () => {
                    const options = getBrowserOptions();
                    options.expandedItems = [1];
                    const browser = getBrowser(options);
                    await browser._beforeMount(options, {}, []);
                    expect(browser._contextState.expandedItems).toEqual([1]);
                    expect(
                        browser._getSourceController().getExpandedItems()
                    ).toEqual([1]);
                });
            });
        });

        describe('searchController', () => {
            describe('searchValue on _beforeMount', () => {
                it('searchValue is longer then minSearchLength', () => {
                    const options = getBrowserOptions();
                    options.searchValue = 'Sash';
                    const browser = getBrowser(options);
                    return new Promise((resolve) => {
                        browser._beforeMount(options, {}).then(() => {
                            expect(browser._searchValue).toEqual('Sash');
                            resolve();
                        });
                    });
                });

                it('filter in context without source on _beforeMount', async () => {
                    const options = getBrowserOptions();
                    const filter = {
                        testField: 'testValue',
                    };
                    options.source = null;
                    options.filter = filter;

                    const browser = getBrowser(options);
                    await browser._beforeMount(options, {});
                    expect(browser._contextState.filter).toEqual(filter);
                    expect(browser._filter).toEqual(filter);
                });

                it('filterButtonSource and filter in context without source on _beforeMount', async () => {
                    const options = getBrowserOptions();
                    const filter = {
                        testField: 'testValue',
                    };
                    options.source = null;
                    options.filter = filter;
                    options.filterButtonSource = [
                        {
                            id: 'testField2',
                            value: 'testValue2',
                        },
                    ];

                    const expectedFilter = {
                        testField: 'testValue',
                        testField2: 'testValue2',
                    };

                    const browser = getBrowser(options);
                    await browser._beforeMount(options, {});
                    expect(browser._contextState.filter).toEqual(
                        expectedFilter
                    );
                    expect(browser._filter).toEqual(expectedFilter);
                });
            });

            describe('search', () => {
                it('search query returns error', async () => {
                    let dataErrorProcessed = false;
                    let propagationStopped = false;
                    const localEventMock = {
                        stopPropagation: () => {
                            propagationStopped = true;
                        },
                    };
                    const options = {
                        ...getBrowserOptions(),
                        dataLoadErrback: () => {
                            dataErrorProcessed = true;
                        },
                    };
                    const browser = getBrowser(options);
                    await browser._beforeMount(options, {});
                    browser.saveOptions(options);
                    options.source.query = () => {
                        const error = new Error();
                        error.processed = true;
                        return Promise.reject(error);
                    };

                    await browser._search(localEventMock, 'test');
                    expect(dataErrorProcessed).toBe(true);
                    expect(propagationStopped).toBe(true);
                    expect(browser._loading).toBe(false);
                    expect(browser._filter).toEqual({ name: 'test' });
                    expect(browser._searchValue === 'test').toBeTruthy();
                });

                it('double search call will create searchController once', async () => {
                    const browserOptions = getBrowserOptions();
                    const browser = getBrowser(browserOptions);
                    await browser._beforeMount(browserOptions);
                    browser.saveOptions(browserOptions);

                    const searchControllerCreatedPromise1 =
                        browser._getSearchController(browserOptions);
                    const searchControllerCreatedPromise2 =
                        browser._getSearchController(browserOptions);

                    const searchController1 =
                        await searchControllerCreatedPromise1;
                    const searchController2 =
                        await searchControllerCreatedPromise2;
                    expect(searchController1 === searchController2).toBe(true);
                });
                it('loading state on search', async () => {
                    const browserOptions = getBrowserOptions();
                    const browser = getBrowser(browserOptions);
                    await browser._beforeMount(browserOptions);
                    browser.saveOptions(browserOptions);
                    const searchPromise = browser._search(null, 'test');
                    expect(browser._loading).toBeTruthy();
                    await searchPromise;
                    expect(!browser._loading).toBeTruthy();
                    expect(browser._searchValue === 'test').toBeTruthy();

                    // search with same value
                    searchPromise = browser._search(null, 'test');
                    expect(browser._loading).toBeTruthy();
                    await searchPromise;
                    expect(!browser._loading).toBeTruthy();
                });

                it('empty searchParam in options', async () => {
                    const browserOptions = getBrowserOptions();
                    delete browserOptions.searchParam;
                    const browser = getBrowser(browserOptions);
                    await browser._beforeMount(browserOptions);
                    browser.saveOptions(browserOptions);
                    const searchPromise = browser._search(null, 'test');
                    expect(!browser._loading).toBeTruthy();
                    await searchPromise;
                    expect(!browser._loading).toBeTruthy();
                });
                it('search with root was canceled', async () => {
                    const options = {
                        ...getBrowserOptions(),
                        startingWith: 'root',
                        root: 'currentRoot',
                        parentProperty: 'parent',
                    };
                    const path = new RecordSet({
                        rawData: [
                            {
                                id: 0,
                                parent: 'root',
                            },
                        ],
                        keyProperty: 'id',
                    });
                    const browser = getBrowser(options);
                    await browser._beforeMount(options, {});
                    browser.saveOptions(options);
                    await browser._getSearchController();
                    browser._getSearchControllerSync().setPath(path);
                    options.source.query = () => {
                        return new Promise((resolve) => {
                            setTimeout(() => {
                                resolve(new DataSet());
                            }, 100);
                        });
                    };

                    const sourceController = browser._getSourceController();
                    const currentRoot = sourceController.getRoot();
                    const searchPromise = browser._search(eventMock, 'test');
                    await browser._getSearchController();

                    browser._resetSearch();
                    // root проставляется в обработчике ошибки promise, а этот код всегда асинхронный
                    await searchPromise;
                    expect(
                        sourceController.getRoot() === currentRoot
                    ).toBeTruthy();
                });

                it('reset search with listsOptions', async () => {
                    const browserOptions = getBrowserOptions();
                    const listsOptions = getListsOptions();
                    listsOptions[1].searchParam = '';
                    const options = {
                        ...browserOptions,
                        listsOptions,
                    };
                    const browser = getBrowser(options);
                    await browser._beforeMount(options);
                    browser.saveOptions(options);
                    await browser._search(null, 'testSearchValue');
                    browser._resetSearch();
                    expect(!browser._searchValue).toBeTruthy();
                });

                it('reset search, option does not change', async () => {
                    const browserOptions = getBrowserOptions();
                    browserOptions.searchValue = 'test';
                    const browser = await getBrowserWithMountCall(
                        browserOptions
                    );

                    await browser._resetSearch();
                    await browser._beforeUpdate(browserOptions);
                    expect(browser._searchValue === 'test').toBeTruthy();
                });

                it('change root in sourceController should reset search', async () => {
                    const browserOptions = {
                        ...getBrowserOptionsHierarchy(),
                        resetSearchOnRootChanged: true,
                    };
                    const sourceController = new NewSourceController({
                        ...browserOptions,
                    });
                    browserOptions.sourceController = sourceController;
                    const browser = await getBrowserWithMountCall(
                        browserOptions
                    );
                    await browser._search(null, 'test');
                    sourceController.setRoot('newRoot');
                    expect(!browser._inputSearchValue).toBeTruthy();
                });

                it('inputSearchValue should saved on reset search', async () => {
                    const options = getBrowserOptions();
                    options.parentProperty = 'parentProperty';
                    options.root = 'rootBeforeSearch';
                    const browser = getBrowser(options);
                    await browser._beforeMount(options);
                    browser.saveOptions(options);
                    await browser._search(null, 'testSearchValue');

                    browser._inputSearchValueChanged(null, 'te');
                    browser._searchResetHandler();
                    expect(browser._inputSearchValue).toEqual('te');
                });
            });

            it('root is not changed, but root in searchController is updated', async () => {
                let browserOptions = getBrowserOptionsHierarchy();
                const searchController = new SearchController(
                    getBrowserOptionsHierarchy()
                );
                browserOptions.searchController = searchController;
                browserOptions.root = null;
                const browser = await getBrowserWithMountCall(browserOptions);

                searchController.setRoot('anyRoot');
                browserOptions = { ...browserOptions };
                await browser._beforeUpdate(browserOptions);
                expect(searchController.getRoot() === null).toBeTruthy();
            });

            describe('_searchReset', () => {
                it('_searchReset while loading', async () => {
                    const options = getBrowserOptions();
                    const browser = getBrowser(options);
                    let loadAborted = false;
                    await browser._beforeMount(options);
                    browser.saveOptions(options);

                    const sourceController = browser._getSourceController();
                    const loadPromise = sourceController.reload().catch(() => {
                        loadAborted = true;
                    });
                    browser._searchResetHandler();
                    await loadPromise;
                    expect(loadAborted).toBeTruthy();
                });

                it('_searchReset with startingWith === "current"', async () => {
                    const options = getBrowserOptions();
                    options.startingWith = 'current';
                    options.root = 'testRoot';
                    options.source.query = (query) => {
                        const recordSet = new RecordSet();
                        recordSet.setMetaData({
                            path: new RecordSet({
                                rawData: [
                                    {
                                        id: query.getWhere()[
                                            options.parentProperty
                                        ],
                                    },
                                ],
                            }),
                        });
                        return Promise.resolve(recordSet);
                    };
                    const browser = getBrowser(options);
                    await browser._beforeMount(options);
                    browser.saveOptions(options);

                    await browser._search(eventMock, 'testSearchValue');
                    expect(browser._root === 'testRoot').toBeTruthy();

                    await browser._searchResetHandler();
                    expect(browser._root === 'testRoot').toBeTruthy();
                });
            });
        });

        describe('init shadow visibility', () => {
            const recordSet = new RecordSet({
                rawData: [{ id: 1 }],
                keyProperty: 'id',
                metaData: {
                    more: {
                        before: true,
                        after: true,
                    },
                },
            });

            const options = getBrowserOptions();

            let browser;

            let defaultIsMobilePlatformValue;

            beforeEach(() => {
                defaultIsMobilePlatformValue = detection.isMobilePlatform;
            });

            afterEach(() => {
                detection.isMobilePlatform = defaultIsMobilePlatformValue;
            });

            it('items in receivedState', () => {
                const newOptions = {
                    ...options,
                    topShadowVisibility: 'auto',
                    bottomShadowVisibility: 'auto',
                };

                browser = new Browser(newOptions);
                browser._beforeMount(newOptions, {}, [
                    { data: recordSet, historyItems: [] },
                ]);
                expect(browser._topShadowVisibility).toEqual('gridauto');
                expect(browser._bottomShadowVisibility).toEqual('gridauto');

                detection.isMobilePlatform = true;

                browser = new Browser(newOptions);
                browser._beforeMount(newOptions, {}, [
                    { data: recordSet, historyItems: [] },
                ]);
                expect(browser._topShadowVisibility).toEqual('auto');
                expect(browser._bottomShadowVisibility).toEqual('auto');
            });
        });

        it('source returns error', async () => {
            const options = getBrowserOptions();
            options.source.query = () => {
                const error = new Error('testError');
                error.processed = true;
                return Promise.reject(error);
            };
            const browser = getBrowser(options);

            const result = await browser._beforeMount(options);
            expect(result instanceof Error).toBeTruthy();
        });

        it('source as prefetchProxy', async () => {
            const options = getBrowserOptions();
            const source = options.source;
            options.source = new PrefetchProxy({
                target: source,
                data: {
                    query: new DataSet(),
                },
            });
            const browser = getBrowser(options);
            await browser._beforeMount(options);
            browser.saveOptions(options);
            expect(browser._source === options.source).toBeTruthy();

            await browser._beforeUpdate(options);
            expect(
                browser._getSourceController().getSource() === options.source
            ).toBeTruthy();
            expect(browser._source === options.source).toBeTruthy();
        });

        it('source as prefetchProxy and with receivedState', async () => {
            const options = getBrowserOptions();
            const receivedState = {
                data: new RecordSet(),
                historyItems: [
                    {
                        name: 'filterField',
                        value: 'filterValue',
                        textValue: 'filterTextValue',
                    },
                ],
            };
            const source = options.source;
            options.source = new PrefetchProxy({
                target: source,
                data: {
                    query: new DataSet(),
                },
            });
            const browser = getBrowser(options);
            await browser._beforeMount(options, {}, [receivedState]);
            browser.saveOptions(options);
            expect(browser._source === source).toBeTruthy();

            await browser._beforeUpdate(options);
            expect(
                browser._getSourceController().getSource() === source
            ).toBeTruthy();
            expect(browser._source === source).toBeTruthy();
        });

        it('source as prefetchProxy and with sourceController', async () => {
            const options = getBrowserOptions();
            const source = options.source;
            options.source = new PrefetchProxy({
                target: source,
                data: {
                    query: new DataSet(),
                },
            });
            options.sourceController = new NewSourceController(options);
            const browser = await getBrowserWithMountCall(options);
            expect(browser._source === source).toBeTruthy();
        });
    });

    describe('_beforeUpdate', () => {
        it('selectionViewMode changed', async () => {
            let options = getBrowserOptions();
            options.selectedKeys = ['testKey'];
            const browser = getBrowser(options);
            await browser._beforeMount(options);
            browser.saveOptions(options);

            options = { ...options };
            options.selectionViewMode = 'selected';
            await browser._beforeUpdate(options);
            expect(browser._filter.SelectionWithPath).toBeTruthy();
        });

        describe('searchController', () => {
            it('filter in searchController updated', async () => {
                const options = getBrowserOptions();
                const filter = {
                    testField: 'newFilterValue',
                };
                options.filter = filter;
                const browser = getBrowser(options);
                await browser._beforeMount(options);
                browser._filter = {
                    testField: 'oldFilterValue',
                };
                browser._options.source = options.source;
                browser._getSourceController().updateOptions = () => {
                    return true;
                };
                const searchController = await browser._getSearchController(
                    browser._options
                );
                options.searchValue = 'oldFilterValue';
                await browser._beforeUpdate(options);
                expect(searchController._options.filter).toEqual(filter);
            });

            it('filter and source are updated, searchValue is cleared', async () => {
                let options = getBrowserOptions();

                options.filter = { testField: 'filterValue' };
                options.searchValue = 'searchValue';
                const browser = getBrowser(options);
                await browser._beforeMount(options);
                browser.saveOptions(options);
                expect(browser._filter).toEqual({
                    testField: 'filterValue',
                    name: 'searchValue',
                });
                await browser._getSearchController();

                options = { ...options };
                options.filter = { testField: 'newFilterValue' };
                options.searchValue = '';
                options.source = new Memory();
                await browser._beforeUpdate(options);
                expect(browser._filter).toEqual({
                    testField: 'newFilterValue',
                });
                expect(browser._getSourceController().getFilter()).toEqual({
                    testField: 'newFilterValue',
                });
            });

            it('searchParam is changed', async () => {
                let options = getBrowserOptions();
                const browser = getBrowser(options);
                await browser._beforeMount(options);
                browser.saveOptions(options);
                await browser._getSearchController();

                options = { ...options };
                options.searchParam = 'newSearchParam';
                await browser._beforeUpdate(options);
                expect(
                    browser._getSearchControllerSync()._options.searchParam ===
                        'newSearchParam'
                ).toBeTruthy();
            });

            it('update with searchValue', async () => {
                let options = getBrowserOptions();
                const filter = {
                    testField: 'newFilterValue',
                };
                options.filter = filter;
                const browser = getBrowser(options);
                await browser._beforeMount(options);
                browser.saveOptions(options);
                await browser._getSearchController();

                options = { ...options };
                options.filter = {};
                options.searchValue = 'test';
                browser._beforeUpdate(options);
                expect(browser._filter.name).toEqual('test');

                options = { ...options };
                delete options.searchValue;
                options.filter = {
                    testField: 'newFilterValue',
                };
                browser._searchValue = 'test';
                browser._beforeUpdate(options);
                expect(browser._filter.name).toEqual('test');
                expect(
                    browser._getSearchControllerSync().getRoot() === null
                ).toBeTruthy();
            });

            it('update source and searchValue should reset inputSearchValue', async () => {
                let options = getBrowserOptions();
                const browser = getBrowser(options);
                await browser._beforeMount(options);
                browser.saveOptions(options);

                await browser._search(null, 'testSearchValue');
                options.searchValue = 'testSearchValue';
                browser.saveOptions(options);
                expect(
                    browser._inputSearchValue === 'testSearchValue'
                ).toBeTruthy();
                expect(browser._filter).toEqual({ name: 'testSearchValue' });

                options = { ...options };
                options.source = new Memory();
                options.searchValue = '';
                browser._beforeUpdate(options);
                expect(!browser._inputSearchValue).toBeTruthy();
                expect(browser._filter).toEqual({});
            });

            it('update source and reset searchValue', async () => {
                let options = getBrowserOptions();
                options.searchValue = 'testSearchValue';
                const browser = getBrowser(options);
                await browser._beforeMount(options);
                browser.saveOptions(options);
                await browser._getSearchController(options);

                expect(browser._searchValue === 'testSearchValue').toBeTruthy();
                expect(
                    browser._inputSearchValue === 'testSearchValue'
                ).toBeTruthy();
                expect(browser._filter.name === 'testSearchValue').toBeTruthy();

                options = { ...options };
                options.source = new Memory();
                options.searchValue = '';
                browser._beforeUpdate(options);
                expect(!browser._inputSearchValue).toBeTruthy();
                expect(!browser._filter.name).toBeTruthy();
            });

            it('update root and reset searchValue', async () => {
                let options = getBrowserOptionsHierarchy();
                options.searchValue = 'testSearchValue';
                const browser = getBrowser(options);
                await browser._beforeMount(options);
                browser.saveOptions(options);

                options = { ...options };
                options.root = 0;
                options.searchValue = '';
                await browser._beforeUpdate(options);
                expect(!browser._filter.name).toBeTruthy();
            });

            it('cancel query while searching', async () => {
                const options = getBrowserOptions();
                const browser = getBrowser(options);
                await browser._beforeMount(options);
                browser.saveOptions(options);

                browser._search(null, 'testSearchValue');
                await browser._getSearchController(options);
                expect(browser._loading).toBeTruthy();

                browser._dataLoader.getSourceController().cancelLoading();
                expect(browser._loading).toBeTruthy();
            });

            it('search returns recordSet with another format', async () => {
                const options = getBrowserOptions();
                const browser = getBrowser(options);
                await browser._beforeMount(options);
                browser.saveOptions(options);

                browser._source.query = () => {
                    return Promise.resolve(
                        new RecordSet({
                            adapter: new adapter.Sbis(),
                            format: [{ name: 'testName2', type: 'string' }],
                            keyProperty: 'testName2',
                        })
                    );
                };
                await browser._search(null, 'testSearchValue');
                expect(
                    browser._contextState.items
                        .getFormat()
                        .getFieldIndex('testName2') !== -1
                ).toBeTruthy();
                expect(
                    browser._items.getFormat().getFieldIndex('testName2') !== -1
                ).toBeTruthy();
            });
        });

        describe('operationsController', () => {
            it('listMarkedKey is updated by markedKey in options', async () => {
                const options = getBrowserOptions();
                options.markedKey = 'testMarkedKey';
                const browser = getBrowser(options);
                await browser._beforeMount(options);
                browser._beforeUpdate(options);
                expect(
                    browser._operationsController._savedListMarkedKey
                ).toEqual('testMarkedKey');

                options.markedKey = undefined;
                browser._beforeUpdate(options);
                expect(
                    browser._operationsController._savedListMarkedKey
                ).toEqual('testMarkedKey');
            });
        });

        describe('sourceController', () => {
            it('update expandedItems', async () => {
                const options = getBrowserOptions();
                const browser = getBrowser(options);
                await browser._beforeMount(options);
                browser._beforeUpdate({ ...options, expandedItems: [1] });
                expect(
                    browser._getSourceController().getExpandedItems()
                ).toEqual([1]);
            });

            it('sourceController is changed', async () => {
                let options = getBrowserOptions();
                let dataLoadCallbackCalled = false;
                options.parentProperty = 'testParentProperty';
                options.sourceController = new NewSourceController({
                    ...options,
                });
                const browser = await getBrowserWithMountCall(options);

                const source = new Memory();
                options = { ...options };
                options.dataLoadCallback = () => {
                    dataLoadCallbackCalled = true;
                };
                options.source = new PrefetchProxy({
                    target: source,
                    data: {
                        query: new RecordSet({
                            rawData: browserData,
                        }),
                    },
                });
                const sourceController = new NewSourceController({
                    ...options,
                    source,
                });
                options.sourceController = sourceController;
                await browser._beforeUpdate(options);
                expect(
                    browser._getSourceController() === sourceController
                ).toBeTruthy();
                expect(browser._source === source).toBeTruthy();
                expect(dataLoadCallbackCalled).toBeTruthy();

                sourceController.setRoot('newRoot');
                expect(browser._root === 'newRoot').toBeTruthy();
            });

            it('backButtonCaption is updated after items changed in sourceController', async () => {
                const options = getBrowserOptions();
                options.parentProperty = 'testParentProperty';
                options.displayProperty = 'title';
                const sourceController = (options.sourceController =
                    new NewSourceController({ ...options }));
                const browser = await getBrowserWithMountCall(options);

                const items = new RecordSet();
                items.setMetaData({
                    path: new RecordSet({
                        rawData: [{ id: 0, title: 'test' }],
                    }),
                });

                sourceController.setItems(items);
                // _contextState, пока нет возможности тестировать вёрстку и то, что прокидывается в вёрстку
                expect(
                    browser._contextState.backButtonCaption === 'test'
                ).toBeTruthy();
            });

            describe('listsOptions', () => {
                it('prefetchProxy source in listsOptions', async () => {
                    const browserOptions = getBrowserOptions();
                    const source = new Memory();
                    const prefetchSource = new PrefetchProxy({
                        target: source,
                        data: {
                            query: new RecordSet({
                                rawData: browserData,
                            }),
                        },
                    });
                    const listsOptions = [
                        {
                            id: 'list',
                            ...browserOptions,
                            source: prefetchSource,
                        },
                    ];
                    const options = {
                        ...browserOptions,
                        listsOptions,
                    };
                    const browser = getBrowser(options);
                    await browser._beforeMount(options, null, [
                        { data: new RecordSet({ rawData: browserData }) },
                    ]);
                    browser.saveOptions(options);
                    await browser._beforeUpdate(options);
                    expect(
                        browser._getSourceController().getState().source ===
                            source
                    ).toBeTruthy();
                });

                it('listsOptions are changed', async () => {
                    const browserOptions = getBrowserOptions();
                    let listsOptions = [
                        {
                            id: 'list',
                            ...browserOptions,
                        },
                    ];
                    let options = {
                        ...browserOptions,
                        listsOptions,
                    };
                    const browser = getBrowser(options);
                    await browser._beforeMount(options, null, [
                        { data: new RecordSet({ rawData: browserData }) },
                    ]);
                    browser.saveOptions(options);

                    const newSource = new Memory();
                    listsOptions = [{ ...listsOptions[0] }];
                    listsOptions[0].id = 'list2';
                    listsOptions[0].source = newSource;
                    options = { ...options };
                    options.listsOptions = listsOptions;

                    await browser._beforeUpdate(options);
                    expect(
                        browser._getSourceController().getState().source ===
                            newSource
                    ).toBeTruthy();
                });

                it('sourceController on listsOptions', async () => {
                    const browserOptions = getBrowserOptions();
                    const sourceController = new NewSourceController({
                        source: browserOptions.source,
                        id: 'list',
                    });
                    const listsOptions = [
                        {
                            id: 'list',
                            ...browserOptions,
                            sourceController,
                        },
                    ];
                    const options = {
                        ...browserOptions,
                        listsOptions,
                    };
                    const browser = getBrowser(options);
                    const browserMountResult = browser._beforeMount(options);
                    browser.saveOptions(options);

                    expect(
                        browser._getSourceController() === sourceController
                    ).toBeTruthy();
                    expect(
                        !(browserMountResult instanceof Promise)
                    ).toBeTruthy();

                    sourceController.setRoot('testRoot');
                    expect(
                        browser._listsOptions[0].root === 'testRoot'
                    ).toBeTruthy();
                });
                it('filterButtonSource in listsOptions', async () => {
                    const browserOptions = getBrowserOptions();
                    const filterButtonSource = [
                        {
                            name: 'filterField',
                            value: '',
                            textValue: '',
                        },
                    ];
                    const listsOptions = [
                        {
                            id: 'list',
                            ...browserOptions,
                            filterButtonSource,
                            filter: {
                                testField: 'testValue',
                            },
                        },
                        {
                            id: 'list1',
                            ...browserOptions,
                            filterButtonSource,
                            filter: {
                                testField1: 'testValue',
                            },
                        },
                    ];
                    const options = {
                        ...browserOptions,
                        listsOptions,
                    };
                    const browser = getBrowser(options);
                    await browser._beforeMount(options);
                    browser.saveOptions(options);
                    await browser._beforeUpdate(options);
                    expect(
                        browser._dataLoader
                            .getFilterController('list')
                            .getFilter()
                    ).toEqual({
                        testField: 'testValue',
                        filterField: '',
                    });

                    filterButtonSource = [...filterButtonSource];
                    filterButtonSource[0] = { ...filterButtonSource[0] };
                    filterButtonSource[0].value = 'newTestValue';
                    browser._filterItemsChanged(null, filterButtonSource);
                    expect(
                        browser._dataLoader
                            .getFilterController('list')
                            .getFilter()
                    ).toEqual({
                        testField: 'testValue',
                        filterField: 'newTestValue',
                    });
                });

                it('root changed with sourceController in listsOptions', async () => {
                    const listsOptions = getListsOptions();
                    let browserOptions = {
                        ...getBrowserOptionsHierarchy(),
                        root: null,
                    };
                    const sourceController = new NewSourceController({
                        source: browserOptions.source,
                    });
                    listsOptions[1].sourceController = sourceController;
                    browserOptions = {
                        ...browserOptions,
                        listsOptions,
                    };

                    const browser = await getBrowserWithMountCall(
                        browserOptions
                    );
                    const notifyStub = jest
                        .spyOn(browser, '_notify')
                        .mockClear()
                        .mockImplementation();
                    sourceController.setRoot('testRoot');
                    expect(notifyStub).toHaveBeenCalledWith('rootChanged', [
                        'testRoot',
                        'list2',
                    ]);
                });

                it('filter changed in listsOptions', async () => {
                    const listsOptions = getListsOptions();
                    let browserOptions = getBrowserOptions();
                    const sourceController1 = new NewSourceController({
                        source: browserOptions.source,
                    });
                    const sourceController2 = new NewSourceController({
                        source: browserOptions.source,
                    });
                    listsOptions[0].sourceController = sourceController1;
                    listsOptions[1].searchParam = '';
                    listsOptions[1].sourceController = sourceController2;
                    browserOptions = {
                        ...browserOptions,
                        listsOptions,
                    };

                    const browser = getBrowser(browserOptions);
                    await browser._beforeMount(browserOptions);
                    browser.saveOptions(browserOptions);

                    browserOptions = clone(browserOptions);
                    browserOptions.listsOptions[0].filter = {
                        testField: 'testValue',
                    };
                    browserOptions.listsOptions[1].filter = {
                        testField1: 'testValue1',
                    };
                    await browser._beforeUpdate(browserOptions);
                    expect(sourceController1.getFilter()).toEqual({
                        testField: 'testValue',
                    });
                    expect(sourceController2.getFilter()).toEqual({
                        testField1: 'testValue1',
                    });
                });
            });
        });

        describe('filterController', () => {
            it('filterButtonSource changed', async () => {
                const browserOptions = getBrowserOptions();
                browserOptions.filterButtonSource = [
                    {
                        name: 'filterField',
                        value: '',
                        textValue: '',
                    },
                ];
                browserOptions.filter = {
                    filterField2: '',
                };
                const browser = getBrowser(browserOptions);
                await browser._beforeMount(browserOptions);
                browser.saveOptions(browserOptions);

                const notifyStub = jest
                    .spyOn(browser, '_notify')
                    .mockClear()
                    .mockImplementation();
                browserOptions = { ...browserOptions };
                browserOptions.filterButtonSource = [
                    {
                        name: 'filterField',
                        value: 'test',
                        textValue: '',
                    },
                ];
                await browser._beforeUpdate(browserOptions);
                expect(notifyStub).toHaveBeenCalledWith('filterChanged', [
                    { filterField: 'test', filterField2: '' },
                    undefined,
                ]);
                expect(browser._filter).toEqual({
                    filterField: 'test',
                    filterField2: '',
                });

                browserOptions = { ...browserOptions };
                browserOptions.filterButtonSource = [
                    {
                        name: 'filterField',
                        value: 'test',
                        textValue: '',
                    },
                    {
                        name: 'filterField2',
                        value: '',
                        resetValue: '',
                        textValue: '',
                    },
                ];
                await browser._beforeUpdate(browserOptions);
                expect(notifyStub).toHaveBeenCalledWith('filterChanged', [
                    { filterField: 'test', filterField2: '' },
                    undefined,
                ]);
                expect(browser._filter).toEqual({
                    filterField: 'test',
                    filterField2: '',
                });
            });

            it('filterController changed', async () => {
                let browserOptions = getBrowserOptions();
                browserOptions.filterButtonSource = [
                    {
                        name: 'filterField1',
                        value: '',
                        textValue: '',
                    },
                ];
                browserOptions.filter = {
                    filterField1: '',
                };
                browserOptions.filterController = new FilterController({
                    ...browserOptions,
                });
                browserOptions.sourceController = new NewSourceController({
                    ...browserOptions,
                });
                const browser = await getBrowserWithMountCall(browserOptions);

                browserOptions = { ...browserOptions };
                browserOptions.filter = {
                    filterField2: '2',
                };
                browserOptions.sourceController.setFilter({
                    filterField2: '2',
                });
                browserOptions.filterButtonSource = [
                    {
                        name: 'filterField2',
                        value: '2',
                        resetValue: '',
                        textValue: '',
                    },
                ];
                browserOptions.filterController = new FilterController({
                    ...browserOptions,
                });
                expect(
                    !(browser._beforeUpdate(browserOptions) instanceof Promise)
                ).toBeTruthy();
            });

            it('filterController items changed', async () => {
                let filterSource = [
                    {
                        name: 'filterField1',
                        value: '',
                        textValue: '',
                    },
                ];
                const browserOptions = getBrowserOptions();
                browserOptions.filterButtonSource = filterSource;
                browserOptions.filter = { filterField1: '' };
                const filterController = new FilterController({
                    ...browserOptions,
                } as IFilterControllerOptions);
                browserOptions.filterController = filterController;
                const browser = await getBrowserWithMountCall(browserOptions);
                const notifyStub = jest
                    .spyOn(browser, '_notify')
                    .mockClear()
                    .mockImplementation();

                filterSource = clone(filterSource);
                filterSource[0].value = 'test';
                filterController.updateFilterItems(filterSource);
                expect(notifyStub).toHaveBeenCalledWith('filterChanged', [
                    { filterField1: 'test', PrefetchSessionId: undefined },
                    undefined,
                ]);
            });
        });

        it('update source', async () => {
            let options = getBrowserOptions();
            const browser = getBrowser();

            await browser._beforeMount(options);

            options = { ...options };
            options.source = new Memory({
                data: browserHierarchyData,
                keyProperty: 'key',
            });

            await browser._beforeUpdate(options);
            expect(
                browser._items.at(0).get('title') === 'Интерфейсный фреймворк'
            ).toBeTruthy();
        });

        it('update source while loading', async () => {
            let options = getBrowserOptions();
            const browser = getBrowser();
            const errorStub = jest
                .spyOn(browser, '_onDataError')
                .mockClear()
                .mockImplementation();

            await browser._beforeMount(options);

            options = { ...options };
            options.source = new Memory({
                data: browserHierarchyData,
                keyProperty: 'key',
            });
            browser._beforeUpdate(options);

            options.source = new Memory({
                data: browserHierarchyData,
                keyProperty: 'key',
            });
            await browser._beforeUpdate(options);

            expect(errorStub).not.toHaveBeenCalled();
        });

        it('source returns error, then _beforeUpdate', async () => {
            let options = getBrowserOptions();
            const browser = getBrowser();

            options.source.query = () => {
                const error = new Error();
                error.processed = true;
                return Promise.reject(error);
            };
            await browser._beforeMount(options);

            function update() {
                browser._beforeUpdate(options);
            }
            options = { ...options };
            expect(update).not.toThrow();
        });

        it('new source in beforeUpdate returns error', async () => {
            let options = getBrowserOptions();
            const browser = getBrowser();

            await browser._beforeMount(options);

            options = { ...options };
            options.source = new Memory();
            options.source.query = () => {
                const error = new Error();
                error.processed = true;
                return Promise.reject(error);
            };
            await browser._beforeUpdate(options);
            expect(browser._errorRegister).toBeTruthy();
        });

        it('beforeUpdate without source', async () => {
            let options = getBrowserOptions();
            const browser = getBrowser();

            await browser._beforeMount(options);
            browser.saveOptions(options);

            options = { ...options };
            options.source = null;
            options.filter = { newFilterField: 'newFilterValue' };

            await browser._beforeUpdate(options);
            expect(browser._filter).toEqual({
                newFilterField: 'newFilterValue',
            });
        });

        it('if searchValue is empty, then the same field i filter must be reset', async () => {
            const browser = getBrowser();
            const filter = {
                payload: 'something',
            };
            let options = {
                ...getBrowserOptions(),
                searchValue: '123',
                filter,
            };
            await browser._beforeMount(options);
            browser.saveOptions(options);

            const sourceController = browser._getSourceController();
            sourceController.setFilter({ ...filter, name: 'test123' });
            const filterChangedStub = jest
                .spyOn(browser, '_filterChanged')
                .mockClear()
                .mockImplementation();

            options = { ...options };
            options.searchValue = '';

            await browser._beforeUpdate(options);
            expect(filterChangedStub).toHaveBeenCalledWith(null, {
                payload: 'something',
            });
        });

        it('update viewMode', async () => {
            let options = getBrowserOptions();
            const browser = getBrowser();

            options.viewMode = 'table';
            await browser._beforeMount(options);
            browser.saveOptions(options);

            expect(browser._viewMode).toEqual('table');

            options = { ...options, viewMode: 'tile' };
            browser._beforeUpdate(options);

            expect(browser._viewMode).toEqual('tile');
        });

        it('update expanded items in context', async () => {
            const options = getBrowserOptions();
            const browser = getBrowser(options);
            await browser._beforeMount(options);
            browser._beforeUpdate({ ...options, expandedItems: [1] });
            expect(browser._contextState.expandedItems).toEqual([1]);
        });

        it('items in sourceController are changed', async () => {
            const options = getBrowserOptions();
            const browser = getBrowser(options);
            await browser._beforeMount(options);
            browser.saveOptions(options);

            const items = new RecordSet();
            browser._getSourceController().setItems(null);
            browser._getSourceController().setItems(items);

            browser._beforeUpdate(options);
            expect(browser._items === items).toBeTruthy();
        });

        it('items in sourceController are changed', async () => {
            const options = getBrowserOptions();
            const browser = getBrowser(options);
            await browser._beforeMount(options);
            browser.saveOptions(options);

            const items = new RecordSet();
            browser._getSourceController().setItems(null);
            browser._getSourceController().setItems(items);

            browser._beforeUpdate(options);
            expect(browser._items === items).toBeTruthy();
        });

        it('update with listConfigStoreId in options', async () => {
            let options = getBrowserOptions();
            options.listConfigStoreId = 'testStorageId';
            const browser = getBrowser(options);
            await browser._beforeMount(options);
            browser.saveOptions(options);

            options = { ...options };
            options.selectedKeys = ['testId'];
            options.excludedKeys = ['testId'];
            options.searchValue = 'testSearchValue';
            const updatePromise = browser._beforeUpdate(options);
            browser.saveOptions(options);
            await updatePromise;

            expect(getControllerState('testStorageId')).toEqual({
                selectedKeys: ['testId'],
                excludedKeys: ['testId'],
                searchValue: 'testSearchValue',
                expandedItems: [],
            });
        });

        it('update root with sourceController in options', async () => {
            const sourceController = new NewSourceController(
                getBrowserOptions()
            );
            let options = { ...getBrowserOptions(), sourceController };
            const browser = await getBrowserWithMountCall(options);
            const notifyStub = jest
                .spyOn(browser, '_notify')
                .mockClear()
                .mockImplementation();

            options = { ...options };
            options.root = 'newRoow';
            await browser._beforeUpdate(options);
            expect(notifyStub).not.toHaveBeenCalled();

            sourceController.setRoot('nextRoot');
            expect(notifyStub).toHaveBeenCalledTimes(1);
        });
    });

    describe('_updateSearchController', () => {
        it('filter changed if search was reset', async () => {
            const options = {
                ...getBrowserOptions(),
                searchValue: 'testSearchValue',
                filter: {
                    payload: 'something',
                },
            };
            const sourceController = new NewSourceController(options);
            let browserOptions = {
                ...options,
                sourceController,
            };
            const browser = getBrowser(browserOptions);
            await browser._beforeMount(browserOptions);
            browser.saveOptions(browserOptions);

            let filter;
            browser._notify = (event, args) => {
                if (event === 'filterChanged') {
                    filter = args[0];
                }
            };
            browserOptions = { ...options };
            browserOptions.searchValue = '';
            await browser._updateSearchController(browserOptions);

            expect(filter).toEqual({ payload: 'something' });
            expect(browser._searchValue).toEqual('');
        });
    });

    describe('_update', () => {
        it('update without source in options', async () => {
            const options = getBrowserOptions();
            const browser = getBrowser(options);
            await browser._beforeMount(options);
            browser.saveOptions(options);
            const notifyStub = jest
                .spyOn(browser, '_reload')
                .mockClear()
                .mockImplementation();
            const newOptions = { ...options };
            newOptions.searchParam = 'param';
            await browser._update(options, newOptions);

            expect(notifyStub).not.toHaveBeenCalledWith('filterChanged', [
                { payload: 'something' },
            ]);
        });
    });

    describe('_dataLoadCallback', () => {
        it('check direction', async () => {
            let actualDirection = null;
            const options = getBrowserOptions();
            options.dataLoadCallback = (items, direction) => {
                actualDirection = direction;
            };
            const browser = getBrowser(options);
            await browser._beforeMount(options);
            browser.saveOptions(options);
            browser._dataLoadCallback(null, 'down');
            expect(actualDirection).toEqual('down');
        });

        it('search view mode changed on dataLoadCallback', async () => {
            let options = getBrowserOptions();
            options.searchValue = 'Sash';
            const browser = await getBrowserWithMountCall(options);

            expect(browser._viewMode === 'search').toBeTruthy();
            expect(browser._searchValue === 'Sash').toBeTruthy();

            options = { ...options };
            options.searchValue = '';
            await browser._beforeUpdate(options);
            expect(browser._searchValue === '').toBeTruthy();
            expect(
                browser._getSearchControllerSync().getViewMode()
            ).not.toBeDefined();
            expect(browser._misspellValue === '').toBeTruthy();
        });

        it('misspellValue after search', async () => {
            let options = getBrowserOptions();
            const searchQueryMock = () => {
                const dataSet = new DataSet({
                    rawData: {
                        meta: {
                            returnSwitched: true,
                            switchedStr: 'Саша',
                        },
                    },
                    metaProperty: 'meta',
                });
                return Promise.resolve(dataSet);
            };
            const browser = new Browser();
            await browser._beforeMount(options);
            browser.saveOptions(options);

            options = { ...options };
            options.searchValue = 'Cfif';
            options.source.query = searchQueryMock;
            await browser._beforeUpdate(options);
            expect(browser._misspellValue === 'Саша').toBeTruthy();
            expect(browser._returnedOnlyByMisspellValue).toBeTruthy();
            expect(browser._searchValue === 'Cfif').toBeTruthy();
        });

        it('misspellValue after load to direction', async () => {
            let options = getBrowserOptions();
            const searchQueryMock = () => {
                const dataSet = new DataSet({
                    rawData: {
                        meta: {
                            returnSwitched: true,
                            switchedStr: 'Саша',
                        },
                    },
                    metaProperty: 'meta',
                });
                return Promise.resolve(dataSet);
            };
            const browser = new Browser();
            await browser._beforeMount(options);
            browser.saveOptions(options);

            options = { ...options };
            options.searchValue = 'Cfif';
            const originQuery = options.source.query;
            options.source.query = searchQueryMock;
            await browser._beforeUpdate(options);
            expect(browser._misspellValue === 'Саша').toBeTruthy();

            options.source.query = originQuery;
            await browser._getSourceController().load('down');
            expect(browser._misspellValue === 'Саша').toBeTruthy();
        });

        it('path is updated in searchController after load', async () => {
            const options = getBrowserOptions();
            const path = new RecordSet({
                rawData: [{ id: 1, title: 'folder' }],
            });
            options.source.query = () => {
                const recordSet = new RecordSet();
                recordSet.setMetaData({ path });
                return Promise.resolve(recordSet);
            };
            const browser = await getBrowserWithMountCall(options);
            await browser._getSearchController();
            await browser._reload(options);
            expect(
                browser._getSearchControllerSync()._path === path
            ).toBeTruthy();
        });

        it('dataLoadCallback in listsOptions', async () => {
            const browserOptions = getBrowserOptions();
            let listDataLoadCallbackCalled = false;
            let list2DataLoadCallbackCalled = false;
            const listsOptions = [
                {
                    id: 'list',
                    ...browserOptions,
                },
                {
                    id: 'list2',
                    ...browserOptions,
                },
            ];
            const options = {
                ...browserOptions,
                listsOptions,
                dataLoadCallback: (items, direction, id) => {
                    if (id === 'list') {
                        listDataLoadCallbackCalled = true;
                    }
                    if (id === 'list2') {
                        list2DataLoadCallbackCalled = true;
                    }
                },
            };
            const browser = new Browser();
            browser.saveOptions(options);
            await browser._beforeMount(options);
            expect(listDataLoadCallbackCalled).toBeTruthy();
            expect(list2DataLoadCallbackCalled).toBeTruthy();
        });
    });

    describe('_handleItemOpen', () => {
        it('root is changed synchronously', async () => {
            const options = getBrowserOptions();
            const browser = getBrowser(options);
            await browser._beforeMount(options);
            browser.saveOptions(options);
            await browser._getSearchController();

            browser._handleItemOpen('test123', undefined);

            expect(browser._root).toEqual('test123');
            expect(browser._getSearchControllerSync()._root).toEqual('test123');
            expect(browser._getSourceController().getRoot()).toEqual(null);

            await browser._beforeUpdate(options);
            expect(browser._getSourceController().getRoot()).toEqual('test123');
        });

        it('root changed, browser is in search mode', async () => {
            const options = getBrowserOptions();
            options.parentProperty = 'parentProperty';
            const browser = getBrowser(options);
            await browser._beforeMount(options);
            browser.saveOptions(options);
            await browser._search(null, 'testSearchValue');

            browser._handleItemOpen('testRoot', undefined);
            expect(!browser._inputSearchValue).toBeTruthy();
            expect(browser._root).toEqual('testRoot');
            expect(browser._filter).toEqual({});
        });

        it('root changed, saved root in searchController is reseted', async () => {
            let options = getBrowserOptions();
            options.parentProperty = 'parentProperty';
            options.root = 'rootBeforeSearch';
            const browser = getBrowser(options);
            await browser._beforeMount(options);
            browser.saveOptions(options);
            await browser._search(null, 'testSearchValue');
            browser._handleItemOpen('testRoot', undefined);
            options = { ...options };
            options.root = 'testRoot';
            await browser._beforeUpdate(options);
            expect(browser._root).toEqual('testRoot');
        });

        it('root is changed, shearchController is not created', async () => {
            const options = getBrowserOptions();
            const browser = getBrowser(options);
            await browser._beforeMount(options);
            browser.saveOptions(options);
            browser._handleItemOpen('test123', undefined, 'test123');

            expect(browser._root).toEqual('test123');
        });

        it('root is in options', async () => {
            const options = { ...getBrowserOptions(), root: 'testRoot' };
            const browser = getBrowser(options);
            await browser._beforeMount(options);
            browser.saveOptions(options);
            await browser._getSearchController();
            browser._handleItemOpen('test123', undefined, 'test123');

            expect(browser._root).toEqual('testRoot');
        });
    });

    describe('_afterSearch', () => {
        it('filter updated', async () => {
            const filter = {
                title: 'test',
            };
            const resultFilter = {
                title: 'test',
                testSearchParam: 'test',
            };
            const options = {
                ...getBrowserOptions(),
                searchParam: 'testSearchParam',
                searchValue: 'testSearchValue',
                filter,
            };
            const browser = getBrowser(options);
            await browser._beforeMount(options);
            browser.saveOptions(options);
            await browser._search(null, 'test');

            expect(browser._filter).toEqual(resultFilter);
            expect(browser._contextState.filter).toEqual(resultFilter);
        });
    });

    it('resetPrefetch', async () => {
        const filter = {
            testField: 'testValue',
            PrefetchSessionId: 'test',
        };
        await import('Controls/filter');
        let options = {
            ...getBrowserOptions(),
            filter,
            prefetchParams: { PrefetchMethod: 'test' },
        };
        const browser = getBrowser(options);
        await browser._beforeMount(options);
        browser.saveOptions(options);

        options = { ...options };
        options.source = new Memory();
        const loadPromise = browser._beforeUpdate(options);

        browser.resetPrefetch();
        expect(!!browser._filter.PrefetchSessionId).toBeTruthy();

        await loadPromise;
        browser.resetPrefetch();
        expect(!browser._filter.PrefetchSessionId).toBeTruthy();
    });

    it('filterItemsChanged', async () => {
        const options = { ...getBrowserOptions() };
        const filter = {};
        options.filter = filter;
        options.filterButtonSource = [
            {
                name: 'filterField',
                value: '',
                resetValue: '',
                textValue: '',
            },
        ];
        const browser = await getBrowserWithMountCall(options);

        browser._filterItemsChanged(null, [
            {
                name: 'filterField',
                value: '123',
                resetValue: '',
                textValue: '',
            },
        ]);
        expect(options.filter === filter).toBeTruthy();
        expect(browser._filter).toEqual({ filterField: '123' });
    });
});
