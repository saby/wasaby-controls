import DataCell from 'Controls/_grid/display/DataCell';
import { getDataRowMock } from 'ControlsUnit/_listsUtils/mockOwner';
import { Model } from 'Types/entity';

describe('Controls/_grid/display/DataCell/getDefaultDisplayValue', () => {
    let field: string | number | [] | Date;
    const getOwner = () => {
        return getDataRowMock({
            gridColumnsConfig: [{}],
            searchValue: '',
            contents: { field } as unknown as Model,
            displayValue: 'title',
        });
    };

    it('value is string', () => {
        field = 'value';
        const cell = new DataCell({
            owner: getOwner(),
            column: { displayProperty: 'field' },
        });
        expect(cell.getDefaultDisplayValue()).toEqual('value');
    });

    it('value is number', () => {
        field = 1234;
        const cell = new DataCell({
            owner: getOwner(),
            column: { displayProperty: 'field' },
        });
        expect(cell.getDefaultDisplayValue()).toEqual(1234);
    });

    it('value is array', () => {
        field = [];
        const cell = new DataCell({
            owner: getOwner(),
            column: { displayProperty: 'field' },
        });
        expect(cell.getDefaultDisplayValue()).toEqual('');
    });

    it('value is date', () => {
        field = new Date();
        const cell = new DataCell({
            owner: getOwner(),
            column: { displayProperty: 'field' },
        });
        expect(cell.getDefaultDisplayValue()).toEqual(field.toString());
    });
});
