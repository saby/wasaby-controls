import { GridCollection } from 'Controls/grid';
import { VirtualScrollController } from 'Controls/display';
import { RecordSet } from 'Types/collection';

const keyProperty = 'key';

const displayProperties = ['first', 'second', 'third'];

const ladderProperties = ['firstSticky', 'secondSticky'];

const COLUMNS_COUNT_2 = [
    {
        displayProperty: displayProperties[0],
        stickyProperty: ladderProperties,
        width: '100px',
    },
    {
        displayProperty: displayProperties[1],
        width: '200px',
    },
];

const COLUMNS_COUNT_3 = [
    {
        displayProperty: displayProperties[0],
        stickyProperty: ladderProperties,
        width: '100px',
    },
    {
        displayProperty: displayProperties[1],
        width: '200px',
    },
    {
        displayProperty: displayProperties[2],
        width: '300px',
    },
];

function generateStickyLadderData(itemsCount: number): object[] {
    const data = [];
    for (let i = 0; i < itemsCount; i++) {
        const item = {};
        item[keyProperty] = i;
        item[ladderProperties[0]] = Math.floor(i / 5);
        item[ladderProperties[1]] = Math.floor(i / 2);
        displayProperties.forEach((property) => {
            item[property] = `${property} ${i}`;
        });
        data.push(item);
    }
    return data;
}

describe('Controls/display/GridCollection/StickyLadder', () => {
    describe('Without multiSelect', () => {
        const itemsCount = 10;
        let rs: RecordSet;

        beforeEach(() => {
            rs = new RecordSet({
                rawData: generateStickyLadderData(itemsCount),
                keyProperty,
            });
        });

        afterEach(() => {
            rs = undefined;
        });

        it('Initialize', () => {
            // initialize test result
            const resultItems = RESULT_ITEMS_10_COLUMNS_2_WITHOUT_MULTI_SELECT;

            // initialize collection
            const collection = new GridCollection({
                collection: rs,
                keyProperty,
                columns: COLUMNS_COUNT_2,
                ladderProperties,
            });
            VirtualScrollController.setup(
                collection as unknown as VirtualScrollController.IVirtualScrollCollection
            );
            collection.setIndexes(0, itemsCount);

            // test
            try {
                checkCollectionItems(collection, resultItems);
            } catch (error) {
                throw error;
            }
        });

        it('Indexes changed to 0..5', () => {
            // initialize test result
            const resultItems = RESULT_ITEMS_5_COLUMNS_2_WITHOUT_MULTI_SELECT;

            // initialize collection
            const collection = new GridCollection({
                collection: rs,
                keyProperty,
                columns: COLUMNS_COUNT_2,
                ladderProperties,
            });
            VirtualScrollController.setup(
                collection as unknown as VirtualScrollController.IVirtualScrollCollection
            );
            collection.setIndexes(0, 5);

            // test
            try {
                checkCollectionItems(collection, resultItems);
            } catch (error) {
                throw error;
            }
        });

        it('Columns count changed from 2 to 3', () => {
            // initialize test result
            const resultItems = RESULT_ITEMS_10_COLUMNS_3_WITHOUT_MULTI_SELECT;

            // initialize collection
            const collection = new GridCollection({
                collection: rs,
                keyProperty,
                columns: COLUMNS_COUNT_2,
                ladderProperties,
            });
            VirtualScrollController.setup(
                collection as unknown as VirtualScrollController.IVirtualScrollCollection
            );
            collection.setIndexes(0, itemsCount);
            collection.setColumns(COLUMNS_COUNT_3);

            // test
            try {
                checkCollectionItems(collection, resultItems);
            } catch (error) {
                throw error;
            }
        });

        it('Indexes sets to 0..5. Set multiSelectVisibility to "visible"', () => {
            // initialize test result
            const resultItems = RESULT_ITEMS_5_COLUMNS_2_WITH_MULTI_SELECT;

            // initialize collection
            const collection = new GridCollection({
                collection: rs,
                keyProperty,
                columns: COLUMNS_COUNT_2,
                ladderProperties,
            });
            VirtualScrollController.setup(
                collection as unknown as VirtualScrollController.IVirtualScrollCollection
            );
            collection.setIndexes(0, 5);
            collection.setMultiSelectVisibility('visible');

            // test
            try {
                checkCollectionItems(collection, resultItems);
            } catch (error) {
                throw error;
            }
        });

        it('Indexes sets to 0..10. Index changed to 0..5. Set multiSelectVisibility to "visible". Remove item with index=2.', () => {
            // initialize test result
            const resultItems =
                RESULT_ITEMS_5_COLUMNS_2_WITH_MULTI_SELECT_AFTER_REMOVE_ITEMS;

            // initialize collection
            const collection = new GridCollection({
                collection: rs,
                keyProperty,
                columns: COLUMNS_COUNT_2,
                ladderProperties,
            });
            VirtualScrollController.setup(
                collection as unknown as VirtualScrollController.IVirtualScrollCollection
            );
            collection.setIndexes(0, itemsCount);
            collection.setIndexes(0, 5);
            collection.setMultiSelectVisibility('visible');
            rs.removeAt(2);
            collection.setIndexes(0, 5);

            // test
            try {
                checkCollectionItems(collection, resultItems);
            } catch (error) {
                throw error;
            }
        });

        it('Check emptyTemplate with multi-ladder', () => {
            // initialize collection
            const collection = new GridCollection({
                collection: new RecordSet({
                    rawData: [],
                    keyProperty,
                }),
                keyProperty,
                columns: COLUMNS_COUNT_2,
                ladderProperties,
                emptyTemplate: () => {
                    return '<div>EMPTY ROW</div>';
                },
            });

            const emptyGridRow = collection.getEmptyGridRow();
            expect(emptyGridRow).toBeDefined();
            const emptyRowColumns = emptyGridRow.getColumns();
            expect(emptyRowColumns.length).toBe(1);
            expect(
                collection.getEmptyGridRow().getColumns()[0].getWrapperStyles()
            ).toBe('grid-column: 1 / 5;');
        });
    });
});

function checkCollectionItems(
    collection: GridCollection<any>,
    resultItems: any[]
) {
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
                expect(column.constructor.name).toBe(
                    resultColumn.constructorName
                );
                if (resultColumn.hasOwnProperty('wrapperStyles')) {
                    expect(column.getWrapperStyles()).toBe(
                        resultColumn.wrapperStyles
                    );
                }
            } catch (originalError) {
                throw new Error(
                    originalError +
                        `. itemIndex: ${index}, columnIndex: ${columnIndex}`
                );
            }
        });
    });

    // check items count
    expect(itemsCount).toBe(expectedItemsCount);
}

const RESULT_ITEMS_10_COLUMNS_2_WITHOUT_MULTI_SELECT = [
    {
        columns: [
            {
                constructorName: 'StickyLadderCell',
                wrapperStyles: 'grid-row: span 5',
            },
            { constructorName: 'DataCell' },
            {
                constructorName: 'StickyLadderCell',
                wrapperStyles: 'grid-row: span 2',
            },
            { constructorName: 'DataCell' },
        ],
    },
    {
        columns: [
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
        ],
    },
    {
        columns: [
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            {
                constructorName: 'StickyLadderCell',
                wrapperStyles: 'grid-row: span 2',
            },
            { constructorName: 'DataCell' },
        ],
    },
    {
        columns: [
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
        ],
    },
    {
        columns: [
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            {
                constructorName: 'StickyLadderCell',
                wrapperStyles: 'grid-row: span 1',
            },
            { constructorName: 'DataCell' },
        ],
    },
    {
        columns: [
            {
                constructorName: 'StickyLadderCell',
                wrapperStyles: 'grid-row: span 5',
            },
            { constructorName: 'DataCell' },
            {
                constructorName: 'StickyLadderCell',
                wrapperStyles: 'grid-row: span 1',
            },
            { constructorName: 'DataCell' },
        ],
    },
    {
        columns: [
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            {
                constructorName: 'StickyLadderCell',
                wrapperStyles: 'grid-row: span 2',
            },
            { constructorName: 'DataCell' },
        ],
    },
    {
        columns: [
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
        ],
    },
    {
        columns: [
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            {
                constructorName: 'StickyLadderCell',
                wrapperStyles: 'grid-row: span 2',
            },
            { constructorName: 'DataCell' },
        ],
    },
    {
        columns: [
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
        ],
    },
];

const RESULT_ITEMS_5_COLUMNS_2_WITHOUT_MULTI_SELECT = [
    {
        columns: [
            {
                constructorName: 'StickyLadderCell',
                wrapperStyles: 'grid-row: span 5',
            },
            { constructorName: 'DataCell' },
            {
                constructorName: 'StickyLadderCell',
                wrapperStyles: 'grid-row: span 2',
            },
            { constructorName: 'DataCell' },
        ],
    },
    {
        columns: [
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
        ],
    },
    {
        columns: [
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            {
                constructorName: 'StickyLadderCell',
                wrapperStyles: 'grid-row: span 2',
            },
            { constructorName: 'DataCell' },
        ],
    },
    {
        columns: [
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
        ],
    },
    {
        columns: [
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            {
                constructorName: 'StickyLadderCell',
                wrapperStyles: 'grid-row: span 1',
            },
            { constructorName: 'DataCell' },
        ],
    },
];

const RESULT_ITEMS_5_COLUMNS_2_WITH_MULTI_SELECT = [
    {
        columns: [
            { constructorName: 'CheckboxCell' },
            {
                constructorName: 'StickyLadderCell',
                wrapperStyles: 'grid-row: span 5',
            },
            { constructorName: 'DataCell' },
            {
                constructorName: 'StickyLadderCell',
                wrapperStyles: 'grid-row: span 2',
            },
            { constructorName: 'DataCell' },
        ],
    },
    {
        columns: [
            { constructorName: 'CheckboxCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
        ],
    },
    {
        columns: [
            { constructorName: 'CheckboxCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            {
                constructorName: 'StickyLadderCell',
                wrapperStyles: 'grid-row: span 2',
            },
            { constructorName: 'DataCell' },
        ],
    },
    {
        columns: [
            { constructorName: 'CheckboxCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
        ],
    },
    {
        columns: [
            { constructorName: 'CheckboxCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            {
                constructorName: 'StickyLadderCell',
                wrapperStyles: 'grid-row: span 1',
            },
            { constructorName: 'DataCell' },
        ],
    },
];

const RESULT_ITEMS_5_COLUMNS_2_WITH_MULTI_SELECT_AFTER_REMOVE_ITEMS = [
    {
        columns: [
            { constructorName: 'CheckboxCell' },
            {
                constructorName: 'StickyLadderCell',
                wrapperStyles: 'grid-row: span 4',
            },
            { constructorName: 'DataCell' },
            {
                constructorName: 'StickyLadderCell',
                wrapperStyles: 'grid-row: span 2',
            },
            { constructorName: 'DataCell' },
        ],
    },
    {
        columns: [
            { constructorName: 'CheckboxCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
        ],
    },
    {
        columns: [
            { constructorName: 'CheckboxCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            {
                constructorName: 'StickyLadderCell',
                wrapperStyles: 'grid-row: span 1',
            },
            { constructorName: 'DataCell' },
        ],
    },
    {
        columns: [
            { constructorName: 'CheckboxCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            {
                constructorName: 'StickyLadderCell',
                wrapperStyles: 'grid-row: span 1',
            },
            { constructorName: 'DataCell' },
        ],
    },
    {
        columns: [
            { constructorName: 'CheckboxCell' },
            {
                constructorName: 'StickyLadderCell',
                wrapperStyles: 'grid-row: span 1',
            },
            { constructorName: 'DataCell' },
            {
                constructorName: 'StickyLadderCell',
                wrapperStyles: 'grid-row: span 1',
            },
            { constructorName: 'DataCell' },
        ],
    },
];

const RESULT_ITEMS_10_COLUMNS_3_WITHOUT_MULTI_SELECT = [
    {
        columns: [
            {
                constructorName: 'StickyLadderCell',
                wrapperStyles: 'grid-row: span 5',
            },
            { constructorName: 'DataCell' },
            {
                constructorName: 'StickyLadderCell',
                wrapperStyles: 'grid-row: span 2',
            },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
        ],
    },
    {
        columns: [
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
        ],
    },
    {
        columns: [
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            {
                constructorName: 'StickyLadderCell',
                wrapperStyles: 'grid-row: span 2',
            },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
        ],
    },
    {
        columns: [
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
        ],
    },
    {
        columns: [
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            {
                constructorName: 'StickyLadderCell',
                wrapperStyles: 'grid-row: span 1',
            },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
        ],
    },
    {
        columns: [
            {
                constructorName: 'StickyLadderCell',
                wrapperStyles: 'grid-row: span 5',
            },
            { constructorName: 'DataCell' },
            {
                constructorName: 'StickyLadderCell',
                wrapperStyles: 'grid-row: span 1',
            },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
        ],
    },
    {
        columns: [
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            {
                constructorName: 'StickyLadderCell',
                wrapperStyles: 'grid-row: span 2',
            },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
        ],
    },
    {
        columns: [
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
        ],
    },
    {
        columns: [
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            {
                constructorName: 'StickyLadderCell',
                wrapperStyles: 'grid-row: span 2',
            },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
        ],
    },
    {
        columns: [
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
            { constructorName: 'DataCell' },
        ],
    },
];
