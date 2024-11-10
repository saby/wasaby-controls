import { Model } from 'Types/entity';
import { GridRow, GridCell, IGridCellOptions } from 'Controls/grid';
import { CssClassesAssert as cAssert } from '../../../CustomAsserts';
import { getRowMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/grid/Display/Cell/backgroundColorStyle', () => {
    let hasColumnScroll: boolean;
    let isSticked: boolean;

    function createGridCell(params: Partial<IGridCellOptions>): GridCell<Model, GridRow<Model>> {
        return new GridCell({
            owner: getRowMock({
                gridColumnsConfig: [{}, {}, {}],
                hoverBackgroundStyle: 'default',
                editingBackgroundStyle: 'default',
                rowSeparatorSize: 's',
                columnIndex: 1,
                hasColumnScroll,
                isSticked,
            }),
            ...(params as IGridCellOptions),
        });
    }

    beforeEach(() => {
        isSticked = false;
    });

    describe('not Editing, no ColumnScroll, not Sticked', () => {
        beforeEach(() => {
            hasColumnScroll = false;
        });

        describe('backgroundColorStyle has the highest priority', () => {
            // + backgroundStyle!=default
            // + style!=default
            // + backgroundColorStyle
            // = backgroundColorStyle
            it('+backgroundStyle!=default, +style!=default, +backgroundColorStyle', () => {
                const cell = createGridCell({
                    column: { width: '' },
                    backgroundStyle: 'red',
                    theme: 'default',
                    style: 'master',
                });
                cAssert.include(cell.getWrapperClasses('blue', false), 'controls-background-blue');
                cAssert.notInclude(cell.getWrapperClasses('blue', false), [
                    'controls-background-red',
                    'controls-background-default',
                    'controls-background-master',
                ]);
            });

            // + backgroundStyle!=default
            // - style!=default
            // + backgroundColorStyle
            // = backgroundColorStyle
            it('+backgroundStyle!=default, -style!=default, +backgroundColorStyle', () => {
                const cell = createGridCell({
                    column: { width: '' },
                    backgroundStyle: 'red',
                    theme: 'default',
                });
                cAssert.include(cell.getWrapperClasses('blue', false), 'controls-background-blue');
                cAssert.notInclude(cell.getWrapperClasses('blue', false), [
                    'controls-background-red',
                    'controls-background-default',
                ]);
            });

            // - backgroundStyle!=default
            // + style!=default
            // + backgroundColorStyle
            // = backgroundColorStyle
            it('-backgroundStyle!=default, +style!=default, +backgroundColorStyle', () => {
                const cell = createGridCell({
                    column: { width: '' },
                    theme: 'default',
                    style: 'master',
                });
                cAssert.include(cell.getWrapperClasses('blue', false), 'controls-background-blue');
                cAssert.notInclude(cell.getWrapperClasses('blue', false), [
                    'controls-background-master',
                    'controls-background-default',
                ]);
            });

            // + style=default
            // + backgroundStyle=default
            // + backgroundColorStyle
            // = backgroundColorStyle
            it('+backgroundStyle=default, +style=default, +backgroundColorStyle', () => {
                const cell = createGridCell({
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

        describe('Without ColumnScroll backgroundStyle and style does not affect cell backgroundColor', () => {
            beforeEach(() => {
                hasColumnScroll = false;
            });

            // + backgroundStyle!=default
            // + style!=default
            // - backgroundColorStyle
            // = none
            it('+backgroundStyle!=default, +style!=default, -backgroundColorStyle', () => {
                const cell = createGridCell({
                    column: { width: '' },
                    backgroundStyle: 'red',
                    theme: 'default',
                    style: 'master',
                });
                cAssert.notInclude(cell.getWrapperClasses(undefined, false), [
                    'controls-background-undefined',
                    'controls-background-default',
                    'controls-background-master',
                    'controls-background-master',
                    'controls-background-default',
                ]);
            });

            // + backgroundStyle!=default
            // + style=default
            // - backgroundColorStyle
            // = none
            it('+backgroundStyle!=default, +style=default, -backgroundColorStyle', () => {
                const cell = createGridCell({
                    column: { width: '' },
                    backgroundStyle: 'red',
                    theme: 'default',
                    style: 'default',
                });
                cAssert.notInclude(cell.getWrapperClasses(undefined, false), [
                    'controls-background-undefined',
                    'controls-background-default',
                    'controls-background-default',
                ]);
            });

            // + backgroundStyle=default
            // + style=default
            // - backgroundColorStyle
            // = none
            it('+backgroundStyle=default, +style=default, -backgroundColorStyle', () => {
                const cell = createGridCell({
                    column: { width: '' },
                    backgroundStyle: 'default',
                    theme: 'default',
                    style: 'default',
                });
                cAssert.notInclude(cell.getWrapperClasses(undefined, false), [
                    'controls-background-undefined',
                    'controls-background-default',
                    'controls-background-default',
                ]);
            });

            // + backgroundStyle=default
            // + style!=default
            // - backgroundColorStyle
            // = none
            it('+backgroundStyle=default, +style=!default, -backgroundColorStyle', () => {
                const cell = createGridCell({
                    column: { width: '' },
                    backgroundStyle: 'default',
                    theme: 'default',
                    style: 'master',
                });
                cAssert.notInclude(cell.getWrapperClasses(undefined, false), [
                    'controls-background-undefined',
                    'controls-background-default',
                    'controls-background-master',
                ]);
            });

            // - backgroundStyle=default
            // - style=default
            // - backgroundColorStyle
            // = none
            it('-backgroundStyle=default, -style=!default, -backgroundColorStyle', () => {
                const cell = createGridCell({
                    column: { width: '' },
                    theme: 'default',
                });
                cAssert.notInclude(cell.getWrapperClasses(undefined, false), [
                    'controls-background-undefined',
                    'controls-background-default',
                    'controls-background-master',
                    'controls-background-master',
                    'controls-background-default',
                ]);
            });

            // - backgroundStyle=default
            // + style!=default
            // - backgroundColorStyle
            // = none
            it('-backgroundStyle=default, +style=!default, -backgroundColorStyle', () => {
                const cell = createGridCell({
                    column: { width: '' },
                    theme: 'default',
                    style: 'master',
                });
                cAssert.notInclude(cell.getWrapperClasses(undefined, false), [
                    'controls-background-undefined',
                    'controls-background-default',
                    'controls-background-master',
                    'controls-background-master',
                    'controls-background-default',
                ]);
            });
        });
    });

    describe('not Editing, with ColumnScroll, not Sticked', () => {
        beforeEach(() => {
            hasColumnScroll = true;
        });

        describe('backgroundColorStyle has the highest priority', () => {
            // + backgroundStyle!=default
            // + style!=default
            // + backgroundColorStyle
            // = backgroundColorStyle
            it('+backgroundStyle!=default, +style!=default, +backgroundColorStyle', () => {
                const cell = createGridCell({
                    column: { width: '' },
                    backgroundStyle: 'red',
                    theme: 'default',
                    style: 'master',
                });
                cAssert.include(cell.getWrapperClasses('blue', false), 'controls-background-blue');
                cAssert.notInclude(cell.getWrapperClasses('blue', false), [
                    'controls-background-red',
                    'controls-background-master',
                    'controls-background-default',
                ]);
            });

            // + backgroundStyle!=default
            // - style!=default
            // + backgroundColorStyle
            // = backgroundColorStyle
            it('+backgroundStyle!=default, -style!=default, +backgroundColorStyle', () => {
                const cell = createGridCell({
                    column: { width: '' },
                    backgroundStyle: 'red',
                    theme: 'default',
                });
                cAssert.include(cell.getWrapperClasses('blue', false), 'controls-background-blue');
                cAssert.notInclude(cell.getWrapperClasses('blue', false), [
                    'controls-background-red',
                    'controls-background-default',
                ]);
            });

            // - backgroundStyle!=default
            // + style!=default
            // + backgroundColorStyle
            // = backgroundColorStyle
            it('-backgroundStyle!=default, +style!=default, +backgroundColorStyle', () => {
                const cell = createGridCell({
                    column: { width: '' },
                    theme: 'default',
                    style: 'master',
                });
                cAssert.include(cell.getWrapperClasses('blue', false), 'controls-background-blue');
                cAssert.notInclude(cell.getWrapperClasses('blue', false), [
                    'controls-background-master',
                    'controls-background-default',
                ]);
            });

            // + style=default
            // + backgroundStyle=default
            // + backgroundColorStyle
            // = backgroundColorStyle
            it('+backgroundStyle=default, +style=default, +backgroundColorStyle', () => {
                const cell = createGridCell({
                    column: { width: '' },
                    backgroundStyle: 'default',
                    theme: 'default',
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
                const cell = createGridCell({
                    column: { width: '' },
                    backgroundStyle: 'red',
                    theme: 'default',
                    style: 'master',
                });
                cAssert.include(cell.getWrapperClasses(undefined, false), [
                    'controls-background-red',
                ]);

                cAssert.notInclude(cell.getWrapperClasses(undefined, false), [
                    'controls-background-undefined',
                    'controls-background-default',
                    'controls-background-master',
                ]);
            });

            // + backgroundStyle!=default
            // + style=default
            // - backgroundColorStyle
            // = backgroundStyle
            it('+backgroundStyle!=default, +style=default, -backgroundColorStyle', () => {
                const cell = createGridCell({
                    column: { width: '' },
                    backgroundStyle: 'red',
                    theme: 'default',
                    style: 'default',
                });
                cAssert.include(cell.getWrapperClasses(undefined, false), [
                    'controls-background-red',
                ]);
                cAssert.notInclude(cell.getWrapperClasses(undefined, false), [
                    'controls-background-undefined',
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
                const cell = createGridCell({
                    column: { width: '' },
                    backgroundStyle: 'default',
                    theme: 'default',
                    style: 'default',
                });
                cAssert.include(cell.getWrapperClasses(undefined, false), [
                    'controls-background-default-sticky',
                ]);
                cAssert.notInclude(cell.getWrapperClasses(undefined, false), [
                    'controls-background-undefined',
                    'controls-background-default',
                ]);
            });

            // + backgroundStyle=default
            // + style!=default
            // - backgroundColorStyle
            // = style
            it('+backgroundStyle=default, +style=!default, -backgroundColorStyle', () => {
                const cell = createGridCell({
                    column: { width: '' },
                    backgroundStyle: 'default',
                    theme: 'default',
                    style: 'master',
                });
                cAssert.include(cell.getWrapperClasses(undefined, false), [
                    'controls-background-master',
                ]);
                cAssert.notInclude(cell.getWrapperClasses(undefined, false), [
                    'controls-background-undefined',
                    'controls-background-default',
                ]);
            });
        });

        describe('use default if background style undefined', () => {
            // - backgroundStyle=null
            // + style=default
            // - backgroundColorStyle=undefined
            // + hasColumnScroll
            // = controls-background-default
            it('-backgroundStyle=default, +style=default, -backgroundColorStyle', () => {
                hasColumnScroll = true;
                const cell = createGridCell({
                    column: { width: '' },
                    backgroundStyle: null,
                });
                cAssert.include(
                    cell.getWrapperClasses('default', undefined, 'default'),
                    'controls-background-default'
                );
            });
        });
    });

    describe('not Editing, no ColumnScroll, isSticked', () => {
        beforeEach(() => {
            hasColumnScroll = false;
            isSticked = true;
        });

        describe('backgroundColorStyle has the highest priority', () => {
            // + backgroundStyle!=default
            // + style!=default
            // + backgroundColorStyle
            // = backgroundColorStyle
            it('+backgroundStyle!=default, +style!=default, +backgroundColorStyle', () => {
                const cell = createGridCell({
                    column: { width: '' },
                    backgroundStyle: 'red',
                    isSticked,
                    theme: 'default',
                    style: 'master',
                });
                cAssert.include(cell.getWrapperClasses('blue', false), 'controls-background-blue');
                cAssert.notInclude(cell.getWrapperClasses('blue', false), [
                    'controls-background-red',
                    'controls-background-master',
                    'controls-background-default',
                ]);
            });

            // + backgroundStyle!=default
            // - style!=default
            // + backgroundColorStyle
            // = backgroundColorStyle
            it('+backgroundStyle!=default, -style!=default, +backgroundColorStyle', () => {
                const cell = createGridCell({
                    column: { width: '' },
                    backgroundStyle: 'red',
                    isSticked,
                    theme: 'default',
                });
                cAssert.include(cell.getWrapperClasses('blue', false), 'controls-background-blue');
                cAssert.notInclude(cell.getWrapperClasses('blue', false), [
                    'controls-background-red',
                    'controls-background-default',
                ]);
            });

            // - backgroundStyle!=default
            // + style!=default
            // + backgroundColorStyle
            // = backgroundColorStyle
            it('-backgroundStyle!=default, +style!=default, +backgroundColorStyle', () => {
                const cell = createGridCell({
                    column: { width: '' },
                    isSticked: true,
                    theme: 'default',
                    style: 'master',
                });
                cAssert.include(cell.getWrapperClasses('blue', false), 'controls-background-blue');
                cAssert.notInclude(cell.getWrapperClasses('blue', false), [
                    'controls-background-master',
                    'controls-background-default',
                ]);
            });

            // + style=default
            // + backgroundStyle=default
            // + backgroundColorStyle
            // = backgroundColorStyle
            it('+backgroundStyle=default, +style=default, +backgroundColorStyle', () => {
                const cell = createGridCell({
                    column: { width: '' },
                    backgroundStyle: 'default',
                    isSticked,
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
                const cell = createGridCell({
                    column: { width: '' },
                    backgroundStyle: 'red',
                    isSticked,
                    theme: 'default',
                    style: 'master',
                });
                cAssert.include(cell.getWrapperClasses(undefined, false), [
                    'controls-background-red',
                ]);

                cAssert.notInclude(cell.getWrapperClasses(undefined, false), [
                    'controls-background-undefined',
                    'controls-background-default',
                    'controls-background-master',
                ]);
            });

            // + backgroundStyle!=default
            // + style=default
            // - backgroundColorStyle
            // = backgroundStyle
            it('+backgroundStyle!=default, +style=default, -backgroundColorStyle', () => {
                const cell = createGridCell({
                    column: { width: '' },
                    backgroundStyle: 'red',
                    isSticked,
                    theme: 'default',
                    style: 'default',
                });
                cAssert.include(cell.getWrapperClasses(undefined, false), [
                    'controls-background-red',
                ]);
                cAssert.notInclude(cell.getWrapperClasses(undefined, false), [
                    'controls-background-undefined',
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
                const cell = createGridCell({
                    column: { width: '' },
                    backgroundStyle: 'default',
                    isSticked,
                    theme: 'default',
                    style: 'default',
                });
                cAssert.include(cell.getWrapperClasses(undefined, false), [
                    'controls-background-default-sticky',
                ]);
                cAssert.notInclude(cell.getWrapperClasses(undefined, false), [
                    'controls-background-undefined',
                    'controls-background-default',
                ]);
            });

            // + backgroundStyle=default
            // + style!=default
            // - backgroundColorStyle
            // = style
            it('+backgroundStyle=default, +style=!default, -backgroundColorStyle', () => {
                const cell = createGridCell({
                    column: { width: '' },
                    backgroundStyle: 'default',
                    isSticked,
                    theme: 'default',
                    style: 'master',
                });
                cAssert.include(cell.getWrapperClasses(undefined, false), [
                    'controls-background-master',
                ]);
                cAssert.notInclude(cell.getWrapperClasses(undefined, false), [
                    'controls-background-undefined',
                    'controls-background-default',
                ]);
            });
        });
    });
});
