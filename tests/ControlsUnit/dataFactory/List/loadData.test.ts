import { List } from 'Controls/dataFactory';
import { Memory, IMemoryOptions } from 'Types/source';
import { IFilterItem } from 'Controls/filter';
import { query } from 'Application/Env';
import { ErrorController } from 'Controls/error';
import { fetch, HTTPStatus } from 'Browser/Transport';
import { PREFETCH_SESSION_FIELD } from 'Controls-ListEnv/filterPrefetch';

function getFlatListSource(opts?: Partial<IMemoryOptions>): Memory {
    return new Memory({
        data: [
            {
                id: 0,
                title: 'Sasha',
            },
            {
                it: 1,
                title: 'Sergey',
            },
            {
                it: 3,
                title: 'Dmitry',
            },
        ],
        keyProperty: 'id',
        ...opts,
    });
}

describe('Controls/dataFactory/List/loadData', () => {
    it('Загрузка с filterDescription в виде функции', async () => {
        const filterDescription = function () {
            return [
                {
                    name: 'testFilterField',
                    value: 'test',
                    resetValue: null,
                    textValue: '',
                },
            ];
        };
        const source = new Memory();
        const filter = {};

        const loadResult = await List.loadData({ source, filter, filterDescription }, {});
        expect(loadResult.filter.testFilterField).toStrictEqual('test');
        expect(loadResult.historyItems).toStrictEqual([]);
    });

    it('Загрузка с filterDescription в виде функции и historyItems', async () => {
        const filterDescription = function (historyItems: IFilterItem[]) {
            return [
                {
                    name: 'testFilterField',
                    value: historyItems[0]?.value,
                    resetValue: null,
                    textValue: '',
                },
            ];
        };
        const historyItems = [
            {
                name: 'testFilterField',
                value: 'test',
            },
        ];
        const source = new Memory();
        const filter = {};

        const loadResult = await List.loadData(
            { source, filter, filterDescription, historyId: 'test', historyItems },
            {}
        );
        expect(loadResult.filter.testFilterField).toStrictEqual('test');
    });

    it('historyItems не влияет на фильтр, если функции переданную в filterDescription возвращают структуру без истории', async () => {
        const filterDescription = [
            {
                name: 'testFilterField',
                value: 'myValue',
                resetValue: null,
                textValue: '',
            },
        ];
        const filterDescriptionFunc = function () {
            return filterDescription;
        };
        const historyItems = [
            {
                name: 'testFilterField',
                value: 'test',
            },
        ];
        const source = new Memory();
        const filter = {};

        const loadResult = await List.loadData(
            {
                source,
                filter,
                filterDescription: filterDescriptionFunc,
                historyId: 'test',
                historyItems,
            },
            {}
        );
        expect(loadResult.filter.testFilterField).toStrictEqual('myValue');
    });

    it('Загрузка с filterDescription в виде функции и historyItems пустым массивом', async () => {
        const filterDescription = function (historyItems: IFilterItem[]) {
            return [
                {
                    name: 'testFilterField',
                    value: 'test',
                    resetValue: null,
                    textValue: '',
                },
            ];
        };
        const historyItems = [];
        const source = new Memory();
        const filter = {};

        const loadResult = await List.loadData(
            { source, filter, filterDescription, historyId: 'test', historyItems },
            {}
        );
        expect(loadResult.filter.testFilterField).toStrictEqual('test');
    });

    describe('Загрузка с фильтром из URL', () => {
        it('Фильтр из URL применяется к структуре', async () => {
            const filterDescription = function () {
                return [
                    {
                        name: 'testFilterField',
                        value: null,
                        resetValue: null,
                        textValue: '',
                    },
                ];
            };
            const historyItems = [];

            jest.spyOn(query, 'get', 'get').mockClear().mockReturnValue({
                filter: '%5B%7B%22name%22%3A%22testFilterField%22%2C%22value%22%3A%22test%22%2C%22textValue%22%3A%22%22%2C%22visibility%22%3A%22%24u%22%7D%5D',
            });
            const source = new Memory();
            const filter = {};

            const loadResult = await List.loadData(
                {
                    source,
                    filter,
                    filterDescription,
                    saveToUrl: true,
                    historyItems,
                    historyId: 'testHistoryId',
                },
                {}
            );
            expect(loadResult.filter.testFilterField).toStrictEqual('test');
        });

        it('Фильтр из URL применяется к элементам, у которых задан historyId', async () => {
            const filterDescription = function () {
                return [
                    {
                        name: 'testFilterField',
                        value: null,
                        resetValue: null,
                        textValue: '',
                        historyId: 'testHistoryId',
                    },
                ];
            };

            jest.spyOn(query, 'get', 'get').mockClear().mockReturnValue({
                filter: '%5B%7B%22name%22%3A%22testFilterField%22%2C%22value%22%3A%22test%22%2C%22textValue%22%3A%22%22%2C%22visibility%22%3A%22%24u%22%7D%5D',
            });
            const source = new Memory();
            const filter = {};

            const loadResult = await List.loadData(
                {
                    source,
                    filter,
                    filterDescription,
                    saveToUrl: true,
                },
                {}
            );
            expect(loadResult.filter.testFilterField).toStrictEqual('test');
        });
    });

    describe("callback'и на filterDescription вызывается при загрузке", () => {
        it('descriptionToValueConverter вызывается при формировании фильтра для загрузки', async () => {
            const descriptionToValueConverter =
                'ControlsUnit/dataFactory/List/resources/descriptionToValueConverter';
            const descriptionToValueConverterForResetFilter =
                'ControlsUnit/dataFactory/List/resources/descriptionToValueConverterForResetFilter';
            const filterDescription = [
                {
                    name: 'testFilterField',
                    value: ['testValue1', 'testValue2'],
                    resetValue: null,
                    textValue: '',
                    descriptionToValueConverter,
                },
                {
                    name: 'testFilterField2',
                    value: ['testValue1', 'testValue2'],
                    resetValue: ['testValue1', 'testValue2'],
                    textValue: '',
                    descriptionToValueConverter: descriptionToValueConverterForResetFilter,
                },
            ];
            const source = new Memory();
            const filter = {};

            const loadResult = await List.loadData(
                { source, filter, filterDescription, saveToUrl: true },
                {}
            );
            expect(loadResult.filter).toStrictEqual({
                filterField1: 'testValue1',
                filterField2: 'testValue2',
                filterField3: 'testValue1',
                filterField4: 'testValue2',
            });
        });

        it('filterChangedCallback вызывается при подготовке структуры', async () => {
            const filterDescription = [
                {
                    name: 'testFilterField',
                    value: 'testValue1',
                    resetValue: null,
                    type: 'list',
                    textValue: '',
                    filterChangedCallback:
                        'ControlsUnit/dataFactory/List/resources/filterChangedCallback',
                    editorOptions: {
                        source: new Memory(),
                        filter: {
                            testFilter: 'testValue',
                        },
                    },
                },
            ];
            const source = new Memory();
            const filter = {};

            const loadResult = await List.loadData({ source, filter, filterDescription }, {});
            expect(loadResult.filterDescription[0].editorOptions.filter).toStrictEqual({
                testFilter: 'testValue',
                fromCallback: true,
            });
        });
    });

    describe('Обработка ошибок загрузки', () => {
        it('Ошибка обрабатывается через дефолтный errorController', async () => {
            const error = new fetch.Errors.HTTP({
                httpError: HTTPStatus.GatewayTimeout,
                message: 'test',
                url: 'test',
            });

            const source = new Memory();
            source.query = () => Promise.reject(error);

            const loadResult = await List.loadData({ source }, {});

            expect(loadResult.errorViewConfig.mode).toStrictEqual('include');
            expect(loadResult.errorViewConfig.status).toStrictEqual(HTTPStatus.GatewayTimeout);
        });

        it('Ошибка обрабатывается кастомным errorController', async () => {
            const errorController = new ErrorController({});
            const error = new fetch.Errors.HTTP({
                httpError: HTTPStatus.GatewayTimeout,
                message: 'test',
                url: 'test',
            });

            const source = new Memory();
            source.query = () => Promise.reject(error);

            errorController.addHandler((errorConfig) => {
                if (errorConfig.error.status === HTTPStatus.GatewayTimeout) {
                    return {
                        myErrorField: 'test',
                    };
                }
            });

            const loadResult = await List.loadData({ source, errorController }, {});

            expect(loadResult.errorViewConfig.myErrorField).toStrictEqual('test');
        });
    });

    describe('Загрузка с searchValue в конфиге', () => {
        it('Данные отфлильтрованы по searchValue', async () => {
            const source = getFlatListSource();
            const filter = {};

            const loadResult = await List.loadData(
                { source, filter, searchParam: 'title', searchValue: 'Sasha' },
                {}
            );
            expect(loadResult.filter.title).toStrictEqual('Sasha');
            expect(loadResult.searchValue).toStrictEqual('Sasha');
            expect(loadResult.data.getCount()).toStrictEqual(1);
            expect(loadResult.data.at(0).get('title')).toStrictEqual('Sasha');
        });

        it('У searchValue обрезаются пробелы, если передана опция searchValueTrim', async () => {
            const source = getFlatListSource();
            const filter = {};

            const loadResult = await List.loadData(
                {
                    source,
                    filter,
                    searchParam: 'title',
                    searchValue: 'Sasha   ',
                    searchValueTrim: true,
                },
                {}
            );
            expect(loadResult.filter.title).toStrictEqual('Sasha');
            expect(loadResult.searchValue).toStrictEqual('Sasha   ');
            expect(loadResult.data.getCount()).toStrictEqual(1);
            expect(loadResult.data.at(0).get('title')).toStrictEqual('Sasha');
        });

        it('Загрузка без поиска, если searchValue передан пустой строкой с пробелами', async () => {
            const source = getFlatListSource();
            const filter = {};

            const loadResult = await List.loadData(
                {
                    source,
                    filter,
                    searchParam: 'title',
                    searchValue: '     ',
                    searchValueTrim: true,
                },
                {}
            );
            expect(loadResult.data.getCount()).toStrictEqual(3);
        });
    });

    describe('Загрузка данных с prefetchParams в конфигурации', () => {
        it('В конфигурации переданы prefetchParams и prefetchSessionId', async () => {
            const source = getFlatListSource();
            const filter = {};
            const prefetchParams = { PrefetchMethod: 'test' };
            const prefetchSessionId = '123';
            const filterDescription = [
                {
                    name: 'testFilterField',
                    value: null,
                    resetValue: null,
                    textValue: '',
                },
            ];

            const loadResult = await List.loadData(
                {
                    source,
                    filter,
                    prefetchParams,
                    prefetchSessionId,
                    filterDescription,
                },
                {}
            );
            expect(loadResult.filter.PrefetchMethod).toStrictEqual(prefetchParams.PrefetchMethod);
            expect(loadResult.filter[PREFETCH_SESSION_FIELD]).toStrictEqual(prefetchSessionId);
        });
    });
});
