import { Model as EntityModel, Model } from 'Types/entity';

import {
    GridCollection,
    GridDataCell,
    GridDataRow,
    TColspanCallback,
} from 'Controls/grid';
import { IColumn } from 'Controls/grid';

describe('Controls/display/GridDataCell', () => {
    let owner: GridDataRow<Model>;
    let cell: GridDataCell<Model, GridDataRow<Model>>;
    let multiSelectVisibility: string;
    let columnIndex: number;
    let columnsCount: number;
    let column: IColumn;
    let editArrowIsVisible: boolean;

    function initCell(): GridDataCell<Model, GridDataRow<Model>> {
        cell = new GridDataCell<Model, GridDataRow<Model>>({
            owner,
            column,
        });
        return cell;
    }

    beforeEach(() => {
        column = {
            width: '1px',
        };
        multiSelectVisibility = 'hidden';
        columnIndex = 0;
        columnsCount = 4;
        editArrowIsVisible = false;
        owner = {
            getColumnIndex(): number {
                return columnIndex;
            },
            hasMultiSelectColumn(): boolean {
                return multiSelectVisibility === 'visible';
            },
            editArrowIsVisible(): boolean {
                return editArrowIsVisible;
            },
            getContents(): Model {
                return {} as undefined as Model;
            },
        } as Partial<GridDataRow<Model>> as undefined as GridDataRow<Model>;
    });

    // region Аспект "Кнопка редактирования"

    describe('shouldDisplayEditArrow', () => {
        it('should return true for columnIndex===0', () => {
            editArrowIsVisible = true;
            columnIndex = 0;
            expect(initCell().shouldDisplayEditArrow()).toBe(true);
        });
        it('should return true for columnIndex===1, when multiSelect', () => {
            editArrowIsVisible = true;
            multiSelectVisibility = 'visible';
            columnIndex = 1;
            expect(initCell().shouldDisplayEditArrow()).toBe(true);
        });
        it('should not return true for columnIndex===1, when no multiSelect', () => {
            editArrowIsVisible = true;
            columnIndex = 1;
            expect(initCell().shouldDisplayEditArrow()).toBe(false);
        });
        it('should not return true when custom contentTemplate is set', () => {
            editArrowIsVisible = true;
            expect(
                initCell().shouldDisplayEditArrow(() => {
                    return '';
                })
            ).toBe(false);
        });
    });

    // endregion

    describe('ColumnSeparatorSize', () => {
        let columns: IColumn[];
        let hasMultiSelectColumn: boolean;
        let stickyColumnsCount: number;
        let hasItemActionsSeparatedCell: boolean;
        let hasColumnScroll: boolean;

        function getGridRow(): GridDataRow<Model> {
            const owner: GridCollection<Model> = {
                hasMultiSelectColumn: () => {
                    return hasMultiSelectColumn;
                },
                getStickyColumnsCount: () => {
                    return stickyColumnsCount;
                },
                getGridColumnsConfig: () => {
                    return columns;
                },
                hasItemActionsSeparatedCell: () => {
                    return hasItemActionsSeparatedCell;
                },
                hasColumnScroll: () => {
                    return hasColumnScroll;
                },
                getHoverBackgroundStyle: () => {
                    return 'default';
                },
                getTopPadding: () => {
                    return 'null';
                },
                getBottomPadding: () => {
                    return 'null';
                },
                isEditing: () => {
                    return false;
                },
                isDragging: () => {
                    return false;
                },
                getEditingBackgroundStyle: () => {
                    return 'default';
                },
                isActive: () => {
                    return false;
                },
                getRowSeparatorSize: () => {
                    return 's';
                },
                getEditingConfig: () => {
                    return {};
                },
                getItemEditorTemplate: jest.fn(),
                isFullGridSupport: () => {
                    return true;
                },
                hasSpacingColumn: () => {
                    return false;
                },
                hasResizer: () => {
                    return false;
                },
                hasColumnScrollReact: () => {
                    return false;
                },
            } as undefined as GridCollection<Model>;
            return new GridDataRow({
                gridColumnsConfig: columns,
                columnsConfig: columns,
                owner,
                contents: {
                    getKey: () => {
                        return 1;
                    },
                },
                colspanCallback: ((
                    item: EntityModel,
                    column: IColumn,
                    columnIndex: number,
                    isEditing: boolean
                ) => {
                    return null; // number | 'end'
                }) as TColspanCallback,
            });
        }

        beforeEach(() => {
            hasMultiSelectColumn = false;
            stickyColumnsCount = 0;
            hasItemActionsSeparatedCell = false;
            hasColumnScroll = false;
            columns = [
                { width: '1px' },
                { width: '1px' },
                { width: '1px' },
                { width: '1px' },
            ];
        });

        it("should add columnSeparatorSize based on grid's columnSeparatorSize", () => {
            const row = getGridRow();
            row.setColumnSeparatorSize('s');
            cell = row.getColumns()[1] as GridDataCell<
                Model,
                GridDataRow<Model>
            >;
            const wrapperClasses = cell.getWrapperClasses('default', true);
            expect(wrapperClasses).toContain(
                'controls-Grid__columnSeparator_size-s'
            );
        });

        it("should add columnSeparatorSize based on current column's left columnSeparatorSize", () => {
            columns[1].columnSeparatorSize = { left: 's', right: null };
            const row = getGridRow();
            cell = row.getColumns()[1] as GridDataCell<
                Model,
                GridDataRow<Model>
            >;
            const wrapperClasses = cell.getWrapperClasses('default', true);
            expect(wrapperClasses).toContain(
                'controls-Grid__columnSeparator_size-s'
            );
        });

        it("should add columnSeparatorSize based on previous column's right columnSeparatorSize config", () => {
            columns[1].columnSeparatorSize = { left: null, right: 's' };
            const row = getGridRow();
            let wrapperClasses: string;
            cell = row.getColumns()[1] as GridDataCell<
                Model,
                GridDataRow<Model>
            >;
            wrapperClasses = cell.getWrapperClasses('default', true);
            expect(wrapperClasses).not.toContain(
                'controls-Grid__columnSeparator_size-s'
            );

            cell = row.getColumns()[2] as GridDataCell<
                Model,
                GridDataRow<Model>
            >;
            wrapperClasses = cell.getWrapperClasses('default', true);
            expect(wrapperClasses).toContain(
                'controls-Grid__columnSeparator_size-s'
            );
        });

        it("should add columnSeparatorSize based on grid's columnSeparatorSize when multiSelect", () => {
            hasMultiSelectColumn = true;
            const row = getGridRow();
            row.setColumnSeparatorSize('s');
            cell = row.getColumns()[2] as GridDataCell<
                Model,
                GridDataRow<Model>
            >;
            const wrapperClasses = cell.getWrapperClasses('default', true);
            expect(wrapperClasses).toContain(
                'controls-Grid__columnSeparator_size-s'
            );
        });

        it('should add columnSeparatorSize based on current column config when multiSelect', () => {
            hasMultiSelectColumn = true;
            columns[1].columnSeparatorSize = { left: 's', right: null };
            const row = getGridRow();
            cell = row.getColumns()[2] as GridDataCell<
                Model,
                GridDataRow<Model>
            >;
            const wrapperClasses = cell.getWrapperClasses('default', true);
            expect(wrapperClasses).toContain(
                'controls-Grid__columnSeparator_size-s'
            );
        });
    });
});
