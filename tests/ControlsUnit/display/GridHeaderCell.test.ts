import { GridHeaderCell } from 'Controls/grid';
import { getHeaderRowMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/display:HeaderCell', () => {
    describe('align and valign', () => {
        it('should use values from header if it exist', () => {
            const headerColumnConfig = {
                align: 'right',
                valign: 'bottom',
            };
            const cell = new GridHeaderCell({
                owner: getHeaderRowMock({
                    gridColumnsConfig: [{}],
                    headerColumnsConfig: [headerColumnConfig],
                    hasMultiSelectColumn: false,
                }),
                column: headerColumnConfig,
            });
            expect('right').toEqual(cell.getAlign());
            expect('bottom').toEqual(cell.getVAlign());
        });

        it('should use values from columns if values on header not exist', () => {
            const headerColumnConfig = {};
            const cell = new GridHeaderCell({
                owner: getHeaderRowMock({
                    gridColumnsConfig: [
                        {
                            align: 'right',
                            valign: 'bottom',
                        },
                    ],
                    headerColumnsConfig: [headerColumnConfig],
                    hasMultiSelectColumn: false,
                }),
                column: headerColumnConfig,
            });
            expect('right').toEqual(cell.getAlign());
            expect('bottom').toEqual(cell.getVAlign());
        });

        it('should set valign center on row spanned cell if value on cell config not exists', () => {
            const headerColumnConfig = {
                startRow: 1,
                endRow: 3,
            };
            const cell = new GridHeaderCell({
                owner: getHeaderRowMock({
                    gridColumnsConfig: [
                        {
                            align: 'right',
                            valign: 'bottom',
                        },
                    ],
                    headerColumnsConfig: [headerColumnConfig],
                    hasMultiSelectColumn: false,
                }),
                column: headerColumnConfig,
            });
            expect('right').toEqual(cell.getAlign());
            expect('center').toEqual(cell.getVAlign());
        });

        it('should set align center on colspanned cell if value on cell config not exists', () => {
            const headerColumnConfig = {
                startColumn: 1,
                endColumn: 3,
            };
            const cell = new GridHeaderCell({
                owner: getHeaderRowMock({
                    gridColumnsConfig: [
                        {
                            align: 'right',
                            valign: 'bottom',
                        },
                    ],
                    headerColumnsConfig: [headerColumnConfig],
                    hasMultiSelectColumn: false,
                }),
                column: headerColumnConfig,
            });
            expect('center').toEqual(cell.getAlign());
            expect('bottom').toEqual(cell.getVAlign());
        });
    });
});
