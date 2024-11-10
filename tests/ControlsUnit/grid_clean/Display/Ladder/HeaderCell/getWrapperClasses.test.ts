import { createRegExpForTestMatchClass } from 'ControlsUnit/_listsUtils/RegExp';
import { GridHeaderCell } from 'Controls/grid';
import { getHeaderRowMock } from 'ControlsUnit/_listsUtils/mockOwner';

const column = { displayProperty: 'col1' };
const headerColumn = {};

describe('Controls/grid_clean/Display/Ladder/HeaderCell/getWrapperClasses', () => {
    it('ladderCell not contains padding classes', () => {
        const gridHeaderCell = new GridHeaderCell({
            owner: getHeaderRowMock({
                gridColumnsConfig: [column],
                headerColumnsConfig: [headerColumn],
                leftPadding: 's',
                rightPadding: 's',
            }),
            column: headerColumn,
            isLadderCell: true,
        });
        const cellWrapperClasses = gridHeaderCell.getWrapperClasses('TestBGStyle');
        expect(cellWrapperClasses).not.toMatch(
            createRegExpForTestMatchClass('controls-Grid__cell_spacingLeft')
        );
        expect(cellWrapperClasses).not.toMatch(
            createRegExpForTestMatchClass('controls-Grid__cell_spacingRight')
        );
        expect(cellWrapperClasses).not.toMatch(
            createRegExpForTestMatchClass('controls-Grid__cell_spacingFirstCol')
        );
        expect(cellWrapperClasses).not.toMatch(
            createRegExpForTestMatchClass('controls-Grid__cell_spacingLastCol')
        );
    });
});
