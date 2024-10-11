import { GridHeaderRow } from 'Controls/grid';
import { getGridCollectionMock } from 'ControlsUnit/_listsUtils/mockOwner';

const THEME = 'UnitTests';

describe('Controls/grid_clean/Display/HeaderRow', () => {
    describe('Controls/grid_clean/Display/HeaderRow/Spacing', () => {
        it('Padding set in owner', () => {
            const columns = [{}, {}, {}];
            const header = [{}, {}, {}];

            const mockedHeaderModel = {
                isMultiline: () => {
                    return false;
                },
                isSticked: () => {
                    return false;
                },
            };

            const headerRow = new GridHeaderRow({
                columnsConfig: header,
                headerModel: mockedHeaderModel,
                gridColumnsConfig: columns,
                owner: getGridCollectionMock({
                    gridColumnsConfig: columns,
                    headerConfig: header,
                    leftPadding: 's',
                    rightPadding: 's',
                }),
            });
            const columnItems = headerRow.getColumns();
            expect(columnItems.length).toBe(3);

            expect(
                columnItems[0]
                    .getWrapperClasses()
                    .indexOf('controls-Grid__cell_spacingFirstCol_s') !== -1
            ).toBe(true);
            expect(
                columnItems[0].getWrapperClasses().indexOf('controls-Grid__cell_spacingLeft') !== -1
            ).toBe(false);
            expect(
                columnItems[0].getWrapperClasses().indexOf('controls-Grid__cell_spacingLastCol') !==
                    -1
            ).toBe(false);
            expect(
                columnItems[0].getWrapperClasses().indexOf('controls-Grid__cell_spacingRight') !==
                    -1
            ).toBe(true);

            expect(
                columnItems[1]
                    .getWrapperClasses()
                    .indexOf('controls-Grid__cell_spacingFirstCol') !== -1
            ).toBe(false);
            expect(
                columnItems[1].getWrapperClasses().indexOf('controls-Grid__cell_spacingLeft') !== -1
            ).toBe(true);
            expect(
                columnItems[1].getWrapperClasses().indexOf('controls-Grid__cell_spacingLastCol') !==
                    -1
            ).toBe(false);
            expect(
                columnItems[1].getWrapperClasses().indexOf('controls-Grid__cell_spacingRight') !==
                    -1
            ).toBe(true);

            expect(
                columnItems[2]
                    .getWrapperClasses()
                    .indexOf('controls-Grid__cell_spacingFirstCol') !== -1
            ).toBe(false);
            expect(
                columnItems[2].getWrapperClasses().indexOf('controls-Grid__cell_spacingLeft') !== -1
            ).toBe(true);
            expect(
                columnItems[2]
                    .getWrapperClasses()
                    .indexOf('controls-Grid__cell_spacingLastCol_s') !== -1
            ).toBe(true);
            expect(
                columnItems[2].getWrapperClasses().indexOf('controls-Grid__cell_spacingRight') !==
                    -1
            ).toBe(false);
        });

        it('Padding set in columns', () => {
            const columns = [
                {
                    cellPadding: {
                        left: 'l',
                        right: 'l',
                    },
                },
                {
                    cellPadding: {
                        left: 'xl',
                        right: 'xl',
                    },
                },
                {
                    cellPadding: {
                        left: 'xs',
                        right: 'xs',
                    },
                },
            ];
            const header = [{}, {}, {}];

            const mockedHeaderModel = {
                isMultiline: () => {
                    return false;
                },
                isSticked: () => {
                    return false;
                },
            };

            const headerRow = new GridHeaderRow({
                columnsConfig: header,
                headerModel: mockedHeaderModel,
                gridColumnsConfig: columns,
                owner: getGridCollectionMock({
                    gridColumnsConfig: columns,
                    headerConfig: header,
                    leftPadding: 's',
                    rightPadding: 's',
                }),
            });
            const columnItems = headerRow.getColumns();
            expect(columnItems.length).toBe(3);

            expect(columnItems[0].getWrapperClasses(THEME)).toContain(
                'controls-Grid__cell_spacingFirstCol_s'
            );
            expect(columnItems[0].getWrapperClasses(THEME)).not.toContain(
                'controls-Grid__cell_spacingLeft'
            );
            expect(columnItems[0].getWrapperClasses(THEME)).not.toContain(
                'controls-Grid__cell_spacingLastCol'
            );
            expect(columnItems[0].getWrapperClasses(THEME)).toContain(
                'controls-Grid__cell_spacingRight_l'
            );

            expect(columnItems[1].getWrapperClasses(THEME)).not.toContain(
                'controls-Grid__cell_spacingFirstCol'
            );
            expect(columnItems[1].getWrapperClasses(THEME)).toContain(
                'controls-Grid__cell_spacingLeft_xl'
            );
            expect(columnItems[1].getWrapperClasses(THEME)).not.toContain(
                'controls-Grid__cell_spacingLastCol'
            );
            expect(columnItems[1].getWrapperClasses(THEME)).toContain(
                'controls-Grid__cell_spacingRight_xl'
            );

            expect(columnItems[2].getWrapperClasses(THEME)).not.toContain(
                'controls-Grid__cell_spacingFirstCol'
            );
            expect(columnItems[2].getWrapperClasses(THEME)).toContain(
                'controls-Grid__cell_spacingLeft_xs'
            );
            expect(columnItems[2].getWrapperClasses(THEME)).toContain(
                'controls-Grid__cell_spacingLastCol_s'
            );
            expect(columnItems[2].getWrapperClasses(THEME)).not.toContain(
                'controls-Grid__cell_spacingRight'
            );
        });
        it('Padding set default value', () => {
            const columns = [{}, {}, {}];
            const header = [{}, {}, {}];

            const mockedHeaderModel = {
                isMultiline: () => {
                    return false;
                },
                isSticked: () => {
                    return false;
                },
            };

            const headerRow = new GridHeaderRow({
                columnsConfig: header,
                headerModel: mockedHeaderModel,
                gridColumnsConfig: columns,
                owner: getGridCollectionMock({
                    gridColumnsConfig: columns,
                    headerConfig: header,
                    leftPadding: 'default',
                    rightPadding: 'default',
                }),
            });
            const columnItems = headerRow.getColumns();
            expect(columnItems.length).toBe(3);

            expect(columnItems[0].getWrapperClasses(THEME)).toContain(
                'controls-Grid__cell_spacingFirstCol_default'
            );
            expect(columnItems[0].getWrapperClasses(THEME)).not.toContain(
                'controls-Grid__cell_spacingLeft'
            );
            expect(columnItems[0].getWrapperClasses(THEME)).not.toContain(
                'controls-Grid__cell_spacingLastCol'
            );
            expect(columnItems[0].getWrapperClasses(THEME)).toContain(
                'controls-Grid__cell_spacingRight'
            );

            expect(columnItems[1].getWrapperClasses(THEME)).not.toContain(
                'controls-Grid__cell_spacingFirstCol'
            );
            expect(columnItems[1].getWrapperClasses(THEME)).toContain(
                'controls-Grid__cell_spacingLeft'
            );
            expect(columnItems[1].getWrapperClasses(THEME)).not.toContain(
                'controls-Grid__cell_spacingLastCol'
            );
            expect(columnItems[1].getWrapperClasses(THEME)).toContain(
                'controls-Grid__cell_spacingRight'
            );

            expect(columnItems[2].getWrapperClasses(THEME)).not.toContain(
                'controls-Grid__cell_spacingFirstCol'
            );
            expect(columnItems[2].getWrapperClasses(THEME)).toContain(
                'controls-Grid__cell_spacingLeft'
            );
            expect(columnItems[2].getWrapperClasses(THEME)).toContain(
                'controls-Grid__cell_spacingLastCol_default'
            );
            expect(columnItems[2].getWrapperClasses(THEME)).not.toContain(
                'controls-Grid__cell_spacingRight'
            );
        });
    });

    describe('Controls/grid_clean/Display/HeaderRow/MultilineHeader', () => {
        it('Simple multiline cells', () => {
            const columns = [{}, {}, {}];

            /* |             |   Two columns                                                |
               |  Two rows   |   --------------------------------------------------------   |
               |             |   Second row, first column   |   Second row, second column   | */
            const header = [
                {
                    startRow: 1,
                    endRow: 3,
                    startColumn: 1,
                    endColumn: 2,
                    caption: 'Two rows',
                },
                {
                    startRow: 1,
                    endRow: 2,
                    startColumn: 2,
                    endColumn: 4,
                    caption: 'Two columns',
                },
                {
                    startRow: 2,
                    endRow: 3,
                    startColumn: 2,
                    endColumn: 3,
                    caption: 'Second row, first column',
                },
                {
                    startRow: 1,
                    endRow: 3,
                    startColumn: 3,
                    endColumn: 4,
                    caption: 'Second row, second column',
                },
            ];

            const mockedHeaderModel = {
                isMultiline: () => {
                    return true;
                },
                getBounds: () => {
                    return {
                        column: {
                            start: 1,
                            end: 4,
                        },
                        row: {
                            start: 1,
                            end: 3,
                        },
                    };
                },
                isSticked: () => {
                    return false;
                },
            };

            const headerRow = new GridHeaderRow({
                columnsConfig: header,
                headerModel: mockedHeaderModel,
                gridColumnsConfig: columns,
                owner: getGridCollectionMock({
                    gridColumnsConfig: columns,
                    headerConfig: header,
                    leftPadding: 's',
                    rightPadding: 's',
                }),
            });
            const columnItems = headerRow.getColumns();
            expect(columnItems.length).toBe(4);

            expect(columnItems[0].isLastColumn()).toBe(false);
            expect(columnItems[1].isLastColumn()).toBe(true);
            expect(columnItems[2].isLastColumn()).toBe(false);
            expect(columnItems[3].isLastColumn()).toBe(true);
        });

        it('Difficult multiline cells', () => {
            const columns = [{}, {}, {}, {}];

            /* |             |   Two columns                                                |                 |
               |  Two rows   |   --------------------------------------------------------   |   Two rows,     |
               |             |   Second row, first column   |   Second row, second column   |   last column   | */
            const header = [
                {
                    startRow: 1,
                    endRow: 3,
                    startColumn: 1,
                    endColumn: 2,
                    caption: 'Two rows',
                },
                {
                    startRow: 1,
                    endRow: 2,
                    startColumn: 2,
                    endColumn: 4,
                    caption: 'Two columns',
                },
                {
                    startRow: 2,
                    endRow: 3,
                    startColumn: 2,
                    endColumn: 3,
                    caption: 'Second row, first column',
                },
                {
                    startRow: 1,
                    endRow: 3,
                    startColumn: 3,
                    endColumn: 4,
                    caption: 'Second row, second column',
                },
                {
                    startRow: 1,
                    endRow: 3,
                    startColumn: 4,
                    endColumn: 5,
                    caption: 'Two rows, last column',
                },
            ];

            const mockedHeaderModel = {
                isMultiline: () => {
                    return true;
                },
                getBounds: () => {
                    return {
                        column: {
                            start: 1,
                            end: 5,
                        },
                        row: {
                            start: 1,
                            end: 3,
                        },
                    };
                },
                isSticked: () => {
                    return false;
                },
            };

            const headerRow = new GridHeaderRow({
                columnsConfig: header,
                headerModel: mockedHeaderModel,
                gridColumnsConfig: columns,
                owner: getGridCollectionMock({
                    gridColumnsConfig: columns,
                    headerConfig: header,
                    leftPadding: 's',
                    rightPadding: 's',
                }),
            });
            const columnItems = headerRow.getColumns();
            expect(columnItems.length).toBe(5);

            expect(columnItems[0].isLastColumn()).toBe(false);
            expect(columnItems[1].isLastColumn()).toBe(false);
            expect(columnItems[2].isLastColumn()).toBe(false);
            expect(columnItems[3].isLastColumn()).toBe(false);
            expect(columnItems[4].isLastColumn()).toBe(true);
        });

        it('Difficult multiline cells with multiSelect', () => {
            const columns = [{}, {}, {}, {}];

            /* |             |   Two columns                                                |                 |
               |  Two rows   |   --------------------------------------------------------   |   Two rows,     |
               |             |   Second row, first column   |   Second row, second column   |   last column   | */
            const header = [
                {
                    startRow: 1,
                    endRow: 3,
                    startColumn: 1,
                    endColumn: 2,
                    caption: 'Two rows',
                },
                {
                    startRow: 1,
                    endRow: 2,
                    startColumn: 2,
                    endColumn: 4,
                    caption: 'Two columns',
                },
                {
                    startRow: 2,
                    endRow: 3,
                    startColumn: 2,
                    endColumn: 3,
                    caption: 'Second row, first column',
                },
                {
                    startRow: 1,
                    endRow: 3,
                    startColumn: 3,
                    endColumn: 4,
                    caption: 'Second row, second column',
                },
                {
                    startRow: 1,
                    endRow: 3,
                    startColumn: 4,
                    endColumn: 5,
                    caption: 'Two rows, last column',
                },
            ];

            const mockedHeaderModel = {
                isMultiline: () => {
                    return true;
                },
                getBounds: () => {
                    return {
                        column: {
                            start: 1,
                            end: 5,
                        },
                        row: {
                            start: 1,
                            end: 3,
                        },
                    };
                },
                isSticked: () => {
                    return false;
                },
            };

            const headerRow = new GridHeaderRow({
                columnsConfig: header,
                headerModel: mockedHeaderModel,
                gridColumnsConfig: columns,
                owner: getGridCollectionMock({
                    gridColumnsConfig: columns,
                    headerConfig: header,
                    hasMultiSelectColumn: true,
                    leftPadding: 's',
                    rightPadding: 's',
                }),
            });
            const columnItems = headerRow.getColumns();
            expect(columnItems.length).toBe(6);

            expect(columnItems[0].isLastColumn()).toBe(false);
            expect(columnItems[1].isLastColumn()).toBe(false);
            expect(columnItems[2].isLastColumn()).toBe(false);
            expect(columnItems[3].isLastColumn()).toBe(false);
            expect(columnItems[4].isLastColumn()).toBe(false);
            expect(columnItems[5].isLastColumn()).toBe(true);
        });
    });

    describe('Controls/grid_clean/Display/HeaderRow/Sorting', () => {
        describe('.setSorting()', () => {
            it('should update sorting only in header cells with skipping itemActionsCell', () => {
                const columns = [{}, {}, {}];

                const header = [{ caption: 'One' }, { caption: 'Two' }, { caption: 'Three' }];

                const mockedHeaderModel = {
                    isMultiline: () => {
                        return true;
                    },
                    getBounds: () => {
                        return {
                            column: { start: 1, end: 4 },
                            row: { start: 1, end: 2 },
                        };
                    },
                };

                const headerRow = new GridHeaderRow({
                    columnsConfig: header,
                    headerModel: mockedHeaderModel,
                    gridColumnsConfig: columns,
                    owner: getGridCollectionMock({
                        gridColumnsConfig: columns,
                        headerConfig: header,
                        hasItemActionsSeparatedCell: true,
                        leftPadding: 's',
                        rightPadding: 's',
                    }),
                });

                // Проверяем, что в ячейку с операциями над записью не замешалась сортировка.
                headerRow.getColumns()[3].setSorting = () => {
                    throw Error(
                        "ItemActionsCell doesn't support sorting! Method .setSorting() shouldn't exist!"
                    );
                };
                headerRow.getColumns()[3].getSortingProperty = () => {
                    throw Error(
                        "ItemActionsCell doesn't support sorting! Method .getSortingProperty() shouldn't exist!"
                    );
                };

                expect(() => {
                    headerRow.setSorting({
                        One: 'ASC',
                        Two: 'DESC',
                    });
                }).not.toThrow();
            });
        });
    });
});
