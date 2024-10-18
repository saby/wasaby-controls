import FooterCell from 'Controls/_gridDisplay/FooterCell';
import { getFooterRowMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/_gridDisplay/FooterCell', () => {
    const owner = getFooterRowMock({
        gridColumnsConfig: [{}],
        hoverBackgroundStyle: '',
        editingBackgroundStyle: 'default',
        rowSeparatorSize: 's',
        columnIndex: 0,
        topPadding: 'null',
        bottomPadding: 'null',
        shouldDisplayMarker: false,
    });

    describe('getWrapperStyles', () => {
        it('is single cell', () => {
            const cell = new FooterCell({
                owner,
                isSingleColspanedCell: true,
                column: { startColumn: 1, endColumn: 2 },
            });
            expect(cell.getWrapperStyles()).toEqual('grid-column: 1 / 2; ');
            expect(cell.getWrapperStyles(500)).toEqual('grid-column: 1 / 2; width: 500px;');
        });

        it('is not single cell', () => {
            const cell = new FooterCell({
                owner,
                isSingleColspanedCell: true,
                column: { startColumn: 1, endColumn: 2 },
            });
            expect(cell.getWrapperStyles()).toEqual('grid-column: 1 / 2; ');
            expect(cell.getWrapperStyles(500)).toEqual('grid-column: 1 / 2; ');
        });
    });
});
