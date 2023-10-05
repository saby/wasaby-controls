import { RecordSet } from 'Types/collection';
import { GridCollection } from 'Controls/grid';

const rawData = [
    { key: 1, ladder: '1', group: '1', text: 'item-1' },
    { key: 2, ladder: '1', group: '1', text: 'item-2' },
    { key: 3, ladder: '2', group: '2', text: 'item-3' },
    { key: 4, ladder: '3', group: '2', text: 'item-4' },
];
const columns = [{ displayProperty: 'text', stickyProperty: ['ladder'], width: '100px' }];

describe('Controls/grid_clean/Display/Ladder/Grid/CollapseGroup', () => {
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
    it('should set ladder on correct items', () => {
        const expectedLadderItems = [
            {
                columns: [{ constructorName: 'GroupCell', width: '100px' }],
            },
            {
                columns: [
                    {
                        constructorName: 'StickyLadderCell',
                        wrapperStyles: 'grid-row: span 2',
                        width: '100px',
                    },
                    { constructorName: 'DataCell', width: '100px' },
                ],
            },
            {
                columns: [
                    { constructorName: 'DataCell', width: '100px' },
                    { constructorName: 'DataCell', width: '100px' },
                ],
            },
            {
                columns: [{ constructorName: 'GroupCell', width: '100px' }],
            },
            {
                columns: [
                    {
                        constructorName: 'StickyLadderCell',
                        wrapperStyles: 'grid-row: span 1',
                        width: '100px',
                    },
                    { constructorName: 'DataCell', width: '100px' },
                ],
            },
            {
                columns: [
                    {
                        constructorName: 'StickyLadderCell',
                        wrapperStyles: 'grid-row: span 1',
                        width: '100px',
                    },
                    { constructorName: 'DataCell', width: '100px' },
                ],
            },
        ];
        const expectedLaddersItemsAfterCollapseGroup = [
            {
                columns: [{ constructorName: 'GroupCell', width: '100px' }],
            },
            {
                columns: [{ constructorName: 'GroupCell', width: '100px' }],
            },
            {
                columns: [
                    {
                        constructorName: 'StickyLadderCell',
                        wrapperStyles: 'grid-row: span 1',
                        width: '100px',
                    },
                    { constructorName: 'DataCell', width: '100px' },
                ],
            },
            {
                columns: [
                    {
                        constructorName: 'StickyLadderCell',
                        wrapperStyles: 'grid-row: span 1',
                        width: '100px',
                    },
                    { constructorName: 'DataCell', width: '100px' },
                ],
            },
        ];

        const gridCollection = new GridCollection({
            collection,
            keyProperty: 'key',
            columns,
            groupProperty: 'group',
            ladderProperties: ['ladder'],
        });
        checkCollectionItems(gridCollection, expectedLadderItems);
        gridCollection.setCollapsedGroups(['1']);
        checkCollectionItems(gridCollection, expectedLaddersItemsAfterCollapseGroup);
    });
});

function checkCollectionItems(collection: GridCollection<any>, resultItems: any[]) {
    const expectedItemsCount = resultItems.length;
    let itemsCount = 0;

    // check items columns
    collection.getViewIterator().each((item, index) => {
        itemsCount++;
        const resultItem = resultItems[index];
        const itemColumns = item.getColumns();

        // check columns count
        try {
            expect(itemColumns.length).toBe(resultItem.columns.length);
        } catch (originalError) {
            throw new Error(originalError + `. itemIndex: ${index}`);
        }

        // check columns instances
        itemColumns.forEach((column, columnIndex) => {
            const resultColumn = resultItem.columns[columnIndex];
            try {
                expect(column.constructor.name).toBe(resultColumn.constructorName);
                if (resultColumn.hasOwnProperty('wrapperStyles')) {
                    expect(column.getWrapperStyles()).toBe(resultColumn.wrapperStyles);
                }
            } catch (originalError) {
                throw new Error(
                    originalError + `. itemIndex: ${index}, columnIndex: ${columnIndex}`
                );
            }
        });
    });

    // check items count
    expect(itemsCount).toBe(expectedItemsCount);
}
