import { TreeGridFooterCell } from 'Controls/treeGrid';
import { createRegExpForTestMatchClass } from 'ControlsUnit/_listsUtils/RegExp';

describe('Controls/treeGrid_clean/Display/MultiSelectVisibility/FooterCell/getWrapperClasses', () => {
    it('hasMultiSelectColumn() returns false, check first cell', () => {
        const mockedOwner = {
            getGridColumnsConfig: () => {
                return [{}];
            },
            getColumnsCount: () => {
                return 1;
            },
            getStickyColumnsCount: () => {
                return 0;
            },
            getExpanderSize: () => {
                return '';
            },
            getExpanderIcon: () => {
                return '';
            },
            hasNodeWithChildren: () => {
                return true;
            },
            hasNode: () => {
                return true;
            },
            getExpanderPosition: () => {
                return 'default';
            },
            getExpanderVisibility: () => {
                return 'hasChildren';
            },
            getActionsTemplateConfig: jest.fn(),
            hasMultiSelectColumn: () => {
                return false;
            },
            getMultiSelectVisibility: () => {
                return 'hidden';
            },
            hasColumnScroll: () => {
                return false;
            },
            getLeftPadding: () => {
                return '';
            },
            getRightPadding: () => {
                return '';
            },
            hasItemActionsSeparatedCell: () => {
                return false;
            },
            getColumnIndex: () => {
                return 0;
            },
            isFullGridSupport: () => {
                return true;
            },
        } as any;

        const footerCell = new TreeGridFooterCell({
            owner: mockedOwner,
            column: {},
        });
        expect(footerCell.getWrapperClasses('mockedBG', false)).toMatch(
            createRegExpForTestMatchClass('controls-TreeView__expanderPadding')
        );
    });

    it('hasMultiSelectColumn() returns true, check first cell (checkbox cell)', () => {
        const mockedOwner = {
            getGridColumnsConfig: () => {
                return [{}];
            },
            getColumnsCount: () => {
                return 2;
            },
            getStickyColumnsCount: () => {
                return 0;
            },
            getExpanderSize: () => {
                return '';
            },
            getExpanderIcon: () => {
                return '';
            },
            getExpanderPosition: () => {
                return 'default';
            },
            getExpanderVisibility: () => {
                return 'hasChildren';
            },
            hasNodeWithChildren: () => {
                return true;
            },
            hasNode: () => {
                return true;
            },
            getActionsTemplateConfig: jest.fn(),
            hasMultiSelectColumn: () => {
                return true;
            },
            getMultiSelectVisibility: () => {
                return 'visible';
            },
            hasColumnScroll: () => {
                return false;
            },
            getLeftPadding: () => {
                return '';
            },
            getRightPadding: () => {
                return '';
            },
            hasItemActionsSeparatedCell: () => {
                return false;
            },
            getColumnIndex: () => {
                return 0;
            },
            isFullGridSupport: () => {
                return true;
            },
        } as any;

        const footerCell = new TreeGridFooterCell({
            owner: mockedOwner,
            column: {},
        });

        expect(footerCell.getWrapperClasses('mockedBG', false)).not.toMatch(
            createRegExpForTestMatchClass('controls-TreeView__expanderPadding')
        );
    });

    it('hasMultiSelectColumn() returns true, check second cell', () => {
        const mockedOwner = {
            getGridColumnsConfig: () => {
                return [{}];
            },
            getColumnsCount: () => {
                return 2;
            },
            getStickyColumnsCount: () => {
                return 0;
            },
            getExpanderSize: () => {
                return '';
            },
            getExpanderIcon: () => {
                return '';
            },
            getExpanderPosition: () => {
                return 'default';
            },
            getExpanderVisibility: () => {
                return 'hasChildren';
            },
            hasNodeWithChildren: () => {
                return true;
            },
            hasNode: () => {
                return true;
            },
            getActionsTemplateConfig: jest.fn(),
            hasMultiSelectColumn: () => {
                return true;
            },
            getMultiSelectVisibility: () => {
                return 'visible';
            },
            hasColumnScroll: () => {
                return false;
            },
            getLeftPadding: () => {
                return '';
            },
            getRightPadding: () => {
                return '';
            },
            hasItemActionsSeparatedCell: () => {
                return false;
            },
            getColumnIndex: () => {
                return 1;
            },
            isFullGridSupport: () => {
                return true;
            },
        } as any;

        const footerCell = new TreeGridFooterCell({
            owner: mockedOwner,
            column: {},
        });

        expect(footerCell.getWrapperClasses('mockedBG', false)).toMatch(
            createRegExpForTestMatchClass('controls-TreeView__expanderPadding')
        );
    });
});
