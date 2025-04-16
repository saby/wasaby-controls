import { TreeGridNodeFooterRow } from 'Controls/treeGrid';

describe('Controls/treeGrid_clean/Display/NodeFooterRow', () => {
    const getMockedOwner = () => {
        return {
            getRoot: () => {
                return null;
            },
            hasMultiSelectColumn: () => {
                return false;
            },
            hasColumnScroll: () => {
                return false;
            },
            isFullGridSupport: () => {
                return true;
            },
            hasItemActionsSeparatedCell: () => {
                return false;
            },
            hasSpacingColumn: () => {
                return false;
            },
            hasResizer: () => {
                return false;
            },
            isDragging: () => {
                return false;
            },
        };
    };

    describe('.getColumnIndex()', () => {
        describe('node footer row in grid with ladder', () => {
            let nodeFooter;
            beforeEach(() => {
                const columnsConfig = [
                    {
                        displayProperty: 'first',
                        stickyProperty: ['prop1', 'prop2'],
                    },
                    {
                        displayProperty: 'second',
                    },
                ];
                nodeFooter = new TreeGridNodeFooterRow({
                    owner: {
                        ...getMockedOwner(),
                        getGridColumnsConfig: () => {
                            return columnsConfig;
                        },
                    },
                    rowTemplate: () => {
                        return 'NODE_FOOTER_TEMPLATE';
                    },
                    nodeFooterTemplate: () => {
                        return 'NODE_FOOTER_TEMPLATE';
                    },
                    gridColumnsConfig: columnsConfig,
                    contents: '',
                });
                nodeFooter.shouldDisplayMoreButton = () => {
                    return true;
                };
            });

            it('count with ladder column', () => {
                const columns = nodeFooter.getColumns();
                expect(nodeFooter.getColumnIndex(columns[1], false, true)).toEqual(1);
            });
            it('count without ladder column', () => {
                const columns = nodeFooter.getColumns();
                expect(nodeFooter.getColumnIndex(columns[1], false, false)).toEqual(0);
            });
        });
    });
});
