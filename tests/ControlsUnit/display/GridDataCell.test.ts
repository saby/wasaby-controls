import { Model as EntityModel, Model } from 'Types/entity';

import { GridCollection, GridDataCell, GridDataRow, TColspanCallback } from 'Controls/grid';
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
});
