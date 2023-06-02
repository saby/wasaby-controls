/* eslint-disable quote-props, dot-notation, @typescript-eslint/dot-notation */
/* eslint-disable no-magic-numbers */

import {
    ITreeSelectionStrategyOptions,
    TreeSelectionStrategy,
} from 'Controls/multiselection';
import { Model } from 'Types/entity';
import * as ListData from 'ControlsUnit/ListData';
import { RecordSet } from 'Types/collection';
import { groupConstants } from 'Controls/display';
import { ITreeOptions, Tree, TreeItem } from 'Controls/baseTree';
import GroupItem from 'Controls/_display/GroupItem';
import { SearchGridCollection } from 'Controls/searchBreadcrumbsGrid';
import TreeGridCollection from 'Controls/_treeGrid/display/TreeGridCollection';

function initTest(
    items: object[],
    options: Partial<ITreeSelectionStrategyOptions> = {},
    modelOptions: Partial<ITreeOptions> = {}
): TreeSelectionStrategy {
    const model = new Tree({
        collection: new RecordSet({
            keyProperty: 'id',
            rawData: items,
        }),
        root: null,
        keyProperty: 'id',
        parentProperty: 'parent',
        nodeProperty: 'node',
        ...modelOptions,
    });

    return new TreeSelectionStrategy({
        selectDescendants: true,
        selectAncestors: true,
        rootKey: null,
        model,
        entryPath: [],
        selectionType: 'all',
        selectionCountMode: 'all',
        recursiveSelection: false,
        hasMoreUtil: () => {
            return false;
        },
        isLoadedUtil: () => {
            return true;
        },
        ...options,
    });
}

describe('Controls/_multiselection/SelectionStrategy/Tree', () => {
    const model = new Tree({
        collection: new RecordSet({
            keyProperty: ListData.KEY_PROPERTY,
            rawData: ListData.getItems(),
        }),
        root: new Model({
            rawData: { id: null },
            keyProperty: ListData.KEY_PROPERTY,
        }),
        keyProperty: ListData.KEY_PROPERTY,
        parentProperty: ListData.PARENT_PROPERTY,
        nodeProperty: ListData.NODE_PROPERTY,
        hasChildrenProperty: ListData.HAS_CHILDREN_PROPERTY,
    });

    const strategy = new TreeSelectionStrategy({
        selectDescendants: false,
        selectAncestors: false,
        rootKey: null,
        model,
        selectionType: 'all',
        selectionCountMode: 'all',
        recursiveSelection: false,
        hasMoreUtil: () => {
            return false;
        },
        isLoadedUtil: () => {
            return true;
        },
    });

    const strategyWithDescendantsAndAncestors = new TreeSelectionStrategy({
        selectDescendants: true,
        selectAncestors: true,
        rootKey: null,
        model,
        selectionType: 'all',
        selectionCountMode: 'all',
        recursiveSelection: false,
        hasMoreUtil: () => {
            return false;
        },
        isLoadedUtil: () => {
            return true;
        },
    });

    function toArrayKeys(array: TreeItem<Model>[]): number[] {
        return array
            .map((el) => {
                return el.key;
            })
            .sort((e1, e2) => {
                return e1 < e2 ? -1 : 1;
            });
    }

    beforeEach(() => {
        strategy._rootKey = null;
        strategyWithDescendantsAndAncestors._rootKey = null;
        strategy.setEntryPath(undefined);
    });

    describe('select', () => {
        it('not selected', () => {
            let selection = { selected: [], excluded: [] };
            selection = strategy.select(selection, 6);
            expect(selection.selected).toEqual([6]);
            expect(selection.excluded).toEqual([]);

            selection = { selected: [], excluded: [] };
            selection = strategy.select(selection, 1);
            expect(selection.selected).toEqual([1]);
            expect(selection.excluded).toEqual([]);

            selection = { selected: [], excluded: [] };
            selection = strategy.select(selection, 2);
            expect(selection.selected).toEqual([2]);
            expect(selection.excluded).toEqual([]);

            selection = { selected: [], excluded: [2] };
            selection = strategy.select(selection, 2);
            expect(selection.selected).toEqual([]);
            expect(selection.excluded).toEqual([]);
        });

        it('has selected', () => {
            let selection = { selected: [3, 4], excluded: [] };
            selection = strategyWithDescendantsAndAncestors.select(
                selection,
                2
            );
            expect(selection.selected).toEqual([2]);
            expect(selection.excluded).toEqual([]);

            selection = { selected: [3, 4], excluded: [] };
            selection = strategy.select(selection, 2);
            expect(selection.selected).toEqual([3, 4, 2]);
            expect(selection.excluded).toEqual([]);
        });
    });

    describe('unselect', () => {
        it('selected node', () => {
            // выбран узел, в котором выбраны дети
            let selection = { selected: [], excluded: [] };
            selection = strategy.unselect(selection, 2);
            expect(selection.selected).toEqual([]);
            expect(selection.excluded).toEqual([]);

            // выбран узел, в котором выбраны дети
            selection = { selected: [2, 3], excluded: [] };
            selection = strategyWithDescendantsAndAncestors.unselect(
                selection,
                2
            );
            expect(selection.selected).toEqual([]);
            expect(selection.excluded).toEqual([]);

            // выбран узел, в котором исключены дети
            selection = { selected: [2], excluded: [3] };
            selection = strategyWithDescendantsAndAncestors.unselect(
                selection,
                2
            );
            expect(selection.selected).toEqual([]);
            expect(selection.excluded).toEqual([]);

            // выбран узел, в котором исключены дети
            selection = { selected: [2], excluded: [3] };
            selection = strategy.unselect(selection, 2);
            expect(selection.selected).toEqual([]);
            expect(selection.excluded).toEqual([]);

            // выбран узел без родителей и детей
            selection = { selected: [6], excluded: [] };
            selection = strategy.unselect(selection, 6);
            expect(selection.selected).toEqual([]);
            expect(selection.excluded).toEqual([]);

            // выбран узел со всеми детьми
            selection = { selected: [2], excluded: [] };
            selection = strategyWithDescendantsAndAncestors.unselect(
                selection,
                3
            );
            expect(selection.selected).toEqual([2]);
            expect(selection.excluded).toEqual([3]);

            // снимаем выбор с последнего ребенка
            selection = { selected: [2], excluded: [3] };
            selection = strategyWithDescendantsAndAncestors.unselect(
                selection,
                4
            );
            expect(selection.selected).toEqual([]);
            expect(selection.excluded).toEqual([]);

            // при снятии выбора с последнего выбранного ребенка, снимаем выбор со всех родителей
            selection = { selected: [1, 2], excluded: [3, 5] };
            selection = strategyWithDescendantsAndAncestors.unselect(
                selection,
                4
            );
            expect(selection.selected).toEqual([]);
            expect(selection.excluded).toEqual([]);
        });

        it('selected all', () => {
            let selection = { selected: [null], excluded: [null] };
            selection = strategyWithDescendantsAndAncestors.unselect(
                selection,
                4
            );
            expect(selection.selected).toEqual([null]);
            expect(selection.excluded).toEqual([null, 4]);
        });

        it('unselect child', () => {
            // Снять выбор с последнего ближнего ребенка, но ребенок невыбранного ребенка выбран
            let selection = { selected: [1, 3], excluded: [4] };
            selection = strategyWithDescendantsAndAncestors.unselect(
                selection,
                5
            );
            expect(selection.selected).toEqual([1, 3]);
            expect(selection.excluded).toEqual([4, 5]);

            // Снять выбор с ребенка ребенка (проверка рекурсивной проверки выбранных детей)
            selection = strategyWithDescendantsAndAncestors.unselect(
                selection,
                3
            );
            expect(selection.selected).toEqual([]);
            expect(selection.excluded).toEqual([]);
        });

        it('selectDescendants = false, unselect all selected childs', () => {
            let selection = { selected: [3], excluded: [] };
            selection = strategy.unselect(selection, 2);
            expect(selection.selected).toEqual([]);
            expect(selection.excluded).toEqual([]);
        });

        it('with entry path', () => {
            strategy.setEntryPath([
                { id: 3, parent: 2 },
                { id: 2, parent: 1 },
                { id: 1, parent: null },
            ]);

            const result = strategy.unselect(
                { selected: [3], excluded: [] },
                3
            );
            expect(result).toEqual({ selected: [], excluded: [] });
        });

        it('clear entry path', () => {
            const entryPath = [
                { id: 2, parent: 1 },
                { id: 1, parent: null },
            ];
            strategyWithDescendantsAndAncestors.setEntryPath(entryPath);

            const result = strategyWithDescendantsAndAncestors.unselect(
                { selected: [2], excluded: [] },
                1
            );
            expect(result).toEqual({ selected: [], excluded: [] });
            expect(entryPath).toEqual([]);
        });

        it('unselect last node with childs when all is selected', () => {
            const items = new RecordSet({
                rawData: [
                    { id: 1, parent: null, node: null },
                    { id: 11, parent: 1, node: null },
                    { id: 12, parent: 1, node: null },
                ],
                keyProperty: 'id',
            });
            const model = new Tree({
                collection: items,
                root: null,
                keyProperty: 'id',
                parentProperty: 'parent',
                nodeProperty: 'node',
                expandedItems: [null],
            });
            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: null,
                model,
                selectionType: 'all',
                selectionCountMode: 'all',
                recursiveSelection: false,
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });

            const newSelection = strategy.unselect(
                { selected: [null], excluded: [null] },
                1
            );
            expect(newSelection).toEqual({ selected: [], excluded: [] });
        });

        it('unselect only one child of not fully loaded node ', () => {
            const items = new RecordSet({
                rawData: [
                    { id: 1, parent: null, node: null },
                    { id: 2, parent: null, node: true },
                    { id: 21, parent: 2, node: null },
                ],
                keyProperty: 'id',
            });
            const model = new Tree({
                collection: items,
                root: null,
                keyProperty: 'id',
                parentProperty: 'parent',
                nodeProperty: 'node',
                expandedItems: [null],
                hasMoreStorage: {
                    2: {
                        backward: false,
                        forward: true,
                    },
                },
            });
            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: null,
                model,
                selectionType: 'all',
                selectionCountMode: 'all',
                recursiveSelection: false,
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });

            const newSelection = strategy.unselect(
                { selected: [null], excluded: [null] },
                21
            );
            expect(newSelection).toEqual({
                selected: [null],
                excluded: [null, 21],
            });
        });

        it('select all, unselect childs, select node => can unselect childs', () => {
            const items = new RecordSet({
                rawData: [
                    { id: 1, parent: null, node: true },
                    { id: 11, parent: 1, node: null },
                    { id: 12, parent: 1, node: null },
                ],
                keyProperty: 'id',
            });
            const model = new Tree({
                collection: items,
                root: null,
                keyProperty: 'id',
                parentProperty: 'parent',
                nodeProperty: 'node',
                expandedItems: [null],
            });
            const strategy = new TreeSelectionStrategy({
                selectDescendants: false,
                selectAncestors: false,
                rootKey: null,
                model,
                selectionType: 'all',
                selectionCountMode: 'all',
                recursiveSelection: false,
            });

            let selection = { selected: [null], excluded: [null] };
            selection = strategy.unselect(selection, 11);
            selection = strategy.select(selection, 1);
            selection = strategy.unselect(selection, 11);

            expect(selection).toEqual({
                selected: [null],
                excluded: [null, 11],
            });
            const res = strategy.getSelectionForModel(selection);
            expect(toArrayKeys(res.get(true))).toEqual([1, 12]);
            expect(toArrayKeys(res.get(null))).toEqual([]);
            expect(toArrayKeys(res.get(false))).toEqual([11]);
        });

        it('select all, unselect node => can select childs', () => {
            const items = new RecordSet({
                rawData: [
                    { id: 1, parent: null, node: true },
                    { id: 11, parent: 1, node: null },
                    { id: 12, parent: 1, node: null },
                    { id: 2, parent: null, node: null },
                ],
                keyProperty: 'id',
            });
            const model = new Tree({
                collection: items,
                root: null,
                keyProperty: 'id',
                parentProperty: 'parent',
                nodeProperty: 'node',
                expandedItems: [null],
            });
            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: null,
                model,
                selectionType: 'all',
                selectionCountMode: 'all',
                recursiveSelection: true,
            });

            let selection = { selected: [null], excluded: [null] };
            selection = strategy.unselect(selection, 1);
            selection = strategy.select(selection, 11);

            expect(selection).toEqual({
                selected: [null, 11],
                excluded: [null, 1],
            });
            const res = strategy.getSelectionForModel(selection);
            expect(toArrayKeys(res.get(true))).toEqual([2, 11]);
            expect(toArrayKeys(res.get(null))).toEqual([1]);
            expect(toArrayKeys(res.get(false))).toEqual([12]);
        });

        it('unselect child when deep inside selected node', () => {
            const path = new RecordSet({
                rawData: [
                    { id: 1, parent: null, node: true },
                    { id: 11, parent: 1, node: true },
                ],
                keyProperty: 'id',
            });
            const items = new RecordSet({
                rawData: [
                    { id: 111, parent: 11, node: null },
                    { id: 112, parent: 11, node: null },
                ],
                keyProperty: 'id',
                metaData: { path },
            });
            const model = new Tree({
                collection: items,
                root: 11,
                keyProperty: 'id',
                parentProperty: 'parent',
                nodeProperty: 'node',
            });
            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: 11,
                model,
                selectionType: 'all',
                recursiveSelection: false,
                entryPath: [],
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });

            let selection = { selected: [1], excluded: [] };
            selection = strategy.unselect(selection, 111);
            expect(selection.selected).toEqual([1]);
            expect(selection.excluded).toEqual([111]);
        });

        it('unselect child when has deep selected child in sister node', () => {
            const items = new RecordSet({
                rawData: [
                    { id: 1, parent: null, node: true },
                    { id: 11, parent: 1, node: true },
                    { id: 111, parent: 11, node: null },
                    { id: 112, parent: 11, node: null },
                    { id: 12, parent: 1, node: true },
                    { id: 121, parent: 12, node: null },
                    { id: 122, parent: 12, node: null },
                ],
                keyProperty: 'id',
            });
            const model = new Tree({
                collection: items,
                root: null,
                keyProperty: 'id',
                parentProperty: 'parent',
                nodeProperty: 'node',
            });
            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: null,
                model,
                selectionType: 'all',
                recursiveSelection: false,
                entryPath: [],
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });

            const selection = strategy.unselect(
                { selected: [null, 111], excluded: [null, 11] },
                12
            );
            expect(selection.selected).toEqual([null, 111]);
            expect(selection.excluded).toEqual([null, 11, 12]);
        });

        it('search model', () => {
            /*
            node-1
               leaf-11
               leaf-12
            node-2
               leaf-21
               leaf-22
          */
            const items = new RecordSet({
                rawData: [
                    {
                        id: 1,
                        parent: null,
                        nodeType: true,
                        title: 'test_node1',
                    },
                    {
                        id: 11,
                        parent: 1,
                        nodeType: null,
                        title: 'test_leaf11',
                    },
                    {
                        id: 12,
                        parent: 1,
                        nodeType: null,
                        title: 'test_leaf12',
                    },
                    {
                        id: 2,
                        parent: null,
                        nodeType: true,
                        title: 'test_node2',
                    },
                    {
                        id: 21,
                        parent: 2,
                        nodeType: null,
                        title: 'test_leaf21',
                    },
                    {
                        id: 22,
                        parent: 2,
                        nodeType: null,
                        title: 'test_leaf22',
                    },
                ],
                keyProperty: 'id',
            });

            const searchModel = new SearchGridCollection({
                collection: items,
                root: null,
                keyProperty: 'id',
                parentProperty: 'parent',
                nodeProperty: 'nodeType',
                columns: [{}],
            });

            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: null,
                model: searchModel,
                selectionType: 'all',
                selectionCountMode: 'all',
                recursiveSelection: false,
                entryPath: null,
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });

            let result = strategy.unselect(
                { selected: [11], excluded: [] },
                11
            );
            expect(result).toEqual({ selected: [], excluded: [] });

            result = strategy.unselect({ selected: [1], excluded: [] }, 1);
            expect(result).toEqual({ selected: [], excluded: [] });

            result = strategy.unselect({ selected: [1], excluded: [] }, 11);
            expect(result).toEqual({ selected: [1], excluded: [11] });
        });

        it('search model, select all and unselect only one breadcrumb child', () => {
            /*
            node-1, node-21
               leaf-211
            node-1
               leaf-11
          */
            const items = new RecordSet({
                rawData: [
                    {
                        id: 1,
                        parent: null,
                        nodeType: true,
                        title: 'test_node1',
                    },
                    {
                        id: 11,
                        parent: 1,
                        nodeType: null,
                        title: 'test_leaf11',
                    },
                    {
                        id: 21,
                        parent: 1,
                        nodeType: true,
                        title: 'test_node2',
                    },
                    {
                        id: 211,
                        parent: 21,
                        nodeType: null,
                        title: 'test_leaf21',
                    },
                ],
                keyProperty: 'id',
            });

            const searchModel = new SearchGridCollection({
                collection: items,
                root: null,
                keyProperty: 'id',
                parentProperty: 'parent',
                nodeProperty: 'nodeType',
                columns: [{}],
            });

            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: null,
                model: searchModel,
                selectionType: 'all',
                recursiveSelection: false,
                entryPath: [],
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });

            const result = strategy.unselect(
                { selected: [null], excluded: [null] },
                11,
                'aaa'
            );
            expect(result).toEqual({ selected: [null], excluded: [null, 11] });
        });

        it('search model, select node and unselect only one deep inside breadcrumb child', () => {
            /*
            node-1, node-21
               leaf-211
          */
            const items = new RecordSet({
                rawData: [
                    {
                        id: 1,
                        parent: null,
                        nodeType: true,
                        title: 'test_node1',
                    },
                    {
                        id: 21,
                        parent: 1,
                        nodeType: true,
                        title: 'test_node2',
                    },
                    {
                        id: 211,
                        parent: 21,
                        nodeType: null,
                        title: 'test_leaf21',
                    },
                ],
                keyProperty: 'id',
            });

            const searchModel = new SearchGridCollection({
                collection: items,
                root: null,
                keyProperty: 'id',
                parentProperty: 'parent',
                nodeProperty: 'nodeType',
                columns: [{}],
            });

            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: null,
                model: searchModel,
                selectionType: 'all',
                recursiveSelection: false,
                entryPath: [],
                selectionCountMode: 'all',
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });

            const selection = strategy.unselect(
                { selected: [1], excluded: [] },
                211,
                'aaa'
            );
            expect(selection).toEqual({ selected: [1], excluded: [211] });

            const res = strategy.getSelectionForModel(
                selection,
                undefined,
                'sad'
            );
            expect(toArrayKeys(res.get(true))).toEqual([]);
            expect(toArrayKeys(res.get(null))).toEqual([21]);
            expect(toArrayKeys(res.get(false))).toEqual([211]);
        });

        it('search model, select node and unselect this node when it is breadcrumb', () => {
            /*
            node-1, node-21
               leaf-211
          */
            const items = new RecordSet({
                rawData: [
                    {
                        id: 1,
                        parent: null,
                        nodeType: true,
                        title: 'test_node1',
                    },
                    {
                        id: 21,
                        parent: 1,
                        nodeType: true,
                        title: 'test_node2',
                    },
                    {
                        id: 211,
                        parent: 21,
                        nodeType: null,
                        title: 'test_leaf21',
                    },
                ],
                keyProperty: 'id',
            });

            const searchModel = new SearchGridCollection({
                collection: items,
                root: null,
                keyProperty: 'id',
                parentProperty: 'parent',
                nodeProperty: 'nodeType',
                columns: [{}],
            });

            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: null,
                model: searchModel,
                selectionType: 'all',
                recursiveSelection: false,
                entryPath: [],
                selectionCountMode: 'all',
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });

            const selection = strategy.unselect(
                { selected: [1], excluded: [] },
                21,
                'aaa'
            );
            expect(selection).toEqual({ selected: [1], excluded: [21] });
        });

        it('search model, empty breadcrumb should be selected if is all selected', () => {
            /*
            node-1, node-21
          */
            const items = new RecordSet({
                rawData: [
                    {
                        id: 1,
                        parent: null,
                        nodeType: true,
                        title: 'test_node1',
                    },
                    {
                        id: 21,
                        parent: 1,
                        nodeType: true,
                        title: 'test_node2',
                    },
                ],
                keyProperty: 'id',
            });

            const searchModel = new SearchGridCollection({
                collection: items,
                root: null,
                keyProperty: 'id',
                parentProperty: 'parent',
                nodeProperty: 'nodeType',
                columns: [{}],
            });

            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: null,
                model: searchModel,
                selectionType: 'all',
                recursiveSelection: false,
                entryPath: [],
                selectionCountMode: 'all',
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });

            const selection = { selected: [null], excluded: [null] };
            const res = strategy.getSelectionForModel(
                selection,
                undefined,
                'sad'
            );
            expect(toArrayKeys(res.get(true))).toEqual([]);
            expect(toArrayKeys(res.get(null))).toEqual([21]);
            expect(toArrayKeys(res.get(false))).toEqual([]);
        });

        it('search model, select breadcrumb and unselect breadcrumb', () => {
            /*
            node-1, node-21
               leaf-211
          */
            const items = new RecordSet({
                rawData: [
                    {
                        id: 1,
                        parent: null,
                        nodeType: true,
                        title: 'test_node1',
                    },
                    {
                        id: 21,
                        parent: 1,
                        nodeType: true,
                        title: 'test_node2',
                    },
                    {
                        id: 211,
                        parent: 21,
                        nodeType: null,
                        title: 'test_leaf21',
                    },
                ],
                keyProperty: 'id',
            });

            const searchModel = new SearchGridCollection({
                collection: items,
                root: null,
                keyProperty: 'id',
                parentProperty: 'parent',
                nodeProperty: 'nodeType',
                columns: [{}],
            });

            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: null,
                model: searchModel,
                selectionType: 'all',
                recursiveSelection: false,
                entryPath: [],
                selectionCountMode: 'all',
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });

            const selection = strategy.unselect(
                { selected: [211], excluded: [] },
                211,
                'aaa'
            );
            expect(selection).toEqual({ selected: [], excluded: [] });
        });
    });

    describe('selectAll', () => {
        it('not selected', () => {
            // выбрали все в корневом узле
            let selection = { selected: [], excluded: [] };
            selection = strategy.selectAll(selection);
            expect(selection.selected).toEqual([null]);
            expect(selection.excluded).toEqual([null]);

            // провалились в узел 2 и выбрали все
            strategy._rootKey = 2;
            selection = { selected: [], excluded: [] };
            selection = strategy.selectAll(selection);
            expect(selection.selected).toEqual([2]);
            expect(selection.excluded).toEqual([2]);
        });

        it('selected one', () => {
            let selection = { selected: [1], excluded: [] };
            selection = strategy.selectAll(selection);
            expect(selection.selected).toEqual([null]);
            expect(selection.excluded).toEqual([null]);
        });

        it('selected all, but one', () => {
            let selection = { selected: [null], excluded: [null, 2] };
            selection = strategy.selectAll(selection);
            expect(selection.selected).toEqual([null]);
            expect(selection.excluded).toEqual([null]);
        });

        it('select all after change root', () => {
            strategy.update({
                selectDescendants: false,
                selectAncestors: false,
                rootKey: 5,
                selectionType: 'all',
                model,
                recursiveSelection: false,
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });
            let selection = { selected: [2], excluded: [] };
            selection = strategy.selectAll(selection);
            expect(selection.selected).toEqual([2, 5]);
            expect(selection.excluded).toEqual([5]);
            strategy.reset();
        });

        it('should not add root to selection if has selected parent', () => {
            strategy.update({
                selectDescendants: false,
                selectAncestors: false,
                rootKey: 2,
                selectionType: 'all',
                model,
                recursiveSelection: false,
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });

            const selection = strategy.selectAll({
                selected: [1],
                excluded: [1],
            });
            expect(selection.selected).toEqual([1]);
            expect(selection.excluded).toEqual([1]);
            strategy.reset();
        });

        it('with limit', () => {
            let selection = { selected: [3], excluded: [] };
            selection = strategy.selectAll(selection, 1);
            expect(selection.selected).toEqual([3, null]);
            expect(selection.excluded).toEqual([null]);
        });

        it('should not throw error if has hidden group', () => {
            const items = new RecordSet({
                rawData: [
                    {
                        id: 1,
                        parent: null,
                        node: null,
                        group: groupConstants.hiddenGroup,
                    },
                ],
                keyProperty: 'id',
            });
            const model = new Tree({
                collection: items,
                root: null,
                keyProperty: 'id',
                parentProperty: 'parent',
                nodeProperty: 'node',
                groupProperty: 'group',
                expandedItems: [null],
            });
            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: null,
                model,
                selectionType: 'all',
                recursiveSelection: false,
                entryPath: [],
                selectionCountMode: 'all',
            });

            let error;
            try {
                const selection = strategy.selectAll({
                    selected: [],
                    excluded: [],
                });
                expect(selection).toEqual({
                    selected: [null],
                    excluded: [null],
                });
            } catch (e) {
                error = e;
            }

            expect(error).toBeFalsy();
        });
    });

    describe('unselectAll', () => {
        it('without ENTRY_PATH', () => {
            let selection = { selected: [1, 6], excluded: [3, 5] };
            selection = strategy.unselectAll(selection);
            expect(selection.selected).toEqual([]);
            expect(selection.excluded).toEqual([]);
        });

        it('with ENTRY_PATH', () => {
            // если есть ENTRY_PATH то удаляется только текущий корень и его дети
            strategy._entryPath = [{}];
            strategy._rootKey = 2;
            let selection = { selected: [2, 5], excluded: [2, 3] };
            selection = strategy.unselectAll(selection);
            expect(selection.selected).toEqual([]);
            expect(selection.excluded).toEqual([]);
        });

        it('with empty ENTRY_PATH', () => {
            // если есть ENTRY_PATH то удаляется только текущий корень и его дети
            strategy._entryPath = [];
            strategy._rootKey = 2;
            let selection = { selected: [2, 5], excluded: [2, 3] };
            selection = strategy.unselectAll(selection);
            expect(selection.selected).toEqual([]);
            expect(selection.excluded).toEqual([]);
        });
    });

    describe('toggleAll', () => {
        it('selected current node', () => {
            strategy._rootKey = 2;
            let selection = { selected: [2], excluded: [2] };
            selection = strategy.toggleAll(selection);
            expect(selection.selected).toEqual([]);
            expect(selection.excluded).toEqual([]);
        });

        it('selected some items', () => {
            const selection = strategy.toggleAll(
                { selected: [1, 5], excluded: [] },
                false
            );
            expect(selection.selected).toEqual([null]);
            expect(selection.excluded).toEqual([null, 1, 5]);
        });

        it('selected some items, change root, toggle all twice', () => {
            const options = {
                selectDescendants: true,
                selectAncestors: true,
                rootKey: null,
                model,
                selectionType: 'all',
                selectionCountMode: 'all',
                recursiveSelection: false,
                entryPath: undefined,
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            };
            strategyWithDescendantsAndAncestors.update({
                ...options,
                rootKey: 2,
            });
            strategyWithDescendantsAndAncestors.update({
                ...options,
                rootKey: null,
            });
            let selection = strategyWithDescendantsAndAncestors.toggleAll(
                { selected: [1, 5], excluded: [] },
                false
            );
            selection = strategyWithDescendantsAndAncestors.toggleAll(
                selection,
                false
            );
            expect(selection.selected).toEqual([1, 5]);
            expect(selection.excluded).toEqual([]);
        });

        it('selected all, but few', () => {
            let selection = { selected: [null], excluded: [null, 2] };
            selection = strategy.toggleAll(selection);
            expect(selection.selected).toEqual([2]);
            expect(selection.excluded).toEqual([]);
        });

        it('toggleAll after select all by one', () => {
            let selection = { selected: [1, 2, 3, 4, 5, 6, 7], excluded: [] };

            selection = strategy.unselect(selection, 2);

            expect(selection.selected).toEqual([1, 5, 6, 7]);
            expect(selection.excluded).toEqual([]);

            selection = strategy.toggleAll(selection);

            expect(selection.selected).toEqual([null]);
            expect(selection.excluded).toEqual([null, 1, 5, 6, 7]);
        });

        it('toggleAll after select all by one in root', () => {
            let selection = { selected: [1, 2, 3, 4, 5, 6, 7], excluded: [] };

            selection = strategy.toggleAll(selection);

            expect(selection.selected).toEqual([]);
            expect(selection.excluded).toEqual([]);
        });

        it('selected not loaded item', () => {
            let selection = { selected: [20], excluded: [] };
            selection = strategy.toggleAll(selection, true);

            expect(selection.selected).toEqual([null]);
            expect(selection.excluded).toEqual([null, 20]);
        });

        it('after change root', () => {
            strategy.update({
                selectDescendants: false,
                selectAncestors: false,
                rootKey: 2,
                selectionType: 'all',
                model,
                recursiveSelection: false,
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });
            let selection = { selected: [6, 3], excluded: [] };
            selection = strategy.toggleAll(selection);
            expect(selection.selected).toEqual([2]);
            expect(selection.excluded).toEqual([2, 3]);
            strategy.reset();
        });

        it('when selected childs in collapsed node', () => {
            const model = new TreeGridCollection({
                collection: new RecordSet({
                    keyProperty: ListData.KEY_PROPERTY,
                    rawData: ListData.getItems(),
                }),
                root: null,
                keyProperty: ListData.KEY_PROPERTY,
                parentProperty: ListData.PARENT_PROPERTY,
                nodeProperty: ListData.NODE_PROPERTY,
                hasChildrenProperty: ListData.HAS_CHILDREN_PROPERTY,
                columns: [],
                expandedItems: [null],
                collapsedItems: [null, 2],
            });

            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: null,
                model,
                selectionType: 'all',
                selectionCountMode: 'all',
                recursiveSelection: false,
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });
            let selection = { selected: [3, 4], excluded: [] };
            selection = strategy.toggleAll(selection, false);

            expect(selection.selected).toEqual([null]);
            expect(selection.excluded).toEqual([null, 3, 4]);

            selection = strategy.toggleAll(selection, false);
            expect(selection.selected).toEqual([3, 4]);
            expect(selection.excluded).toEqual([]);
        });

        it('has added item with key=null', () => {
            const contents = new Model({
                rawData: { id: null, parent: null, node: null },
                keyProperty: 'id',
            });
            const editingItem = model.createItem({ contents, isAdd: true });
            editingItem.setEditing(true, contents, false);
            model.setAddingItem(editingItem, { position: 'bottom' });

            let selection = { selected: [1, 5], excluded: [] };
            selection = strategy.toggleAll(selection);

            expect(selection.selected).toEqual([null]);
            expect(selection.excluded).toEqual([null, 1, 5]);

            model.resetAddingItem();
        });
    });

    describe('selectRange', () => {
        it('without expanded nodes', () => {
            const selection = strategy.selectRange(model.getItems());
            expect(selection.selected).toEqual([1, 2, 3, 4, 5, 6, 7]);
            expect(selection.excluded).toEqual([]);
        });
        it('with expanded nodes', () => {
            const items = model.getItems();
            items[0].setExpanded(true);
            items[1].getContents().set(model.getNodeProperty(), true);
            items[1].setExpanded(true);
            const selection = strategy.selectRange(items);
            expect(selection.selected).toEqual([3, 4, 5, 6, 7]);
            expect(selection.excluded).toEqual([]);
        });
    });

    describe('getSelectionForModel', () => {
        it('not selected', () => {
            const selection = { selected: [], excluded: [] };
            const res = strategy.getSelectionForModel(selection);
            expect(toArrayKeys(res.get(true))).toEqual([]);
            expect(toArrayKeys(res.get(null))).toEqual([]);
            expect(toArrayKeys(res.get(false))).toEqual([1, 2, 3, 4, 5, 6, 7]);
        });

        it('selected one', () => {
            // выбрали только лист и выбрались все его родители
            let selection = { selected: [3], excluded: [] };
            let res =
                strategyWithDescendantsAndAncestors.getSelectionForModel(
                    selection
                );
            expect(toArrayKeys(res.get(true))).toEqual([3]);
            expect(toArrayKeys(res.get(null))).toEqual([1, 2]);
            expect(toArrayKeys(res.get(false))).toEqual([4, 5, 6, 7]);

            // выбрали лист и выбрался только он
            selection = { selected: [3], excluded: [] };
            res = strategy.getSelectionForModel(selection);
            expect(toArrayKeys(res.get(true))).toEqual([3]);
            expect(toArrayKeys(res.get(null))).toEqual([]);
            expect(toArrayKeys(res.get(false))).toEqual([1, 2, 4, 5, 6, 7]);

            // выбрали узел с родителями и с детьми, выбрался узел, дети и родители
            selection = { selected: [2], excluded: [] };
            res =
                strategyWithDescendantsAndAncestors.getSelectionForModel(
                    selection
                );
            expect(toArrayKeys(res.get(true))).toEqual([2, 3, 4]);
            expect(toArrayKeys(res.get(null))).toEqual([1]);
            expect(toArrayKeys(res.get(false))).toEqual([5, 6, 7]);

            // выбрали узел с родителями и с детьми, выбрался только узел
            selection = { selected: [2], excluded: [] };
            res = strategy.getSelectionForModel(selection);
            expect(toArrayKeys(res.get(true))).toEqual([2]);
            expect(toArrayKeys(res.get(null))).toEqual([]);
            expect(toArrayKeys(res.get(false))).toEqual([1, 3, 4, 5, 6, 7]);

            // выбрали узел с родителями и с детьми и некоторые дети исключены
            selection = { selected: [2], excluded: [3] };
            res =
                strategyWithDescendantsAndAncestors.getSelectionForModel(
                    selection
                );
            expect(toArrayKeys(res.get(true))).toEqual([4]);
            expect(toArrayKeys(res.get(null))).toEqual([1, 2]);
            expect(toArrayKeys(res.get(false))).toEqual([3, 5, 6, 7]);
        });

        it('selected all, but one', () => {
            const selection = { selected: [null], excluded: [null, 2] };
            let res = strategy.getSelectionForModel(selection);
            expect(toArrayKeys(res.get(true))).toEqual([1, 3, 4, 5, 6, 7]);
            expect(toArrayKeys(res.get(null))).toEqual([]);
            expect(toArrayKeys(res.get(false))).toEqual([2]);

            res =
                strategyWithDescendantsAndAncestors.getSelectionForModel(
                    selection
                );
            expect(toArrayKeys(res.get(true))).toEqual([5, 6, 7]);
            expect(toArrayKeys(res.get(null))).toEqual([1]);
            expect(toArrayKeys(res.get(false))).toEqual([2, 3, 4]);
        });

        it('selected all, but one child of root item', () => {
            const items = new RecordSet({
                rawData: [
                    { id: 1, parent: null, node: true },
                    { id: 11, parent: 1, node: true },
                    { id: 2, parent: null, node: true },
                    { id: 3, parent: null, node: false },
                ],
                keyProperty: 'id',
            });
            const model = new Tree({
                collection: items,
                root: null,
                keyProperty: 'id',
                parentProperty: 'parent',
                nodeProperty: 'node',
                expandedItems: [null],
            });
            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: null,
                model,
                selectionType: 'all',
                recursiveSelection: false,
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });
            const res = strategy.getSelectionForModel({
                selected: [null],
                excluded: [null, 11],
            });
            expect(toArrayKeys(res.get(true))).toEqual([2, 3]);
            expect(toArrayKeys(res.get(null))).toEqual([]);
            expect(toArrayKeys(res.get(false))).toEqual([1, 11]);
        });

        it('selected unloaded item', () => {
            const treeStrategyWithRootItems = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: null,
                model,
                selectionType: 'all',
                recursiveSelection: false,
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });
            const entryPath = [
                { parent: 6, id: 10 },
                { parent: 6, id: 11 },
            ];
            const selection = {
                selected: [10],
                excluded: [],
            };
            treeStrategyWithRootItems._entryPath = entryPath;
            const result =
                treeStrategyWithRootItems.getSelectionForModel(selection);
            const unselectedKeys = toArrayKeys(result.get(false));
            const hasSelectedItems = !!result.get(true).length;
            const nullStateKeys = toArrayKeys(result.get(null));
            expect(unselectedKeys).toEqual([1, 2, 3, 4, 5, 7]);
            expect(hasSelectedItems).toBe(false);
            expect(nullStateKeys).toEqual([6]);
        });

        it('selected node use selectAll and go to parent node', () => {
            const selection = { selected: [1], excluded: [1] };
            let res =
                strategyWithDescendantsAndAncestors.getSelectionForModel(
                    selection
                );
            expect(toArrayKeys(res.get(true))).toEqual([2, 3, 4, 5]);
            expect(toArrayKeys(res.get(null))).toEqual([1]);
            expect(toArrayKeys(res.get(false))).toEqual([6, 7]);

            res = strategy.getSelectionForModel(selection);
            expect(toArrayKeys(res.get(true))).toEqual([]);
            expect(toArrayKeys(res.get(null))).toEqual([]);
            expect(toArrayKeys(res.get(false))).toEqual([1, 2, 3, 4, 5, 6, 7]);
        });

        it('with group and search value', () => {
            // если задан searchValue, то не должны выбираться узлы. Группа ломала это поведение

            const selection = { selected: [null], excluded: [null] };

            const items = model.getItems();
            items.push(new GroupItem({}));

            let res = strategy.getSelectionForModel(selection, null, 'asdas');
            expect(toArrayKeys(res.get(true))).toEqual([4, 5, 7]);
            expect(toArrayKeys(res.get(null))).toEqual([1, 2, 3, 6]);
            expect(toArrayKeys(res.get(false))).toEqual([]);

            res = strategyWithDescendantsAndAncestors.getSelectionForModel(
                selection,
                null,
                'asdas'
            );
            expect(toArrayKeys(res.get(true))).toEqual([4, 5, 7]);
            expect(toArrayKeys(res.get(null))).toEqual([1, 2, 3, 6]);
            expect(toArrayKeys(res.get(false))).toEqual([]);
        });

        it('go to deep nodes in explorer with ENTRY_PATH', () => {
            const items = new RecordSet({
                rawData: [
                    { id: 111, parent: 11, node: null },
                    { id: 112, parent: 11, node: null },
                ],
                keyProperty: 'id',
            });
            const model = new Tree({
                collection: items,
                root: 11,
                keyProperty: 'id',
                parentProperty: 'parent',
                nodeProperty: 'node',
            });
            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: 11,
                model,
                selectionType: 'all',
                recursiveSelection: false,
                entryPath: [
                    { id: 1, parent: null },
                    { id: 11, parent: 1 },
                ],
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });

            const res = strategy.getSelectionForModel({
                selected: [1],
                excluded: [112],
            });
            expect(toArrayKeys(res.get(true))).toEqual([111]);
            expect(toArrayKeys(res.get(false))).toEqual([112]);
            expect(toArrayKeys(res.get(null))).toEqual([]);
        });

        it('unselect item from ENTRY_PATH', () => {
            const items = new RecordSet({
                rawData: [
                    { id: 1, parent: null, node: null },
                    { id: 2, parent: null, node: null },
                ],
                keyProperty: 'id',
            });
            const model = new Tree({
                collection: items,
                root: null,
                keyProperty: 'id',
                parentProperty: 'parent',
                nodeProperty: 'node',
            });
            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: null,
                model,
                selectionType: 'all',
                recursiveSelection: false,
                entryPath: [{ id: 1, parent: null }],
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });

            const res = strategy.getSelectionForModel({
                selected: [],
                excluded: [],
            });
            expect(toArrayKeys(res.get(true))).toEqual([]);
            expect(toArrayKeys(res.get(false))).toEqual([1, 2]);
            expect(toArrayKeys(res.get(null))).toEqual([]);
        });

        it('node has selected children deep ', () => {
            const items = new RecordSet({
                rawData: [
                    { id: 1, parent: null, node: true },
                    { id: 11, parent: 1, node: true },
                    { id: 111, parent: 11, node: true },
                    { id: 1111, parent: 111, node: null },
                ],
                keyProperty: 'id',
            });
            const model = new Tree({
                collection: items,
                root: null,
                keyProperty: 'id',
                parentProperty: 'parent',
                nodeProperty: 'node',
                expandedItems: [null],
            });
            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: null,
                model,
                selectionType: 'all',
                recursiveSelection: false,
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });

            let res = strategy.getSelectionForModel({
                selected: [1111],
                excluded: [],
            });
            expect(toArrayKeys(res.get(true))).toEqual([1, 11, 111, 1111]);
            expect(toArrayKeys(res.get(false))).toEqual([]);
            expect(toArrayKeys(res.get(null))).toEqual([]);

            res = strategy.getSelectionForModel({
                selected: [111],
                excluded: [],
            });
            expect(toArrayKeys(res.get(true))).toEqual([1, 11, 111, 1111]);
            expect(toArrayKeys(res.get(false))).toEqual([]);
            expect(toArrayKeys(res.get(null))).toEqual([]);

            res = strategy.getSelectionForModel({
                selected: [11],
                excluded: [],
            });
            expect(toArrayKeys(res.get(true))).toEqual([1, 11, 111, 1111]);
            expect(toArrayKeys(res.get(false))).toEqual([]);
            expect(toArrayKeys(res.get(null))).toEqual([]);

            res = strategy.getSelectionForModel({
                selected: [1],
                excluded: [],
            });
            expect(toArrayKeys(res.get(true))).toEqual([1, 11, 111, 1111]);
            expect(toArrayKeys(res.get(false))).toEqual([]);
            expect(toArrayKeys(res.get(null))).toEqual([]);

            res = strategy.getSelectionForModel({
                selected: [null],
                excluded: [null],
            });
            expect(toArrayKeys(res.get(true))).toEqual([1, 11, 111, 1111]);
            expect(toArrayKeys(res.get(false))).toEqual([]);
            expect(toArrayKeys(res.get(null))).toEqual([]);
        });

        it('node has excluded single children deep ', () => {
            const items = new RecordSet({
                rawData: [
                    { id: 1, parent: null, node: true },
                    { id: 11, parent: 1, node: true },
                    { id: 111, parent: 11, node: true },
                    { id: 1111, parent: 111, node: null },
                    { id: 2, parent: null, node: null },
                ],
                keyProperty: 'id',
            });
            const model = new Tree({
                collection: items,
                root: null,
                keyProperty: 'id',
                parentProperty: 'parent',
                nodeProperty: 'node',
                expandedItems: [null],
            });
            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: null,
                model,
                selectionType: 'all',
                recursiveSelection: false,
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });

            const res = strategy.getSelectionForModel({
                selected: [null],
                excluded: [null, 1111],
            });
            expect(toArrayKeys(res.get(true))).toEqual([2]);
            expect(toArrayKeys(res.get(false))).toEqual([1, 11, 111, 1111]);
            expect(toArrayKeys(res.get(null))).toEqual([]);
        });

        it('node has selected children deep in entry_path ', () => {
            const items = new RecordSet({
                rawData: [{ id: 1, parent: null, node: true }],
                keyProperty: 'id',
            });
            const model = new Tree({
                collection: items,
                root: null,
                keyProperty: 'id',
                parentProperty: 'parent',
                nodeProperty: 'node',
            });
            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: null,
                model,
                selectionType: 'all',
                recursiveSelection: false,
                entryPath: [
                    { id: 11, parent: 1 },
                    { id: 111, parent: 11 },
                ],
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });

            const res = strategy.getSelectionForModel({
                selected: [111],
                excluded: [],
            });
            expect(toArrayKeys(res.get(true))).toEqual([]);
            expect(toArrayKeys(res.get(false))).toEqual([]);
            expect(toArrayKeys(res.get(null))).toEqual([1]);
        });

        it('node has selected children deep in entry_path, entry_path reverted', () => {
            const items = new RecordSet({
                rawData: [{ id: 1, parent: null, node: true }],
                keyProperty: 'id',
            });
            const model = new Tree({
                collection: items,
                root: null,
                keyProperty: 'id',
                parentProperty: 'parent',
                nodeProperty: 'node',
            });
            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: null,
                model,
                selectionType: 'all',
                recursiveSelection: false,
                entryPath: [
                    { id: 11111, parent: 1111 },
                    { id: 11, parent: 1 },
                    { id: 1111, parent: 111 },
                    { id: 111, parent: 11 },
                ],
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });

            const res = strategy.getSelectionForModel({
                selected: [11111],
                excluded: [],
            });
            expect(toArrayKeys(res.get(true))).toEqual([]);
            expect(toArrayKeys(res.get(false))).toEqual([]);
            expect(toArrayKeys(res.get(null))).toEqual([1]);
        });

        it('select item in current root and get ENTRY_PATH for it, recordset not has parents', () => {
            const items = new RecordSet({
                rawData: [
                    { id: 3, parent: 2, node: null },
                    { id: 4, parent: 2, node: null },
                    { id: 5, parent: 2, node: null },
                ],
                keyProperty: 'id',
            });
            const model = new Tree({
                collection: items,
                root: 2,
                keyProperty: 'id',
                parentProperty: 'parent',
                nodeProperty: 'node',
            });
            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: 2,
                model,
                selectionType: 'all',
                recursiveSelection: false,
                entryPath: [
                    { id: 1, parent: null },
                    { id: 2, parent: 1 },
                    { id: 3, parent: 2 },
                ],
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });

            const res = strategy.getSelectionForModel({
                selected: [3],
                excluded: [],
            });
            expect(toArrayKeys(res.get(true))).toEqual([3]);
            expect(toArrayKeys(res.get(false))).toEqual([4, 5]);
            expect(toArrayKeys(res.get(null))).toEqual([]);
        });

        it('with limit', () => {
            let res = strategy.getSelectionForModel(
                { selected: [null], excluded: [null] },
                3
            );
            expect(toArrayKeys(res.get(true))).toEqual([1, 2, 3]);
            expect(toArrayKeys(res.get(null))).toEqual([]);
            expect(toArrayKeys(res.get(false))).toEqual([4, 5, 6, 7]);

            res = strategy.getSelectionForModel(
                { selected: [null, 5], excluded: [null] },
                3
            );
            expect(toArrayKeys(res.get(true))).toEqual([1, 2, 3, 5]);
            expect(toArrayKeys(res.get(null))).toEqual([]);
            expect(toArrayKeys(res.get(false))).toEqual([4, 6, 7]);
        });

        it('node is partially selected', () => {
            const model = new TreeGridCollection({
                collection: new RecordSet({
                    keyProperty: ListData.KEY_PROPERTY,
                    rawData: ListData.getItems(),
                }),
                root: 1,
                keyProperty: ListData.KEY_PROPERTY,
                parentProperty: ListData.PARENT_PROPERTY,
                nodeProperty: ListData.NODE_PROPERTY,
                hasChildrenProperty: ListData.HAS_CHILDREN_PROPERTY,
                columns: [],
                expandedItems: [null],
            });
            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: 1,
                model,
                selectionType: 'all',
                recursiveSelection: false,
                entryPath: null,
                selectionCountMode: 'all',
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });
            const res = strategy.getSelectionForModel({
                selected: [2],
                excluded: [2, 3],
            });
            expect(toArrayKeys(res.get(true))).toEqual([4]);
            expect(toArrayKeys(res.get(null))).toEqual([2]);
            expect(toArrayKeys(res.get(false))).toEqual([3, 5]);
        });

        it('selectionType=leaf, recurseSelection=true, feature1188089336=true', () => {
            const model = new TreeGridCollection({
                collection: new RecordSet({
                    keyProperty: ListData.KEY_PROPERTY,
                    rawData: ListData.getItems(),
                }),
                root: null,
                keyProperty: ListData.KEY_PROPERTY,
                parentProperty: ListData.PARENT_PROPERTY,
                nodeProperty: ListData.NODE_PROPERTY,
                hasChildrenProperty: ListData.HAS_CHILDREN_PROPERTY,
                columns: [],
                expandedItems: [null],
            });
            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: null,
                model,
                selectionType: 'leaf',
                recursiveSelection: true,
                feature1188089336: true,
                entryPath: null,
                selectionCountMode: 'all',
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });

            const selection = strategy.select(
                { selected: [], excluded: [] },
                1
            );
            expect(selection.selected).toEqual([1]);
            expect(selection.excluded).toEqual([1]);

            const res = strategy.getSelectionForModel(selection, 0, true);
            expect(toArrayKeys(res.get(true))).toEqual([4, 5]);
            expect(toArrayKeys(res.get(null))).toEqual([1, 2, 3]);
            expect(toArrayKeys(res.get(false))).toEqual([6, 7]);
        });

        it('node is partially selected after select all inside it', () => {
            const model = new TreeGridCollection({
                collection: new RecordSet({
                    keyProperty: 'key',
                    rawData: [{ key: 1, parent: null, node: true }],
                }),
                root: null,
                keyProperty: 'key',
                parentProperty: 'parent',
                nodeProperty: 'node',
                columns: [],
            });
            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: null,
                model,
                selectionType: 'all',
                recursiveSelection: false,
                entryPath: [{ id: 1, parent: null }],
                selectionCountMode: 'all',
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });
            const res = strategy.getSelectionForModel({
                selected: [1],
                excluded: [1],
            });
            expect(toArrayKeys(res.get(true))).toEqual([]);
            expect(toArrayKeys(res.get(null))).toEqual([1]);
            expect(toArrayKeys(res.get(false))).toEqual([]);
        });

        it('all childs is selected by one', () => {
            const model = new TreeGridCollection({
                collection: new RecordSet({
                    keyProperty: 'key',
                    rawData: [
                        {
                            key: 1,
                            parent: null,
                            node: true,
                        },
                        {
                            key: 11,
                            parent: 1,
                            node: false,
                        },
                        {
                            key: 12,
                            parent: 1,
                            node: false,
                        },
                        {
                            key: 13,
                            parent: 1,
                            node: false,
                        },
                    ],
                }),
                root: null,
                keyProperty: 'key',
                parentProperty: 'parent',
                nodeProperty: 'node',
                columns: [],
                expandedItems: [null],
                collapsedItems: [],
            });
            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: null,
                model,
                selectionType: 'all',
                recursiveSelection: false,
                entryPath: null,
                selectionCountMode: 'all',
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });
            const res = strategy.getSelectionForModel({
                selected: [11, 12, 13],
                excluded: [],
            });
            expect(toArrayKeys(res.get(true))).toEqual([1, 11, 12, 13]);
            expect(toArrayKeys(res.get(null))).toEqual([]);
            expect(toArrayKeys(res.get(false))).toEqual([]);
        });

        it('search model', () => {
            /*
            node-1
               leaf-11
               leaf-12
            node-2
               leaf-21
               leaf-22
          */
            const items = new RecordSet({
                rawData: [
                    {
                        id: 1,
                        parent: null,
                        nodeType: true,
                        title: 'test_node1',
                    },
                    {
                        id: 11,
                        parent: 1,
                        nodeType: null,
                        title: 'test_leaf11',
                    },
                    {
                        id: 12,
                        parent: 1,
                        nodeType: null,
                        title: 'test_leaf12',
                    },
                    {
                        id: 2,
                        parent: null,
                        nodeType: true,
                        title: 'test_node2',
                    },
                    {
                        id: 21,
                        parent: 2,
                        nodeType: null,
                        title: 'test_leaf21',
                    },
                    {
                        id: 22,
                        parent: 2,
                        nodeType: null,
                        title: 'test_leaf22',
                    },
                ],
                keyProperty: 'id',
            });

            const searchModel = new SearchGridCollection({
                collection: items,
                root: null,
                keyProperty: 'id',
                parentProperty: 'parent',
                nodeProperty: 'nodeType',
                columns: [{}],
            });

            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: null,
                model: searchModel,
                selectionType: 'all',
                recursiveSelection: false,
                entryPath: [],
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });

            let res = strategy.getSelectionForModel(
                { selected: [null], excluded: [null] },
                undefined,
                true
            );
            expect(toArrayKeys(res.get(true))).toEqual([11, 12, 21, 22]);
            expect(toArrayKeys(res.get(null))).toEqual([1, 2]);
            expect(toArrayKeys(res.get(false))).toEqual([]);

            // Изменилось состояние хлебной крошки, когда сняли чекбокс с одного из ее детей
            res = strategy.getSelectionForModel(
                { selected: [null], excluded: [null, 11, 12] },
                undefined,
                true
            );
            expect(toArrayKeys(res.get(true))).toEqual([21, 22]);
            expect(toArrayKeys(res.get(null))).toEqual([2]);
            expect(toArrayKeys(res.get(false))).toEqual([1, 11, 12]);

            // Выбирается хлебная крошка
            res = strategy.getSelectionForModel(
                { selected: [2], excluded: [] },
                undefined,
                true
            );
            expect(toArrayKeys(res.get(true))).toEqual([2, 21, 22]);
            expect(toArrayKeys(res.get(null))).toEqual([]);
            expect(toArrayKeys(res.get(false))).toEqual([1, 11, 12]);

            // исключена хлебная крошка
            res = strategy.getSelectionForModel(
                { selected: [null], excluded: [null, 2] },
                undefined,
                true
            );
            expect(toArrayKeys(res.get(true))).toEqual([11, 12]);
            expect(toArrayKeys(res.get(null))).toEqual([1]);
            expect(toArrayKeys(res.get(false))).toEqual([2, 21, 22]);

            // выбрали ребенка хлебной крошки
            res = strategy.getSelectionForModel(
                { selected: [11], excluded: [] },
                undefined,
                true
            );
            expect(toArrayKeys(res.get(true))).toEqual([11]);
            expect(toArrayKeys(res.get(null))).toEqual([1]);
            expect(toArrayKeys(res.get(false))).toEqual([2, 12, 21, 22]);
        });

        it('search model, select all and unselect only one breadcrumb child', () => {
            /*
            node-1, node-21
               leaf-211
            node-1
               leaf-11
          */
            const items = new RecordSet({
                rawData: [
                    {
                        id: 1,
                        parent: null,
                        nodeType: true,
                        title: 'test_node1',
                    },
                    {
                        id: 11,
                        parent: 1,
                        nodeType: null,
                        title: 'test_leaf11',
                    },
                    {
                        id: 21,
                        parent: 1,
                        nodeType: true,
                        title: 'test_node2',
                    },
                    {
                        id: 211,
                        parent: 21,
                        nodeType: null,
                        title: 'test_leaf21',
                    },
                ],
                keyProperty: 'id',
            });

            const searchModel = new SearchGridCollection({
                collection: items,
                root: null,
                keyProperty: 'id',
                parentProperty: 'parent',
                nodeProperty: 'nodeType',
                columns: [{}],
            });

            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: null,
                model: searchModel,
                selectionType: 'all',
                recursiveSelection: false,
                entryPath: [],
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });

            const res = strategy.getSelectionForModel(
                {
                    selected: [null],
                    excluded: [null, 11],
                },
                undefined,
                'sad'
            );
            expect(toArrayKeys(res.get(true))).toEqual([211]);
            expect(toArrayKeys(res.get(null))).toEqual([21]);
            expect(toArrayKeys(res.get(false))).toEqual([1, 11]);
        });

        it('search model, select breadcrumbs and unselect only one breadcrumb child', () => {
            /*
            node-1
               leaf-11
          */
            const items = new RecordSet({
                rawData: [
                    {
                        id: 1,
                        parent: null,
                        nodeType: true,
                        title: 'test_node1',
                    },
                    {
                        id: 11,
                        parent: 1,
                        nodeType: null,
                        title: 'test_leaf11',
                    },
                ],
                keyProperty: 'id',
            });

            const searchModel = new SearchGridCollection({
                collection: items,
                root: null,
                keyProperty: 'id',
                parentProperty: 'parent',
                nodeProperty: 'nodeType',
                columns: [{}],
            });

            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: null,
                model: searchModel,
                selectionType: 'all',
                recursiveSelection: false,
                entryPath: [],
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });

            const res = strategy.getSelectionForModel(
                {
                    selected: [1],
                    excluded: [11],
                },
                undefined,
                undefined,
                'sad'
            );
            expect(toArrayKeys(res.get(true))).toEqual([]);
            expect(toArrayKeys(res.get(null))).toEqual([1]);
            expect(toArrayKeys(res.get(false))).toEqual([11]);
        });
    });

    describe('cases of go inside node and out it', () => {
        it('select node and go inside it', () => {
            let selection = { selected: [], excluded: [] };
            selection = strategyWithDescendantsAndAncestors.select(
                selection,
                2
            );
            strategyWithDescendantsAndAncestors._rootKey = 2;
            const res =
                strategyWithDescendantsAndAncestors.getSelectionForModel(
                    selection
                );
            expect(toArrayKeys(res.get(true))).toEqual([2, 3, 4]);
            expect(toArrayKeys(res.get(null))).toEqual([1]);
            expect(toArrayKeys(res.get(false))).toEqual([5, 6, 7]);
        });

        it('select leaf being inside node and go out it', () => {
            let selection = { selected: [], excluded: [] };
            strategyWithDescendantsAndAncestors._rootKey = 1;
            selection = strategyWithDescendantsAndAncestors.select(
                selection,
                5
            );
            strategyWithDescendantsAndAncestors._rootKey = null;
            const res =
                strategyWithDescendantsAndAncestors.getSelectionForModel(
                    selection
                );
            expect(toArrayKeys(res.get(true))).toEqual([5]);
            expect(toArrayKeys(res.get(null))).toEqual([1]);
            expect(toArrayKeys(res.get(false))).toEqual([2, 3, 4, 6, 7]);
        });
    });

    describe('isAllSelected', () => {
        it('all selected', () => {
            const selection = { selected: [null], excluded: [null] };
            expect(strategy.isAllSelected(selection, false, 7, null)).toBe(
                true
            );
            expect(
                strategy.isAllSelected(selection, false, 7, null, false)
            ).toBe(true);
        });

        it('all selected and one excluded', () => {
            const selection = { selected: [null], excluded: [null, 2] };
            expect(strategy.isAllSelected(selection, false, 7, null)).toBe(
                false
            );
            expect(
                strategy.isAllSelected(selection, false, 7, null, false)
            ).toBe(true);
        });

        it('selected current root', () => {
            const selection = { selected: [5], excluded: [5] };
            strategy.update({
                selectDescendants: false,
                selectAncestors: false,
                selectionType: 'all',
                selectionCountMode: 'all',
                rootKey: 5,
                model,
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });
            expect(strategy._rootChanged).toBe(true);
            expect(strategy.isAllSelected(selection, false, 7, null)).toBe(
                true
            );
            expect(
                strategy.isAllSelected(selection, true, 7, null, false)
            ).toBe(true);
        });

        it('selected by one all elements', () => {
            const selection = { selected: [1, 2, 3, 4, 5, 6, 7], excluded: [] };
            expect(strategy.isAllSelected(selection, false, 7, null)).toBe(
                true
            );
            expect(
                strategy.isAllSelected(selection, true, 7, null, false)
            ).toBe(false);
        });

        it('selected by one all elements and has more data', () => {
            const selection = { selected: [1, 2, 3, 4, 5, 6, 7], excluded: [] };
            expect(strategy.isAllSelected(selection, true, 7, null)).toBe(
                false
            );
            expect(
                strategy.isAllSelected(selection, true, 7, null, false)
            ).toBe(false);
        });

        it('empty model', () => {
            const strategy = new TreeSelectionStrategy({
                selectDescendants: false,
                selectAncestors: false,
                rootKey: null,
                model,
                selectionType: 'all',
                recursiveSelection: false,
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });
            const selection = { selected: [], excluded: [] };
            expect(
                strategy.isAllSelected(selection, false, 0, null, true)
            ).toBe(false);
        });

        it('limit', () => {
            const selection = { selected: [null], excluded: [null] };
            expect(strategy.isAllSelected(selection, false, 3, 2, true)).toBe(
                false
            );
            expect(strategy.isAllSelected(selection, false, 3, 3, true)).toBe(
                true
            );
            expect(strategy.isAllSelected(selection, false, 3, 5, true)).toBe(
                true
            );
            expect(strategy.isAllSelected(selection, true, 3, 5, true)).toBe(
                false
            );
        });

        it('pass rootKey', () => {
            const selection = { selected: [5], excluded: [5] };
            strategy.update({
                selectDescendants: false,
                selectAncestors: false,
                selectionType: 'all',
                selectionCountMode: 'all',
                rootKey: 5,
                model,
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });
            expect(strategy._rootChanged).toBe(true);
            expect(strategy.isAllSelected(selection, false, 7, null)).toBe(
                true
            );
            expect(
                strategy.isAllSelected(selection, true, 7, null, false)
            ).toBe(true);
            expect(
                strategy.isAllSelected(selection, true, 7, null, false, 4)
            ).toBe(false);
            expect(
                strategy.isAllSelected(
                    { selected: [4], excluded: [4] },
                    true,
                    7,
                    null,
                    false,
                    4
                )
            ).toBe(true);
        });

        it('selected all root items by one', () => {
            const model = new TreeGridCollection({
                collection: new RecordSet({
                    keyProperty: 'key',
                    rawData: [
                        {
                            key: 1,
                            parent: null,
                            node: true,
                        },
                        {
                            key: 2,
                            parent: null,
                            node: true,
                        },
                        {
                            key: 3,
                            parent: null,
                            node: true,
                        },
                    ],
                }),
                root: null,
                keyProperty: 'key',
                parentProperty: 'parent',
                nodeProperty: 'node',
                columns: [],
                expandedItems: [],
                collapsedItems: [],
            });

            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: null,
                model,
                selectionType: 'all',
                selectionCountMode: 'all',
                recursiveSelection: false,
                entryPath: [],
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });

            const selection = { selected: [1, 2, 3], excluded: [] };
            expect(
                strategy.isAllSelected(selection, false, 3, null, true)
            ).toBe(true);
        });

        it('selected all root items by one, one node is expanded', () => {
            const model = new TreeGridCollection({
                collection: new RecordSet({
                    keyProperty: 'key',
                    rawData: [
                        {
                            key: 1,
                            parent: null,
                            node: true,
                        },
                        {
                            key: 11,
                            parent: 1,
                            node: true,
                        },
                        {
                            key: 2,
                            parent: null,
                            node: true,
                        },
                        {
                            key: 3,
                            parent: null,
                            node: true,
                        },
                    ],
                }),
                root: null,
                keyProperty: 'key',
                parentProperty: 'parent',
                nodeProperty: 'node',
                columns: [],
                expandedItems: [1],
                collapsedItems: [],
            });

            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: null,
                model,
                selectionType: 'all',
                selectionCountMode: 'all',
                recursiveSelection: false,
                entryPath: [],
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });

            const selection = { selected: [1, 2, 3], excluded: [] };
            expect(
                strategy.isAllSelected(selection, false, 4, null, true)
            ).toBe(true);
        });

        it('selected all and has partial selected node', () => {
            const collection = new RecordSet({
                keyProperty: 'key',
                rawData: [
                    {
                        key: 1,
                        parent: null,
                        node: true,
                    },
                    {
                        key: 11,
                        parent: 1,
                        node: true,
                    },
                    {
                        key: 12,
                        parent: 1,
                        node: true,
                    },
                    {
                        key: 2,
                        parent: null,
                        node: true,
                    },
                    {
                        key: 3,
                        parent: null,
                        node: true,
                    },
                ],
            });

            const model = new TreeGridCollection({
                collection,
                root: null,
                keyProperty: 'key',
                parentProperty: 'parent',
                nodeProperty: 'node',
                columns: [],
                expandedItems: [],
                collapsedItems: [],
            });

            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: null,
                model,
                selectionType: 'all',
                selectionCountMode: 'all',
                recursiveSelection: false,
                entryPath: [],
            });

            const selection = { selected: [null], excluded: [null, 11] };
            expect(
                strategy.isAllSelected(selection, false, 5, null, true)
            ).toBe(false);
        });
    });

    describe('selectionType', () => {
        describe('leaf', () => {
            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: null,
                model,
                selectionType: 'leaf',
                recursiveSelection: false,
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });

            it('select', () => {
                let result = strategy.select({ selected: [], excluded: [] }, 1);
                expect(result).toEqual({ selected: [], excluded: [] });

                result = strategy.select({ selected: [], excluded: [] }, 7);
                expect(result).toEqual({ selected: [7], excluded: [] });
            });

            it('unselect', () => {
                let result = strategy.unselect(
                    { selected: [1], excluded: [] },
                    1
                );
                expect(result).toEqual({ selected: [1], excluded: [] });

                result = strategy.unselect({ selected: [7], excluded: [] }, 7);
                expect(result).toEqual({ selected: [], excluded: [] });
            });

            it('getSelectionForModel', () => {
                const selection = { selected: [null], excluded: [null] };
                const res = strategy.getSelectionForModel(selection);
                expect(toArrayKeys(res.get(true))).toEqual([4, 5, 7]);
                expect(toArrayKeys(res.get(null))).toEqual([]);
                expect(toArrayKeys(res.get(false))).toEqual([1, 2, 3, 6]);
            });

            it('with readonly items', () => {
                const data = ListData.getItems();
                data[3].checkboxState = false;

                const model = new Tree({
                    collection: new RecordSet({
                        keyProperty: ListData.KEY_PROPERTY,
                        rawData: data,
                    }),
                    root: new Model({
                        rawData: { id: null },
                        keyProperty: ListData.KEY_PROPERTY,
                    }),
                    keyProperty: ListData.KEY_PROPERTY,
                    parentProperty: ListData.PARENT_PROPERTY,
                    nodeProperty: ListData.NODE_PROPERTY,
                    hasChildrenProperty: ListData.HAS_CHILDREN_PROPERTY,
                    multiSelectAccessibilityProperty: 'checkboxState',
                });

                const strategy = new TreeSelectionStrategy({
                    selectDescendants: true,
                    selectAncestors: true,
                    rootKey: null,
                    model,
                    selectionType: 'leaf',
                    recursiveSelection: false,
                    hasMoreUtil: () => {
                        return false;
                    },
                    isLoadedUtil: () => {
                        return true;
                    },
                });

                const selection = { selected: [null], excluded: [null] };
                const res = strategy.getSelectionForModel(selection);
                expect(toArrayKeys(res.get(true))).toEqual([4, 5, 7]);
                expect(toArrayKeys(res.get(null))).toEqual([]);
                expect(toArrayKeys(res.get(false))).toEqual([1, 2, 3, 6]);
            });

            it('selectAll', () => {
                const result = strategy.selectAll({
                    selected: [],
                    excluded: [],
                });
                expect(result).toEqual({ selected: [null], excluded: [null] });
            });
        });

        describe('node', () => {
            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: null,
                model,
                selectionType: 'node',
                recursiveSelection: false,
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });

            it('select', () => {
                let result = strategy.select({ selected: [], excluded: [] }, 1);
                expect(result).toEqual({ selected: [1], excluded: [] });

                result = strategy.select({ selected: [], excluded: [] }, 7);
                expect(result).toEqual({ selected: [], excluded: [] });
            });

            it('unselect', () => {
                let result = strategy.unselect(
                    { selected: [1], excluded: [] },
                    1
                );
                expect(result).toEqual({ selected: [], excluded: [] });

                result = strategy.unselect({ selected: [7], excluded: [] }, 7);
                expect(result).toEqual({ selected: [7], excluded: [] });
            });

            it('getSelectionForModel', () => {
                const selection = { selected: [null], excluded: [null] };
                const res = strategy.getSelectionForModel(selection);
                expect(toArrayKeys(res.get(true))).toEqual([1, 2, 3, 6]);
                expect(toArrayKeys(res.get(null))).toEqual([]);
                expect(toArrayKeys(res.get(false))).toEqual([4, 5, 7]);
            });

            it('with readonly items', () => {
                const data = ListData.getItems();
                data[0].checkboxState = false;

                const model = new Tree({
                    collection: new RecordSet({
                        keyProperty: ListData.KEY_PROPERTY,
                        rawData: data,
                    }),
                    root: new Model({
                        rawData: { id: null },
                        keyProperty: ListData.KEY_PROPERTY,
                    }),
                    keyProperty: ListData.KEY_PROPERTY,
                    parentProperty: ListData.PARENT_PROPERTY,
                    nodeProperty: ListData.NODE_PROPERTY,
                    hasChildrenProperty: ListData.HAS_CHILDREN_PROPERTY,
                    multiSelectAccessibilityProperty: 'checkboxState',
                });

                const strategy = new TreeSelectionStrategy({
                    selectDescendants: true,
                    selectAncestors: true,
                    rootKey: null,
                    model,
                    selectionType: 'node',
                    recursiveSelection: false,
                    hasMoreUtil: () => {
                        return false;
                    },
                    isLoadedUtil: () => {
                        return true;
                    },
                });

                const selection = { selected: [null], excluded: [null] };
                const res = strategy.getSelectionForModel(selection);
                expect(toArrayKeys(res.get(true))).toEqual([1, 2, 3, 6]);
                expect(toArrayKeys(res.get(null))).toEqual([]);
                expect(toArrayKeys(res.get(false))).toEqual([4, 5, 7]);
            });
        });

        describe('allBySelectAction', () => {
            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: null,
                model,
                selectionType: 'allBySelectAction',
                recursiveSelection: false,
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });

            it('should select any item', () => {
                let result = strategy.select({ selected: [], excluded: [] }, 1);
                expect(result).toEqual({ selected: [1], excluded: [] });

                result = strategy.select({ selected: [], excluded: [] }, 7);
                expect(result).toEqual({ selected: [7], excluded: [] });
            });
        });
    });

    describe('recursiveSelection', () => {
        describe('leaf', () => {
            const strategy = new TreeSelectionStrategy({
                selectDescendants: true,
                selectAncestors: true,
                rootKey: null,
                model,
                selectionType: 'leaf',
                recursiveSelection: true,
                hasMoreUtil: () => {
                    return false;
                },
                isLoadedUtil: () => {
                    return true;
                },
            });

            it('select', () => {
                let result = strategy.select({ selected: [], excluded: [] }, 1);
                expect(result).toEqual({ selected: [1], excluded: [] });

                result = strategy.select({ selected: [], excluded: [] }, 7);
                expect(result).toEqual({ selected: [7], excluded: [] });
            });

            it('unselect', () => {
                let result = strategy.unselect(
                    { selected: [1], excluded: [] },
                    1
                );
                expect(result).toEqual({ selected: [], excluded: [] });

                result = strategy.unselect({ selected: [7], excluded: [] }, 7);
                expect(result).toEqual({ selected: [], excluded: [] });
            });

            it('getSelectionForModel', () => {
                const selection = { selected: [null], excluded: [null] };
                const res = strategy.getSelectionForModel(selection);
                expect(toArrayKeys(res.get(true))).toEqual([
                    1, 2, 3, 4, 5, 6, 7,
                ]);
                expect(toArrayKeys(res.get(null))).toEqual([]);
                expect(toArrayKeys(res.get(false))).toEqual([]);
            });

            it('with readonly items', () => {
                const data = ListData.getItems();
                data[3].checkboxState = false;

                const model = new Tree({
                    collection: new RecordSet({
                        keyProperty: ListData.KEY_PROPERTY,
                        rawData: data,
                    }),
                    root: new Model({
                        rawData: { id: null },
                        keyProperty: ListData.KEY_PROPERTY,
                    }),
                    keyProperty: ListData.KEY_PROPERTY,
                    parentProperty: ListData.PARENT_PROPERTY,
                    nodeProperty: ListData.NODE_PROPERTY,
                    hasChildrenProperty: ListData.HAS_CHILDREN_PROPERTY,
                    multiSelectAccessibilityProperty: 'checkboxState',
                });

                const strategy = new TreeSelectionStrategy({
                    selectDescendants: true,
                    selectAncestors: true,
                    rootKey: null,
                    model,
                    selectionType: 'leaf',
                    recursiveSelection: true,
                    hasMoreUtil: () => {
                        return false;
                    },
                    isLoadedUtil: () => {
                        return true;
                    },
                });

                const selection = { selected: [2], excluded: [] };
                const res = strategy.getSelectionForModel(selection);
                expect(toArrayKeys(res.get(true))).toEqual([2, 3, 4]);
                expect(toArrayKeys(res.get(null))).toEqual([1]);
                expect(toArrayKeys(res.get(false))).toEqual([5, 6, 7]);
            });
        });
    });

    describe('check validation of options', () => {
        describe('selectionCountMode=leaf', () => {
            it('selectionType=node, recursiveSelection=false', () => {
                let throwedError = false;
                try {
                    const strategy = new TreeSelectionStrategy({
                        selectDescendants: true,
                        selectAncestors: true,
                        rootKey: null,
                        model,
                        entryPath: [],
                        selectionType: 'node',
                        selectionCountMode: 'leaf',
                        recursiveSelection: false,
                        hasMoreUtil: () => {
                            return false;
                        },
                        isLoadedUtil: () => {
                            return true;
                        },
                    });
                } catch (e) {
                    throwedError = true;
                }
                expect(throwedError).toBe(true);
            });

            it('selectionType=node, recursiveSelection=true', () => {
                let throwedError = false;
                try {
                    const strategy = new TreeSelectionStrategy({
                        selectDescendants: true,
                        selectAncestors: true,
                        rootKey: null,
                        model,
                        entryPath: [],
                        selectionType: 'node',
                        selectionCountMode: 'leaf',
                        recursiveSelection: true,
                        hasMoreUtil: () => {
                            return false;
                        },
                        isLoadedUtil: () => {
                            return true;
                        },
                    });
                } catch (e) {
                    throwedError = true;
                }
                expect(throwedError).toBe(false);
            });
        });

        describe('selectionCountMode=node', () => {
            it('selectionType=leaf', () => {
                let throwedError = false;
                try {
                    const strategy = new TreeSelectionStrategy({
                        selectDescendants: true,
                        selectAncestors: true,
                        rootKey: null,
                        model,
                        entryPath: [],
                        selectionType: 'leaf',
                        selectionCountMode: 'node',
                        recursiveSelection: false,
                        hasMoreUtil: () => {
                            return false;
                        },
                        isLoadedUtil: () => {
                            return true;
                        },
                    });
                } catch (e) {
                    throwedError = true;
                }
                expect(throwedError).toBe(true);
            });
        });
    });
});
