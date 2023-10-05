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
});
