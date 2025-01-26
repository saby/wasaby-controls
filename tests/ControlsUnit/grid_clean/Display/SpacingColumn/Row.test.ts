import { GridDataRow } from 'Controls/grid';
import { getCtorParamsMock } from 'ControlsUnit/grid_clean/mockUtil/ForDataRow';

describe('ControlsUnit/grid_clean/Display/SpacingColumn/Row', () => {
    describe('column separators', () => {
        it('right separator should be always null', () => {
            const gridRow = new GridDataRow(
                getCtorParamsMock(
                    {
                        gridColumnsConfig: [{}],
                        hasSpacingColumn: true,
                        columnSeparatorSize: 's',
                    },
                    true
                )
            );

            const columns = gridRow.getColumns();
            expect(columns.length).toBe(2);
            expect(columns[columns.length - 1]._$leftSeparatorSize).toBe('s');
            expect(columns[columns.length - 1]._$rightSeparatorSize).toBe(null);
        });
    });
});
