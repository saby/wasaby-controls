import { GridCell, GridCollection, GridRow } from 'Controls/grid';
import { Model } from 'Types/entity';
import { IColumn } from 'Controls/grid';
import MoneyRender from 'Controls/_grid/Render/types/MoneyRender';
import NumberRender from 'Controls/_grid/Render/types/NumberRender';
import DateRender from 'Controls/_grid/Render/types/DateRender';
import StringRender from 'Controls/_grid/Render/types/StringRender';
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

        gridRow
            .getColumns()
            .unshift(new GridCell({ owner: gridRow, column: {} }));
        expect(gridCell.isMultiSelectColumn()).toBe(false);

        gridRow
            .getColumns()
            .shift(new GridCell({ owner: gridRow, column: {} }));
        grid.setMultiSelectVisibility('hidden');
        expect(gridCell.isMultiSelectColumn()).toBe(false);

        gridRow.setMultiSelectVisibility('visible');
        grid.setMultiSelectPosition('custom');
        expect(gridCell.isMultiSelectColumn()).toBe(false);
    });

    describe('.hasCellContentRender()', () => {
        const cases: TCaseSet<boolean> = [
            {
                caseName: "doesn't have cell content render",
                assertValue: false,
                cellConfig: {},
            },
            {
                caseName: 'has content cell render cause of display type',
                assertValue: true,
                cellConfig: {
                    displayType: 'number',
                },
            },
            {
                caseName: 'has content cell render cause of text overflow',
                assertValue: true,
                cellConfig: {
                    textOverflow: 'ellipsis',
                },
            },
            {
                caseName: 'has content cell render cause of font color style',
                assertValue: true,
                cellConfig: {
                    fontColorStyle: 'primary',
                },
            },
            {
                caseName: 'has content cell render cause of font size',
                assertValue: true,
                cellConfig: {
                    fontSize: 'm',
                },
            },
        ];

        cases.forEach((item) => {
            it(item.caseName, () => {
                const gridCell = createCell(item.cellConfig);

                expect(gridCell.hasCellContentRender()).toEqual(
                    item.assertValue
                );
            });
        });
    });

    describe('.getCellContentRender()', () => {
        const cases: TCaseSet<React.FunctionComponent<unknown>> = [
            {
                caseName: 'money render',
                assertValue: MoneyRender,
                cellConfig: {
                    displayType: 'money',
                },
            },
            {
                caseName: 'number render',
                assertValue: NumberRender,
                cellConfig: {
                    displayType: 'number',
                },
            },
            {
                caseName: 'date render',
                assertValue: DateRender,
                cellConfig: {
                    displayType: 'date',
                },
            },
            {
                caseName: 'default render',
                assertValue: StringRender,
                cellConfig: {},
            },
        ];

        cases.forEach((item) => {
            it(item.caseName, () => {
                const gridCell = createCell(item.cellConfig);

                expect(gridCell.getCellContentRender()).toEqual(
                    item.assertValue
                );
            });
        });
    });
});
