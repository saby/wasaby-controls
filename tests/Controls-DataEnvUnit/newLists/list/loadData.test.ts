import { IListDataFactoryArguments, List } from 'Controls/dataFactory';
import { DataSet, IMemoryOptions, Memory } from 'Types/source';
import { IFilterItem } from 'Controls/filter';
import { query } from 'Application/Env';
import { ErrorController } from 'Controls/error';
import { fetch, HTTPStatus } from 'Browser/Transport';
import { USER } from 'ParametersWebAPI/Scope';
import { RecordSet } from 'Types/collection';
import { PREFETCH_SESSION_FIELD } from 'Controls-ListEnv/filterPrefetch';
import { Store } from 'Controls/HistoryStore';
import { ILoadDataResult, saveControllerState } from 'Controls/dataSource';

function getFlatListSource(opts?: Partial<IMemoryOptions>): Memory {
    return new Memory({
        data: [
            {
                id: 0,
                title: 'Sasha',
                order: 0,
            },
            {
                it: 1,
                title: 'Sergey',
                order: 2,
            },
            {
                it: 3,
                title: 'Dmitry',
                order: 1,
            },
        ],
        keyProperty: 'id',
        ...opts,
    });
}

describe('Controls/dataFactory/List/loadData', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Тесты loadData с фильтрами в конфиге', () => {
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

        it('Загрузка с сохранённым в истории фильтром', async () => {
            const filterDescription = [
                {
                    name: 'test',
                    value: null,
                    resetValue: null,
                },
            ];
            const historyFilterDescription = [{ ...filterDescription[0], value: 'testValue' }];
            const historyId = 'testPrepareFilterHistoryId';
            await Store.push(historyId, historyFilterDescription);

            const source = new Memory({
                data: [{ test: 'wrong' }, { test: 'testValue' }],
            });
            const filter = {};
            const loadResult = await List.loadData(
                { source, filter, filterDescription, historyId: 'testPrepareFilterHistoryId' },
                {}
            );
            expect(loadResult.items.getCount()).toEqual(1);
            expect(loadResult.items.at(0).get('test')).toEqual('testValue');
            expect(loadResult.filter).toStrictEqual({ test: 'testValue' });
            expect(loadResult.filterDescription?.[0].value).toStrictEqual('testValue');
        });

        it('Загрузка не должна падать, если история сохранена в неправильном формате', async () => {
            const filterDescription = [
                {
                    name: 'test',
                    value: 'testValue',
                    resetValue: null,
                },
            ];
            const historyId = 'testPrepareFilterHistoryId';
            await Store.push(historyId, 'someHistory');

            const source = new Memory({
                data: [{ test: 'wrong' }, { test: 'testValue' }],
            });
            const filter = {};
            const loadResult = await List.loadData(
                { source, filter, filterDescription, historyId },
                {}
            );
            expect(loadResult.items.getCount()).toEqual(1);
            expect(loadResult.filter).toStrictEqual({ test: 'testValue' });
            expect(loadResult.filterDescription?.[0].value).toStrictEqual('testValue');
        });

        it('Загрузка с фильтром по счётчику', async () => {
            const filterDescription = [
                {
                    name: 'testFilterField',
                    value: null,
                    resetValue: null,
                    textValue: '',
                    type: 'list',
                    editorOptions: {
                        filter: {},
                        source: new Memory({
                            data: [
                                {
                                    id: 'testCountId',
                                    CalcCountBy: 'customCountValue',
                                },
                                {
                                    id: 'testWrongId',
                                    CalcCountBy: 'month',
                                },
                            ],
                        }),
                    },
                },
            ];
            const countFilterValue = 'customCountValue';
            const countFilterLinkedNames = ['testFilterField'];
            const source = new Memory();
            const propStorageId = 'testCountPropStorageId';

            // эмулируем работу сервиса параметров, который отдаёт null для параметров,
            // которые ранее не ни разу не записывались на сервис
            await USER.set(propStorageId + '-countFilterValue', JSON.stringify(null));

            const loadResult = await List.loadData(
                {
                    source,
                    filterDescription,
                    countFilterValue,
                    countFilterLinkedNames,
                    propStorageId,
                },
                {}
            );

            expect(loadResult.filterDescription[0].editorOptions.items.getCount()).toStrictEqual(1);
            expect(loadResult.countFilterValue).toStrictEqual(countFilterValue);
        });

        it('Загрузка с фильтром по счётчику сохранённым в параметрах', async () => {
            const filterDescription = [
                {
                    name: 'testFilterField',
                    value: null,
                    resetValue: null,
                    textValue: '',
                    type: 'list',
                    editorOptions: {
                        filter: {},
                        source: new Memory({
                            data: [
                                {
                                    id: 'testCountId',
                                    CalcCountBy: 'customCountValue',
                                },
                                {
                                    id: 'testWrongId',
                                    CalcCountBy: 'month',
                                },
                            ],
                        }),
                    },
                },
            ];
            const countFilterValue = 'customCountValue';
            const propStorageId = 'testCountFilterPropStorageId';
            const countFilterLinkedNames = ['testFilterField'];
            const source = new Memory();

            await USER.set(propStorageId + '-countFilterValue', JSON.stringify(countFilterValue));

            const loadResult = await List.loadData(
                { source, filterDescription, propStorageId, countFilterLinkedNames },
                {}
            );

            expect(loadResult.filterDescription[0].editorOptions.items.getCount()).toStrictEqual(1);
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

                jest.spyOn(query, 'get', 'get').mockReturnValue({
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

                jest.spyOn(query, 'get', 'get').mockReturnValue({
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
                    'Controls-DataEnvUnit/newLists/list/resources/descriptionToValueConverter';
                const descriptionToValueConverterForResetFilter =
                    'Controls-DataEnvUnit/newLists/list/resources/descriptionToValueConverterForResetFilter';
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
                            'Controls-DataEnvUnit/newLists/list/resources/filterChangedCallback',
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
                expect(loadResult.filterDescription[0].filterChangedCallback).toBeDefined();
            });
            it('filterChangedCallback указанный как функция удаляется из результатов загрузки', async () => {
                const filterDescription = [
                    {
                        name: 'testFilterField',
                        value: 'testValue1',
                        resetValue: null,
                        type: 'list',
                        textValue: '',
                        filterChangedCallback: (filterItem: IFilterItem) => {
                            filterItem.editorOptions.filter.fromCallback = true;
                            return filterItem;
                        },
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
                expect(loadResult.filterDescription[0].filterChangedCallback).toBeUndefined();
            });
        });
    });

    it('Опция фабрики selectFields передаётся в запрос', async () => {
        const data = [
            {
                id: 0,
                title: 'Саша',
                salary: '15000$',
            },
        ];
        const source = new Memory({
            data,
            keyProperty: 'id',
        });

        const { items } = await List.loadData({ source, selectFields: ['id', 'title'] });
        expect(items?.getFormat().getCount()).toStrictEqual(2);
        expect(items?.at(0).get('id')).toStrictEqual(0);
        expect(items?.at(0).get('title')).toStrictEqual('Саша');
    });

    describe('вычисление root', () => {
        it('из метаданных рекордсета', async () => {
            const correctRoot = '1,root';
            const source = new Memory();
            const filter = {};
            const queryResult = new DataSet({
                rawData: {
                    items: [],
                    meta: {
                        correctRoot,
                    },
                },
                metaProperty: 'meta',
            });
            jest.spyOn(source, 'query').mockReturnValue(Promise.resolve(queryResult));

            const loadResult = await List.loadData(
                { source, filter, rootHistoryId: 'rootHistoryId', parentProperty: 'parent' },
                {}
            );

            expect(loadResult.root).toBe(correctRoot);
        });

        it('из метаданных рекордсета, correctRoot равен null', async () => {
            const correctRoot = null;
            const source = new Memory();
            const filter = {};
            const queryResult = new DataSet({
                rawData: {
                    items: [],
                    meta: {
                        correctRoot,
                    },
                },
                metaProperty: 'meta',
            });
            jest.spyOn(source, 'query').mockReturnValue(Promise.resolve(queryResult));

            const loadResult = await List.loadData(
                { source, filter, rootHistoryId: 'rootHistoryId', parentProperty: 'parent' },
                {}
            );

            expect(loadResult.root).toBe(correctRoot);
        });

        it('Из конфига, если нет rootHistoryId', async () => {
            const root = '1,root';
            const source = new Memory();
            const filter = {};
            const queryResult = new DataSet({
                rawData: {
                    items: [],
                },
            });
            jest.spyOn(source, 'query').mockReturnValue(Promise.resolve(queryResult));

            const loadResult = await List.loadData(
                { source, filter, rootHistoryId: '', parentProperty: 'parent', root },
                {},
                undefined,
                true
            );

            expect(loadResult.root).toBe(root);
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
            jest.spyOn(source, 'query').mockReturnValue(Promise.reject(error));

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
            jest.spyOn(source, 'query').mockReturnValue(Promise.reject(error));

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
            expect(loadResult.items.getCount()).toStrictEqual(1);
            expect(loadResult.items.at(0).get('title')).toStrictEqual('Sasha');
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
            expect(loadResult.items.getCount()).toStrictEqual(1);
            expect(loadResult.items.at(0).get('title')).toStrictEqual('Sasha');
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
            expect(loadResult.items.getCount()).toStrictEqual(3);
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

    describe('Загрузка с опцией listConfigStoreId', () => {
        it('По listConfigStoreId ничего не сохранено', async () => {
            const listConfigStoreId = 'testListConfigStoreId';
            const source = getFlatListSource();
            const filter = {};

            const loadResult = await List.loadData(
                {
                    source,
                    filter,
                    listConfigStoreId,
                },
                {}
            );
            expect(loadResult?.items.getCount()).toStrictEqual(3);
        });

        it('По listConfigStoreId сохранена конфигурация, которая влияет на загрузку', async () => {
            const listConfigStoreId = 'testListConfigStoreId';
            const source = getFlatListSource({
                data: [
                    {
                        id: 0,
                        title: 'Sasha',
                    },
                    {
                        it: 1,
                        title: 'Sasha',
                    },
                    {
                        it: 2,
                        title: 'Sasha',
                    },
                    {
                        it: 3,
                        title: 'Sergey',
                    },
                ],
            });
            const filter = {};
            const navigation: IListDataFactoryArguments['navigation'] = {
                source: 'page',
                sourceConfig: {
                    pageSize: 1,
                    page: 0,
                    hasMore: false,
                },
            };

            saveControllerState(listConfigStoreId, {
                searchValue: 'Sasha',
                navigationSourceConfig: {
                    page: 0,
                    pageSize: 2,
                },
            });

            const loadResult = await List.loadData(
                {
                    source,
                    filter,
                    navigation,
                    listConfigStoreId,
                    searchParam: 'title',
                },
                {}
            );
            expect(loadResult.items.getCount()).toStrictEqual(2);
            expect(loadResult.items.at(0).get('title')).toStrictEqual('Sasha');
            expect(loadResult.items.at(1).get('title')).toStrictEqual('Sasha');
        });

        it('По listConfigStoreId сохранена множественная навигация', async () => {
            const listConfigStoreId = 'testListConfigStoreId';
            const source = new Memory({});
            // Т.к. на уровне Memory источника не поддержана множественная навигация,
            // то мокаю метод
            jest.spyOn(source, 'query').mockImplementation((query) => {
                if (query?.getUnion().length) {
                    return Promise.resolve(
                        new DataSet({
                            rawData: [
                                {
                                    key: 0,
                                    title: 'Sasha',
                                },
                            ],
                        })
                    );
                } else {
                    return Promise.resolve(new DataSet());
                }
            });

            const filter = {};
            const navigation: IListDataFactoryArguments['navigation'] = {
                source: 'position',
                sourceConfig: {
                    field: 'key',
                    position: 0,
                    direction: 'bothways',
                    limit: 20,
                },
            };

            const navigationSourceConfig = new Map([
                [
                    null,
                    {
                        position: 0,
                        limit: 2,
                    },
                ],
                [
                    0,
                    {
                        position: 1,
                        limit: 1,
                    },
                ],
            ]);
            navigationSourceConfig.multiNavigation = true;

            saveControllerState(listConfigStoreId, {
                navigationSourceConfig,
            });

            const loadResult = await List.loadData(
                {
                    source,
                    filter,
                    navigation,
                    listConfigStoreId,
                    searchParam: 'title',
                    parentProperty: 'parent',
                    expandedItems: [0],
                },
                {}
            );
            expect(loadResult.items.getCount()).toStrictEqual(1);
            expect(loadResult.items.at(0).get('title')).toStrictEqual('Sasha');
        });

        it('Из listConfigStoreId вытаскиваются только те параметры, которые указаны listConfigPropsNames', async () => {
            const listConfigStoreId = 'testListConfigStoreId';
            const source = getFlatListSource();
            const filter = {};

            saveControllerState(listConfigStoreId, {
                searchValue: 'Sasha',
                selectedKeys: ['Sergey'],
                excludedKeys: ['Dmitry'],
            });

            const loadResult = await List.loadData(
                {
                    source,
                    filter,
                    listConfigStoreId,
                    listConfigStorePropsNames: ['searchValue'],
                    searchParam: 'title',
                },
                {}
            );
            expect(loadResult.items.getCount()).toStrictEqual(1);
            expect(loadResult.items.at(0).get('title')).toStrictEqual('Sasha');
            expect(loadResult.selectedKeys).toBeUndefined();
            expect(loadResult.excludedKeys).toBeUndefined();
        });
        it('Хранилище по listConfigStoreId пустое. Не должна падать закгрузка, если нет параметров указанных в listConfigStorePropsNames', async () => {
            const listConfigStoreId = 'testListConfigStoreId-1';
            const source = getFlatListSource();
            const filter = {};

            const loadResult = await List.loadData(
                {
                    source,
                    filter,
                    listConfigStoreId,
                    listConfigStorePropsNames: ['searchValue'],
                    searchParam: 'title',
                },
                {}
            );
            expect(loadResult.items.getCount()).toStrictEqual(3);
        });
    });

    it('Загрузка с переданной опцией items, запроса к источнику не должно быть', async () => {
        const source = getFlatListSource();
        const items = new RecordSet({
            rawData: [
                {
                    id: 0,
                    title: 'Sasha',
                },
            ],
            keyProperty: 'id',
        });
        const filter = {};

        const loadResult = await List.loadData(
            {
                source,
                filter,
                items,
            },
            {}
        );
        expect(loadResult.items.getCount()).toStrictEqual(1);
        expect(loadResult.items.at(0).get('title')).toStrictEqual('Sasha');
    });

    describe('Тесты загрузки с сохранёнными параметрами', () => {
        it('collapsedGroups сохранены в пользовательских параметрах', async () => {
            const source = getFlatListSource();
            const groupHistoryId = 'testGroupHistoryId';
            const groups = ['testCollapsedGroup1', 'testCollapsedGroup2'];

            await USER.set('LIST_COLLAPSED_GROUP_' + groupHistoryId, JSON.stringify(groups));

            const loadDataResult = await List.loadData(
                {
                    source,
                    groupHistoryId,
                },
                {}
            );
            expect(loadDataResult.collapsedGroups).toEqual(groups);
        });

        it('expandedItems сохранены в пользовательских параметрах', async () => {
            const source = getFlatListSource();
            const nodeHistoryId = 'testNodeHistoryId';
            const nodes = ['node_0'];

            await USER.set(nodeHistoryId, JSON.stringify(nodes));

            const loadDataResult = await List.loadData(
                {
                    source,
                    nodeHistoryId,
                    parentProperty: 'parent',
                },
                {}
            );
            expect(loadDataResult.expandedItems).toEqual(nodes);
        });

        describe('Тесты загрузки с сортировкой сохранённой в параметрах', () => {
            it('Сортировка сохранена в пользовательских параметрах', async () => {
                const source = getFlatListSource();
                const propStorageId = 'testSortingPropStorageId';
                const sorting = [{ order: 'DESC' }];

                await USER.set(propStorageId + '-sorting', JSON.stringify(sorting));

                const loadDataResult = await List.loadData(
                    {
                        source,
                        propStorageId,
                        sorting: [],
                    },
                    {}
                );
                expect(loadDataResult.items.at(0).get('title')).toEqual('Sergey');
                expect(loadDataResult.sorting).toStrictEqual(sorting);
            });

            it('Сортировки нет в параметрах, должна браться из конфига', async () => {
                const source = getFlatListSource();
                const propStorageId = 'testSortingPropStorageId2';
                const sorting = [];

                const loadDataResult = await List.loadData(
                    {
                        source,
                        propStorageId,
                        sorting,
                    },
                    {}
                );
                expect(loadDataResult.items.at(0).get('title')).toEqual('Sasha');
                expect(loadDataResult.sorting).toStrictEqual(sorting);
            });
        });
    });
});
