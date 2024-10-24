import DataCell from 'Controls/_baseGrid/display/DataCell';
import LadderWrapper from 'Controls/_baseGrid/Render/types/LadderWrapper';
import { getDataRowMock } from 'ControlsUnit/_listsUtils/mockOwner';
import { Model } from 'Types/entity';

describe('Controls/_baseGrid/display/DataCell/getCellContentRender', () => {
    const owner = getDataRowMock({
        gridColumnsConfig: [{}],
        searchValue: '',
        contents: {} as Model,
        displayValue: 'title',
        ladder: { field: {} },
    });

    it('with ladder in column', () => {
        const cell = new DataCell({
            owner,
            column: { displayProperty: 'field' },
        });
        expect(cell.getCellContentRender()).toEqual(LadderWrapper);
    });

    it('clear render template column', () => {
        const cell = new DataCell({
            owner,
            column: { displayProperty: 'field' },
        });
        expect(cell.getCellContentRender(true)).not.toEqual(LadderWrapper);
    });

    it('without ladder in column', () => {
        const cell = new DataCell({
            owner,
            column: { displayProperty: 'otherField' },
        });
        expect(cell.getCellContentRender()).not.toEqual(LadderWrapper);
    });
});
