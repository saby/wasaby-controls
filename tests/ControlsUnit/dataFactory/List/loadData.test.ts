import { List } from 'Controls/dataFactory';
import { Memory, PrefetchProxy } from 'Types/source';
import { IFilterItem } from 'Controls/filter';
import { query } from 'Application/Env';
import { ErrorController } from 'Controls/error';
import { fetch, HTTPStatus } from 'Browser/Transport';

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

    it('descriptionToValueConverter вызывается при формировании фильтра для загрузки', async () => {
        const descriptionToValueConverter =
            'ControlsUnit/dataFactory/List/resources/descriptionToValueConverter';
        const filterDescription = [
            {
                name: 'testFilterField',
                value: ['testValue1', 'testValue2'],
                resetValue: null,
                textValue: '',
                descriptionToValueConverter,
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
});
