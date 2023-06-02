import { RecordSet } from 'Types/collection';
import { GridCollection } from 'Controls/grid';

const rawData = [
    { key: 1, col1: 'c1-1', col2: 'с2-1', col3: 'с3-1' },
    { key: 2, col1: 'c1-2', col2: 'с2-2', col3: 'с3-2' },
    { key: 3, col1: 'c1-3', col2: 'с2-3', col3: 'с3-3' },
    { key: 4, col1: 'c1-4', col2: 'с2-4', col3: 'с3-4' },
];
const columns = [
    { displayProperty: 'col1' },
    { displayProperty: 'col2' },
    { displayProperty: 'col3' },
];

describe('Controls/grid_clean/Display/EmptyTemplate/UpdateOption', () => {
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

    it('Initialize without emptyTemplate and set emptyTemplate', () => {
        const gridCollection = new GridCollection({
            collection,
            keyProperty: 'key',
            columns,
        });

        expect(gridCollection.getEmptyGridRow()).not.toBeDefined();
        expect(gridCollection.getVersion()).toBe(0);

        gridCollection.setEmptyTemplate(() => {
            return 'EMPTY_TEMPLATE';
        });

        expect(gridCollection.getEmptyGridRow()).toBeDefined();
        expect(gridCollection.getVersion()).toBe(1);
    });

    it('Initialize with emptyTemplate and reset emptyTemplate', () => {
        const gridCollection = new GridCollection({
            collection,
            keyProperty: 'key',
            columns,
            emptyTemplate: () => {
                return 'EMPTY_TEMPLATE';
            },
        });

        expect(gridCollection.getEmptyGridRow()).toBeDefined();
        expect(gridCollection.getVersion()).toBe(0);

        gridCollection.setEmptyTemplate(undefined);

        expect(gridCollection.getEmptyGridRow()).not.toBeDefined();
        expect(gridCollection.getVersion()).toBe(1);
    });

    it('Initialize with emptyTemplate and replace emptyTemplate', () => {
        const gridCollection = new GridCollection({
            collection,
            keyProperty: 'key',
            columns,
            emptyTemplate: () => {
                return 'EMPTY_TEMPLATE';
            },
        });

        const newEmptyTemplate = () => {
            return 'NEW_EMPTY_TEMPLATE';
        };

        const emptyGridRow = gridCollection.getEmptyGridRow();

        const spy = jest.spyOn(emptyGridRow, 'setRowTemplate').mockClear();

        gridCollection.setEmptyTemplate(newEmptyTemplate);

        expect(emptyGridRow.setRowTemplate).toHaveBeenCalledTimes(1);
        expect(emptyGridRow.setRowTemplate.mock.calls[0][0]).toBe(
            newEmptyTemplate
        );
        expect(gridCollection.getVersion()).toBe(1);

        spy.mockRestore();
    });
});
