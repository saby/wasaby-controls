import { Model } from 'Types/entity';
import { GridRow, GridCell, IGridCellOptions } from 'Controls/grid';
import { getRowMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/grid/Display/Cell/relativeCellWrapper', () => {
    let hasColumnScroll: boolean = true;

    function createGridCell(
        column: IGridCellOptions['column'],
        isFixed: boolean
    ): GridCell<Model, GridRow<Model>> {
        return new GridCell({
            owner: getRowMock({
                gridColumnsConfig: [{}],
                editingBackgroundStyle: 'default',
                rowSeparatorSize: 's',
                columnIndex: 1,
                fadedClass: '',
                isFullGridSupport: false,
                hasColumnScroll,
            }),
            column,
            isFixed,
        } as IGridCellOptions);
    }

    describe('should set max width on fixed columns with column scroll', () => {
        it('fixed cell + px width', () => {
            const cell = createGridCell({ width: '50px' }, true);
            expect(cell.getRelativeCellWrapperStyles()).toEqual({
                maxWidth: '50px',
            });
        });

        it('fixed cell + non px width', () => {
            const cell = createGridCell({ width: 'auto' }, true);
            expect(cell.getRelativeCellWrapperStyles()).toEqual({});
        });

        it('fixed cell + px compatibleWidth + non px width', () => {
            const cell = createGridCell(
                { width: 'auto', compatibleWidth: '50px' },
                true
            );
            expect(cell.getRelativeCellWrapperStyles()).toEqual({
                maxWidth: '50px',
            });
        });

        it('fixed cell + non px compatibleWidth + non px width', () => {
            const cell = createGridCell(
                { width: 'auto', compatibleWidth: 'auto' },
                true
            );
            expect(cell.getRelativeCellWrapperStyles()).toEqual({});
        });

        it('scrollable cell + px width', () => {
            const cell = createGridCell(
                { width: 'auto', compatibleWidth: 'auto' },
                false
            );
            expect(cell.getRelativeCellWrapperStyles()).toEqual({});
        });

        it('grid has no column scroll', () => {
            hasColumnScroll = false;
            const cell = createGridCell({ width: '50px' }, true);
            expect(cell.getRelativeCellWrapperStyles()).toEqual({});
        });
    });
});
