import { SharedUtils, DYNAMIC_GRID_CELL_BASE_CLASS_NAME } from 'Controls-Lists/dynamicGrid';
import { IColumnConfig } from 'Controls/gridReact';

describe('Controls-ListsUnit/DynamicGrid/shared/utils/patchColumnProps', () => {
    test('patchColumnProps', () => {
        const column: IColumnConfig = {
            getCellProps: (item) => {
                return {
                    fontColorStyle: 'danger',
                };
            },
        };
        const getCellProps = (originalResult, item) => {
            return {
                backgroundStyle: 'info',
            };
        };

        const expectedResults = {
            fontColorStyle: 'danger',
            backgroundStyle: 'info',
        };

        SharedUtils.patchColumnProps(column, getCellProps, 'cellProps');
        expect(column.getCellProps(null)).toEqual(expectedResults);
    });

    test('multiple patchColumnProps', () => {
        const column: IColumnConfig = {
            getCellProps: (item) => {
                return {
                    fontColorStyle: 'danger',
                };
            },
        };
        const getCellPropsWithBackground = (originalResult, item) => {
            return {
                backgroundStyle: 'info',
            };
        };
        const getCellPropsWithClassName = (originalResult, item) => {
            return {
                className: 'some_class',
            };
        };

        const expectedResults = {
            fontColorStyle: 'danger',
            backgroundStyle: 'info',
            className: 'some_class',
        };

        SharedUtils.patchColumnProps(column, getCellPropsWithBackground, 'backgroundStyle');
        SharedUtils.patchColumnProps(column, getCellPropsWithClassName, 'className');
        expect(column.getCellProps(null)).toEqual(expectedResults);
    });

    test('addDefaultClassNameToAllDynamicColumns', () => {
        const columns: IColumnConfig[] = [
            {
                key: 'start_static',
                getCellProps: () => {
                    return {
                        className: 'start_static_class',
                    };
                },
            },
            {},
            {
                key: 'end_static',
                getCellProps: () => {
                    return {
                        className: 'end_static_class',
                    };
                },
            },
        ];

        const expectedResults = [
            {
                className: `start_static_class ${DYNAMIC_GRID_CELL_BASE_CLASS_NAME}`,
                multiSelectClassName: DYNAMIC_GRID_CELL_BASE_CLASS_NAME,
            },
            {
                className: `${DYNAMIC_GRID_CELL_BASE_CLASS_NAME}`,
                multiSelectClassName: DYNAMIC_GRID_CELL_BASE_CLASS_NAME,
            },
            {
                className: `end_static_class ${DYNAMIC_GRID_CELL_BASE_CLASS_NAME}`,
                multiSelectClassName: DYNAMIC_GRID_CELL_BASE_CLASS_NAME,
            },
        ];

        SharedUtils.addDefaultClassNameToAllDynamicColumns(columns);
        expect(columns[0].getCellProps(null)).toEqual(expectedResults[0]);
        expect(columns[1].getCellProps(null)).toEqual(expectedResults[1]);
        expect(columns[2].getCellProps(null)).toEqual(expectedResults[2]);
    });
});
