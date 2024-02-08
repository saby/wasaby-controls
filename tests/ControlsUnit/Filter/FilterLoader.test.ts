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