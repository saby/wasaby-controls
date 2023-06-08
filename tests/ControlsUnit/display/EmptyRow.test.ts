import { GridCollection } from 'Controls/grid';
import { RecordSet } from 'Types/collection';

describe('Controls/_display/EmptyRow', () => {
    let collection: RecordSet;
    let gridCollection: GridCollection;

    beforeEach(() => {
        collection = new RecordSet({
            rawData: [],
            keyProperty: 'key',
        });
    });

    it('one colspan cell', () => {
        gridCollection = new GridCollection({
            collection,
            keyProperty: 'key',
            columns: [{}, {}, {}],
            multiSelectVisibility: 'hidden',
            emptyTemplate: () => {
                /* template function*/
            },
        });
        expect(gridCollection.getEmptyGridRow()).toBeDefined();
        expect(gridCollection.getEmptyGridRow().getColumns().length).toEqual(1);
    });

    it('separated columns', () => {
        gridCollection = new GridCollection({
            collection,
            keyProperty: 'key',
            columns: [{}, {}, {}],
            multiSelectVisibility: 'hidden',
            emptyTemplateColumns: [
                { startColumn: 1, endColumn: 2 },
                { startColumn: 2, endColumn: 4 },
            ],
        });
        expect(gridCollection.getEmptyGridRow()).toBeDefined();
        expect(gridCollection.getEmptyGridRow().getColumns().length).toEqual(2);

        const column = gridCollection.getEmptyGridRow().getColumns()[1];
        expect(column._$colspan).toEqual(2);
    });

    it('separated columns and multiselect', () => {
        gridCollection = new GridCollection({
            collection,
            keyProperty: 'key',
            columns: [{}, {}, {}],
            multiSelectVisibility: 'visible',
            emptyTemplateColumns: [
                { startColumn: 1, endColumn: 2 },
                { startColumn: 2, endColumn: 4 },
            ],
        });
        expect(gridCollection.getEmptyGridRow()).toBeDefined();
        expect(gridCollection.getEmptyGridRow().getColumns().length).toEqual(3);
        expect(
            gridCollection.getEmptyGridRow().getColumns()[0].getColspanStyles()
        ).toEqual('grid-column: 1 / 2;');
    });
});
