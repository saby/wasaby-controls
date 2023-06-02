import { RecordSet } from 'Types/collection';
import * as ListData from 'ControlsUnit/ListData';
import { ISelectionObject as ISelection } from 'Controls/interface';

import CounterController, {
    ICounterControllerOptions,
} from 'Controls/_multiselection/CounterController';
import { MultiSelectAccessibility, FlatDataStrategy } from 'Controls/display';

/* eslint-disable no-magic-numbers */

function getTreeController(
    options?: Partial<ICounterControllerOptions> & {
        selection: ISelection;
        items?: RecordSet;
    }
): CounterController {
    const collection =
        options.items ||
        new RecordSet({
            keyProperty: ListData.KEY_PROPERTY,
            rawData: ListData.getItems(),
        });
    const controller = new CounterController({
        collection: new FlatDataStrategy({
            collection,
            keyProperty: ListData.KEY_PROPERTY,
            childrenProperty: '',
        }),
        keyProperty: ListData.KEY_PROPERTY,
        parentProperty: ListData.PARENT_PROPERTY,
        nodeProperty: ListData.NODE_PROPERTY,
        hasChildrenProperty: ListData.HAS_CHILDREN_PROPERTY,
        childrenCountProperty: '',
        multiSelectAccessibilityProperty: '',
        rootKey: null,
        selectAncestors: true,
        selectDescendants: true,
        recursiveSelection: false,
        selectionCountMode: 'all',
        selectionType: 'all',
        hasMoreUtil: () => {
            return false;
        },
        isLoadedUtil: () => {
            return true;
        },
        ...options,
    });
    controller.setSelection(options.selection);
    return controller;
}

describe('Controls/_multiselection/CounterController', () => {
    describe('flat', () => {
        let flatController: CounterController;
        let hasMore;

        beforeEach(() => {
            hasMore = false;
            flatController = new CounterController({
                collection: new FlatDataStrategy({
                    collection: new RecordSet({
                        rawData: [{ key: 1 }, { key: 2 }, { key: 3 }],
                    }),
                    keyProperty: ListData.KEY_PROPERTY,
                    childrenProperty: '',
                }),
                keyProperty: 'key',
                rootKey: null,
                hasMoreUtil: () => {
                    return hasMore;
                },
                isLoadedUtil: () => {
                    return true;
                },
                multiSelectAccessibilityProperty: '',
            });
        });

        describe('getCount', () => {
            it('not selected', () => {
                flatController.setSelection({ selected: [], excluded: [] });
                const count = flatController.getCount();
                expect(count).toEqual(0);
            });

            it('selected one', () => {
                flatController.setSelection({ selected: [1], excluded: [] });
                const count = flatController.getCount();
                expect(count).toEqual(1);
            });

            it('selected one and has more data', () => {
                flatController.setSelection({ selected: [1], excluded: [] });
                hasMore = true;
                const count = flatController.getCount();
                expect(count).toEqual(1);
            });

            it('selected all, but one', () => {
                flatController.setSelection({
                    selected: [null],
                    excluded: [2],
                });
                const count = flatController.getCount();
                expect(count).toEqual(2);
            });

            it('selected all, but one and has more data', () => {
                flatController.setSelection({
                    selected: [null],
                    excluded: [2],
                });
                hasMore = true;
                const count = flatController.getCount();
                expect(count).toEqual(null);
            });

            it('limit, not has more data, limit < itemsCount', () => {
                flatController.setSelection({
                    selected: [null],
                    excluded: [3],
                });
                const count = flatController.getCount(2);
                expect(count).toEqual(2);
            });

            it('limit, has more data, limit < itemsCount', () => {
                flatController.setSelection({
                    selected: [null],
                    excluded: [3],
                });
                hasMore = true;
                const count = flatController.getCount(2);
                expect(count).toEqual(2);
            });

            it('limit, not has more data, limit > itemsCount', () => {
                flatController.setSelection({ selected: [null], excluded: [] });
                const count = flatController.getCount(4);
                expect(count).toEqual(3);
            });

            it('limit, has more data, limit > itemsCount', () => {
                flatController.setSelection({ selected: [null], excluded: [] });
                hasMore = true;
                const count = flatController.getCount(4);
                expect(count).toEqual(null);
            });

            it('limit, one separated selected, hasMoreData', () => {
                flatController.setSelection({
                    selected: [null],
                    excluded: [3],
                });
                hasMore = true;
                const count = flatController.getCount(1);
                expect(count).toEqual(2);
            });
        });
    });

    describe('tree', () => {
        describe('getCount', () => {
            it('not selected', () => {
                const selection = { selected: [], excluded: [] };
                const count = getTreeController({
                    selection,
                    selectAncestors: false,
                    selectDescendants: false,
                }).getCount();
                const countWithDescAndAnc = getTreeController({
                    selection,
                }).getCount();
                expect(count).toEqual(0);
                expect(countWithDescAndAnc).toEqual(0);
            });

            it('selected one', () => {
                const selection = { selected: [2], excluded: [] };
                const count = getTreeController({
                    selection,
                    selectAncestors: false,
                    selectDescendants: false,
                }).getCount();
                const countWithDescAndAnc = getTreeController({
                    selection,
                }).getCount();
                expect(count).toEqual(1);
                expect(countWithDescAndAnc).toEqual(3);
            });

            it('selected node has unselected child', () => {
                const selection = { selected: [2], excluded: [3] };
                const count = getTreeController({ selection }).getCount();
                expect(count).toEqual(1);
            });

            it('selected one and has more data', () => {
                const selection = { selected: [1], excluded: [] };
                const count = getTreeController({
                    selection,
                    selectAncestors: false,
                    selectDescendants: false,
                    hasMoreUtil: (nodeKey) => {
                        return nodeKey === null;
                    },
                }).getCount();
                const countWithDescAndAnc = getTreeController({
                    selection,
                    hasMoreUtil: (nodeKey) => {
                        return nodeKey === null;
                    },
                }).getCount();
                expect(count).toEqual(1);
                expect(countWithDescAndAnc).toEqual(5);
            });

            it('should count children if unselect node and selectAncestors=false', () => {
                const selection = { selected: [1], excluded: [1, 2] };
                const controller = getTreeController({
                    selection,
                    rootKey: 1,
                    selectAncestors: false,
                    selectDescendants: false,
                });
                const count = controller.getCount();
                expect(count).toEqual(3);
            });

            it('selected all, but one', () => {
                const selection = { selected: [null], excluded: [null, 2] };
                const count = getTreeController({
                    selection,
                    selectAncestors: false,
                    selectDescendants: false,
                }).getCount();
                const countWithDescAndAnc = getTreeController({
                    selection,
                }).getCount();
                expect(count).toEqual(6);
                expect(countWithDescAndAnc).toEqual(3);
            });

            it('should count node if select all childs by one', () => {
                const controller = getTreeController({
                    selection: { selected: [3, 4], excluded: [] },
                });
                expect(controller.getCount()).toEqual(3);
            });

            it('should right count if select all items in root by one', () => {
                const items = new RecordSet({
                    keyProperty: 'id',
                    rawData: [
                        { id: 1, parent: null, node: true },
                        { id: 2, parent: null, node: true },
                    ],
                });
                const controller = getTreeController({
                    items,
                    selection: { selected: [1, 2], excluded: [] },
                });
                expect(controller.getCount()).toEqual(2);
            });

            it('should count node if select all childs by one and search view mode', () => {
                const controller = getTreeController({
                    selection: { selected: [3, 4], excluded: [] },
                    isSearchViewMode: true,
                });
                expect(controller.getCount()).toEqual(2);
            });

            it('not should count node if select all childs by one and not is not selectable', () => {
                const items = new RecordSet({
                    keyProperty: 'id',
                    rawData: [
                        {
                            id: 1,
                            parent: null,
                            node: true,
                            multiSelectAccessibility:
                                MultiSelectAccessibility.disabled,
                        },
                        { id: 11, parent: 1, node: true },
                        { id: 12, parent: 1, node: true },
                    ],
                });
                const controller = getTreeController({
                    items,
                    selection: { selected: [11, 12], excluded: [] },
                    multiSelectAccessibilityProperty:
                        'multiSelectAccessibility',
                });
                expect(controller.getCount()).toEqual(2);
            });

            it('not should count node if select all childs by one and selectDescendants=false', () => {
                const items = new RecordSet({
                    keyProperty: 'id',
                    rawData: [
                        { id: 1, parent: null, node: true },
                        { id: 11, parent: 1, node: true },
                        { id: 12, parent: 1, node: true },
                    ],
                });
                const controller = getTreeController({
                    items,
                    selection: { selected: [11, 12], excluded: [] },
                    selectDescendants: false,
                });
                expect(controller.getCount()).toEqual(2);
            });

            it('should not count children if select node by one and selectDescendants=false', () => {
                const items = new RecordSet({
                    keyProperty: 'id',
                    rawData: [
                        { id: 1, parent: null, node: true },
                        { id: 11, parent: 1, node: true },
                        { id: 12, parent: 1, node: true },
                    ],
                });
                const controller = getTreeController({
                    items,
                    selection: { selected: [1], excluded: [] },
                    selectDescendants: false,
                });
                expect(controller.getCount()).toEqual(1);
            });

            it('should right count if select all childs by one with parent node and selectDescendants=false', () => {
                const items = new RecordSet({
                    keyProperty: 'id',
                    rawData: [
                        { id: 1, parent: null, node: true },
                        { id: 11, parent: 1, node: true },
                        { id: 12, parent: 1, node: true },
                    ],
                });
                const controller = getTreeController({
                    items,
                    selection: { selected: [1, 11, 12], excluded: [] },
                    selectDescendants: false,
                });
                expect(controller.getCount()).toEqual(3);
            });

            it('selected all, but one and has more data', () => {
                const selection = { selected: [null], excluded: [null, 2] };
                const count = getTreeController({
                    selection,
                    selectAncestors: false,
                    selectDescendants: false,
                    hasMoreUtil: (nodeKey) => {
                        return nodeKey === null;
                    },
                }).getCount();
                const countWithDescAndAnc = getTreeController({
                    selection,
                    hasMoreUtil: (nodeKey) => {
                        return nodeKey === null;
                    },
                }).getCount();
                expect(count).toEqual(null);
                expect(countWithDescAndAnc).toEqual(null);
            });

            it('selected node with more data', () => {
                const selection = { selected: [6], excluded: [] };
                const count = getTreeController({
                    selection,
                    hasMoreUtil: (nodeKey) => {
                        return nodeKey === 6;
                    },
                }).getCount();
                expect(count).toBeNull();
            });

            it('should return null if selected node is not loaded', () => {
                const items = new RecordSet({
                    keyProperty: 'id',
                    rawData: [{ id: 1, parent: null, node: true }],
                });
                const selection = { selected: [1], excluded: [] };
                const controller = getTreeController({
                    selection,
                    items,
                    isLoadedUtil: () => {
                        return false;
                    },
                });
                expect(controller.getCount()).toBeNull();
            });

            it('selected node', () => {
                const selection = { selected: [1], excluded: [] };
                const count = getTreeController({
                    selection,
                    selectAncestors: false,
                    selectDescendants: false,
                }).getCount();
                const countWithDescAndAnc = getTreeController({
                    selection,
                }).getCount();
                expect(count).toEqual(1);
                expect(countWithDescAndAnc).toEqual(5);
            });

            it('selected all', () => {
                const selection = { selected: [null], excluded: [null] };
                const count = getTreeController({
                    selection,
                    selectAncestors: false,
                    selectDescendants: false,
                }).getCount();
                const countWithDescAndAnc = getTreeController({
                    selection,
                }).getCount();
                expect(count).toEqual(7);
                expect(countWithDescAndAnc).toEqual(7);
            });

            it('with readonly items', () => {
                const data = ListData.getItems();
                data[3].checkboxState = false;
                const items = new RecordSet({
                    keyProperty: ListData.KEY_PROPERTY,
                    rawData: data,
                });
                const controller = getTreeController({
                    items,
                    selection: { selected: [null], excluded: [null] },
                    selectionType: 'leaf',
                    recursiveSelection: true,
                    multiSelectAccessibilityProperty: 'checkboxState',
                });

                const res = controller.getCount();
                expect(res).toEqual(6);
            });

            it('selectionType=leaf and recursiveSelection', () => {
                const selection = { selected: [2], excluded: [] };
                const count = getTreeController({
                    selection,
                    selectionType: 'leaf',
                    recursiveSelection: true,
                }).getCount();
                expect(count).toEqual(3);
            });

            it('with limit', () => {
                const selection = { selected: [null], excluded: [null] };
                const count = getTreeController({
                    selection,
                    selectAncestors: false,
                    selectDescendants: false,
                }).getCount(5);
                expect(count).toEqual(5);
            });

            it('limit is more items count', () => {
                const selection = { selected: [null], excluded: [null] };
                const countWithoutHasMore = getTreeController({
                    selection,
                    selectAncestors: false,
                    selectDescendants: false,
                }).getCount(10);
                const countWithHasMore = getTreeController({
                    selection,
                    selectAncestors: false,
                    selectDescendants: false,
                    hasMoreUtil: (nodeKey) => {
                        return nodeKey === null;
                    },
                }).getCount(10);
                expect(countWithoutHasMore).toEqual(7);
                expect(countWithHasMore).toEqual(10);
            });

            it('selected not loaded item', () => {
                const selection = { selected: [20], excluded: [] };
                const countWithDescAndAnc = getTreeController({
                    selection,
                }).getCount();
                expect(countWithDescAndAnc).toBeNull();
            });

            it('should count leafs are childs of not selectable items', () => {
                const items = new RecordSet({
                    keyProperty: 'id',
                    rawData: [
                        { id: 1, parent: null, node: true },
                        { id: 11, parent: 1, node: null },
                        { id: 12, parent: 1, node: null },
                        { id: 2, parent: null, node: true },
                        { id: 21, parent: 2, node: null },
                        { id: 22, parent: 2, node: null },
                    ],
                });
                const selection = { selected: [null], excluded: [null] };
                const controller = getTreeController({
                    selection,
                    items,
                    selectionType: 'leaf',
                });
                expect(controller.getCount()).toEqual(4);
            });

            it('should not count parent if select all children and selectAncestors=false', () => {
                const items = new RecordSet({
                    keyProperty: 'id',
                    rawData: [
                        { id: 1, parent: null, node: true },
                        { id: 11, parent: 1, node: null },
                        { id: 12, parent: 1, node: null },
                    ],
                });
                const selection = { selected: [11, 12], excluded: [] };
                const controller = getTreeController({
                    selection,
                    items,
                    selectAncestors: false,
                });
                expect(controller.getCount()).toEqual(2);
            });

            it('should equally count when selected separated items and select all with excluded keys', () => {
                /*
                 * 1
                 *    11
                 *    12
                 *    13
                 * 2
                 *    21
                 *    22
                 *    23
                 */
                const items = new RecordSet({
                    keyProperty: 'id',
                    rawData: [
                        { id: 1, parent: null, node: true },
                        { id: 11, parent: 1, node: null },
                        { id: 12, parent: 1, node: null },
                        { id: 13, parent: 1, node: null },
                        { id: 2, parent: null, node: true },
                        { id: 21, parent: 2, node: null },
                        { id: 22, parent: 2, node: null },
                        { id: 23, parent: 2, node: null },
                    ],
                });
                const controller = getTreeController({
                    selection: { selected: [null], excluded: [null, 2, 11] },
                    items,
                    selectionType: 'leaf',
                });

                // визуальное состояние выбранности в этих случаях одинаковое => кол-во тоже должно быть одинаковым
                expect(controller.getCount()).toEqual(2);

                controller.setSelection({ selected: [12, 13], excluded: [] });
                expect(controller.getCount()).toEqual(2);
            });

            it('should not loop', () => {
                const items = new RecordSet({
                    keyProperty: 'id',
                    rawData: [
                        { id: 1, parent: null, node: true },
                        { id: 11, parent: 1, node: true },
                        { id: 111, parent: 11, node: true },
                        { id: 1111, parent: 111, node: null },
                        { id: 13, parent: 1, node: null },
                    ],
                });
                const controller = getTreeController({
                    selection: { selected: [1111], excluded: [] },
                    items,
                });
                items.setEventRaising(false, true);
                items.getRecordById(111).set('parent', 1);

                const count = controller.getCount();
                expect(count).toEqual(2);
                items.setEventRaising(true, true);
            });

            it('should not throw error if empty list', () => {
                const items = new RecordSet({
                    rawData: [],
                    keyProperty: 'id',
                });
                const controller = getTreeController({
                    selection: { selected: [null], excluded: [null] },
                    items,
                    recursiveSelection: false,
                });

                let error;
                try {
                    const count = controller.getCount();
                    expect(count).toEqual(0);
                } catch (e) {
                    error = e;
                }

                expect(error).toBeFalsy();
            });

            it('should count items if flat model', () => {
                const items = new RecordSet({
                    keyProperty: 'id',
                    rawData: [{ id: 1 }, { id: 2 }],
                });
                const controller = getTreeController({
                    selection: { selected: [1], excluded: [] },
                    items,
                    selectionType: 'leaf',
                });

                const res = controller.getCount();
                expect(res).toEqual(1);
            });

            describe('selectionCountMode', () => {
                const items = new RecordSet({
                    keyProperty: 'id',
                    rawData: [
                        { id: 1, parent: null, node: true },
                        { id: 11, parent: 1, node: null },
                        { id: 12, parent: 1, node: null },
                        { id: 2, parent: null, node: true },
                        { id: 21, parent: 2, node: null },
                        { id: 22, parent: 2, node: null },
                        { id: 3, parent: null, node: false },
                        { id: 31, parent: 3, node: null },
                    ],
                });

                describe('leaf', () => {
                    it('is all selected, not has more data', () => {
                        const controller = getTreeController({
                            items,
                            selection: { selected: [null], excluded: [null] },
                            selectionCountMode: 'leaf',
                        });
                        const count = controller.getCount();
                        expect(count).toEqual(5);
                    });

                    it('is all selected, has more data', () => {
                        const controller = getTreeController({
                            items,
                            selection: { selected: [null], excluded: [null] },
                            selectionCountMode: 'leaf',
                            hasMoreUtil: (nodeKey) => {
                                return nodeKey === null;
                            },
                        });
                        const count = controller.getCount();
                        expect(count).toEqual(null);
                    });

                    it('selected node, not has more data', () => {
                        const controller = getTreeController({
                            items,
                            selection: { selected: [1], excluded: [] },
                            selectionCountMode: 'leaf',
                        });
                        const count = controller.getCount();
                        expect(count).toEqual(2);
                    });

                    it('selected node, has more data', () => {
                        const controller = getTreeController({
                            items,
                            selection: { selected: [1], excluded: [] },
                            selectionCountMode: 'leaf',
                            hasMoreUtil: (nodeKey) => {
                                return nodeKey === null;
                            },
                        });
                        const count = controller.getCount();
                        expect(count).toEqual(2);
                    });

                    it('selected leaf, not has more data', () => {
                        const controller = getTreeController({
                            items,
                            selection: { selected: [11], excluded: [] },
                            selectionCountMode: 'leaf',
                        });
                        const count = controller.getCount();
                        expect(count).toEqual(1);
                    });

                    it('selected leaf, has more data', () => {
                        const controller = getTreeController({
                            items,
                            selection: { selected: [11], excluded: [] },
                            selectionCountMode: 'leaf',
                            hasMoreUtil: (nodeKey) => {
                                return nodeKey === null;
                            },
                        });
                        const count = controller.getCount();
                        expect(count).toEqual(1);
                    });

                    it('selected leaf and node, not has more data', () => {
                        const controller = getTreeController({
                            items,
                            selection: { selected: [1, 22], excluded: [] },
                            selectionCountMode: 'leaf',
                        });
                        const count = controller.getCount();
                        expect(count).toEqual(3);
                    });

                    it('selected leaf and node, has more data', () => {
                        const controller = getTreeController({
                            items,
                            selection: { selected: [1, 22], excluded: [] },
                            selectionCountMode: 'leaf',
                            hasMoreUtil: (nodeKey) => {
                                return nodeKey === null;
                            },
                        });
                        const count = controller.getCount();
                        expect(count).toEqual(3);
                    });

                    it('selected unloaded item', () => {
                        const controller = getTreeController({
                            items,
                            selection: { selected: [99], excluded: [] },
                            selectionCountMode: 'leaf',
                            hasMoreUtil: (nodeKey) => {
                                return nodeKey === null;
                            },
                        });
                        const count = controller.getCount();
                        expect(count).toEqual(null);
                    });

                    it('deep inside, empty node', () => {
                        const newItems = new RecordSet({
                            keyProperty: 'id',
                            rawData: [
                                { id: 1, parent: null, node: true },
                                { id: 11, parent: 1, node: true },
                                { id: 111, parent: 11, node: true },
                                { id: 112, parent: 11, node: true },
                                { id: 1121, parent: 112, node: null },
                                { id: 1122, parent: 112, node: null },
                                { id: 1123, parent: 112, node: null },
                                { id: 12, parent: 1, node: null },
                            ],
                        });
                        const controller = getTreeController({
                            items: newItems,
                            selection: { selected: [1], excluded: [] },
                            selectionCountMode: 'leaf',
                            hasMoreUtil: () => {
                                return false;
                            },
                        });
                        const count = controller.getCount();
                        expect(count).toEqual(4);
                    });
                });

                describe('node', () => {
                    it('is all selected, not has more data', () => {
                        const controller = getTreeController({
                            items,
                            selection: { selected: [null], excluded: [null] },
                            selectionCountMode: 'node',
                        });
                        const count = controller.getCount();
                        expect(count).toEqual(3);
                    });

                    it('is all selected, has more data', () => {
                        const controller = getTreeController({
                            items,
                            selection: { selected: [null], excluded: [null] },
                            selectionCountMode: 'node',
                            hasMoreUtil: (nodeKey) => {
                                return nodeKey === null;
                            },
                        });
                        const count = controller.getCount();
                        expect(count).toEqual(null);
                    });

                    it('selected node, not has more data', () => {
                        const controller = getTreeController({
                            items,
                            selection: { selected: [1], excluded: [] },
                            selectionCountMode: 'node',
                        });
                        const count = controller.getCount();
                        expect(count).toEqual(1);
                    });

                    it('selected node, has more data', () => {
                        const controller = getTreeController({
                            items,
                            selection: { selected: [1], excluded: [] },
                            selectionCountMode: 'node',
                            hasMoreUtil: (nodeKey) => {
                                return nodeKey === null;
                            },
                        });
                        const count = controller.getCount();
                        expect(count).toEqual(1);
                    });

                    it('selected leaf, not has more data', () => {
                        const controller = getTreeController({
                            items,
                            selection: { selected: [11], excluded: [] },
                            selectionCountMode: 'node',
                        });
                        const count = controller.getCount();
                        expect(count).toEqual(0);
                    });

                    it('selected leaf, has more data', () => {
                        const controller = getTreeController({
                            items,
                            selection: { selected: [11], excluded: [] },
                            selectionCountMode: 'node',
                        });
                        const count = controller.getCount();
                        expect(count).toEqual(0);
                    });

                    it('selected leaf and node, not has more data', () => {
                        const controller = getTreeController({
                            items,
                            selection: { selected: [1, 22], excluded: [] },
                            selectionCountMode: 'node',
                        });
                        const count = controller.getCount();
                        expect(count).toEqual(1);
                    });

                    it('selected leaf and node, has more data', () => {
                        const controller = getTreeController({
                            items,
                            selection: { selected: [1, 22], excluded: [] },
                            selectionCountMode: 'node',
                            hasMoreUtil: (nodeKey) => {
                                return nodeKey === null;
                            },
                        });
                        const count = controller.getCount();
                        expect(count).toEqual(1);
                    });

                    it('selected unloaded item', () => {
                        const controller = getTreeController({
                            items,
                            selection: { selected: [99], excluded: [] },
                            selectionCountMode: 'node',
                            hasMoreUtil: (nodeKey) => {
                                return nodeKey === null;
                            },
                        });
                        const count = controller.getCount();
                        expect(count).toEqual(null);
                    });
                });

                describe('all', () => {
                    it('is all selected, not has more data', () => {
                        const controller = getTreeController({
                            items,
                            selection: { selected: [null], excluded: [null] },
                            selectionCountMode: 'all',
                        });
                        const count = controller.getCount();
                        expect(count).toEqual(8);
                    });

                    it('is all selected, has more data', () => {
                        const controller = getTreeController({
                            items,
                            selection: { selected: [null], excluded: [null] },
                            selectionCountMode: 'all',
                            hasMoreUtil: (nodeKey) => {
                                return nodeKey === null;
                            },
                        });
                        const count = controller.getCount();
                        expect(count).toEqual(null);
                    });

                    it('selected node, not has more data', () => {
                        const controller = getTreeController({
                            items,
                            selection: { selected: [1], excluded: [] },
                            selectionCountMode: 'all',
                        });
                        const count = controller.getCount();
                        expect(count).toEqual(3);
                    });

                    it('selected node, has more data', () => {
                        const controller = getTreeController({
                            items,
                            selection: { selected: [1], excluded: [] },
                            selectionCountMode: 'all',
                            hasMoreUtil: (nodeKey) => {
                                return nodeKey === null;
                            },
                        });
                        const count = controller.getCount();
                        expect(count).toEqual(3);
                    });

                    it('selected leaf, not has more data', () => {
                        const controller = getTreeController({
                            items,
                            selection: { selected: [11], excluded: [] },
                            selectionCountMode: 'all',
                        });
                        const count = controller.getCount();
                        expect(count).toEqual(1);
                    });

                    it('selected leaf, has more data', () => {
                        const controller = getTreeController({
                            items,
                            selection: { selected: [11], excluded: [] },
                            selectionCountMode: 'all',
                            hasMoreUtil: (nodeKey) => {
                                return nodeKey === null;
                            },
                        });
                        const count = controller.getCount();
                        expect(count).toEqual(1);
                    });

                    it('selected leaf and node, not has more data', () => {
                        const controller = getTreeController({
                            items,
                            selection: { selected: [1, 22], excluded: [] },
                            selectionCountMode: 'all',
                        });
                        const count = controller.getCount();
                        expect(count).toEqual(4);
                    });

                    it('selected leaf and node, has more data', () => {
                        const controller = getTreeController({
                            items,
                            selection: { selected: [1, 22], excluded: [] },
                            selectionCountMode: 'all',
                            hasMoreUtil: (nodeKey) => {
                                return nodeKey === null;
                            },
                        });
                        const count = controller.getCount();
                        expect(count).toEqual(4);
                    });

                    it('selected unloaded item', () => {
                        const controller = getTreeController({
                            items,
                            selection: { selected: [99], excluded: [] },
                            selectionCountMode: 'all',
                            hasMoreUtil: (nodeKey) => {
                                return nodeKey === null;
                            },
                        });
                        const count = controller.getCount();
                        expect(count).toEqual(null);
                    });
                });
            });

            describe('childrenCountProperty', () => {
                it('get count from property', () => {
                    const controller = getTreeController({
                        childrenCountProperty: 'childredCount',
                        selection: { selected: [1], excluded: [] },
                        isLoadedUtil: (nodeKey) => {
                            return nodeKey === null;
                        },
                    });

                    expect(controller.getCount()).toEqual(5);
                });

                it('all selected', () => {
                    const controller = getTreeController({
                        childrenCountProperty: 'childredCount',
                        selection: { selected: [null], excluded: [null] },
                        isLoadedUtil: (nodeKey) => {
                            return nodeKey === null;
                        },
                    });

                    expect(controller.getCount()).toEqual(7);
                });

                it('all selected without шт node', () => {
                    const controller = getTreeController({
                        childrenCountProperty: 'childredCount',
                        selection: { selected: [null], excluded: [null, 2] },
                        isLoadedUtil: (nodeKey) => {
                            return nodeKey === null;
                        },
                    });

                    expect(controller.getCount()).toEqual(4);
                });
            });
        });
    });
});
