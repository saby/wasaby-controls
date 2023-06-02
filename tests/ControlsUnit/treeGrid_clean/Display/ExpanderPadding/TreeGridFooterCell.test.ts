import { TreeGridFooterCell } from 'Controls/treeGrid';
import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';

describe('Controls/treeGrid_clean/Display/ExpanderPadding/TreeGridFooterCell', () => {
    let mockedOwner;

    beforeEach(() => {
        mockedOwner = {
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
                return false;
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
    });

    it('display expander padding', () => {
        const footerCell = new TreeGridFooterCell({
            displayExpanderPadding: true,
            column: {},
            owner: mockedOwner,
        });

        CssClassesAssert.include(
            footerCell.getWrapperClasses('mockedBG', false),
            'controls-TreeView__expanderPadding-default'
        );
    });

    it('not display expander padding', () => {
        const footerCell = new TreeGridFooterCell({
            displayExpanderPadding: false,
            column: {},
            owner: mockedOwner,
        });

        CssClassesAssert.notInclude(
            footerCell.getWrapperClasses('mockedBG', false),
            'controls-TreeView__expanderPadding-default'
        );
    });

    it('setDisplayExpanderPadding', () => {
        const footerCell = new TreeGridFooterCell({
            displayExpanderPadding: false,
            column: {},
            owner: mockedOwner,
        });

        CssClassesAssert.notInclude(
            footerCell.getWrapperClasses('mockedBG', false),
            'controls-TreeView__expanderPadding-default'
        );

        footerCell.setDisplayExpanderPadding(true);
        CssClassesAssert.include(
            footerCell.getWrapperClasses('mockedBG', false),
            'controls-TreeView__expanderPadding-default'
        );
    });

    describe('not full grid support', () => {
        beforeEach(() => {
            mockedOwner.isFullGridSupport = () => {
                return false;
            };
        });

        it("wrapper classes don't include expander padding classes", () => {
            mockedOwner.getExpanderVisibility = () => {
                return 'visible';
            };
            const footerCell = new TreeGridFooterCell({
                displayExpanderPadding: false,
                column: {},
                owner: mockedOwner,
            });

            CssClassesAssert.notInclude(
                footerCell.getWrapperClasses('mockedBG', false),
                'controls-TreeView__expanderPadding-default'
            );
        });

        it('content classes include expander padding classes', () => {
            const footerCell = new TreeGridFooterCell({
                displayExpanderPadding: true,
                column: {},
                owner: mockedOwner,
            });

            CssClassesAssert.include(
                footerCell.getContentClasses(),
                'controls-TreeView__expanderPadding-default'
            );
        });
    });
});
