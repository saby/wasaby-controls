import { GridCell, GridCollection, GridRow } from 'Controls/grid';
import { Model } from 'Types/entity';
import { IColumn } from 'Controls/grid';
import Money from 'Controls/_gridRender/cell/content/Money';
import Number from 'Controls/_gridRender/cell/content/Number';
import Date from 'Controls/_gridRender/cell/content/Date';
import String from 'Controls/_gridRender/cell/content/String';
import * as React from 'react';

const createCell = (cell: IColumn) => {
    const gridCollection = new GridCollection({
        collection: [{ id: 1 }],
        columns: [cell],
    });
    const gridRow = new GridRow({
        owner: gridCollection,
        columns: [cell],
        colspanCallback: () => {
            return 'end';
        },
    });
    const gridCell = new GridCell({ owner: gridRow, column: cell });

    return gridCell;
};

interface ICase<T> {
    caseName: string;
    assertValue: T;
    cellConfig: IColumn;
}

type TCaseSet<T> = ICase<T>[];

describe('Controls/display:Cell', () => {
    // region Аспект "Кнопка редактирования"

    describe('editArrow', () => {
        let cell: GridCell<Model, GridRow<Model>>;

        beforeEach(() => {
            cell = new GridCell();
        });

        it('shouldDisplayEditArrow', () => {
            expect(cell.shouldDisplayEditArrow()).toBe(false);
        });
    });

    describe('isMultiSelectColumn', () => {
        const grid = new GridCollection({
            collection: [{ id: 1 }],
            columns: [{}],
            keyProperty: 'id',
            multiSelectVisibility: 'visible',
            multiSelectPosition: 'default',
        });
        const gridRow = new GridRow({ owner: grid });
        const gridCell = new GridCell({ owner: gridRow, column: {} });
        gridRow._$columnItems = [gridCell];

        expect(gridCell.isMultiSelectColumn()).toBe(true);

        gridRow.getColumns().unshift(new GridCell({ owner: gridRow, column: {} }));
        expect(gridCell.isMultiSelectColumn()).toBe(false);

        gridRow.getColumns().shift(new GridCell({ owner: gridRow, column: {} }));
        grid.setMultiSelectVisibility('hidden');
        expect(gridCell.isMultiSelectColumn()).toBe(false);

        gridRow.setMultiSelectVisibility('visible');
        grid.setMultiSelectPosition('custom');
        expect(gridCell.isMultiSelectColumn()).toBe(false);
    });

    describe('.getCellContentRender()', () => {
        const cases: TCaseSet<React.FunctionComponent<unknown>> = [
            {
                caseName: 'money render',
                assertValue: Money,
                cellConfig: {
                    displayType: 'money',
                },
            },
            {
                caseName: 'number render',
                assertValue: Number,
                cellConfig: {
                    displayType: 'number',
                },
            },
            {
                caseName: 'date render',
                assertValue: Date,
                cellConfig: {
                    displayType: 'date',
                },
            },
            {
                caseName: 'default render',
                assertValue: String,
                cellConfig: {},
            },
        ];

        cases.forEach((item) => {
            it(item.caseName, () => {
                const gridCell = createCell(item.cellConfig);

                expect(gridCell.getCellContentRender()).toEqual(item.assertValue);
            });
        });
    });
});
