import { IPrefetchHistoryParams, Prefetch } from 'Controls-ListEnv/filterPrefetch';
import { ControllerClass } from 'Controls/filter';
import Browser from 'Controls/_browser/Browser';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { Memory, PrefetchProxy } from 'Types/source';
import { DataLoader } from 'Controls/dataSourceOld';

function getPrefetchParams(): IPrefetchHistoryParams {
    return {
        PrefetchSessionId: 'test',
        PrefetchDataValidUntil: new Date(),
        PrefetchDataCreated: new Date('December 17, 1995 03:24:00'),
    };
}

function getRecordSetWithoutPrefetch(): RecordSet {
    return new RecordSet();
}

function getRecordSetWithPrefetch(): RecordSet {
    const recordSet = getRecordSetWithoutPrefetch();
    const results = new Model({
        rawData: getPrefetchParams(),
    });

    recordSet.setMetaData({ results });
    return recordSet;
}

function getHistoryWithPrefetch(): object {
    return {
        items: [],
        prefetchParams: getPrefetchParams(),
    };
}

describe('Controls.filter.Prefetch', () => {
    it('applyPrefetchFromItems', () => {
        let filter = {};
        expect(Prefetch.applyPrefetchFromItems(filter, getRecordSetWithPrefetch())).toEqual({
            PrefetchSessionId: 'test',
        });

        filter = {};
        expect(Prefetch.applyPrefetchFromItems(filter, getRecordSetWithoutPrefetch())).toEqual({});
    });

    it('applyPrefetchFromHistory', () => {
        const filter = {};
        expect(Prefetch.applyPrefetchFromHistory(filter, getHistoryWithPrefetch())).toEqual({
            PrefetchSessionId: 'test',
        });
    });

    it('getPrefetchParamsForSave', () => {
        let params = Prefetch.getPrefetchParamsForSave(getRecordSetWithPrefetch());
        expect(params.PrefetchSessionId).toEqual('test');

        params = Prefetch.getPrefetchParamsForSave(getRecordSetWithoutPrefetch());
        expect(params).toEqual(undefined);
    });

    it('addPrefetchToHistory', () => {
        const history = {
            items: [],
        };

        Prefetch.addPrefetchToHistory(history);
        expect(!history.prefetchParams).toBe(true);

        Prefetch.addPrefetchToHistory(history, getPrefetchParams());
        expect(history.prefetchParams.PrefetchSessionId).toEqual('test');
    });

    it('needInvalidatePrefetch', () => {
        const history = getHistoryWithPrefetch();
        history.prefetchParams.PrefetchDataValidUntil = new Date('December 17, 1995 03:24:00');
        expect(Prefetch.needInvalidatePrefetch(history)).toBe(true);
    });

    it('prepareFilter', () => {
        const prefetchOptions = {
            PrefetchMethod: 'testMethodName',
        };
        expect(Prefetch.prepareFilter({}, prefetchOptions)).toEqual({
            PrefetchMethod: 'testMethodName',
        });
        expect(Prefetch.prepareFilter({}, prefetchOptions, 'testPrefetchSessionId')).toEqual({
            PrefetchMethod: 'testMethodName',
            PrefetchSessionId: 'testPrefetchSessionId',
        });
        expect(Prefetch.prepareFilter({}, prefetchOptions)).toEqual({
            PrefetchMethod: 'testMethodName',
        });
    });

    it('clearPrefetchSession', () => {
        const filterWithSession = {
            PrefetchSessionId: 'test',
            anyField: 'anyValue',
        };

        expect(Prefetch.clearPrefetchSession(filterWithSession)).toEqual({
            anyField: 'anyValue',
        });
    });

    it('getPrefetchDataCreatedFromItems', () => {
        const dataCreated = new Date('December 17, 1995 03:24:00');
        expect(
            Prefetch.getPrefetchDataCreatedFromItems(getRecordSetWithPrefetch()).getTime() ===
                dataCreated.getTime()
        ).toBe(true);
    });
});

describe('Controls/filter:Controller prefetch', () => {
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
});

describe('Controls/browser:Browser', () => {
    it('resetPrefetch', async () => {
        const filter = {
            testField: 'testValue',
            PrefetchSessionId: 'test',
        };
        let options = {
            minSearchLength: 3,
            source: new Memory({
                keyProperty: 'id',
                data: [
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
                ],
            }),
            searchParam: 'name',
            filter,
            keyProperty: 'id',
            prefetchParams: { PrefetchMethod: 'test' },
        };

        const browser = new Browser(options);
        // это сделано для того, чтобы ручные вызовы _forceUpdate не заваливали консоль ошибками
        jest.spyOn(browser, '_forceUpdate').mockClear().mockImplementation();

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
});

describe('Controls/dataSourceOld:Dataloader', () => {
    it('loadData with filterButtonSource, prefetchParams, historyId', async () => {
        const getDataArray = () => [
            {
                id: 0,
                title: 'Sasha',
            },
            {
                id: 1,
                title: 'Sergey',
            },
            {
                id: 2,
                title: 'Dmitry',
            },
            {
                id: 3,
                title: 'Andrey',
            },
            {
                id: 4,
                title: 'Aleksey',
            },
        ];
        const rs = new RecordSet({
            rawData: getDataArray(),
        });
        rs.setMetaData({
            results: new Model({
                rawData: {
                    [Prefetch.PREFETCH_SESSION_FIELD]: 'testPrefetchSessionId',
                },
            }),
        });
        const memorySource = new Memory({
            data: getDataArray(),
            keyProperty: 'id',
        });
        const prefetchSource = new PrefetchProxy({
            target: memorySource,
            data: {
                query: rs,
            },
        });
        const loadDataConfigWithFilter = {
            type: 'list',
            source: prefetchSource,
            filter: {},
            historyId: 'testId',
            historyItems: [],
            prefetchParams: {
                PrefetchMethod: 'testPrefetchMethodName',
            },
            filterButtonSource: [
                {
                    name: 'title',
                    value: 'Sasha',
                    textValue: 'Sasha',
                },
            ],
        };
        const dataLoader = new DataLoader();
        await dataLoader.load([loadDataConfigWithFilter]);
        const filterController = dataLoader.getFilterController();

        expect(filterController.getFilter()).toEqual({
            title: 'Sasha',
            PrefetchMethod: 'testPrefetchMethodName',
            [Prefetch.PREFETCH_SESSION_FIELD]: 'testPrefetchSessionId',
        });
    });
});
