import { calcRowPadding } from 'Controls/_baseGrid/row/utils/props/Padding';
import {
    rowPropsGridS,
    rowPropsUndefined,
} from 'ControlsUnit/gridReact/paddings/mocks/rowProps.mock';
import {
    dataRowDefaultPadding,
    dataRowLPadding,
} from 'ControlsUnit/gridReact/paddings/mocks/dataRow.mock';
import DataRow from 'Controls/_baseGrid/display/DataRow';

describe('calcRowPadding tests', () => {
    test('should return default padding', () => {
        const result = {
            paddingTop: 'grid_s',
            paddingBottom: 'grid_s',
            paddingLeft: 'list_default',
            paddingRight: 'list_default',
        };
        expect(calcRowPadding(rowPropsUndefined, dataRowDefaultPadding as DataRow)).toEqual(result);
    });
    test('should return dataRowPadding', () => {
        const result = {
            paddingTop: 'grid_l',
            paddingBottom: 'grid_l',
            paddingLeft: 'list_l',
            paddingRight: 'list_l',
        };
        expect(calcRowPadding(rowPropsUndefined, dataRowLPadding as DataRow)).toEqual(result);
    });
    test('should return rowPropsPadding', () => {
        const result = {
            paddingTop: 'grid_s',
            paddingBottom: 'grid_s',
            paddingLeft: 'list_l',
            paddingRight: 'list_l',
        };
        expect(calcRowPadding(rowPropsGridS, dataRowLPadding as DataRow)).toEqual(result);
    });
});
