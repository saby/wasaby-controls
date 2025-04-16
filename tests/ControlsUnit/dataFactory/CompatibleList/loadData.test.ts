import { CompatibleList } from 'Controls/dataFactory';
import { Memory } from 'Types/source';

describe('Controls/dataFactory/List/CompatibleLsit', () => {
    it('Загрузка с filterDescription и historyItems', async () => {
        const filterDescription = [
            {
                name: 'testFilterField',
                value: null,
                resetValue: null,
                textValue: '',
                type: 'list',
                editorOptions: {
                    source: new Memory({
                        data: [{ id: 0 }, { id: 1 }],
                        keyProperty: 'id',
                    }),
                },
            },
        ];
        const historyItems = [
            {
                name: 'testFilterField',
                value: 1,
                resetValue: null,
                textValue: 'test',
            },
        ];
        const source = new Memory();
        const filter = {};

        const loadResult = await CompatibleList.loadData(
            { source, filter, filterDescription, historyItems, historyId: 'test' },
            {}
        );
        expect(loadResult.filter.testFilterField).toStrictEqual(1);
        expect(loadResult.filterDescription[0].value).toStrictEqual(1);
        expect(loadResult.filterDescription[0].editorOptions.items.getCount()).toStrictEqual(2);
    });

    it('Загрузка с filterDescription в виде функции', async () => {
        const filterDescription = () => [
            {
                name: 'testFilterField',
                value: null,
                resetValue: null,
                textValue: '',
                type: 'list',
                filterChangedCallback: () => {},
                editorOptions: {
                    source: new Memory({
                        data: [{ id: 0 }, { id: 1 }],
                        keyProperty: 'id',
                    }),
                },
            },
        ];
        const source = new Memory();
        const filter = {};

        const loadResult = await CompatibleList.loadData(
            { source, filter, filterDescription, historyId: 'test' },
            {}
        );
        expect(loadResult.filterDescription[0].filterChangedCallback).toBeDefined();
    });
});
