import {
    ControllerClass,
    Prefetch,
    IFilterControllerOptions,
} from 'Controls/filter';
import { SbisService, Memory } from 'Types/source';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { object } from 'Types/util';

function getFilterButtonItems(): any[] {
    return [
        {
            id: 'testId1',
            value: '',
            textValue: '',
        },
        {
            id: 'testId2',
            value: '',
            textValue: '',
        },
    ];
}

describe('Controls/filter:ControllerClass', () => {
    describe('constructor', () => {
        it('init filter with prefetchParams', () => {
            const filterController = new ControllerClass({
                filter: { test: '123' },
                prefetchParams: { PrefetchMethod: 'test' },
            });
            expect(filterController._$filter).toEqual({
                test: '123',
                PrefetchMethod: 'test',
            });
        });

        it('init filter with filterChangedCallback in filterItem', () => {
            let filterChangedCallbackCalled = false;
            const filterChangedCallback = () => {
                filterChangedCallbackCalled = true;
            };
            let controller = new ControllerClass({
                filterButtonSource: [
                    {
                        name: 'testId1',
                        value: 'testValue',
                        textValue: '',
                        resetValue: '',
                        filterChangedCallback,
                    },
                ],
            });
            expect(filterChangedCallbackCalled).toBeTruthy();
            expect({ testId1: 'testValue' }).toEqual(controller.getFilter());

            controller = new ControllerClass({
                filterButtonSource: [
                    {
                        name: 'testId1',
                        value: '',
                        textValue: '',
                        resetValue: '',
                        filterChangedCallback,
                    },
                ],
            });
            filterChangedCallbackCalled = false;
            expect(!filterChangedCallbackCalled).toBeTruthy();
        });
    });

    it('loadFilterItemsFromHistory', async () => {
        const filterButtonItems = getFilterButtonItems();
        let filterChangedCallbackCalled = false;
        const filterChangedCallback = (
            filterDescriptionItem,
            filter,
            changedFilters
        ) => {
            filterChangedCallbackCalled = true;
        };
        filterButtonItems[1].filterChangedCallback = filterChangedCallback;
        const filterController = new ControllerClass({
            filterButtonSource: filterButtonItems,
            historyId: 'hId',
        });
        const historyItems = [
            {
                id: 'testId1',
                value: '',
                textValue: '',
            },
            {
                id: 'testId2',
                value: 'testValue',
                textValue: 'textValue4',
            },
        ];
        jest.spyOn(filterController, '_loadHistoryItems')
            .mockClear()
            .mockImplementation(() => {
                return Promise.resolve(historyItems);
            });

        await filterController.loadFilterItemsFromHistory();
        expect(filterController.getFilterButtonItems()).toEqual([
            {
                id: 'testId1',
                value: '',
                textValue: '',
            },
            {
                id: 'testId2',
                value: 'testValue',
                textValue: 'textValue4',
                filterChangedCallback,
            },
        ]);
        expect(filterChangedCallbackCalled).toBeTruthy();
    });

    it('loadFilterItemsFromHistory with prefetch', () => {
        const historyItems = [
            {
                name: 'testId1',
                value: '',
                textValue: '',
                resetValue: '',
            },
            {
                name: 'testId2',
                value: 'testValue',
                textValue: 'textValue4',
                resetValue: '',
            },
        ];
        let itemsLoaded = false;
        const filterController = new ControllerClass({
            filterButtonSource: getFilterButtonItems(),
            searchParam: 'test',
            filter: {},
            searchValue: '',
            minSearchLength: 1,
            parentProperty: '',
            historyId: 'hId2',
            historyItems,
            prefetchParams: { PrefetchMethod: 'test' },
        });
        jest.spyOn(filterController, '_loadHistoryItems')
            .mockClear()
            .mockImplementation(() => {
                itemsLoaded = true;
                return Promise.resolve();
            });
        jest.spyOn(filterController, '_findItemInHistory')
            .mockClear()
            .mockImplementation(() => {
                return null;
            });
        return filterController.loadFilterItemsFromHistory().then(() => {
            expect(itemsLoaded).toBe(true);
        });
    });

    it('handleDataLoad', () => {
        const controller = new ControllerClass({
            filter: {},
            historyId: 'TEST_HISTORY_ID',
        });
        controller._isFilterChanged = true;

        const addToHistoryStub = jest
            .spyOn(controller, '_addToHistory')
            .mockClear()
            .mockImplementation();
        jest.spyOn(controller, '_deleteCurrentFilterFromHistory')
            .mockClear()
            .mockImplementation();
        jest.spyOn(Prefetch, 'getPrefetchParamsForSave')
            .mockClear()
            .mockImplementation();
        jest.spyOn(Prefetch, 'applyPrefetchFromItems')
            .mockClear()
            .mockImplementation();

        controller.handleDataLoad();
        expect(controller._isFilterChanged).toBe(false);
        expect(addToHistoryStub).toHaveBeenCalledTimes(1);
    });

    it('handleDataLoad with prefetchSessionId in items', () => {
        const controller = new ControllerClass({
            filter: {},
            historyId: 'TEST_HISTORY_ID',
        });
        const items = new RecordSet();
        items.setMetaData({
            results: new Model({
                rawData: {
                    PrefetchSessionId: 'testId',
                },
            }),
        });
        jest.spyOn(controller, '_deleteCurrentFilterFromHistory')
            .mockClear()
            .mockImplementation();
        jest.spyOn(Prefetch, 'getPrefetchParamsForSave')
            .mockClear()
            .mockImplementation();
        jest.spyOn(controller, '_addToHistory')
            .mockClear()
            .mockImplementation();

        controller.handleDataLoad(items);
        expect(
            controller.getFilter().PrefetchSessionId === 'testId'
        ).toBeTruthy();
    });

    it('handleDataError', () => {
        const controller = new ControllerClass({
            filter: {},
            historyId: 'TEST_HISTORY_ID',
        });
        controller._isFilterChanged = true;

        const historyItems = {
            data: {
                items: [],
                prefetchParams: {
                    PrefetchSessionId: 'test',
                },
            },
        };

        jest.spyOn(controller, '_getHistoryByItems')
            .mockClear()
            .mockImplementation(() => {
                return historyItems;
            });

        controller.handleDataError();
        expect(controller._$filter).toEqual({ PrefetchSessionId: 'test' });
    });

    it('resetPrefetch', () => {
        const controller = new ControllerClass({
            filter: {
                testField: 'testValue',
                PrefetchSessionId: 'test',
            },
        });

        controller.resetPrefetch();
        expect(controller._$filter).toEqual({ testField: 'testValue' });
    });

    it('updateFilterItems with filterChangedCallback', () => {
        const filterButtonItems = getFilterButtonItems();
        const filterChangedCallback = (
            filterDescriptionItem,
            filter,
            changedFilters
        ) => {
            const filterItem = { ...filterDescriptionItem };
            if (changedFilters.hasOwnProperty('testId1')) {
                filterItem.value = 'filterChangedValue';
                filterItem.textValue = 'filterChangedTextValue';
                filterItem.editorOptions.filter.date = 'test';
            }
            return filterItem;
        };
        let filterFromEvent;
        filterButtonItems[1].filterChangedCallback = filterChangedCallback;
        filterButtonItems[1].editorOptions = {
            filter: {
                date: null,
            },
        };
        const filterController = new ControllerClass({
            filterButtonItems,
            filter: {},
        });

        const newFilterItems = [
            {
                id: 'testId1',
                value: 'secondValue',
                textValue: 'text1',
            },
        ];
        filterController.subscribe('filterSourceChanged', () => {
            filterFromEvent = filterController.getFilter();
        });

        filterController.updateFilterItems(newFilterItems);
        expect(
            filterController.getFilterButtonItems()[1].textValue ===
                'filterChangedTextValue'
        ).toBeTruthy();
        expect(
            filterController.getFilterButtonItems()[1].editorOptions.filter
                .date === 'test'
        ).toBeTruthy();
        expect(
            filterButtonItems[1].editorOptions.filter.date === null
        ).toBeTruthy();
        expect(
            filterController.getFilter().testId2 === 'filterChangedValue'
        ).toBeTruthy();
        expect(filterFromEvent.testId2 === 'filterChangedValue').toBeTruthy();
    });

    it('updateFilterItems with filterVisibilityCallback', () => {
        const filterVisibilityCallback = (
            filterDescriptionItem,
            filter,
            changedFilters
        ) => {
            return !changedFilters.hasOwnProperty('testId1');
        };
        const filterItems = [
            {
                id: 'testId1',
                value: 'secondValue',
                textValue: 'text1',
            },
            {
                id: 'testId2',
                value: 'value2',
                textValue: 'text2',
                filterVisibilityCallback,
            },
        ];
        const filterController = new ControllerClass({
            filterButtonSource: filterItems,
        });

        const newFilterItems = [{ ...filterItems[0] }, { ...filterItems[1] }];
        newFilterItems[0].value = 'testNewValue';

        filterController.updateFilterItems(newFilterItems);
        expect(
            filterController.getFilterButtonItems()[1].visibility === false
        ).toBeTruthy();
    });

    it('updateFilterItems', () => {
        const filterController = new ControllerClass({});
        let eventFired = false;
        filterController._$filterButtonItems = getFilterButtonItems();
        filterController.subscribe('filterSourceChanged', () => {
            eventFired = true;
        });
        const newFilterItems = [
            {
                id: 'testId1',
                value: 'value1',
                textValue: 'text1',
            },
            {
                id: 'testId2',
                value: 'value2',
                textValue: 'text2',
            },
        ];
        filterController.updateFilterItems(newFilterItems);
        expect(filterController.getFilter()).toEqual({
            testId1: 'value1',
            testId2: 'value2',
        });
        expect(filterController.getFilterButtonItems()).toEqual(newFilterItems);
        expect(eventFired).toBeTruthy();

        eventFired = false;
        filterController.updateFilterItems(newFilterItems);
        expect(!eventFired).toBeTruthy();
    });

    it('resetFilterItems', () => {
        const filterVisibilityCallback = (item) => {
            return item.value ? false : undefined;
        };
        const filterController = new ControllerClass({
            filterButtonSource: [
                {
                    name: 'testId1',
                    value: '',
                    textValue: 'textValue1',
                    resetValue: '',
                },
                {
                    name: 'testId2',
                    value: 'testValue',
                    textValue: 'textValue4',
                    resetValue: '',
                },
                {
                    name: 'testId3',
                    value: 'testValue',
                    textValue: 'textValue4',
                    resetValue: '',
                    filterVisibilityCallback,
                    visibility: true,
                },
            ],
        });
        let eventFired = false;
        filterController.subscribe('filterSourceChanged', () => {
            eventFired = true;
        });
        const newFilterItems = [
            {
                name: 'testId1',
                value: '',
                textValue: '',
                resetValue: '',
            },
            {
                name: 'testId2',
                value: '',
                textValue: '',
                resetValue: '',
            },
            {
                name: 'testId3',
                value: '',
                textValue: '',
                resetValue: '',
                filterVisibilityCallback,
                visibility: undefined,
            },
        ];
        filterController.resetFilterItems();
        expect(filterController.getFilter()).toEqual({
            testId1: '',
            testId2: '',
            testId3: '',
        });
        expect(filterController.getFilterButtonItems()).toEqual(newFilterItems);
        expect(eventFired).toBeTruthy();
    });

    describe('setFilterItems', () => {
        it('save history on data load only with historyItems', () => {
            const controller = new ControllerClass({
                filterButtonSource: [],
                prefetchParams: {
                    PrefetchSessionId: 'test',
                },
            });
            // Когда включено кэширование, то фильтр изначально считается изменённым
            // т.к. в отчёты всегда строятся с каким то фильтром и надо получить сессию в ответе метода
            expect(controller._isFilterChanged).toBe(true);
            controller.handleDataLoad(new RecordSet());

            controller.applyFilterDescriptionFromHistory([]);
            expect(controller._isFilterChanged).toBe(false);

            controller.applyFilterDescriptionFromHistory([{}]);
            expect(controller._isFilterChanged).toBe(true);
        });

        it('setFilterItem with filterChangedCallback in filterItem', () => {
            let filterChangedCallbackCalled = false;
            const filterChangedCallback = () => {
                filterChangedCallbackCalled = true;
            };
            let filterButtonSource = [
                {
                    name: 'testId1',
                    value: '',
                    textValue: '',
                    resetValue: '',
                    filterChangedCallback,
                },
            ];
            const controller = new ControllerClass({
                filterButtonSource,
            });
            filterButtonSource = object.clonePlain(filterButtonSource);
            filterButtonSource[0].value = 'testValue';
            controller.applyFilterDescriptionFromHistory(filterButtonSource);
            expect(filterChangedCallbackCalled).toBeTruthy();
        });
    });

    describe('setFilter', () => {
        const controller = new ControllerClass({});

        it('check operations filter', () => {
            const filter = {};
            controller.update({
                filter,
                source: new SbisService({
                    endpoint: { contract: '123' },
                    keyProperty: 'id',
                }),
            });
            expect(controller.getFilter()).toEqual({});

            const controllerOptions = { ...controller._options };
            controllerOptions.selectionViewMode = 'selected';
            controllerOptions.selectedKeys = [1, 2];
            controller.update(controllerOptions as IFilterControllerOptions);
            expect('SelectionWithPath' in controller.getFilter()).toBe(true);
        });

        it('check search filter in constructor', () => {
            let filterController = new ControllerClass({
                searchParam: 'title',
                searchValue: 'test',
                parentProperty: 'test',
                minSearchLength: 3,
            });

            expect(filterController.getFilter()).toEqual({
                Разворот: 'С разворотом',
                usePages: 'full',
                title: 'test',
            });

            filterController = new ControllerClass({
                searchValue: 'test',
                minSearchLength: 3,
            });

            expect(filterController.getFilter()).toEqual({});

            filterController = new ControllerClass({
                minSearchLength: 3,
                searchParam: 'title',
                searchValue: 'te',
            });
            expect(filterController.getFilter()).toEqual({});
        });

        it('check search filter on update', () => {
            const filterController = new ControllerClass({
                filter: { title: 'test' },
            });
            filterController.update({
                filter: {
                    title: 'test2',
                },
            });

            expect(filterController.getFilter()).toEqual({ title: 'test2' });

            filterController._options.filter = null;
            filterController.update({
                filter: {
                    title: 'test2',
                },
                searchValue: 'test',
                searchParam: 'search_string',
                minSearchLength: 3,
            });

            expect(filterController.getFilter()).toEqual({
                title: 'test2',
                search_string: 'test',
            });

            filterController._options.filter = {
                title: 'test2',
            };
            filterController._$filter = null;
            // filter options is not changed
            filterController.update({
                filter: {
                    title: 'test2',
                },
            });
            expect(filterController.getFilter()).toBeNull();
        });
    });

    describe('updateHistory', () => {
        let historyItems = null;
        const filterController = new ControllerClass({
            filter: {
                PrefetchSessionId: 'testId',
                testFilterFilter: 'testValue',
            },
            prefetchParams: {},
        });

        beforeEach(() => {
            jest.spyOn(filterController, '_getHistoryByItems')
                .mockClear()
                .mockImplementation(() => {
                    // нельзя использовать mockReturnValue, т.к. historyItems меняется внутри тестов
                    return historyItems;
                });
            jest.spyOn(ControllerClass, '_deleteFromHistory')
                .mockClear()
                .mockImplementation();
        });

        it('clearPrefetchSession', () => {
            const originalGetHistorySource = filterController._getHistorySource;
            jest.spyOn(filterController, '_getHistorySource')
                .mockClear()
                .mockImplementationOnce((...args) => {
                    const originalResult = originalGetHistorySource(...args);

                    jest.spyOn(originalResult, 'historyReady')
                        .mockClear()
                        .mockImplementationOnce(() => {
                            return true;
                        });

                    return originalResult;
                });
            filterController.updateHistory({});
            expect(filterController.getFilter()).toEqual({
                testFilterFilter: 'testValue',
            });
        });

        it('delete history item', () => {
            historyItems = {
                data: {
                    items: [],
                    prefetchParams: {
                        PrefetchSessionId: 'testId',
                    },
                },
                item: {
                    getId: () => {
                        return 'test';
                    },
                },
                index: 1,
            };

            filterController.updateHistory({});

            expect(filterController.getFilter()).toEqual({
                PrefetchSessionId: 'testId',
                testFilterFilter: 'testValue',
            });
            expect(ControllerClass._deleteFromHistory).toHaveBeenCalled();
        });

        it('update PrefetchParams', () => {
            filterController.setFilter({
                PrefetchSessionId: 'testId',
                testFilterFilter: 'testValue',
            });

            filterController.updateHistory(historyItems);

            expect(filterController.getFilter()).toEqual({
                testFilterFilter: 'testValue',
                PrefetchSessionId: 'testId',
            });
        });
    });

    describe('getItemsByOptions', () => {
        const items = [
            {
                id: 'testId',
                value: '',
                resetValue: '',
            },
        ];

        it('items is array', () => {
            const result = ControllerClass._getItemsByOption(items);
            expect(result).toEqual(items);
            expect(result === items).toBe(false);
        });

        it('items if function', () => {
            const returnOptFunc = () => {
                return [
                    {
                        id: 'testId',
                        value: '',
                        resetValue: '',
                    },
                ];
            };

            const result = ControllerClass._getItemsByOption(returnOptFunc);
            expect(result).toEqual(items);
        });

        const history = [
            {
                id: 'testId',
                value: 'testValue',
                resetValue: '',
            },
        ];
        it('items is array, with history', () => {
            const result = ControllerClass._getItemsByOption(items, history);
            expect(result).toEqual(history);
            expect(result === items).toBe(false);
        });

        it('items is function, with history', () => {
            const returnOptFunc = (optHistory) => {
                return [
                    {
                        id: 'testId',
                        value: optHistory[0].value,
                        resetValue: '',
                    },
                ];
            };
            const result = ControllerClass._getItemsByOption(
                returnOptFunc,
                history
            );
            expect(result).toEqual(history);
        });
    });

    describe('minimizeItem', () => {
        let filterButtonItem;
        let expectedMinItem;
        it('item with id', () => {
            filterButtonItem = {
                id: 'testId4',
                value: 'testValue4',
                textValue: 'textValue',
                resetValue: '',
                visibility: true,
            };
            expectedMinItem = {
                id: 'testId4',
                value: 'testValue4',
                textValue: 'textValue',
                visibility: true,
            };

            const resultItem = ControllerClass._minimizeItem(filterButtonItem);
            expect(resultItem).toEqual(expectedMinItem);
        });

        it('item with name', () => {
            filterButtonItem = {
                name: 'testId4',
                value: 'testValue4',
                textValue: 'textTextValue',
                resetValue: '',
                visibility: true,
                viewMode: 'basic',
            };
            expectedMinItem = {
                name: 'testId4',
                value: 'testValue4',
                textValue: 'textTextValue',
                visibility: true,
                viewMode: 'basic',
            };

            const resultItem = ControllerClass._minimizeItem(filterButtonItem);
            expect(resultItem).toEqual(expectedMinItem);
        });
        it('item is reseted', () => {
            filterButtonItem = {
                name: 'testId4',
                value: 'testValue4',
                resetValue: 'testValue4',
                visibility: true,
                viewMode: 'basic',
            };
            expectedMinItem = {
                name: 'testId4',
                visibility: false,
                viewMode: 'basic',
            };
            const resultItem = ControllerClass._minimizeItem(filterButtonItem);
            expect(resultItem).toEqual(expectedMinItem);
        });

        it('item without textValue', () => {
            filterButtonItem = {
                name: 'testId4',
                value: 'testValue4',
                visibility: true,
                viewMode: 'basic',
            };
            expectedMinItem = {
                name: 'testId4',
                value: 'testValue4',
                visibility: false,
                viewMode: 'basic',
            };
            const resultItem = ControllerClass._minimizeItem(filterButtonItem);
            expect(resultItem).toEqual(expectedMinItem);
        });

        it('item without editorTemplateName', () => {
            filterButtonItem = {
                name: 'testId4',
                value: 'testValue4',
                visibility: false,
                editorTemplateName: 'test',
                viewMode: 'basic',
            };
            expectedMinItem = {
                name: 'testId4',
                value: 'testValue4',
                viewMode: 'basic',
            };
            const resultItem = ControllerClass._minimizeItem(filterButtonItem);
            expect(resultItem).toEqual(expectedMinItem);
        });
    });

    describe('setFilterDescription', () => {
        it('setFilterDescription', () => {
            const filterDescription = [
                {
                    name: 'test',
                    value: null,
                },
            ];
            const newFilterDescription = [
                {
                    name: 'test',
                    value: null,
                },
                {
                    name: 'test',
                    value: null,
                },
            ];
            const controller = new ControllerClass({
                filterButtonSource: filterDescription,
                filter: {},
            });

            controller.setFilterDescription(newFilterDescription);
            expect(controller.getFilterButtonItems()).toEqual(
                newFilterDescription
            );
        });
    });

    it('reloadFilterItem', async () => {
        const source = new Memory({
            data: [{ id: 'test' }],
            keyProperty: 'id',
        });
        const filterDescription = [
            {
                name: 'test',
                value: null,
                editorTemplateName: 'Controls/filterPanel:ListEditor',
                editorOptions: {
                    source,
                },
            },
        ];

        const controller = new ControllerClass({
            filterButtonSource: filterDescription,
            filter: {},
        });

        await controller.reloadFilterItem('test');
        expect(
            controller
                .getFilterButtonItems()[0]
                .editorOptions.sourceController.getItems()
                .getCount()
        ).toEqual(1);
    });

    describe('filterDescription in options', () => {
        it('filterDescription in options, update with filterButtonSource', () => {
            const filterDescription = [
                {
                    name: 'test',
                    value: null,
                    editorTemplateName: 'Controls/filterPanel:ListEditor',
                },
            ];

            let options = {
                filterDescription,
                filter: {},
            };

            const controller = new ControllerClass(options);

            options = {
                filterButtonSource: filterDescription,
                filter: {},
            };

            expect(!!controller.update(options)).toBeFalsy();
        });
    });
});
