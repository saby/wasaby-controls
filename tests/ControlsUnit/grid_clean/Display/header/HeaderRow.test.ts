import { Model } from 'Types/entity';
import {
    GridHeader,
    GridHeaderRow,
    IGridHeaderRowOptions,
    GridCollection,
    GridCell,
    GridRow,
} from 'Controls/grid';

describe('Controls/grid_clean/Display/header/HeaderRow', () => {
    const columns = [{ width: '1px' }];
    const owner = {
        getStickyColumnsCount: () => {
            return 1;
        },
        getGridColumnsConfig: () => {
            return columns;
        },
        hasMultiSelectColumn: () => {
            return true;
        },
        hasItemActionsSeparatedCell: () => {
            return false;
        },
        hasNewColumnScroll: () => {
            return false;
        },
        hasSpacingColumn: () => {
            return false;
        },
        hasResizer: () => {
            return false;
        },
    } as undefined as GridCollection<Model>;

    const headerModel = {
        isMultiline: () => {
            return false;
        },
        getBounds: () => {
            return {
                column: {
                    start: 1,
                    end: 2,
                },
                row: {
                    start: 1,
                    end: 2,
                },
            };
        },
    } as undefined as GridHeader<Model>;

    describe('_initializeColumns', () => {
        it('should call columnFactory with correct params', () => {
            function MockedFactory(): (options: any) => GridCell<any, any> {
                return (options) => {
                    const checkboxStandardOptions = {
                        backgroundStyle: 'custom',
                        column: {
                            endColumn: 2,
                            endRow: 2,
                            startColumn: 1,
                            startRow: 1,
                        },
                        isFixed: true,
                        shadowVisibility: 'visible',
                        isCheckBoxCell: true,
                    };
                    const standardOptions = {
                        column: columns[0],
                        isFixed: true,
                        sorting: undefined,
                        cellPadding: undefined,
                        backgroundStyle: 'custom',
                        leftSeparatorSize: null,
                        rightSeparatorSize: null,
                        shadowVisibility: 'visible',
                    };

                    // assertion here
                    if (columns.includes(options.column)) {
                        expect(options).toEqual(standardOptions);
                    } else {
                        expect(options).toEqual(checkboxStandardOptions);
                    }

                    return {} as undefined as GridCell<any, GridRow<any>>;
                };
            }

            const row = new GridHeaderRow({
                header: [{}],
                columns,
                headerModel,
                owner,
                backgroundStyle: 'custom',
                columnsConfig: columns,
                gridColumnsConfig: columns.slice(),
                style: 'default',
            } as undefined as IGridHeaderRowOptions<any>);

            const stubMockedFactory = jest
                .spyOn(row, 'getColumnsFactory')
                .mockClear()
                .mockImplementation(MockedFactory);

            row.getColumns();

            // assertion inside MockedFactory above

            // check call for column and for checkboxColumn
            expect(stubMockedFactory).toHaveBeenCalledTimes(2);

            jest.restoreAllMocks();
        });
    });
});
