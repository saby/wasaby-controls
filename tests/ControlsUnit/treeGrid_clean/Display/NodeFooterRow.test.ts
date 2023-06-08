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
            hasColumnScrollReact: () => {
                return false;
            },
        };
    };

    it('override setGridColumnsConfig', () => {
        const oldGridColumnsConfig = [{}];
        const newGridColumnsConfig = [{}, {}];

        const owner = {
            ...getMockedOwner(),
            getGridColumnsConfig: () => {
                return oldGridColumnsConfig;
            },
            getColumnsEnumerator: () => {
                return {
                    getColumnsConfig: () => {
                        return oldGridColumnsConfig;
                    },
                };
            },
            hasNodeFooterColumns: () => {
                return false;
            },
        };

        const nodeFooter = new TreeGridNodeFooterRow({
            owner,
            rowTemplate: () => {
                return 'NODE_FOOTER_TEMPLATE';
            },
            gridColumnsConfig: oldGridColumnsConfig,
            contents: '',
        });

        expect(nodeFooter.getGridColumnsConfig()).toEqual(oldGridColumnsConfig);
        nodeFooter.setGridColumnsConfig(newGridColumnsConfig);

        // TODO: Выправить, группировка написана тоже странно.
        //  При вызове collection.setColumns, getGridColumnsConfig на коллекции и элементе группы
        //  возвращают разные значения, т.к. метод лезет в owner.
        //  https://online.sbis.ru/opendoc.html?guid=5fc3c0e2-e5bf-4006-a67e-51a80c8bd8f1
        owner.getGridColumnsConfig = () => {
            return newGridColumnsConfig;
        };
        owner.getColumnsEnumerator = () => {
            return {
                getColumnsConfig: () => {
                    return newGridColumnsConfig;
                },
            };
        };
        expect(nodeFooter.getGridColumnsConfig()).toEqual(newGridColumnsConfig);
    });

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
                        getColumnsEnumerator: () => {
                            return {
                                getColumnsConfig: () => {
                                    return columnsConfig;
                                },
                            };
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
                nodeFooter.needMoreButton = () => {
                    return true;
                };
            });

            it('count with ladder column', () => {
                const columns = nodeFooter.getColumns();
                expect(
                    nodeFooter.getColumnIndex(columns[1], false, true)
                ).toEqual(1);
            });
            it('count without ladder column', () => {
                const columns = nodeFooter.getColumns();
                expect(
                    nodeFooter.getColumnIndex(columns[1], false, false)
                ).toEqual(0);
            });
        });
    });
});
