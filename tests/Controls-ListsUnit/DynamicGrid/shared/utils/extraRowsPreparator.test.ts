import { SharedUtils, IPrepareExtraRowColumnsParams } from 'Controls-Lists/dynamicGrid';
import { ICellProps } from 'Controls/gridReact';

describe('Controls-ListsUnit/DynamicGrid/shared/utils/extraRowsPreparator', () => {
    test('prepareExtraRowColumns', () => {
        const getPreparedDynamicColumn = (props) => props;
        const getExtraRowDynamicColumnProps = (): ICellProps => {
            return {
                fontColorStyle: 'secondary',
            };
        };

        const params: IPrepareExtraRowColumnsParams = {
            hoverMode: 'cross',
            dynamicColumnsCount: 10,
            dynamicColumnsGridData: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
            columnsSpacing: 'xs',
            quantum: 'month',
            extraRowStaticColumns: [{ key: 'static_start' }],
            extraRowEndStaticColumns: [{ key: 'static_end' }],
            extraRowDynamicColumn: { getCellProps: getExtraRowDynamicColumnProps },
            dataDensity: 'advanced',
            getPreparedDynamicColumn,
            dynamicColumn: {},
        };

        const expectedResults = [
            params.extraRowStaticColumns[0],
            expect.objectContaining({
                dataDensity: params.dataDensity,
                dynamicColumn: params.dynamicColumn,
                dynamicColumnsCount: params.dynamicColumnsCount,
                dynamicColumnsGridData: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                columnsSpacing: params.columnsSpacing,
                quantum: params.quantum,
                hoverMode: params.hoverMode,
            }),
            params.extraRowEndStaticColumns[0],
        ];

        const result = SharedUtils.prepareExtraRowColumns(params);
        expect(result).toEqual(expect.arrayContaining(expectedResults));
    });
});
