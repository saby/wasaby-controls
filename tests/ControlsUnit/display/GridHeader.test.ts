import { GridHeader, GridHeaderRow } from 'Controls/grid';
import { getGridCollectionMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/grid:GridHeader', () => {
    describe('.isSticked()', () => {
        const getOwnerMock = (isStickyHeader, isFullGridSupport) => {
            return getGridCollectionMock({
                gridColumnsConfig: [{}],
                isStickyHeader,
                isFullGridSupport,
            });
        };

        it('should sticky header if options.stickyHeader === true in full grid support browsers', () => {
            const header = new GridHeader({
                owner: getOwnerMock(true, true),
                columnsConfig: [{}],
                gridColumnsConfig: [{}],
            });
            expect(header.isSticked()).toBe(true);
        });

        it('should not sticky header if options.stickyHeader === false in full grid support browsers', () => {
            const header = new GridHeader({
                owner: getOwnerMock(false, true),
                columnsConfig: [{}],
                gridColumnsConfig: [{}],
            });
            expect(header.isSticked()).toBe(false);
        });

        it('should not sticky header in browsers without grid support', () => {
            const header = new GridHeader({
                owner: getOwnerMock(true, false),
                columnsConfig: [{}],
                gridColumnsConfig: [{}],
            });
            expect(header.isSticked()).toBe(false);
        });
    });

    describe('.isMultiline()', () => {
        it('should returns false for solo row header', () => {
            const header = new GridHeader({
                owner: getGridCollectionMock({ gridColumnsConfig: [{}] }),
                columnsConfig: [{}],
                gridColumnsConfig: [{}],
            });
            expect(header.isMultiline()).toBe(false);
        });
    });

    describe('.getRow()', () => {
        it('should returns GridHeaderRow', () => {
            const header = new GridHeader({
                owner: getGridCollectionMock({ gridColumnsConfig: [{}] }),
                columnsConfig: [{}],
                gridColumnsConfig: [{}],
            });
            const row = header.getRow();
            expect(row).toBeInstanceOf(GridHeaderRow);
        });
    });

    describe('.getBounds()', () => {
        it('simple header', () => {
            const header = new GridHeader({
                owner: getGridCollectionMock({ gridColumnsConfig: [{}] }),
                columnsConfig: [{}, {}],
                gridColumnsConfig: [{}, {}],
            });
            expect({
                row: { start: 1, end: 2 },
                column: { start: 1, end: 3 },
            }).toEqual(header.getBounds());
        });

        it('two line header', () => {
            const header = new GridHeader({
                owner: getGridCollectionMock({ gridColumnsConfig: [{}, {}] }),
                columnsConfig: [
                    { startRow: 1, endRow: 3, startColumn: 1, endColumn: 2 },
                    { startRow: 1, endRow: 2, startColumn: 2, endColumn: 3 },
                    { startRow: 2, endRow: 3, startColumn: 2, endColumn: 3 },
                ],
                gridColumnsConfig: [{}, {}],
            });
            expect({
                row: { start: 1, end: 3 },
                column: { start: 1, end: 3 },
            }).toEqual(header.getBounds());
        });

        it('invalid configuration', () => {
            const header = new GridHeader({
                owner: getGridCollectionMock({ gridColumnsConfig: [{}, {}] }),
                columnsConfig: [
                    { startRow: 1, endRow: 3, startColumn: 1, endColumn: 2 },
                    {},
                    { startRow: 2, endRow: 3, startColumn: 2, endColumn: 3 },
                ],
                gridColumnsConfig: [{}, {}],
            });
            expect({
                row: { start: 1, end: 2 },
                column: { start: 1, end: 3 },
            }).toEqual(header.getBounds());
        });
    });
});
