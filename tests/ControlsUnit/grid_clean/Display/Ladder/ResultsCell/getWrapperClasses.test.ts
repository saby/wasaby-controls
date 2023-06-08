import { createRegExpForTestMatchClass } from 'ControlsUnit/_listsUtils/RegExp';
import { GridResultsCell } from 'Controls/grid';
import { getResultsRowMock } from 'ControlsUnit/_listsUtils/mockOwner';

const column = { displayProperty: 'col1' };
const resultsColumn = {};

describe('Controls/grid_clean/Display/Ladder/ResultsCell/getWrapperClasses', () => {
    it('ladderCell not contains padding classes', () => {
        const gridResultsCell = new GridResultsCell({
            owner: getResultsRowMock({
                gridColumnsConfig: [column],
                headerColumnsConfig: [resultsColumn],
                leftPadding: 's',
                rightPadding: 's',
            }),
            column: resultsColumn,
            isLadderCell: true,
        });
        const cellWrapperClasses = gridResultsCell.getWrapperClasses(
            'TestBGStyle',
            false
        );
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
