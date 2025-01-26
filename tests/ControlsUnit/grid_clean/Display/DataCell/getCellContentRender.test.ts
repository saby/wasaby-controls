import DataCell from 'Controls/_gridDisplay/DataCell';
import Ladder from 'Controls/_gridRender/cell/content/Ladder';
import { getDataRowMock } from 'ControlsUnit/_listsUtils/mockOwner';
import { Model } from 'Types/entity';

describe('Controls/_gridDisplay/DataCell/getCellContentRender', () => {
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
        expect(cell.getCellContentRender()).toEqual(Ladder);
    });

    it('clear render template column', () => {
        const cell = new DataCell({
            owner,
            column: { displayProperty: 'field' },
        });
        expect(cell.getCellContentRender(true)).not.toEqual(Ladder);
    });

    it('without ladder in column', () => {
        const cell = new DataCell({
            owner,
            column: { displayProperty: 'otherField' },
        });
        expect(cell.getCellContentRender()).not.toEqual(Ladder);
    });
});
