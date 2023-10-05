import { GridCollection } from 'Controls/grid';
import { RecordSet } from 'Types/collection';

const rawData = [
    {
        key: 1,
        col1: 'c1-1',
        col2: 'с2-1',
        col3: 'с3-1',
    },
    {
        key: 2,
        col1: 'c1-2',
        col2: 'с2-2',
        col3: 'с3-2',
    },
];

const columns = [
    { displayProperty: 'col1', resultsTemplate: 'mockResultsTemplate1' },
    { displayProperty: 'col2', resultsTemplate: 'mockResultsTemplate2' },
    { displayProperty: 'col3', resultsTemplate: 'mockResultsTemplate3' },
];

describe('Controls/grid_clean/Display/ResultsColspan', () => {
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

    it('Initialize without resultsColspanCallback', () => {
        const gridCollection = new GridCollection({
            collection,
            keyProperty: 'key',
            columns,
            multiSelectVisibility: 'hidden',
            resultsPosition: 'top',
        });

        const columnItems = gridCollection.getResults().getColumns();
        expect(columnItems.length).toBe(3);
        expect(columnItems[0].getColspan()).toBe(1);
        expect(columnItems[0].getColspanStyles()).toBe('');
        expect(columnItems[1].getColspan()).toBe(1);
        expect(columnItems[1].getColspanStyles()).toBe('');
        expect(columnItems[2].getColspan()).toBe(1);
        expect(columnItems[2].getColspanStyles()).toBe('');
    });

    it('Initialize with resultsColspanCallback = () => "end"', () => {
        const gridCollection = new GridCollection({
            collection,
            keyProperty: 'key',
            columns,
            multiSelectVisibility: 'hidden',
            resultsPosition: 'top',
            resultsColspanCallback: () => {
                return 'end';
            },
        });

        const columnItems = gridCollection.getResults().getColumns();
        expect(columnItems.length).toBe(1);
        expect(columnItems[0].getColspan()).toBe(3);
        expect(columnItems[0].getColspanStyles()).toBe('grid-column: 1 / 4;');
    });

    // eslint-disable-next-line max-len
    it('Initialize with resultsColspanCallback = (column, columnIndex) => columnIndex === 1 ? "end" : undefined ', () => {
        const gridCollection = new GridCollection({
            collection,
            keyProperty: 'key',
            columns,
            multiSelectVisibility: 'hidden',
            resultsPosition: 'top',
            resultsColspanCallback: (column, columnIndex) => {
                return columnIndex === 1 ? 'end' : undefined;
            },
        });

        const columnItems = gridCollection.getResults().getColumns();
        expect(columnItems.length).toBe(2);
        expect(columnItems[0].getColspan()).toBe(1);
        expect(columnItems[0].getColspanStyles()).toBe('');
        expect(columnItems[1].getColspan()).toBe(2);
        expect(columnItems[1].getColspanStyles()).toBe('grid-column: 2 / 4;');
    });

    // eslint-disable-next-line max-len
    it('Initialize with resultsColspanCallback = (column, columnIndex) => columnIndex === 2 ? "end" : undefined ', () => {
        const gridCollection = new GridCollection({
            collection,
            keyProperty: 'key',
            columns,
            multiSelectVisibility: 'hidden',
            resultsPosition: 'top',
            resultsColspanCallback: (column, columnIndex) => {
                return columnIndex === 2 ? 'end' : undefined;
            },
        });

        const columnItems = gridCollection.getResults().getColumns();
        expect(columnItems.length).toBe(3);
        expect(columnItems[0].getColspan()).toBe(1);
        expect(columnItems[0].getColspanStyles()).toBe('');
        expect(columnItems[1].getColspan()).toBe(1);
        expect(columnItems[1].getColspanStyles()).toBe('');
        expect(columnItems[2].getColspan()).toBe(1);
        expect(columnItems[2].getColspanStyles()).toBe('');
    });

    it('Initialize with resultsColspanCallback and reset callback', () => {
        const gridCollection = new GridCollection({
            collection,
            keyProperty: 'key',
            columns,
            multiSelectVisibility: 'hidden',
            resultsPosition: 'top',
            resultsColspanCallback: () => {
                return 'end';
            },
        });

        // initialize
        let columnItems = gridCollection.getResults().getColumns();
        expect(columnItems.length).toBe(1);
        expect(columnItems[0].getColspan()).toBe(3);
        expect(columnItems[0].getColspanStyles()).toBe('grid-column: 1 / 4;');

        // reset callback
        gridCollection.setResultsColspanCallback(undefined);
        columnItems = gridCollection.getResults().getColumns();
        expect(columnItems.length).toBe(3);
        expect(columnItems[0].getColspan()).toBe(1);
        expect(columnItems[0].getColspanStyles()).toBe('');
        expect(columnItems[1].getColspan()).toBe(1);
        expect(columnItems[1].getColspanStyles()).toBe('');
        expect(columnItems[2].getColspan()).toBe(1);
        expect(columnItems[2].getColspanStyles()).toBe('');
    });

    it('Initialize without resultsColspanCallback and set callback', () => {
        const gridCollection = new GridCollection({
            collection,
            keyProperty: 'key',
            columns,
            multiSelectVisibility: 'hidden',
            resultsPosition: 'top',
        });

        // initialize
        let columnItems = gridCollection.getResults().getColumns();
        expect(columnItems.length).toBe(3);
        expect(columnItems[0].getColspan()).toBe(1);
        expect(columnItems[0].getColspanStyles()).toBe('');
        expect(columnItems[1].getColspan()).toBe(1);
        expect(columnItems[1].getColspanStyles()).toBe('');
        expect(columnItems[2].getColspan()).toBe(1);
        expect(columnItems[2].getColspanStyles()).toBe('');

        // reset callback
        gridCollection.setResultsColspanCallback((column, columnIndex) => {
            return columnIndex === 0 ? 2 : undefined;
        });
        columnItems = gridCollection.getResults().getColumns();
        expect(columnItems.length).toBe(2);
        expect(columnItems[0].getColspan()).toBe(2);
        expect(columnItems[0].getColspanStyles()).toBe('grid-column: 1 / 3;');
        expect(columnItems[1].getColspan()).toBe(1);
        expect(columnItems[1].getColspanStyles()).toBe('');
    });

    it('getWrapperStyles on cells should look at colspan', () => {
        const gridCollection = new GridCollection({
            collection,
            keyProperty: 'key',
            columns,
            multiSelectVisibility: 'hidden',
            resultsPosition: 'top',
            resultsColspanCallback: () => {
                return 2;
            },
        });

        const columnItems = gridCollection.getResults().getColumns();
        expect(columnItems.length).toBe(2);
        expect(columnItems[0].getWrapperStyles()).toBe('grid-column: 1 / 3;');
        expect(columnItems[1].getWrapperStyles()).toBe('grid-column: 3 / 5;');
    });
});
