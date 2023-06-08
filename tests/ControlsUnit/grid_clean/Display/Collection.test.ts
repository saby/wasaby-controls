import { GridCollection } from 'Controls/grid';
import { TemplateFunction } from 'UI/Base';
import { Logger } from 'UI/Utils';

describe('Controls/grid_clean/Display/Collection', () => {
    describe('Update options', () => {
        describe('multiSelectVisibility', () => {
            it('Initialize with multiSelectVisibility==="hidden" and set it to "visible"', () => {
                const gridCollection = new GridCollection({
                    collection: [{ key: 1 }, { key: 2 }, { key: 3 }],
                    keyProperty: 'key',
                    columns: [
                        {
                            displayProperty: 'id',
                            resultTemplate: () => {
                                return 'result';
                            },
                        },
                    ],
                    footer: [
                        {
                            template: () => {
                                return 'footer';
                            },
                        },
                    ],
                    header: [
                        {
                            template: () => {
                                return 'header';
                            },
                        },
                    ],
                    emptyTemplate: 'emptyTemplate',
                    resultsPosition: 'top',
                    rowSeparatorSize: 's',
                });

                let columnItems = gridCollection.at(0).getColumns();
                expect(columnItems.length).toBe(1);
                expect(columnItems[0].getRowSeparatorSize()).toBe('s');

                let headerItems = gridCollection
                    .getHeader()
                    .getRow()
                    .getColumns();
                expect(headerItems.length).toBe(1);

                let resultsItems = gridCollection.getResults().getColumns();
                expect(resultsItems.length).toBe(1);

                let footerItems = gridCollection.getFooter().getColumns();
                expect(footerItems.length).toBe(1);

                let emptyGridItems = gridCollection
                    .getEmptyGridRow()
                    .getColumns();
                expect(emptyGridItems.length).toBe(1);
                expect(emptyGridItems[0].getColspan()).toBe(1);

                // setMultiSelectVisibility
                gridCollection.setMultiSelectVisibility('visible');

                columnItems = gridCollection.at(0).getColumns();
                expect(columnItems.length).toBe(2);
                expect(columnItems[0].getRowSeparatorSize()).toBe('s');
                expect(columnItems[1].getRowSeparatorSize()).toBe('s');

                headerItems = gridCollection.getHeader().getRow().getColumns();
                expect(headerItems.length).toBe(2);

                resultsItems = gridCollection.getResults().getColumns();
                expect(resultsItems.length).toBe(2);

                footerItems = gridCollection.getFooter().getColumns();
                expect(footerItems.length).toBe(2);

                emptyGridItems = gridCollection.getEmptyGridRow().getColumns();
                expect(emptyGridItems.length).toBe(1);
                expect(emptyGridItems[0].getColspan()).toBe(2);
            });

            it('Initialize with multiSelectVisibility==="visible" and set it to "hidden"', () => {
                const gridCollection = new GridCollection({
                    collection: [{ key: 1 }, { key: 2 }, { key: 3 }],
                    keyProperty: 'key',
                    columns: [
                        {
                            displayProperty: 'id',
                            resultTemplate: () => {
                                return 'result';
                            },
                        },
                    ],
                    footer: [
                        {
                            template: () => {
                                return 'footer';
                            },
                        },
                    ],
                    header: [
                        {
                            template: () => {
                                return 'header';
                            },
                        },
                    ],
                    emptyTemplate: 'emptyTemplate',
                    resultsPosition: 'top',
                    multiSelectVisibility: 'visible',
                    rowSeparatorSize: 's',
                });

                let columnItems = gridCollection.at(0).getColumns();
                expect(columnItems.length).toBe(2);
                expect(columnItems[0].getRowSeparatorSize()).toBe('s');
                expect(columnItems[1].getRowSeparatorSize()).toBe('s');

                let headerItems = gridCollection
                    .getHeader()
                    .getRow()
                    .getColumns();
                expect(headerItems.length).toBe(2);

                let resultsItems = gridCollection.getResults().getColumns();
                expect(resultsItems.length).toBe(2);

                let footerItems = gridCollection.getFooter().getColumns();
                expect(footerItems.length).toBe(2);

                let emptyGridItems = gridCollection
                    .getEmptyGridRow()
                    .getColumns();
                expect(emptyGridItems.length).toBe(1);
                expect(emptyGridItems[0].getColspan()).toBe(2);

                // setMultiSelectVisibility
                gridCollection.setMultiSelectVisibility('hidden');

                columnItems = gridCollection.at(0).getColumns();
                expect(columnItems.length).toBe(1);
                expect(columnItems[0].getRowSeparatorSize()).toBe('s');

                headerItems = gridCollection.getHeader().getRow().getColumns();
                expect(headerItems.length).toBe(1);

                resultsItems = gridCollection.getResults().getColumns();
                expect(resultsItems.length).toBe(1);

                footerItems = gridCollection.getFooter().getColumns();
                expect(footerItems.length).toBe(1);

                emptyGridItems = gridCollection.getEmptyGridRow().getColumns();
                expect(emptyGridItems.length).toBe(1);
                expect(emptyGridItems[0].getColspan()).toBe(1);
            });

            it("change multiSelectVisibility onhover => visible, shouldn't update version", () => {
                const gridCollection = new GridCollection({
                    collection: [{ key: 1 }, { key: 2 }, { key: 3 }],
                    keyProperty: 'key',
                    columns: [
                        {
                            displayProperty: 'id',
                            resultTemplate: () => {
                                return 'result';
                            },
                        },
                    ],
                    footer: [
                        {
                            template: () => {
                                return 'footer';
                            },
                        },
                    ],
                    header: [
                        {
                            template: () => {
                                return 'header';
                            },
                        },
                    ],
                    emptyTemplate: 'emptyTemplate',
                    resultsPosition: 'top',
                    multiSelectVisibility: 'onhover',
                    rowSeparatorSize: 's',
                });

                const headerInitialVersion = gridCollection
                    .getHeader()
                    .getVersion();
                const resultsInitialVersion = gridCollection
                    .getResults()
                    .getVersion();
                const footerInitialVersion = gridCollection
                    .getFooter()
                    .getVersion();
                const emptyGridInitialVersion = gridCollection
                    .getEmptyGridRow()
                    .getVersion();

                // setMultiSelectVisibility
                gridCollection.setMultiSelectVisibility('visible');

                expect(gridCollection.getHeader().getVersion()).toBe(
                    headerInitialVersion
                );
                expect(gridCollection.getResults().getVersion()).toBe(
                    resultsInitialVersion
                );
                expect(gridCollection.getFooter().getVersion()).toBe(
                    footerInitialVersion
                );
                expect(gridCollection.getEmptyGridRow().getVersion()).toBe(
                    emptyGridInitialVersion
                );
            });
        });

        describe('resultsPosition', () => {
            it('Initialize with resultsPosition==="top"', () => {
                const gridCollection = new GridCollection({
                    collection: [{ key: 1 }, { key: 2 }, { key: 3 }],
                    keyProperty: 'key',
                    columns: [
                        {
                            displayProperty: 'id',
                            resultTemplate: () => {
                                return 'result';
                            },
                        },
                    ],
                    resultsPosition: 'top',
                });

                expect(gridCollection.getResults()).toBeDefined();
            });

            it('Initialize with resultsPosition==="top" and set it to "undefined"', () => {
                const gridCollection = new GridCollection({
                    collection: [{ key: 1 }, { key: 2 }, { key: 3 }],
                    keyProperty: 'key',
                    columns: [
                        {
                            displayProperty: 'id',
                            resultTemplate: () => {
                                return 'result';
                            },
                        },
                    ],
                    resultsPosition: 'top',
                });

                gridCollection.setResultsPosition(undefined);
                expect(gridCollection.getResults()).toBeNull();
            });

            it('Initialize with resultsPosition==="undefined"', () => {
                const gridCollection = new GridCollection({
                    collection: [{ key: 1 }, { key: 2 }, { key: 3 }],
                    keyProperty: 'key',
                    columns: [
                        {
                            displayProperty: 'id',
                            resultTemplate: () => {
                                return 'result';
                            },
                        },
                    ],
                });

                expect(gridCollection.getResults()).toBeUndefined();
            });

            it('Initialize with resultsPosition==="undefined" and set it to "top"', () => {
                const gridCollection = new GridCollection({
                    collection: [{ key: 1 }, { key: 2 }, { key: 3 }],
                    keyProperty: 'key',
                    columns: [
                        {
                            displayProperty: 'id',
                            resultTemplate: () => {
                                return 'result';
                            },
                        },
                    ],
                });

                gridCollection.setResultsPosition('top');
                expect(gridCollection.getResults()).toBeDefined();
            });
        });
        describe('resultsVisibility', () => {
            it('setResultsVisibility resets results object', () => {
                const gridCollection = new GridCollection({
                    collection: [],
                    keyProperty: 'key',
                    columns: [
                        {
                            displayProperty: 'id',
                            resultTemplate: () => {
                                return 'result';
                            },
                        },
                    ],
                    resultsPosition: 'top',
                    resultsVisibility: 'visible',
                });

                expect(gridCollection.getResults()).toBeDefined();

                gridCollection.setResultsVisibility('hasdata');

                expect(gridCollection.getResults()).toBeNull();
            });
        });
        describe('emptyTemplateColumns', () => {
            it('Initialize with emptyTemplateColumns', () => {
                const emptyColumnsConfig = [
                    {
                        startColumn: 1,
                        endColumn: 3,
                        template: (() => {
                            return 'EMPTY_COLUMN_TEMPLATE';
                        }) as TemplateFunction,
                    },
                ];
                const gridCollection = new GridCollection({
                    collection: [{ key: 1 }, { key: 2 }, { key: 3 }],
                    keyProperty: 'key',
                    columns: [
                        { displayProperty: 'id' },
                        { displayProperty: 'name' },
                    ],
                    emptyTemplateColumns: emptyColumnsConfig,
                });

                expect(gridCollection.getEmptyGridRow()).toBeDefined();
                expect(
                    gridCollection.getEmptyGridRow().getColumns()[0].config
                ).toEqual(emptyColumnsConfig[0]);
            });

            it('Initialize without emptyTemplateColumns', () => {
                const gridCollection = new GridCollection({
                    collection: [{ key: 1 }, { key: 2 }, { key: 3 }],
                    keyProperty: 'key',
                    columns: [
                        { displayProperty: 'id' },
                        { displayProperty: 'name' },
                    ],
                });

                expect(gridCollection.getEmptyGridRow()).toBeUndefined();
            });

            it('Initialize with emptyTemplateColumns and change it', () => {
                const emptyColumnsConfig = [
                    {
                        startColumn: 1,
                        endColumn: 3,
                        template: (() => {
                            return 'EMPTY_COLUMN_TEMPLATE';
                        }) as TemplateFunction,
                    },
                ];
                const gridCollection = new GridCollection({
                    collection: [{ key: 1 }, { key: 2 }, { key: 3 }],
                    keyProperty: 'key',
                    columns: [
                        { displayProperty: 'id' },
                        { displayProperty: 'name' },
                    ],
                    emptyTemplateColumns: emptyColumnsConfig,
                });

                const oldEmptyTemplateRow = gridCollection.getEmptyGridRow();

                const newEmptyColumnsConfig = [
                    {
                        startColumn: 1,
                        endColumn: 3,
                        template: (() => {
                            return 'NEW_EMPTY_COLUMN_TEMPLATE';
                        }) as TemplateFunction,
                    },
                ];
                gridCollection.setEmptyTemplateColumns(newEmptyColumnsConfig);
                expect(oldEmptyTemplateRow).toEqual(
                    gridCollection.getEmptyGridRow()
                );
                expect(
                    gridCollection.getEmptyGridRow().getColumns()[0].config
                ).toEqual(newEmptyColumnsConfig[0]);
            });

            it('Initialize without emptyTemplateColumns and set it', () => {
                const gridCollection = new GridCollection({
                    collection: [{ key: 1 }, { key: 2 }, { key: 3 }],
                    keyProperty: 'key',
                    columns: [
                        { displayProperty: 'id' },
                        { displayProperty: 'name' },
                    ],
                });

                const emptyColumnsConfig = [
                    {
                        startColumn: 1,
                        endColumn: 3,
                        template: (() => {
                            return 'EMPTY_COLUMN_TEMPLATE';
                        }) as TemplateFunction,
                    },
                ];
                gridCollection.setEmptyTemplateColumns(emptyColumnsConfig);
                expect(gridCollection.getEmptyGridRow()).toBeDefined();
                expect(
                    gridCollection.getEmptyGridRow().getColumns()[0].config
                ).toEqual(emptyColumnsConfig[0]);
            });
        });

        it('editingConfig', () => {
            const gridCollection = new GridCollection({
                collection: [{ key: 1 }],
                keyProperty: 'key',
                columns: [{ displayProperty: 'id' }],
                editingConfig: {},
            });

            expect(gridCollection.getItems()[0].getVersion()).toEqual(0);
            gridCollection.setEditingConfig({ mode: 'cell' });
            expect(gridCollection.getItems()[0].getVersion()).toEqual(1);
        });

        describe('setStickyColumnsCount', () => {
            it('stickyColumnsCount should be less then column.length', () => {
                const gridCollection = new GridCollection({
                    collection: [{ key: 1 }, { key: 2 }, { key: 3 }],
                    keyProperty: 'key',
                    columns: [
                        { displayProperty: 'id' },
                        { displayProperty: 'title' },
                    ],
                });

                const originLoggerErrorMethod = Logger.error;
                Logger.error = (msg) => {
                    // eslint-disable-next-line @typescript-eslint/no-throw-literal
                    throw msg;
                };

                expect(() => {
                    gridCollection.setStickyColumnsCount(1);
                }).not.toThrow();

                expect(() => {
                    gridCollection.setStickyColumnsCount(2);
                }).toThrow();

                expect(() => {
                    gridCollection.setStickyColumnsCount(3);
                }).toThrow();

                Logger.error = originLoggerErrorMethod;
            });
        });
    });
});
