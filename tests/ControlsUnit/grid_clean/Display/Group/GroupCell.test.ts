import { IColumn } from 'Controls/grid';
import { GridGroupCell as GroupCell } from 'Controls/grid';
import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';
import { getGroupRowMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/grid/Display/Group/GroupCell', () => {
    let column: IColumn;
    let hasMultiSelectColumn: boolean;

    const getGroupCell = () => {
        return new GroupCell({
            contents: {},
            columnsLength: 4,
            column,
            owner: getGroupRowMock({
                gridColumnsConfig: [],
                hasMultiSelectColumn,
                groupPaddingClasses: 'controls-ListView__groupContent__rightPadding_s',
            }),
        });
    };

    beforeEach(() => {
        hasMultiSelectColumn = false;
        column = { width: '150' };
    });

    describe('shouldDisplayLeftSeparator', () => {
        it("should return false when textAlign === 'left'", () => {
            const result = getGroupCell().shouldDisplayLeftSeparator(true, undefined, 'left');
            expect(result).toBe(false);
        });

        it("should return true when textAlign !== 'left'", () => {
            const result = getGroupCell().shouldDisplayLeftSeparator(true, undefined, 'right');
            expect(result).toBe(true);
        });

        it('should not return true when textVisible === false', () => {
            const result = getGroupCell().shouldDisplayLeftSeparator(true, false, 'right');
            expect(result).toBe(false);
        });

        it('should not return true when separatorVisibility === false', () => {
            const result = getGroupCell().shouldDisplayLeftSeparator(false, undefined, 'right');
            expect(result).toBe(false);
        });
    });

    describe('shouldDisplayRightSeparator', () => {
        it("should return true when textVisible === false and textAlign === 'right'", () => {
            const result = getGroupCell().shouldDisplayRightSeparator(true, false, 'right');
            expect(result).toBe(true);
        });

        it('should return true when textVisible !== false', () => {
            const result = getGroupCell().shouldDisplayRightSeparator(true, undefined, 'left');
            expect(result).toBe(true);
        });

        it("should return false when textVisible !== false and textAlign === 'right'", () => {
            const result = getGroupCell().shouldDisplayRightSeparator(true, undefined, 'right');
            expect(result).toBe(false);
        });

        it('should return false when separatorVisibility === false', () => {
            const result = getGroupCell().shouldDisplayRightSeparator(false, false, 'left');
            expect(result).toBe(false);
        });
    });

    describe('getContentTextClasses', () => {
        it('should contain placeholder class when no separator and textAlign === right', () => {
            const classes = getGroupCell().getContentTextWrapperClasses(
                undefined,
                undefined,
                undefined,
                undefined,
                false
            );
            CssClassesAssert.include(classes, ['tw-flex-grow']);
        });

        it('should contain placeholder class when no separator', () => {
            const classes = getGroupCell().getContentTextWrapperClasses(
                undefined,
                undefined,
                undefined,
                undefined,
                false
            );
            CssClassesAssert.include(classes, ['tw-flex-grow']);
        });

        it('should contain align class', () => {
            let classes: string;
            classes = getGroupCell().getContentTextClasses('left');
            CssClassesAssert.include(classes, ['controls-ListView__groupContent_left']);

            classes = getGroupCell().getContentTextClasses('right');
            CssClassesAssert.include(classes, ['controls-ListView__groupContent_right']);

            classes = getGroupCell().getContentTextClasses(undefined);
            CssClassesAssert.include(classes, ['controls-ListView__groupContent_center']);
        });

        it('should NOT contain placeholder class when separator and textAlign === right', () => {
            const classes = getGroupCell().getContentTextWrapperClasses(
                undefined,
                undefined,
                undefined,
                undefined,
                true
            );
            CssClassesAssert.notInclude(classes, ['tw-flex-grow']);
        });
    });

    describe('getContentTextStylingClasses', () => {
        it('should contain styling classes when styling options are set', () => {
            const classes = getGroupCell().getContentTextStylingClasses(
                'secondary',
                's',
                'bold',
                'uppercase'
            );
            CssClassesAssert.include(classes, [
                'controls-fontsize-s',
                'controls-text-secondary',
                'controls-fontweight-bold',
                'controls-ListView__groupContent_textTransform_uppercase',
                'controls-ListView__groupContent_textTransform_uppercase_s',
            ]);
        });

        it('should contain default styling class when styling options are not set', () => {
            const classes = getGroupCell().getContentTextStylingClasses();
            CssClassesAssert.include(classes, [
                'controls-ListView__groupContent-text_default',
                'controls-ListView__groupContent-text_color_default',
            ]);
            CssClassesAssert.notInclude(classes, [
                'controls-fontweight-bold',
                'controls-ListView__groupContent_textTransform_uppercase',
                'controls-ListView__groupContent_textTransform_uppercase_s',
            ]);
        });
    });
});
