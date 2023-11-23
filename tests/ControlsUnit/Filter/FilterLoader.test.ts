import { Memory } from 'Types/source';
import { FilterLoader } from 'Controls/filter';

describe('Controls/filter:FilterLoader', () => {
    describe('loadFilterDescriptionData', () => {
        it('Для фильтра с типом list загружаются данные', async () => {
            const filterDescription = [
                {
                    name: 'listTypeFilter',
                    value: [],
                    resetValue: [],
                    type: 'list',
                    editorOptions: {
                        keyProperty: 'key',
                        source: new Memory({
                            data: [
                                {
                                    key: 0,
                                    city: 'Ярославль',
                                },
                            ],
                            keyProperty: 'key',
                        }),
                    },
                },
            ];

            const result = await FilterLoader.loadFilterDescriptionData(
                filterDescription,
                'default'
            );
            expect(result[0].editorOptions.items.getCount()).toBe(1);
        });

        it('Для фильтра с типом lookup загружаются данные', async () => {
            const filterDescription = [
                {
                    name: 'listTypeFilter',
                    value: 1,
                    resetValue: null,
                    type: 'lookup',
                    editorOptions: {
                        keyProperty: 'key',
                        multiSelect: false,
                        source: new Memory({
                            data: [
                                {
                                    key: 0,
                                    city: 'Ярославль',
                                },
                                {
                                    key: 1,
                                    city: 'Москва',
                                },
                            ],
                            keyProperty: 'key',
                        }),
                    },
                },
            ];

            const result = await FilterLoader.loadFilterDescriptionData(
                filterDescription,
                'default'
            );
            expect(result[0].editorOptions.items.getCount()).toBe(1);
            expect(result[0].editorOptions.items.at(0).get('city')).toBe('Москва');
        });
    });
});
