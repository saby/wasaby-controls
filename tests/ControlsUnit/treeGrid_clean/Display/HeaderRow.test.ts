import { Model } from 'Types/entity';
import { ColumnResizer, GridHeader, GridHeaderCell } from 'Controls/grid';
import {
    TreeGridHeaderRow,
    ITreeGridHeaderRowOptions,
    TreeGridCollection,
} from 'Controls/treeGrid';

describe('Controls/grid_clean/Display/HeaderRow', () => {
    const header = [{ caption: 'A' }, { caption: 'B' }];
    const columns = [{ width: '1px' }, { width: '1px' }];
    const owner = {
        getStickyColumnsCount: jest.fn().mockReturnValue(1),
        getGridColumnsConfig: () => {
            return columns;
        },
        getColumnsCount: () => {
            return columns.length;
        },
        getColumnWidths: () => columns.map((c) => c.width),
        getEndStickyColumnsCount: jest.fn().mockReturnValue(0),
        hasMultiSelectColumn: jest.fn().mockReturnValue(false),
        hasItemActionsSeparatedCell: jest.fn().mockReturnValue(false),
        hasSpacingColumn: jest.fn().mockReturnValue(false),
        hasResizer: jest.fn().mockReturnValue(true),
        hasColumnScroll: jest.fn().mockReturnValue(true),
        getItems: jest.fn().mockReturnValue([{ id: 0 }, { id: 1 }, { id: 2 }]),
    } as unknown as TreeGridCollection<Model>;

    const headerModel = {
        isMultiline: () => {
            return false;
        },
        getBounds: () => {
            return {
                column: {
                    start: 1,
                    end: 2,
                },
                row: {
                    start: 1,
                    end: 2,
                },
            };
        },
        isSticked: jest.fn().mockReturnValue(true),
    } as unknown as GridHeader;

    describe('constructor', () => {
        it('should add ColumnResizer', () => {
            const row = new TreeGridHeaderRow({
                header,
                columns,
                headerModel,
                owner,
                backgroundStyle: 'custom',
                columnsConfig: header.slice(),
                gridColumnsConfig: header.slice(),
                style: 'default',
            } as unknown as ITreeGridHeaderRowOptions);

            const rowColumns = row.getColumns();
            expect(rowColumns.length).toBe(2);
        });
    });
});
