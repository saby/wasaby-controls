import { GridCollection, GridView } from 'Controls/grid';
import { RecordSet } from 'Types/collection';

describe('Controls/grid_clean/GridView', () => {
    describe('Mount', () => {
        it('Check gridCollection version after mount', async () => {
            const collectionOptions = {
                collection: new RecordSet({
                    rawData: [
                        {
                            key: 1,
                            title: 'item_1',
                        },
                    ],
                    keyProperty: 'key',
                }),
                keyProperty: 'key',
                columns: [{}],
            };
            const gridOptions = {
                listModel: new GridCollection(collectionOptions),
                keyProperty: 'key',
                columns: [{}],
                footerTemplate: () => {
                    return '';
                },
                footer: () => {
                    return '';
                },
                itemPadding: {},
            };
            const gridView = new GridView(gridOptions);
            await gridView._beforeMount(gridOptions);
            expect(gridView.getListModel().getVersion()).toBe(0);
        });

        it('componentDidMount: should forbid colspan groups if column scroll was shown.', async () => {
            const collectionOptions = {
                keyProperty: 'key',
                columns: [{}],
                collection: new RecordSet({
                    rawData: [{ key: 1, title: 'item_1' }],
                    keyProperty: 'key',
                }),
            };
            const gridOptions = {
                keyProperty: 'key',
                columns: [{}],
                itemPadding: {},
                columnScroll: true,
                listModel: new GridCollection(collectionOptions),
            };
            const gridView = new GridView(gridOptions);

            // MOCK COLUMN SCROLL MIXIN. IT WORKS WITH DOM.
            gridView._columnScrollOnViewBeforeMount = jest.fn();
            gridView._columnScrollOnViewDidMount = jest.fn();
            // EMULATE THAT COLUMN SCROLL NEEDED AND CREATED
            gridView.isColumnScrollVisible = () => {
                return true;
            };
            // END MOCK

            await gridView._beforeMount(gridOptions);
            gridView.saveOptions(gridOptions);
            expect(gridView.getListModel().getColspanGroup()).toBe(true);
            gridView._componentDidMount();
            expect(gridView.getListModel().getColspanGroup()).toBe(false);
        });
    });

    describe('_getGridViewClasses', () => {
        let options: { [p: string]: any };
        let fakeFooter: object;
        let fakeResults: object;
        let resultsPosition: string;

        async function getGridView(): typeof GridView {
            const optionsWithModel = {
                ...options,
                listModel: {
                    getFooter: () => {
                        return fakeFooter;
                    },
                    getResults: () => {
                        return fakeResults;
                    },
                    subscribe: jest.fn(),
                    setItemPadding: jest.fn(),
                    getResultsPosition: () => {
                        return resultsPosition;
                    },
                    isDragging: () => {
                        return false;
                    },
                    hasColumnScroll: () => {
                        return false;
                    },
                    setColumnScroll: () => {
                        return undefined;
                    },
                },
            };
            const grid = new GridView(optionsWithModel);
            await grid._beforeMount(optionsWithModel);
            return grid;
        }

        beforeEach(() => {
            fakeFooter = null;
            fakeResults = null;
            resultsPosition = null;
            options = {
                itemActionsPosition: 'outside',
                style: 'default',
                theme: 'default',
            };
        });

        it('should contain class when dragging', async () => {
            options.columns = [{}];
            const grid = await getGridView();
            grid._listModel.isDragging = () => {
                return true;
            };
            const classes = grid._getGridViewClasses(options);
            expect(classes).toContain('controls-Grid_dragging_process');
        });
    });

    describe('ladder offset style', () => {
        it('_getLadderTopOffsetStyles', () => {
            let headerHeight = 100;
            let resultsHeight = 50;
            let groupHeight = 20;
            const options = {
                stickyHeader: true,
                stickyGroup: true,
                columns: [{}],
                ladderOffset: 'offset',
                ladderProperties: [''],
                uniqueId: 'guid',
            };
            const gridView = new GridView(options);
            gridView._listModel = {
                getResultsPosition: () => {
                    return 'top';
                },
                getEmptyGridRow: () => {
                    return null;
                },
            };
            gridView._container = {
                getElementsByClassName: (className) => {
                    if (className === 'controls-Grid__header') {
                        return [
                            {
                                getComputedStyle: () => {
                                    return '';
                                },
                                getBoundingClientRect: () => {
                                    return { height: headerHeight };
                                },
                                closest: () => {
                                    return undefined;
                                },
                            },
                        ];
                    }
                    if (className === 'controls-Grid__results') {
                        return [
                            {
                                getComputedStyle: () => {
                                    return '';
                                },
                                getBoundingClientRect: () => {
                                    return { height: resultsHeight };
                                },
                                closest: () => {
                                    return undefined;
                                },
                            },
                        ];
                    }
                    if (className === 'controls-ListView__groupContent') {
                        return [
                            {
                                getComputedStyle: () => {
                                    return '';
                                },
                                getBoundingClientRect: () => {
                                    return { height: groupHeight };
                                },
                                closest: () => {
                                    return undefined;
                                },
                            },
                        ];
                    }
                },
                closest: () => {
                    return undefined;
                },
            };
            gridView.saveOptions(options);
            gridView._beforeMount(options);
            const expectedStyle =
                '.controls-GridView__ladderOffset-guid .controls-Grid__row-cell__ladder-spacing_withHeader_withResults {' +
                'top: calc(var(--item_line-height_l_grid) + offset + 150px) !important;' +
                '}' +
                '.controls-GridView__ladderOffset-guid .controls-Grid__row-cell__ladder-spacing_withHeader_withResults_withGroup {' +
                'top: calc(var(--item_line-height_l_grid) + offset + 170px) !important;' +
                '}' +
                '.controls-GridView__ladderOffset-guid .controls-Grid__row-cell__ladder-main_spacing_withGroup {' +
                'top: calc(offset + 170px) !important;}' +
                '.controls-GridView__ladderOffset-guid .controls-Grid__row-cell__ladder-main_spacing {' +
                'top: calc(offset + 150px) !important;}';
            gridView._ladderTopOffsetStyles =
                gridView._getLadderTopOffsetStyles();
            expect(gridView._ladderTopOffsetStyles).toEqual(expectedStyle);

            // Таблицу скрыли на switchableArea или на панели
            // Стиль не должен поменяться
            gridView._container.closest = (selector) => {
                return selector === '.ws-hidden' ? {} : null;
            };
            headerHeight = 0;
            resultsHeight = 0;
            groupHeight = 0;
            gridView._ladderTopOffsetStyles =
                gridView._getLadderTopOffsetStyles();
            expect(gridView._ladderTopOffsetStyles).toEqual(expectedStyle);

            // Таблица не содержит доп. элементов вроде заголовка, результатов, групп и опционального отступа.
            // Не вешаем стилей
            gridView._container.closest = () => {
                return undefined;
            };
            headerHeight = 0;
            resultsHeight = 0;
            groupHeight = 0;
            gridView.saveOptions({
                ...options,
                ladderOffset: undefined,
            });
            gridView._ladderTopOffsetStyles =
                gridView._getLadderTopOffsetStyles();
            expect(gridView._ladderTopOffsetStyles).toEqual('');
        });
        it('_getLadderTopOffsetStyles should return empty string if ladder disabled', () => {
            const gridView = new GridView({});
            expect(gridView._getLadderTopOffsetStyles()).toEqual('');
        });
    });

    describe('Header', () => {
        let headerVisibility;
        let resultsVisibility;
        let colspanGroup;
        let gridView;

        beforeEach(() => {
            headerVisibility = false;
            colspanGroup = false;
            const options = {
                headerVisibility: 'hasdata',
            };
            gridView = new GridView(options);
            gridView.saveOptions(options);
            gridView._listModel = {
                setHeaderVisibility: (value) => {
                    headerVisibility = value;
                },
                setResultsVisibility: (value) => {
                    resultsVisibility = value;
                },
                setColspanGroup: (value) => {
                    colspanGroup = value;
                },
                getEmptyGridRow: () => {
                    return null;
                },
            };
        });

        it('update header visibility', () => {
            const newVisibility = 'visible';
            gridView._beforeUpdate({ headerVisibility: newVisibility });
            expect(headerVisibility).toEqual(newVisibility);
        });

        it('update results visibility', () => {
            const newVisibility = 'visible';
            gridView._beforeUpdate({ resultsVisibility: newVisibility });
            expect(resultsVisibility).toEqual(newVisibility);
        });

        it('update colspanGroup', () => {
            gridView._beforeUpdate({});
            expect(colspanGroup).toEqual(true);
        });
    });

    it('should update itemEditorTemplateOptions', () => {
        let itemEditorTemplateOptions;

        const options = {
            itemEditorTemplateOptions: 'initialValue',
        };
        const gridView = new GridView(options);
        gridView.saveOptions(options);
        gridView._listModel = {
            setItemEditorTemplateOptions: (value) => {
                itemEditorTemplateOptions = value;
            },
            setColspanGroup: jest.fn(),
            getEmptyGridRow: () => {
                return null;
            },
        };

        gridView._beforeUpdate({ itemEditorTemplateOptions: 'newValue' });
        expect(itemEditorTemplateOptions).toEqual('newValue');
    });
});
