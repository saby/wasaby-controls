import { Memory } from 'Types/source';
import { FilterLoader } from 'Controls/filter';
import { RecordSet } from 'Types/collection';
import 'ControlsUnit/Filter/FilterLoader/descriptionToValueConverter';
import { nodeHistoryUtil } from 'Controls/_dataSource/nodeHistoryUtil';

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

        it('Для фильтра с типом list и опцией nodeHistoryId загружаются развёрнутые узлы из параметров', async () => {
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
                        parentProperty: 'parent',
                        nodeProperty: 'parent@',
                        nodeHistoryId: 'testNodeHistoryId',
                    },
                },
            ];

            jest.spyOn(nodeHistoryUtil, 'restore')
                .mockClear()
                .mockImplementation((id) => {
                    return Promise.resolve(['someKey']);
                });

            const result = await FilterLoader.loadFilterDescriptionData(
                filterDescription,
                'default'
            );
            expect(result[0].editorOptions.expandedItems).toStrictEqual(['someKey']);
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
                    descriptionToValueConverter:
                        'ControlsUnit/Filter/FilterLoader/descriptionToValueConverter',
                },
            ];

            const result = await FilterLoader.loadFilterDescriptionData(
                filterDescription,
                'default'
            );
            expect(result[0].editorOptions.items.getCount()).toBe(1);
            expect(result[0].editorOptions.items.at(0).get('city')).toBe('Москва');
        });

        it('Для фильтра с типом lookup загружаются данные без навигации в запросе', async () => {
            const filterDescription = [
                {
                    name: 'listTypeFilter',
                    value: [1, 2],
                    resetValue: [],
                    type: 'lookup',
                    editorOptions: {
                        keyProperty: 'key',
                        multiSelect: true,
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
                                {
                                    key: 2,
                                    city: 'Кострома',
                                },
                            ],
                            filter: (item, filter) => {
                                return filter.key?.includes(item.get('key'));
                            },
                            keyProperty: 'key',
                        }),
                        navigation: {
                            source: 'page',
                            sourceConfig: {
                                pageSize: 1,
                                page: 0,
                                hasMore: false,
                            },
                        },
                    },
                    descriptionToValueConverter:
                        'ControlsUnit/Filter/FilterLoader/descriptionToValueConverter',
                },
            ];

            const result = await FilterLoader.loadFilterDescriptionData(
                filterDescription,
                'default'
            );
            expect(result[0].editorOptions.items.getCount()).toBe(2);
        });

        it('Для фильтра с типом lookup и items в editorOptions метод у источника не вызывается', async () => {
            const filterDescription = [
                {
                    name: 'listTypeFilter',
                    value: 0,
                    resetValue: null,
                    type: 'lookup',
                    editorOptions: {
                        keyProperty: 'key',
                        multiSelect: false,
                        items: new RecordSet({
                            rawData: [
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
            expect(result[0].editorOptions.items.at(0).get('city')).toBe('Ярославль');
        });

        it('Загружаются данные для редактора, указанного в опции panel', async () => {
            const filterDescription = [
                {
                    name: 'listTypeFilter',
                    value: [],
                    resetValue: [],
                    panel: {
                        editorTemplateName: 'Controls/filterPanel:ListEditor',
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
                },
            ];

            const result = await FilterLoader.loadFilterDescriptionData(
                filterDescription,
                'default',
                void 0,
                void 0,
                'panel'
            );
            expect(result[0].panel.editorOptions.items.getCount()).toBe(1);
        });
    });

    describe('loadEditorTemplateName', () => {
        it('Старые editorTemplateName меняются на новые', () => {
            const filterDescription = [
                {
                    name: 'dropdown',
                    value: [],
                    resetValue: [],
                    editorTemplateName: 'Controls/filterPanel:DropdownEditor',
                    editorOptions: {},
                },
            ];

            FilterLoader.loadEditorTemplateName(filterDescription, 'default');
            expect(filterDescription[0].editorTemplateName).toBe(
                'Controls/filterPanelEditors:Dropdown'
            );
        });
    });
});
