import { Prefetch } from 'Controls-ListEnv/filterPrefetch';
import { ControllerClass } from 'Controls/filter';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';

describe('Controls/filter:Controller prefetch', () => {
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
    });

    it('handleDataLoad with prefetchSessionId in items', () => {
        const controller = new ControllerClass({
            filter: {},
            historyId: 'TEST_HISTORY_ID',
            prefetchParams: {},
        });
        const items = new RecordSet();
        items.setMetaData({
            results: new Model({
                rawData: {
                    PrefetchSessionId: 'testId',
                },
            }),
        });
        jest.spyOn(controller, '_deleteCurrentFilterFromHistory').mockClear().mockImplementation();
        jest.spyOn(Prefetch, 'getPrefetchParamsForSave').mockClear().mockImplementation();
        jest.spyOn(controller, '_addToHistory').mockClear().mockImplementation();

        controller.handleDataLoad(items);
        expect(controller.getFilter().PrefetchSessionId === 'testId').toBeTruthy();
    });

    it('handleDataError', () => {
        const controller = new ControllerClass({
            filter: {},
            historyId: 'TEST_HISTORY_ID',
            prefetchParams: {},
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
            filterButtonSource: [
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
            ],
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
            jest.spyOn(ControllerClass, '_deleteFromHistory').mockClear().mockImplementation();
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

        it('update PrefetchParams', () => {
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
});
