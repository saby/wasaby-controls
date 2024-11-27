import { GridDataCell } from 'Controls/grid';
import { CssClassesAssert as cAssert } from './../../../CustomAsserts';
import { getDataRowMock } from 'ControlsUnit/_listsUtils/mockOwner';
import { Model } from 'Types/entity';

describe('Controls/grid_clean/Display/DataCell/textOverflow', () => {
    let editArrowIsVisible: boolean;
    const getMockedOwner = () => {
        return getDataRowMock({
            gridColumnsConfig: [],
            hoverBackgroundStyle: 'default',
            editingConfig: {
                mode: 'cell',
            },
            isEditArrowVisible: editArrowIsVisible,
            defaultDisplayValue: 'value',
            contents: { key: 'key' } as unknown as Model,
        });
    };

    beforeEach(() => {
        editArrowIsVisible = false;
    });

    describe('getTextOverflowClasses', () => {
        it('should add correct classes when textOverflow', () => {
            const cell = new GridDataCell({
                owner: getMockedOwner(),
                column: { displayProperty: 'key', textOverflow: 'ellipsis' },
            });
            cAssert.include(cell.getTextOverflowClasses(), ['tw-truncate']);
        });

        it('should add correct classes when not textOverflow', () => {
            const cell = new GridDataCell({
                owner: getMockedOwner(),
                column: { displayProperty: 'key' },
            });
            cAssert.notInclude(cell.getTextOverflowClasses(), ['tw-truncate']);
        });

        it('should add classes for editArrow placing when textOverflow and editArrow', () => {
            editArrowIsVisible = true;
            const cell = new GridDataCell({
                owner: getMockedOwner(),
                column: { displayProperty: 'key', textOverflow: 'ellipsis' },
            });
            cAssert.include(cell.getTextOverflowClasses(), [
                'tw-truncate',
                'tw-max-w-full',
                'tw-shrink-0',
                'tw-max-w-full',
                'controls-Grid__editArrow-overflow-ellipsis',
            ]);
        });

        it('should not add classes for editArrow placing when textOverflow and not editArrow', () => {
            const cell = new GridDataCell({
                owner: getMockedOwner(),
                column: { displayProperty: 'key', textOverflow: 'ellipsis' },
            });
            cAssert.notInclude(cell.getTextOverflowClasses(), [
                'tw-shrink-0 tw-max-w-full tw-shrink-0 tw-max-w-full',
                'controls-Grid__editArrow-overflow-ellipsis',
            ]);
        });
    });

    describe('getTextOverflowTitle', () => {
        it('should return title when textOverflow and not custom template and not tooltipProperty', () => {
            const cell = new GridDataCell({
                owner: getMockedOwner(),
                column: { displayProperty: 'key', textOverflow: 'ellipsis' },
            });
            expect('key').toEqual(cell.getTextOverflowTitle());
        });
        it('should not return title when textOverflow and custom template', () => {
            const cell = new GridDataCell({
                owner: getMockedOwner(),
                column: {
                    displayProperty: 'key',
                    textOverflow: 'ellipsis',
                    template: {},
                },
            });
            expect(Object.keys(cell.getTextOverflowTitle())).toHaveLength(0);
        });
        it('should not return title when textOverflow and tooltipProperty', () => {
            const cell = new GridDataCell({
                owner: getMockedOwner(),
                column: {
                    displayProperty: 'key',
                    textOverflow: 'ellipsis',
                    tooltipProperty: 'tooltip',
                },
            });
            expect(Object.keys(cell.getTextOverflowTitle())).toHaveLength(0);
        });
    });
});
