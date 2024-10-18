import { Model } from 'Types/entity';
import { GridRow, GridCell, IGridCellOptions } from 'Controls/grid';
import { CssClassesAssert as cAssert } from '../../../CustomAsserts';
import { getRowMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/grid/Display/Cell/background/hoverBackgroundStyle', () => {
    function createGridCell(
        hoverBackgroundStyle?: string,
        gridHoverBackgroundStyle?: string
    ): GridCell<Model, GridRow<Model>> {
        return new GridCell({
            owner: getRowMock({
                gridColumnsConfig: [{}],
                hoverBackgroundStyle: gridHoverBackgroundStyle,
                editingBackgroundStyle: 'default',
                rowSeparatorSize: 's',
                columnIndex: 1,
                fadedClass: '',
            }),
            column: {
                width: '',
                hoverBackgroundStyle,
            },
            theme: 'default',
            style: 'default',
        } as IGridCellOptions);
    }

    describe('getWrapperClasses', () => {
        it('templateHighlightOnHover=false', () => {
            const cell = createGridCell();
            cAssert.notInclude(
                cell.getWrapperClasses(undefined, false),
                'controls-hover-background-default'
            );
        });

        it('-templateHoverBackgroundStyle, +hoverBackgroundStyle', () => {
            const cell = createGridCell(undefined, 'default');
            cAssert.include(
                cell.getWrapperClasses(undefined, true),
                'controls-hover-background-default'
            );
        });

        it('+templateHoverBackgroundStyle, +hoverBackgroundStyle', () => {
            const cell = createGridCell('custom');
            cAssert.include(
                cell.getWrapperClasses(undefined, true, 'custom'),
                'controls-hover-background-custom'
            );
        });

        it('column.hoverBackgroundStyle=transparent', () => {
            const cell = createGridCell('transparent');
            cAssert.notInclude(
                cell.getWrapperClasses(undefined, true),
                'controls-hover-background-default'
            );
        });
    });

    describe('getContentClasses', () => {
        // Если на шаблоне выключен ховер для всей строки, то нет смысла подсвечивать какую-то одну
        it('templateHighlightOnHover=false, column.hoverBackgroundStyle=custom', () => {
            const cell = createGridCell('custom');
            cAssert.notInclude(
                cell.getContentClasses(undefined, 'default', false),
                'controls-hover-background-custom'
            );
        });

        it('templateHighlightOnHover=true, column.hoverBackgroundStyle=custom', () => {
            const cell = createGridCell('custom');
            cAssert.include(
                cell.getContentClasses(undefined, 'default', true),
                'controls-hover-background-custom'
            );
        });

        it('templateHighlightOnHover=true, column.hoverBackgroundStyle=transparent', () => {
            const cell = createGridCell('transparent');
            cAssert.notInclude(
                cell.getContentClasses(undefined, 'default', true),
                'controls-hover-background-default'
            );
        });

        it('templateHighlightOnHover=true, column.hoverBackgroundStyle not defined', () => {
            const cell = createGridCell(undefined, 'default');
            cAssert.include(
                cell.getContentClasses(undefined, 'default', true),
                'controls-hover-background-default'
            );
        });

        // Если на шаблоне выключен ховер для всей строки, то нет смысла подсвечивать какую-то одну
        // eslint-disable-next-line max-len
        it('templateHighlightOnHover=false, templateHoverBackgroundStyle=custom2, column.hoverBackgroundStyle=custom', () => {
            const cell = createGridCell('custom');
            cAssert.notInclude(
                cell.getContentClasses(undefined, 'default', false, true, 'custom2'),
                'controls-hover-background-custom'
            );
        });

        // eslint-disable-next-line max-len
        it('templateHighlightOnHover=true, templateHoverBackgroundStyle=custom2, column.hoverBackgroundStyle=custom', () => {
            const cell = createGridCell('custom');
            cAssert.include(
                cell.getContentClasses(undefined, 'default', true, true, 'custom2'),
                'controls-hover-background-custom'
            );
        });

        it('templateHighlightOnHover=true, templateHoverBackgroundStyle=custom2, column.hoverBackgroundStyle=transparent', () => {
            const cell = createGridCell('transparent');
            cAssert.notInclude(
                cell.getContentClasses(undefined, 'default', true, true, 'custom2'),
                'controls-hover-background-default'
            );
        });

        it('templateHighlightOnHover=true, templateHoverBackgroundStyle=custom2, column.hoverBackgroundStyle not defined', () => {
            const cell = createGridCell();
            cAssert.include(
                cell.getContentClasses(undefined, 'default', true, true, 'custom2'),
                'controls-hover-background-custom2'
            );
        });
    });
});
