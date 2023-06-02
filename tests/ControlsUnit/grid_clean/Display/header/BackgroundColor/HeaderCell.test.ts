import { GridHeaderCell, IColumn } from 'Controls/grid';
import { CssClassesAssert as cAssert } from '../../../../CustomAsserts';
import { getHeaderRowMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/grid_clean/Display/header/BackgroundColor/HeaderCell', () => {
    let cell: GridHeaderCell;
    let column: IColumn;
    const getOwner = () => {
        return getHeaderRowMock({
            gridColumnsConfig: [column],
            headerColumnsConfig: [column],
            hoverBackgroundStyle: 'default',
            editingBackgroundStyle: 'default',
            rowSeparatorSize: 's',
            isStickyHeader: true,
            columnItems: [
                {
                    isLadderCell: () => {
                        return false;
                    },
                },
            ],
        });
    };

    beforeEach(() => {
        cell = null;
        column = { width: '' };
    });

    describe('backgroundColorStyle has the highest priority', () => {
        // + backgroundStyle!=default
        // + style!=default
        // + backgroundColorStyle
        // = backgroundColorStyle
        it('+backgroundStyle!=default, +style!=default, +backgroundColorStyle', () => {
            cell = new GridHeaderCell({
                owner: getOwner(),
                column,
                backgroundStyle: 'red',
                theme: 'default',
                style: 'master',
            });
            cAssert.notInclude(cell.getWrapperClasses('blue'), [
                'controls-background-default',
                'controls-background-master',
                'controls-background-red',
            ]);
        });

        // + backgroundStyle!=default
        // - style!=default
        // + backgroundColorStyle
        // = backgroundColorStyle
        it('+backgroundStyle!=default, -style!=default, +backgroundColorStyle', () => {
            cell = new GridHeaderCell({
                owner: getOwner(),
                column,
                backgroundStyle: 'red',
                theme: 'default',
            });
            cAssert.notInclude(cell.getWrapperClasses('blue'), [
                'controls-background-default',
                'controls-background-red',
            ]);
        });

        // - backgroundStyle!=default
        // + style!=default
        // + backgroundColorStyle
        // = backgroundColorStyle
        it('-backgroundStyle!=default, +style!=default, +backgroundColorStyle', () => {
            cell = new GridHeaderCell({
                owner: getOwner(),
                column,
                theme: 'default',
                style: 'master',
            });
            cAssert.notInclude(cell.getWrapperClasses('blue'), [
                'controls-background-default',
                'controls-background-master',
            ]);
        });

        // + style=default
        // + backgroundStyle=default
        // + backgroundColorStyle
        // = backgroundColorStyle
        it('+backgroundStyle=default, +style=default, +backgroundColorStyle', () => {
            cell = new GridHeaderCell({
                owner: getOwner(),
                column,
                backgroundStyle: 'default',
                theme: 'default',
                style: 'default',
            });
            cAssert.notInclude(cell.getWrapperClasses('blue'), [
                'controls-background-default',
            ]);
        });
    });

    describe('backgroundStyle has higher priority than style', () => {
        // + backgroundStyle!=default
        // + style!=default
        // - backgroundColorStyle
        // = backgroundStyle
        it('+backgroundStyle!=default, +style!=default, -backgroundColorStyle', () => {
            cell = new GridHeaderCell({
                owner: getOwner(),
                column,
                backgroundStyle: 'red',
                theme: 'default',
                style: 'master',
            });
            cAssert.notInclude(cell.getWrapperClasses(undefined), [
                'controls-background-default',
                'controls-background-master',
            ]);
        });

        // + backgroundStyle!=default
        // + style=default
        // - backgroundColorStyle
        // = backgroundStyle
        it('+backgroundStyle!=default, +style=default, -backgroundColorStyle', () => {
            cell = new GridHeaderCell({
                owner: getOwner(),
                column,
                backgroundStyle: 'red',
                theme: 'default',
                style: 'default',
            });
            cAssert.notInclude(cell.getWrapperClasses(undefined), [
                'controls-background-default',
            ]);
        });
    });

    describe('NON-default style has higher priority than backgroundStyle=default', () => {
        // + backgroundStyle=default
        // + style!=default
        // - backgroundColorStyle
        // = style
        it('+backgroundStyle=default, +style=!default, -backgroundColorStyle', () => {
            cell = new GridHeaderCell({
                owner: getOwner(),
                column,
                backgroundStyle: 'default',
                theme: 'default',
                style: 'master',
            });
            cAssert.notInclude(cell.getWrapperClasses(undefined), [
                'controls-background-default',
            ]);
        });
    });
});
