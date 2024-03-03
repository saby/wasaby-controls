import { calculationRowPadding } from 'Controls/_grid/display/ReactRenderUtils';
import {
    rowPropsGridS,
    rowPropsUndefined,
} from 'ControlsUnit/gridReact/paddings/mocks/rowProps.mock';
import {
    dataRowDefaultPadding,
    dataRowLPadding,
} from 'ControlsUnit/gridReact/paddings/mocks/dataRow.mock';
import DataRow from 'Controls/_grid/display/DataRow';

describe('calculationRowPadding tests', () => {
    test('should return default padding', () => {
        const result = {
            paddingTop: 'grid_s',
            paddingBottom: 'grid_s',
            paddingLeft: 'grid_m',
            paddingRight: 'grid_m',
        };
        expect(calculationRowPadding(rowPropsUndefined, dataRowDefaultPadding as DataRow)).toEqual(
            result
        );
    });
    test('should return dataRowPadding', () => {
        const result = {
            paddingTop: 'grid_l',
            paddingBottom: 'grid_l',
            paddingLeft: 'grid_l',
            paddingRight: 'grid_l',
        };
        expect(calculationRowPadding(rowPropsUndefined, dataRowLPadding as DataRow)).toEqual(
            result
        );
    });
    test('should return rowPropsPadding', () => {
        const result = {
            paddingTop: 'grid_s',
            paddingBottom: 'grid_s',
            paddingLeft: 'grid_l',
            paddingRight: 'grid_l',
        };
        expect(calculationRowPadding(rowPropsGridS, dataRowLPadding as DataRow)).toEqual(result);
    });
});
