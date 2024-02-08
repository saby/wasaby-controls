import { List } from 'Controls/dataFactory';
import { Memory } from 'Types/source';
import { IFilterItem } from 'Controls/filter';
import { query } from 'Application/Env';

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

    it('Загрузка с фильтром из URL', async () => {
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
});
