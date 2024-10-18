import { RecordSet } from 'Types/collection';
import { GridCollection } from 'Controls/grid';

const rawData = [
    { key: 1, ladder: '1', group: '1', text: 'item-1' },
    { key: 2, ladder: '1', group: '1', text: 'item-2' },
    { key: 3, ladder: '2', group: '2', text: 'item-3' },
    { key: 4, ladder: '3', group: '2', text: 'item-4' },
];
const columns = [{ displayProperty: 'text', stickyProperty: ['ladder'] }];

describe('Controls/grid_clean/Display/ItemEditorTemplateOptions/Grid', () => {
    let collection: RecordSet;

    beforeEach(() => {
        collection = new RecordSet({
            rawData,
            keyProperty: 'key',
        });
    });

    afterEach(() => {
        collection = undefined;
    });
    it('should update state on collection', () => {
        const gridCollection = new GridCollection({
            collection,
            keyProperty: 'key',
            columns,
            groupProperty: 'group',
            ladderProperties: ['ladder'],
            itemEditorTemplate: () => {
                return 'ITEM_EDITOR_TEMPLATE';
            },
            itemEditorTemplateOptions: 'initValue',
        });

        expect(gridCollection.getItemEditorTemplateOptions()).toEqual('initValue');
        gridCollection.setItemEditorTemplateOptions('newValue');
        expect(gridCollection.getItemEditorTemplateOptions()).toEqual('newValue');
    });
});
