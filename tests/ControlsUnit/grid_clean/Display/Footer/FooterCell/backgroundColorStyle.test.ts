import { GridFooterCell } from 'Controls/grid';
import { CssClassesAssert as cAssert } from '../../../../CustomAsserts';
import { getFooterRowMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/grid/Display/Footer/FooterCell/backgroundColorStyle', () => {
    let cell: GridFooterCell<any>;
    const owner = getFooterRowMock({
        gridColumnsConfig: [{}, {}],
        hoverBackgroundStyle: 'default',
        editingBackgroundStyle: 'default',
        rowSeparatorSize: 's',
        columnIndex: 1,
        hasColumnScroll: true,
    });

    beforeEach(() => {
        cell = null;
    });

    describe('backgroundColorStyle has the highest priority', () => {
        // + backgroundStyle!=default
        // + style!=default
        // + backgroundColorStyle
        // = backgroundColorStyle
        it('+backgroundStyle!=default, +style!=default, +backgroundColorStyle', () => {
            cell = new GridFooterCell({
                owner,
                column: { width: '' },
                backgroundStyle: 'red',
                theme: 'default',
                style: 'master',
            });
            cAssert.include(cell.getWrapperClasses('blue', false), 'controls-background-blue');
            cAssert.notInclude(cell.getWrapperClasses('blue', false), [
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
            cell = new GridFooterCell({
                owner,
                column: { width: '' },
                backgroundStyle: 'red',
                theme: 'default',
            });
            cAssert.include(cell.getWrapperClasses('blue', false), 'controls-background-blue');
            cAssert.notInclude(cell.getWrapperClasses('blue', false), [
                'controls-background-default',
                'controls-background-red',
            ]);
        });

        // - backgroundStyle!=default
        // + style!=default
        // + backgroundColorStyle
        // = backgroundColorStyle
        it('-backgroundStyle!=default, +style!=default, +backgroundColorStyle', () => {
            cell = new GridFooterCell({
                owner,
                column: { width: '' },
                theme: 'default',
                style: 'master',
            });
            cAssert.include(cell.getWrapperClasses('blue', false), 'controls-background-blue');
            cAssert.notInclude(cell.getWrapperClasses('blue', false), [
                'controls-background-default',
                'controls-background-master',
            ]);
        });

        // + style=default
        // + backgroundStyle=default
        // + backgroundColorStyle
        // = backgroundColorStyle
        it('+backgroundStyle=default, +style=default, +backgroundColorStyle', () => {
            cell = new GridFooterCell({
                owner,
                column: { width: '' },
                backgroundStyle: 'default',
                theme: 'default',
                style: 'default',
            });
            cAssert.include(cell.getWrapperClasses('blue', false), 'controls-background-blue');
            cAssert.notInclude(cell.getWrapperClasses('blue', false), [
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
            cell = new GridFooterCell({
                owner,
                column: { width: '' },
                backgroundStyle: 'red',
                theme: 'default',
                style: 'master',
            });
            cAssert.include(cell.getWrapperClasses(undefined, false), 'controls-background-red');
            cAssert.notInclude(cell.getWrapperClasses(undefined, false), [
                'controls-background-default',
                'controls-background-master',
            ]);
        });

        // + backgroundStyle!=default
        // + style=default
        // - backgroundColorStyle
        // = backgroundStyle
        it('+backgroundStyle!=default, +style=default, -backgroundColorStyle', () => {
            cell = new GridFooterCell({
                owner,
                column: { width: '' },
                backgroundStyle: 'red',
                theme: 'default',
                style: 'default',
            });
            cAssert.include(cell.getWrapperClasses(undefined, false), 'controls-background-red');
            cAssert.notInclude(cell.getWrapperClasses(undefined, false), [
                'controls-background-default',
            ]);
        });
    });

    describe('NON-default style has higher priority than backgroundStyle=default', () => {
        // + backgroundStyle=default
        // + style=default
        // - backgroundColorStyle
        // = backgroundStyle
        it('+backgroundStyle=default, +style=default, -backgroundColorStyle', () => {
            cell = new GridFooterCell({
                owner,
                column: { width: '' },
                backgroundStyle: 'default',
                theme: 'default',
                style: 'default',
            });
            cAssert.include(
                cell.getWrapperClasses(undefined, false),
                'controls-background-default-sticky'
            );
        });

        // + backgroundStyle=default
        // + style!=default
        // - backgroundColorStyle
        // = style
        it('+backgroundStyle=default, +style=!default, -backgroundColorStyle', () => {
            cell = new GridFooterCell({
                owner,
                column: { width: '' },
                backgroundStyle: 'default',
                theme: 'default',
                style: 'master',
            });
            cAssert.include(cell.getWrapperClasses(undefined, false), 'controls-background-master');
            cAssert.notInclude(cell.getWrapperClasses(undefined, false), [
                'controls-background-default',
            ]);
        });
    });
});
