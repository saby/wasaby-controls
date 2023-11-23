import { GridResultsCell, GRID_RESULTS_CELL_DEFAULT_TEMPLATE } from 'Controls/grid';
import { getResultsRowMock } from 'ControlsUnit/_listsUtils/mockOwner';

const RESULTS_CELL_TEMPLATE = 'RESULTS_CELL_TEMPLATE';
const CELL_TEMPLATE = 'CELL_TEMPLATE';

describe('Controls/grid_clean/Display/Results/ResultsCell/getTemplate', () => {
    it('getTemplate(), isSingleColspanedCell = false', () => {
        const cell = new GridResultsCell({
            column: {
                template: CELL_TEMPLATE,
                resultTemplate: RESULTS_CELL_TEMPLATE,
            },
            owner: getResultsRowMock({ gridColumnsConfig: [{}] }),
        });
        expect(cell.getTemplate()).toEqual(RESULTS_CELL_TEMPLATE);
    });

    it('getTemplate(), isSingleColspanedCell = false, without resultTemplate', () => {
        const cell = new GridResultsCell({
            column: {
                template: CELL_TEMPLATE,
            },
            owner: getResultsRowMock({ gridColumnsConfig: [{}] }),
        });
        expect(cell.getTemplate()).toEqual(GRID_RESULTS_CELL_DEFAULT_TEMPLATE);
    });

    it('getTemplate(), isSingleColspanedCell = true, with resultTemplate', () => {
        const cell = new GridResultsCell({
            column: {
                template: CELL_TEMPLATE,
                resultTemplate: RESULTS_CELL_TEMPLATE,
            },
            owner: getResultsRowMock({ gridColumnsConfig: [{}] }),
            isSingleColspanedCell: true,
        });
        expect(cell.getTemplate()).toEqual(RESULTS_CELL_TEMPLATE);
    });
});
