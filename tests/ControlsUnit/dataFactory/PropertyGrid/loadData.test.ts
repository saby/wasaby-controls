import { PropertyGrid } from 'Controls/dataFactory';
import { Memory } from 'Types/source';

describe('Тесты загрузки для фабрики Controls/dataFactory:PropertyGrid', () => {
    it('Имя св-ва берётся из поля, указанного в опции keyProperty ', async () => {
        const typeDescription = [
            {
                customName: 'lookupName',
                type: 'lookup',
                editorTemplateName: 'Controls/propertyGridEditors:Lookup',
                editorOptions: {
                    source: new Memory({
                        keyProperty: 'id',
                        data: [
                            {
                                id: 1,
                                title: 'Наша компания',
                            },
                            {
                                id: 2,
                                title: 'Все юридические лица',
                            },
                        ],
                    }),
                    keyProperty: 'id',
                },
            },
        ];
        const editingObject = {
            lookupName: 2,
        };
        const loadResult = await PropertyGrid.loadData({
            typeDescription,
            editingObject,
            keyProperty: 'customName',
        });
        const items = loadResult.typeDescription[0].editorOptions.items;
        expect(items.getCount()).toEqual(1);
        expect(items.at(0).get('title')).toEqual('Все юридические лица');
    });
});
