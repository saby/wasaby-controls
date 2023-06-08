import { ControllerClass } from 'Controls/search';
import {
    NewSourceController,
    NewSourceController as SourceController,
} from 'Controls/dataSource';
import { Memory, QueryWhereExpression } from 'Types/source';
import { IControllerOptions } from 'Controls/_dataSource/Controller';
import { RecordSet } from 'Types/collection';
import { ISearchControllerOptions } from 'Controls/_search/ControllerClass';

const getMemorySource = (): Memory => {
    return new Memory({
        data: [
            {
                id: 0,
                title: 'test',
            },
            {
                id: 1,
                title: 'test1',
            },
            {
                id: 2,
                title: 'test',
            },
            {
                id: 3,
                title: 'test2',
            },
        ],
    });
};

const getSourceController = (options?: Partial<IControllerOptions>) => {
    return new SourceController({
        dataLoadErrback: () => {
            return null;
        },
        parentProperty: null,
        root: null,
        sorting: [],
        filter: {
            payload: 'something',
        },
        keyProperty: 'id',
        source: getMemorySource(),
        navigation: {
            source: 'page',
            sourceConfig: {
                pageSize: 2,
                page: 0,
                hasMore: false,
            },
        },
        ...options,
    });
};

const getSearchControllerClassOptions = (options = {}) => {
    const defaultOptions = {
        minSearchLength: 3,
        searchDelay: 50,
        searchParam: 'testParam',
        searchValue: '',
        searchValueTrim: false,
        sourceController: getSourceController(options),
    };
    return {
        ...defaultOptions,
        ...options,
    };
};

const getSearchController = (options?) => {
    return new ControllerClass(getSearchControllerClassOptions(options));
};

describe('Controls/search:ControllerClass', () => {
    let sourceController: SourceController;
    let controllerClass: ControllerClass;
    let loadSpy;

    beforeEach(() => {
        sourceController = getSourceController({});
        controllerClass = getSearchController({
            sourceController,
        });
        loadSpy = jest.spyOn(sourceController, 'load').mockClear();
    });

    it('searchValue in constructor', () => {
        let options;
        let searchControllerClass;

        options = {
            searchValue: 'testSearchValue',
        };
        searchControllerClass = new ControllerClass(options);
        expect(
            searchControllerClass.getSearchValue() === 'testSearchValue'
        ).toBeTruthy();

        options = {};
        searchControllerClass = new ControllerClass(options);
        expect(searchControllerClass.getSearchValue() === '').toBeTruthy();
    });

    it('search method', () => {
        const filter: QueryWhereExpression<unknown> = {
            testParam: 'testValue',
            payload: 'something',
        };
        controllerClass.search('testValue');

        expect(loadSpy).toHaveBeenCalledWith(undefined, undefined, filter);
    });

    it('load canceled while searching', async () => {
        const filter = sourceController.getFilter();
        const prom = expect(
            controllerClass.search('testValue')
        ).rejects.toThrow('Unknown reason');
        sourceController.cancelLoading();

        expect(filter).toEqual(sourceController.getFilter());
        await prom;
    });

    it('getFilter', () => {
        const resultFilter = {
            testParam: 'testSearchValue',
            payload: 'something',
        };
        controllerClass._searchValue = 'testSearchValue';
        expect(controllerClass.getFilter()).toEqual(resultFilter);
    });

    it('needChangeSearchValueToSwitchedString', () => {
        const rs = new RecordSet();
        rs.setMetaData({
            returnSwitched: true,
        });
        expect(
            controllerClass.needChangeSearchValueToSwitchedString(rs)
        ).toBeTruthy();
    });

    it('search with searchStartCallback', async () => {
        sourceController = getSourceController({
            source: new Memory(),
        });
        let searchStarted = false;
        const searchController = getSearchController({
            sourceController,
            searchStartCallback: () => {
                searchStarted = true;
            },
        });
        await searchController.search('testSearchValue');
        expect(searchStarted).toBeTruthy();
    });

    describe('with hierarchy', () => {
        it('default search case and reset', async () => {
            const filter: QueryWhereExpression<unknown> = {
                testParam: 'testValue',
                testParent: 'testRoot',
                payload: 'something',
                Разворот: 'С разворотом',
                usePages: 'full',
            };
            controllerClass._options.parentProperty = 'testParent';
            controllerClass._root = 'testRoot';
            controllerClass._options.startingWith = 'current';

            await controllerClass.search('testValue');

            expect(loadSpy).toHaveBeenCalledWith(undefined, undefined, filter);
            loadSpy.mockClear();

            await controllerClass.reset();
            expect(loadSpy).toHaveBeenCalledWith(undefined, undefined, {
                payload: 'something',
            });
        });

        it('filter with "Разворот"', async () => {
            sourceController = getSourceController();
            const searchController = getSearchController({
                parentProperty: 'Раздел',
                sourceController,
            });

            sourceController.setFilter({
                Разворот: 'С разворотом',
            });

            await searchController.search('testSearchValue');
            expect(searchController.getFilter().Разворот).toBeTruthy();

            let filter = searchController.reset(true);
            expect(filter.Разворот).toBeTruthy();
            expect(filter.usePages).toBeTruthy();

            sourceController.setFilter({
                Разворот: 'Без разворота',
            });

            await searchController.search('testSearchValue');
            filter = searchController.reset(true);
            expect(!filter.usePages).toBeTruthy();
        });

        describe('startingWith: root', () => {
            function getHierarchyOptions(): Partial<ISearchControllerOptions> {
                return {
                    parentProperty: 'parentProperty',
                    root: 'testRoot',
                    startingWith: 'root',
                };
            }

            function getPath(): RecordSet {
                return new RecordSet({
                    rawData: [
                        {
                            id: 0,
                            parentProperty: null,
                        },
                        {
                            id: 1,
                            parentProperty: 0,
                        },
                    ],
                });
            }

            it('root before search should saved after reset search', async () => {
                sourceController = getSourceController(getHierarchyOptions());
                const searchControllerOptions = {
                    sourceController,
                    ...getHierarchyOptions(),
                };
                const searchController = getSearchController(
                    searchControllerOptions
                );
                searchController.setPath(getPath());
                await searchController.search('testSearchValue');
                expect(sourceController.getRoot() === null).toBeTruthy();
                expect(searchController.getRoot() === null).toBeTruthy();
                expect(
                    sourceController.getFilter().parentProperty === null
                ).toBeTruthy();

                searchController.reset(true);
                expect(searchController.getRoot() === 'testRoot').toBeTruthy();
            });

            it('update root while searching', async () => {
                sourceController = getSourceController(getHierarchyOptions());
                let searchControllerOptions = {
                    sourceController,
                    ...getHierarchyOptions(),
                };
                const searchController = getSearchController(
                    searchControllerOptions
                );
                searchController.setPath(getPath());
                await searchController.search('testSearchValue');
                searchControllerOptions = { ...searchControllerOptions };
                searchControllerOptions.root = 'myRoot';
                searchController.update(searchControllerOptions);
                searchController.reset(true);
                expect(searchController.getRoot() === 'myRoot').toBeTruthy();
            });

            it('update filter while searching', async () => {
                sourceController = getSourceController(getHierarchyOptions());
                let searchControllerOptions = {
                    sourceController,
                    ...getHierarchyOptions(),
                };
                const searchController = getSearchController(
                    searchControllerOptions
                );
                searchController.setPath(getPath());
                await searchController.search('testSearchValue');
                searchControllerOptions = { ...searchControllerOptions };
                searchControllerOptions.root = 'myRoot';
                searchControllerOptions.filter = {
                    testField: 'testValue',
                };
                searchController.update(searchControllerOptions);
                searchController.reset(true);
                expect(searchController.getRoot() === 'myRoot').toBeTruthy();
            });

            it('update with same root while searching', async () => {
                sourceController = getSourceController(getHierarchyOptions());
                let searchControllerOptions = {
                    sourceController,
                    ...getHierarchyOptions(),
                };
                const searchController = getSearchController(
                    searchControllerOptions
                );
                searchController.setPath(getPath());
                await searchController.search('testSearchValue');
                searchControllerOptions = { ...searchControllerOptions };
                searchControllerOptions.root = null;
                searchController.update(searchControllerOptions);
                searchController.reset(true);
                expect(searchController.getRoot() === 'testRoot').toBeTruthy();
            });
        });

        it('without parent property', async () => {
            const filter: QueryWhereExpression<unknown> = {
                testParam: 'testValue',
                payload: 'something',
            };
            controllerClass._root = 'testRoot';
            controllerClass._options.startingWith = 'current';

            await controllerClass.search('testValue');

            expect(loadSpy).toHaveBeenCalledWith(undefined, undefined, filter);
            loadSpy.mockClear();

            await controllerClass.reset();
            expect(loadSpy).toHaveBeenCalledWith(undefined, undefined, {
                payload: 'something',
            });
        });

        it('getFilter', () => {
            const resultFilter = {
                testParam: 'testSearchValue',
                Разворот: 'С разворотом',
                usePages: 'full',
                payload: 'something',
                testParentProeprty: 'testRoot',
            };
            controllerClass._root = 'testRoot';
            controllerClass._searchValue = 'testSearchValue';
            controllerClass._options.parentProperty = 'testParentProeprty';
            expect(controllerClass.getFilter()).toEqual(resultFilter);
        });
    });

    it('search and reset', async () => {
        const filter: QueryWhereExpression<unknown> = {
            testParam: 'testValue',
            payload: 'something',
        };
        await controllerClass.search('testValue');

        expect(loadSpy).toHaveBeenCalledWith(undefined, undefined, filter);

        await controllerClass.reset();

        expect(loadSpy).toHaveBeenCalledWith(undefined, undefined, {
            payload: 'something',
        });
    });

    it('search and update', async () => {
        const filter: QueryWhereExpression<unknown> = {
            testParam: 'testValue',
            payload: 'something',
        };
        const updatedFilter: QueryWhereExpression<unknown> = {
            testParam: 'updatedValue',
            payload: 'something',
        };
        await controllerClass.search('testValue');

        expect(loadSpy).toHaveBeenCalledWith(undefined, undefined, filter);

        controllerClass.update({
            searchValue: 'updatedValue',
            root: 'newRoot',
        });

        expect(controllerClass._root).toEqual('newRoot');
    });

    it('double search call', () => {
        const searchPromise = controllerClass.search('testValue');
        expect(searchPromise).toEqual(controllerClass.search('testValue'));
    });

    describe('update', () => {
        it("shouldn't call when searchValue is null", () => {
            const searchStub = jest
                .spyOn(controllerClass, 'search')
                .mockClear()
                .mockImplementation();
            const resetStub = jest
                .spyOn(controllerClass, 'reset')
                .mockClear()
                .mockImplementation();

            controllerClass._options.searchValue = null;
            controllerClass._searchValue = null;

            controllerClass.update({
                searchValue: null,
            });

            expect(searchStub).not.toHaveBeenCalled();
            expect(resetStub).not.toHaveBeenCalled();
        });

        it("shouldn't call when searchValue is not in options object", () => {
            const searchStub = jest
                .spyOn(controllerClass, 'search')
                .mockClear()
                .mockImplementation();
            const resetStub = jest
                .spyOn(controllerClass, 'reset')
                .mockClear()
                .mockImplementation();

            controllerClass._options.searchValue = null;

            controllerClass.update({});

            expect(searchStub).not.toHaveBeenCalled();
            expect(resetStub).not.toHaveBeenCalled();
        });

        it('should call reset when new sourceController in options', async () => {
            let searchControllerOptions = getSearchControllerClassOptions();
            const searchController = getSearchController(
                searchControllerOptions
            );

            searchControllerOptions = { ...searchControllerOptions };
            searchControllerOptions.searchValue = 'test';
            expect(searchController.update(searchControllerOptions)).toBe(true);
            await searchController.search('test');

            searchControllerOptions = { ...searchControllerOptions };
            searchControllerOptions.sourceController = getSourceController({
                source: new Memory(),
            });
            expect(searchController.update(searchControllerOptions)).toBe(true);

            searchControllerOptions = { ...searchControllerOptions };
            searchControllerOptions.searchValue = '';
            expect(searchController.update(searchControllerOptions)).toBe(true);
        });

        it('should call when searchValue not equal options.searchValue', () => {
            controllerClass._options.searchValue = '';
            controllerClass._searchValue = 'searchValue';

            expect(
                controllerClass.update({
                    searchValue: '',
                })
            ).toBe(true);
        });

        it('update with same value after search', async () => {
            await controllerClass.search('testSearchValue');

            const updateResult = controllerClass.update({
                searchValue: 'testSearchValue',
            });

            expect(!(updateResult instanceof Promise)).toBeTruthy();
        });

        it('update with sourceController', async () => {
            let sourceController = getSourceController();
            let searchControllerOptions = getSearchControllerClassOptions();
            const searchController = getSearchController(
                searchControllerOptions
            );

            searchControllerOptions = {
                ...searchControllerOptions,
                sourceController,
            };
            expect(
                !searchController.update(searchControllerOptions)
            ).toBeTruthy();

            await searchController.search('test');
            sourceController = getSourceController();
            searchControllerOptions = {
                ...searchControllerOptions,
                sourceController,
            };
            expect(
                searchController.update(searchControllerOptions)
            ).toBeTruthy();
        });
    });

    it('search with filterOnSearchCallback option', async () => {
        const filter = {};
        const source = getMemorySource();
        const navigation = {
            source: 'page',
            sourceConfig: {
                pageSize: 2,
                page: 0,
                hasMore: false,
            },
        };
        const sourceController = new NewSourceController({
            source,
            navigation,
        });
        let filterOnItemsChanged;
        await sourceController.reload();
        sourceController.getItems().subscribe('onCollectionChange', () => {
            filterOnItemsChanged = sourceController.getFilter();
        });
        const searchControllerOptions = {
            filterOnSearchCallback: (searchValue, item) => {
                return item.get('title') === 'test';
            },
            filter,
            sourceController,
            source,
            navigation,
            searchParam: 'title',
        };
        const searchController = getSearchController(searchControllerOptions);
        const searchPromise = searchController.search('test');

        expect(filterOnItemsChanged.title).toBeTruthy();
        expect(sourceController.getItems().getCount() === 1).toBeTruthy();
        expect(
            sourceController.getItems().at(0).get('title') === 'test'
        ).toBeTruthy();

        await searchPromise;
        expect(sourceController.getItems().getCount() === 2).toBeTruthy();
    });

    describe('search', () => {
        it('search returns error', async () => {
            const source = new Memory();
            source.query = () => {
                return Promise.reject();
            };
            sourceController = getSourceController({
                source,
            });
            const searchController = getSearchController({ sourceController });
            await searchController.search('testSearchValue').catch(jest.fn());
            expect(sourceController.getFilter()).toEqual({
                payload: 'something',
                testParam: 'testSearchValue',
            });
        });

        it('search without root', async () => {
            const sourceController = getSourceController({
                source: new Memory(),
            });
            const searchController = getSearchController({ sourceController });
            await searchController.search('testSearchValue');
            expect(sourceController.getRoot() === null).toBeTruthy();
        });

        it('search with root and startingWith: "root"', async () => {
            const hierarchyOptions = {
                parentProperty: 'parentProperty',
                root: 'testRoot',
                startingWith: 'root',
            };
            sourceController = getSourceController({
                source: new Memory(),
                ...hierarchyOptions,
            });
            const searchController = getSearchController({
                sourceController,
                ...hierarchyOptions,
            });
            searchController.setPath(
                new RecordSet({
                    rawData: [
                        {
                            id: 'testId',
                            parentProperty: 'testParent',
                        },
                    ],
                })
            );
            await searchController.search('testSearchValue');
            expect(
                sourceController.getFilter().searchStartedFromRoot ===
                    'testRoot'
            ).toBeTruthy();
        });

        it('search with expandedItems', async () => {
            sourceController = getSourceController({
                source: new Memory(),
                expandedItems: ['test'],
            });
            let searchController = getSearchController({ sourceController });
            await searchController.search('testSearchValue');
            expect(sourceController.getExpandedItems()).toEqual([]);

            sourceController = getSourceController({
                source: new Memory(),
                expandedItems: [null],
            });
            searchController = getSearchController({ sourceController });
            await searchController.search('testSearchValue');
            expect(sourceController.getExpandedItems()).toEqual([null]);
        });

        it('inputSearchValue changed while search is in process', async () => {
            sourceController = getSourceController();
            const searchController = getSearchController({ sourceController });
            const searchPromise = searchController.search('testSearchValue');
            searchController.setInputSearchValue('newInputSearchValue');

            return searchPromise.catch((error) => {
                expect(error.isCanceled).toBeTruthy();
            });
        });

        it('search executed while another search in progress', async () => {
            sourceController = getSourceController();
            const searchController = getSearchController({ sourceController });
            let isSearchInProgress;
            const expectProm = expect(
                searchController.search('testSearchValue').finally(() => {
                    isSearchInProgress = searchController.isSearchInProcess();
                })
            ).rejects.toThrow('Unknown reason');
            isSearchInProgress = searchController.isSearchInProcess();

            await searchController.search('testSearchValue1');
            expect(isSearchInProgress).toBeTruthy();
            await expectProm;
        });

        it('search with searchValueTrim option', async () => {
            const searchController = getSearchController({
                sourceController: getSourceController({ filter: {} }),
                searchValueTrim: true,
                searchParam: 'title',
            });

            let searchResult = await searchController.search('   test    ');
            expect((searchResult as RecordSet).getCount() === 2).toBeTruthy();

            await searchController.reset();
            searchResult = await searchController.search('     ');
            expect(searchResult === null).toBeTruthy();
        });

        it('search with new sourceController', async () => {
            let sourceController = getSourceController({ filter: {} });
            let searchControllerOptions = getSearchControllerClassOptions({
                sourceController,
                searchValueTrim: true,
                searchParam: 'title',
            });
            const searchController = getSearchController(
                searchControllerOptions
            );

            await searchController.search('test');
            expect(sourceController.getFilter().title === 'test').toBeTruthy();

            searchControllerOptions = { ...searchControllerOptions };
            sourceController = getSourceController({ filter: {} });
            searchControllerOptions.sourceController = sourceController;
            searchController.update(searchControllerOptions);
            await searchController.search('test2');
            expect(sourceController.getFilter().title === 'test2').toBeTruthy();
        });
    });
});
