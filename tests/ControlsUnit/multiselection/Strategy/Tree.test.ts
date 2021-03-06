/* tslint:disable:object-literal-key-quotes no-string-literal */
// tslint:disable:no-magic-numbers

import { assert } from 'chai';
import { TreeSelectionStrategy } from 'Controls/multiselection';
import { Model } from 'Types/entity';
import * as ListData from 'ControlsUnit/ListData';
import { RecordSet } from 'Types/collection';
import { Tree, TreeItem } from 'Controls/display';
import GroupItem from 'Controls/_display/GroupItem';
import { SearchGridCollection } from 'Controls/searchBreadcrumbsGrid';
import TreeGridCollection from "Controls/_treeGrid/display/TreeGridCollection";

describe('Controls/_multiselection/SelectionStrategy/Tree', () => {
   const model = new Tree({
      collection: new RecordSet({
         keyProperty: ListData.KEY_PROPERTY,
         rawData: ListData.getItems()
      }),
      root: new Model({ rawData: { id: null }, keyProperty: ListData.KEY_PROPERTY }),
      keyProperty: ListData.KEY_PROPERTY,
      parentProperty: ListData.PARENT_PROPERTY,
      nodeProperty: ListData.NODE_PROPERTY,
      hasChildrenProperty: ListData.HAS_CHILDREN_PROPERTY
   });

   const strategy = new TreeSelectionStrategy({
      selectDescendants: false,
      selectAncestors: false,
      rootId: null,
      model: model,
      selectionType: 'all',
      recursiveSelection: false
   });

   const strategyWithDescendantsAndAncestors = new TreeSelectionStrategy({
      selectDescendants: true,
      selectAncestors: true,
      rootId: null,
      model: model,
      selectionType: 'all',
      recursiveSelection: false
   });

   function toArrayKeys(array: TreeItem<Model>[]): number[] {
      return array.map((el) => el.key).sort((e1, e2) => e1 < e2 ? -1 : 1);
   }

   beforeEach(() => {
      strategy._rootId = null;
      strategyWithDescendantsAndAncestors._rootId = null;
      strategy.setEntryPath(undefined);
   });

   describe('select', () => {
      it('not selected', () => {
         let selection = { selected: [], excluded: [] };
         selection = strategy.select(selection, 6);
         assert.deepEqual(selection.selected, [6]);
         assert.deepEqual(selection.excluded, []);

         selection = { selected: [], excluded: [] };
         selection = strategy.select(selection, 1);
         assert.deepEqual(selection.selected, [1]);
         assert.deepEqual(selection.excluded, []);

         selection = { selected: [], excluded: [] };
         selection = strategy.select(selection, 2);
         assert.deepEqual(selection.selected, [2]);
         assert.deepEqual(selection.excluded, []);

         selection = { selected: [], excluded: [2] };
         selection = strategy.select(selection, 2);
         assert.deepEqual(selection.selected, []);
         assert.deepEqual(selection.excluded, []);
      });

      it('has selected', () => {
         let selection = { selected: [3, 4], excluded: [] };
         selection = strategyWithDescendantsAndAncestors.select(selection, 2);
         assert.deepEqual(selection.selected, [2]);
         assert.deepEqual(selection.excluded, []);

         selection = { selected: [3, 4], excluded: [] };
         selection = strategy.select(selection, 2);
         assert.deepEqual(selection.selected, [3, 4, 2]);
         assert.deepEqual(selection.excluded, []);
      });
   });

   describe('unselect', () => {
      it('selected node', () => {
         // ???????????? ????????, ?? ?????????????? ?????????????? ????????
         let selection = { selected: [2, 3], excluded: [] };
         selection = strategy.unselect(selection, 2);
         assert.deepEqual(selection.selected, [3]);
         assert.deepEqual(selection.excluded, []);

         // ???????????? ????????, ?? ?????????????? ?????????????? ????????
         selection = { selected: [2, 3], excluded: [] };
         selection = strategyWithDescendantsAndAncestors.unselect(selection, 2);
         assert.deepEqual(selection.selected, []);
         assert.deepEqual(selection.excluded, []);

         // ???????????? ????????, ?? ?????????????? ?????????????????? ????????
         selection = { selected: [2], excluded: [3] };
         selection = strategyWithDescendantsAndAncestors.unselect(selection, 2);
         assert.deepEqual(selection.selected, []);
         assert.deepEqual(selection.excluded, []);

         // ???????????? ????????, ?? ?????????????? ?????????????????? ????????
         selection = { selected: [2], excluded: [3] };
         selection = strategy.unselect(selection, 2);
         assert.deepEqual(selection.selected, []);
         assert.deepEqual(selection.excluded, []);

         // ???????????? ???????? ?????? ?????????????????? ?? ??????????
         selection = { selected: [6], excluded: [] };
         selection = strategy.unselect(selection, 6);
         assert.deepEqual(selection.selected, []);
         assert.deepEqual(selection.excluded, []);

         // ???????????? ???????? ???? ?????????? ????????????
         selection = { selected: [2], excluded: [] };
         selection = strategyWithDescendantsAndAncestors.unselect(selection, 3);
         assert.deepEqual(selection.selected, [2]);
         assert.deepEqual(selection.excluded, [3]);

         // ?????????????? ?????????? ?? ???????????????????? ??????????????
         selection = { selected: [2], excluded: [3] };
         selection = strategyWithDescendantsAndAncestors.unselect(selection, 4);
         assert.deepEqual(selection.selected, []);
         assert.deepEqual(selection.excluded, []);

         // ?????? ???????????? ???????????? ?? ???????????????????? ???????????????????? ??????????????, ?????????????? ?????????? ???? ???????? ??????????????????
         selection = { selected: [1, 2], excluded: [3, 5] };
         selection = strategyWithDescendantsAndAncestors.unselect(selection, 4);
         assert.deepEqual(selection.selected, []);
         assert.deepEqual(selection.excluded, []);
      });

      it('selected all', () => {
         let selection = { selected: [null], excluded: [null] };
         selection = strategyWithDescendantsAndAncestors.unselect(selection, 4);
         assert.deepEqual(selection.selected, [null]);
         assert.deepEqual(selection.excluded, [null, 4]);
      });

      it('unselect child', () => {
         // ?????????? ?????????? ?? ???????????????????? ???????????????? ??????????????, ???? ?????????????? ???????????????????????? ?????????????? ????????????
         let selection = { selected: [1, 3], excluded: [4] };
         selection = strategyWithDescendantsAndAncestors.unselect(selection, 5);
         assert.deepEqual(selection.selected, [1, 3]);
         assert.deepEqual(selection.excluded, [4, 5]);

         // ?????????? ?????????? ?? ?????????????? ?????????????? (???????????????? ?????????????????????? ???????????????? ?????????????????? ??????????)
         selection = strategyWithDescendantsAndAncestors.unselect(selection, 3);
         assert.deepEqual(selection.selected, []);
         assert.deepEqual(selection.excluded, []);
      });

      it('with entry path', () => {
         strategy.setEntryPath([
            {id: 3, parent: 2},
            {id: 2, parent: 1},
            {id: 1, parent: null}
         ]);

         const result = strategy.unselect({selected: [3], excluded: []}, 3);
         assert.deepEqual(result, {selected: [], excluded: []});
      });

      it('clear entry path', () => {
         const entryPath = [
            {id: 2, parent: 1},
            {id: 1, parent: null}
         ];
         strategyWithDescendantsAndAncestors.setEntryPath(entryPath);

         const result = strategyWithDescendantsAndAncestors.unselect({selected: [2], excluded: []}, 1);
         assert.deepEqual(result, {selected: [], excluded: []});
         assert.deepEqual(entryPath, [{id: 1, parent: null}]);
      });

      it('unselect last node with childs when all is selected', () => {
         const items = new RecordSet({
            rawData: [
               {id: 1, parent: null, node: null},
               {id: 11, parent: 1, node: null},
               {id: 12, parent: 1, node: null}
            ],
            keyProperty: 'id'
         });
         const model = new Tree({
            collection: items,
            root: null,
            keyProperty: 'id',
            parentProperty: 'parent',
            nodeProperty: 'node',
            expandedItems: [null]
         });
         const strategy = new TreeSelectionStrategy({
            selectDescendants: true,
            selectAncestors: true,
            rootId: null,
            model,
            selectionType: 'all',
            recursiveSelection: false
         });

         const newSelection = strategy.unselect({ selected: [null], excluded: [null] }, 1);
         assert.deepEqual(newSelection, {selected: [], excluded: []});
      });
   });

   describe('selectAll', () => {
      it('not selected', () => {
         // ?????????????? ?????? ?? ???????????????? ????????
         let selection = { selected: [], excluded: [] };
         selection = strategy.selectAll(selection);
         assert.deepEqual(selection.selected, [null]);
         assert.deepEqual(selection.excluded, [null]);

         // ?????????????????????? ?? ???????? 2 ?? ?????????????? ??????
         strategy._rootId = 2;
         selection = { selected: [], excluded: [] };
         selection = strategy.selectAll(selection);
         assert.deepEqual(selection.selected, [2]);
         assert.deepEqual(selection.excluded, [2]);
      });

      it('selected one', () => {
         let selection = { selected: [1], excluded: [] };
         selection = strategy.selectAll(selection);
         assert.deepEqual(selection.selected, [null]);
         assert.deepEqual(selection.excluded, [null]);
      });

      it('selected all, but one', () => {
         let selection = { selected: [null], excluded: [null, 2] };
         selection = strategy.selectAll(selection);
         assert.deepEqual(selection.selected, [null]);
         assert.deepEqual(selection.excluded, [null]);
      });

      it('select all after change root', () => {
         strategy.update({
            selectDescendants: false,
            selectAncestors: false,
            rootId: 5,
            selectionType: 'all',
            model,
            recursiveSelection: false
         });
         let selection = { selected: [2], excluded: [] };
         selection = strategy.selectAll(selection);
         assert.deepEqual(selection.selected, [5]);
         assert.deepEqual(selection.excluded, [5]);
         strategy.reset();
      });
   });

   describe('unselectAll', () => {
      it('without ENTRY_PATH', () => {
         let selection = { selected: [1, 6], excluded: [3, 5] };
         selection = strategy.unselectAll(selection);
         assert.deepEqual(selection.selected, []);
         assert.deepEqual(selection.excluded, []);
      });

      it('with ENTRY_PATH', () => {
         // ???????? ???????? ENTRY_PATH ???? ?????????????????? ???????????? ?????????????? ???????????? ?? ?????? ????????
         strategy._entryPath = [{}];
         strategy._rootId = 2;
         let selection = { selected: [2, 5], excluded: [2, 3] };
         selection = strategy.unselectAll(selection);
         assert.deepEqual(selection.selected, [5]);
         assert.deepEqual(selection.excluded, []);
      });

      it('with empty ENTRY_PATH', () => {
         // ???????? ???????? ENTRY_PATH ???? ?????????????????? ???????????? ?????????????? ???????????? ?? ?????? ????????
         strategy._entryPath = [];
         strategy._rootId = 2;
         let selection = { selected: [2, 5], excluded: [2, 3] };
         selection = strategy.unselectAll(selection);
         assert.deepEqual(selection.selected, []);
         assert.deepEqual(selection.excluded, []);
      });
   });

   describe('toggleAll', () => {
      it('selected current node', () => {
         strategy._rootId = 2;
         let selection = { selected: [2], excluded: [2] };
         selection = strategy.toggleAll(selection);
         assert.deepEqual(selection.selected, []);
         assert.deepEqual(selection.excluded, []);
      });

      it('selected some items', () => {
         let selection = { selected: [1, 5], excluded: [] };
         selection = strategy.toggleAll(selection);
         assert.deepEqual(selection.selected, [null]);
         assert.deepEqual(selection.excluded, [null, 1, 5]);
      });

      it('selected all, but few', () => {
         let selection = { selected: [null], excluded: [null, 2] };
         selection = strategy.toggleAll(selection);
         assert.deepEqual(selection.selected, [2]);
         assert.deepEqual(selection.excluded, []);
      });

      it('toggleAll after select all by one', () => {
         let selection = { selected: [1, 2, 3, 4, 5, 6, 7], excluded: [] };

         selection = strategy.unselect(selection, 2);

         assert.deepEqual(selection.selected, [1, 3, 4, 5, 6, 7]);
         assert.deepEqual(selection.excluded, []);

         selection = strategy.toggleAll(selection);

         assert.deepEqual(selection.selected, [null]);
         assert.deepEqual(selection.excluded, [null, 1, 3, 4, 5, 6, 7]);
      });

      it('toggleAll after select all by one in root', () => {
         let selection = { selected: [1, 2, 3, 4, 5, 6, 7], excluded: [] };

         selection = strategy.toggleAll(selection);

         assert.deepEqual(selection.selected, []);
         assert.deepEqual(selection.excluded, []);
      });

      it('selected not loaded item', () => {
         let selection = { selected: [20], excluded: [] };
         selection = strategy.toggleAll(selection, true);

         assert.deepEqual(selection.selected, [null]);
         assert.deepEqual(selection.excluded, [null, 20]);
      });

      it('after change root', () => {
         strategy.update({
            selectDescendants: false,
            selectAncestors: false,
            rootId: 2,
            selectionType: 'all',
            model,
            recursiveSelection: false
         });
         let selection = { selected: [6, 3], excluded: [] };
         selection = strategy.toggleAll(selection);
         assert.deepEqual(selection.selected, [2]);
         assert.deepEqual(selection.excluded, [2, 3]);
         strategy.reset();
      });

      it('when selected childs in collapsed node', () => {
         const model = new TreeGridCollection({
            collection: new RecordSet({
               keyProperty: ListData.KEY_PROPERTY,
               rawData: ListData.getItems()
            }),
            root: null,
            keyProperty: ListData.KEY_PROPERTY,
            parentProperty: ListData.PARENT_PROPERTY,
            nodeProperty: ListData.NODE_PROPERTY,
            hasChildrenProperty: ListData.HAS_CHILDREN_PROPERTY,
            columns: [],
            expandedItems: [null],
            collapsedItems: [null, 2]
         });

         const strategy = new TreeSelectionStrategy({
            selectDescendants: true,
            selectAncestors: true,
            rootId: null,
            model,
            selectionType: 'all',
            recursiveSelection: false
         });
         let selection = { selected: [3, 4], excluded: [] };
         selection = strategy.toggleAll(selection, false);

         assert.deepEqual(selection.selected, [null]);
         assert.deepEqual(selection.excluded, [null, 3, 4]);

         selection = strategy.toggleAll(selection, false);
         assert.deepEqual(selection.selected, [3, 4]);
         assert.deepEqual(selection.excluded, []);
      });
   });

   describe('selectRange', () => {
      it('without expanded nodes', () => {
         let selection = strategy.selectRange(model.getItems());
         assert.deepEqual(selection.selected, [1, 2, 3, 4, 5, 6, 7]);
         assert.deepEqual(selection.excluded, []);
      });
      it('with expanded nodes', () => {
         const items = model.getItems();
         items[0].setExpanded(true);
         items[1].setNode(true);
         items[1].setExpanded(true);
         let selection = strategy.selectRange(items);
         assert.deepEqual(selection.selected, [3, 4, 5, 6, 7]);
         assert.deepEqual(selection.excluded, []);
      });
   });

   describe('getSelectionForModel', () => {
      it('not selected', () => {
         const selection = { selected: [], excluded: [] };
         const res = strategy.getSelectionForModel(selection);
         assert.deepEqual(toArrayKeys(res.get(true)), []);
         assert.deepEqual(toArrayKeys(res.get(null)), []);
         assert.deepEqual(toArrayKeys(res.get(false)), [1, 2, 3, 4, 5, 6, 7]);
      });

      it('selected one', () => {
         // ?????????????? ???????????? ???????? ?? ?????????????????? ?????? ?????? ????????????????
         let selection = { selected: [3], excluded: [] };
         let res = strategyWithDescendantsAndAncestors.getSelectionForModel(selection);
         assert.deepEqual(toArrayKeys(res.get(true)), [3]);
         assert.deepEqual(toArrayKeys(res.get(null)), [1, 2]);
         assert.deepEqual(toArrayKeys(res.get(false)), [4, 5, 6, 7] );

         // ?????????????? ???????? ?? ???????????????? ???????????? ????
         selection = { selected: [3], excluded: [] };
         res = strategy.getSelectionForModel(selection);
         assert.deepEqual(toArrayKeys(res.get(true)), [3]);
         assert.deepEqual(toArrayKeys(res.get(null)), []);
         assert.deepEqual(toArrayKeys(res.get(false)), [1, 2, 4, 5, 6, 7] );

         // ?????????????? ???????? ?? ???????????????????? ?? ?? ????????????, ???????????????? ????????, ???????? ?? ????????????????
         selection = { selected: [2], excluded: [] };
         res = strategyWithDescendantsAndAncestors.getSelectionForModel(selection);
         assert.deepEqual(toArrayKeys(res.get(true)), [2, 3, 4] );
         assert.deepEqual(toArrayKeys(res.get(null)), [1]);
         assert.deepEqual(toArrayKeys(res.get(false)), [5, 6, 7] );

         // ?????????????? ???????? ?? ???????????????????? ?? ?? ????????????, ???????????????? ???????????? ????????
         selection = { selected: [2], excluded: [] };
         res = strategy.getSelectionForModel(selection);
         assert.deepEqual(toArrayKeys(res.get(true)), [2] );
         assert.deepEqual(toArrayKeys(res.get(null)), []);
         assert.deepEqual(toArrayKeys(res.get(false)), [1, 3, 4, 5, 6, 7] );

         // ?????????????? ???????? ?? ???????????????????? ?? ?? ???????????? ?? ?????????????????? ???????? ??????????????????
         selection = { selected: [2], excluded: [3] };
         res = strategyWithDescendantsAndAncestors.getSelectionForModel(selection);
         assert.deepEqual(toArrayKeys(res.get(true)), [ 4 ] );
         assert.deepEqual(toArrayKeys(res.get(null)), [ 1, 2 ]);
         assert.deepEqual(toArrayKeys(res.get(false)), [3, 5, 6, 7] );
      });

      it('selected all, but one', () => {
         const selection = { selected: [null], excluded: [null, 2] };
         let res = strategy.getSelectionForModel(selection);
         assert.deepEqual(toArrayKeys(res.get(true)), [1, 3, 4, 5, 6, 7] );
         assert.deepEqual(toArrayKeys(res.get(null)), []);
         assert.deepEqual(toArrayKeys(res.get(false)), [2]);

         res = strategyWithDescendantsAndAncestors.getSelectionForModel(selection);
         assert.deepEqual(toArrayKeys(res.get(true)), [5, 6, 7] );
         assert.deepEqual(toArrayKeys(res.get(null)), [1]);
         assert.deepEqual(toArrayKeys(res.get(false)), [2, 3, 4]);
      });

      it('selected unloaded item', () => {
          const treeStrategyWithRootItems = new TreeSelectionStrategy({
              selectDescendants: true,
              selectAncestors: true,
              rootId: null,
              model: model,
             selectionType: 'all',
             recursiveSelection: false
          });
          const entryPath = [
              {parent: 6, id: 10},
              {parent: 6, id: 11}
          ];
          const selection = {
             selected: [10],
             excluded: []
          };
          treeStrategyWithRootItems._entryPath = entryPath;
          const result = treeStrategyWithRootItems.getSelectionForModel(selection);
          const unselectedKeys = toArrayKeys(result.get(false));
          const hasSelectedItems = !!result.get(true).length;
          const nullStateKeys = toArrayKeys(result.get(null));
          assert.deepEqual(unselectedKeys, [1, 2, 3, 4, 5, 7]);
          assert.isFalse(hasSelectedItems);
          assert.deepEqual(nullStateKeys, [6]);
      });

      it('selected node use selectAll and go to parent node', () => {
         const selection = {selected: [1], excluded: [1]};
         let res = strategyWithDescendantsAndAncestors.getSelectionForModel(selection);
         assert.deepEqual(toArrayKeys(res.get(true)), [1, 2, 3, 4, 5] );
         assert.deepEqual(toArrayKeys(res.get(null)), []);
         assert.deepEqual(toArrayKeys(res.get(false)), [6, 7] );

         res = strategy.getSelectionForModel(selection);
         assert.deepEqual(toArrayKeys(res.get(true)), [] );
         assert.deepEqual(toArrayKeys(res.get(null)), []);
         assert.deepEqual(toArrayKeys(res.get(false)), [1, 2, 3, 4, 5, 6, 7] );
      });

      it('with group and search value', () => {
         // ???????? ?????????? searchValue, ???? ???? ???????????? ???????????????????? ????????. ???????????? ???????????? ?????? ??????????????????

         const selection = {selected: [null], excluded: [null]};

         const items = model.getItems();
         items.push(new GroupItem({}));

         const res = strategy.getSelectionForModel(selection, null, items, 'asdas');
         assert.deepEqual(toArrayKeys(res.get(true)), [4, 5, 7]);
         assert.deepEqual(toArrayKeys(res.get(null)), [1, 2, 3, 6]);
         assert.deepEqual(toArrayKeys(res.get(false)), []);
      });

      it('go to deep nodes in explorer with ENTRY_PATH', () => {
         const items = new RecordSet({
            rawData: [
                {id: 111, parent: 11, node: null},
                {id: 112, parent: 11, node: null}
            ],
            keyProperty: 'id'
         });
         const model = new Tree({
            collection: items,
            root: 11,
            keyProperty: 'id',
            parentProperty: 'parent',
            nodeProperty: 'node'
         });
         const strategy = new TreeSelectionStrategy({
            selectDescendants: true,
            selectAncestors: true,
            rootId: 11,
            model,
            selectionType: 'all',
            recursiveSelection: false,
            entryPath: [
               {id: 1,  parent: null},
               {id: 11, parent: 1}
            ]
         });

         let res = strategy.getSelectionForModel({selected: [1], excluded: [112]});
         assert.deepEqual(toArrayKeys(res.get(true)), [111]);
         assert.deepEqual(toArrayKeys(res.get(false)), [112]);
         assert.deepEqual(toArrayKeys(res.get(null)), []);
      });

      it('unselect item from ENTRY_PATH', () => {
         const items = new RecordSet({
            rawData: [
               {id: 1, parent: null, node: null},
               {id: 2, parent: null, node: null}
            ],
            keyProperty: 'id'
         });
         const model = new Tree({
            collection: items,
            root: null,
            keyProperty: 'id',
            parentProperty: 'parent',
            nodeProperty: 'node'
         });
         const strategy = new TreeSelectionStrategy({
            selectDescendants: true,
            selectAncestors: true,
            rootId: null,
            model,
            selectionType: 'all',
            recursiveSelection: false,
            entryPath: [
               {id: 1, parent: null}
            ]
         });

         let res = strategy.getSelectionForModel({selected: [], excluded: []});
         assert.deepEqual(toArrayKeys(res.get(true)), []);
         assert.deepEqual(toArrayKeys(res.get(false)), [1, 2]);
         assert.deepEqual(toArrayKeys(res.get(null)), []);
      });

      it('select item in current root and get ENTRY_PATH for it, recordset not has parents', () => {
         const items = new RecordSet({
            rawData: [
               {id: 3, parent: 2, node: null},
               {id: 4, parent: 2, node: null},
               {id: 5, parent: 2, node: null}
            ],
            keyProperty: 'id'
         });
         const model = new Tree({
            collection: items,
            root: 2,
            keyProperty: 'id',
            parentProperty: 'parent',
            nodeProperty: 'node'
         });
         const strategy = new TreeSelectionStrategy({
            selectDescendants: true,
            selectAncestors: true,
            rootId: 2,
            model,
            selectionType: 'all',
            recursiveSelection: false,
            entryPath: [
               {id: 1, parent: null},
               {id: 2, parent: 1},
               {id: 3, parent: 2}
            ]
         });

         const res = strategy.getSelectionForModel({selected: [3], excluded: []});
         assert.deepEqual(toArrayKeys(res.get(true)), [3]);
         assert.deepEqual(toArrayKeys(res.get(false)), [4, 5]);
         assert.deepEqual(toArrayKeys(res.get(null)), []);
      });

      it('with limit', () => {
         const selection = { selected: [null], excluded: [null] };
         let res = strategy.getSelectionForModel(selection, 3);
         assert.deepEqual(toArrayKeys(res.get(true)), [1, 2, 3] );
         assert.deepEqual(toArrayKeys(res.get(null)), []);
         assert.deepEqual(toArrayKeys(res.get(false)), [4, 5, 6, 7]);
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
            rawData: [{
               id: 1,
               parent: null,
               nodeType: true,
               title: 'test_node1'
            }, {
               id: 11,
               parent: 1,
               nodeType: null,
               title: 'test_leaf11'
            }, {
               id: 12,
               parent: 1,
               nodeType: null,
               title: 'test_leaf12'
            },
            {
               id: 2,
               parent: null,
               nodeType: true,
               title: 'test_node2'
            }, {
               id: 21,
               parent: 2,
               nodeType: null,
               title: 'test_leaf21'
            }, {
               id: 22,
               parent: 2,
               nodeType: null,
               title: 'test_leaf22'
            }],
            keyProperty: 'id'
         });

         const searchModel = new SearchGridCollection({
            collection: items,
            root: null,
            keyProperty: 'id',
            parentProperty: 'parent',
            nodeProperty: 'nodeType',
            columns: [{}]
         });

         const strategy = new TreeSelectionStrategy({
            selectDescendants: true,
            selectAncestors: true,
            rootId: null,
            model: searchModel,
            selectionType: 'all',
            recursiveSelection: false
         });

         let res = strategy.getSelectionForModel({selected: [null], excluded: [null]}, undefined, undefined, 'sad');
         assert.deepEqual(toArrayKeys(res.get(true)), [11, 12, 21, 22]);
         assert.deepEqual(toArrayKeys(res.get(null)), [1, 2]);
         assert.deepEqual(toArrayKeys(res.get(false)), []);

         // ???????????????????? ?????????????????? ?????????????? ????????????, ?????????? ?????????? ?????????????? ?? ???????????? ???? ???? ??????????
         res = strategy.getSelectionForModel({selected: [null], excluded: [null, 11, 12]}, undefined, undefined, 'sad');
         assert.deepEqual(toArrayKeys(res.get(true)), [21, 22]);
         assert.deepEqual(toArrayKeys(res.get(null)), [1, 2]);
         assert.deepEqual(toArrayKeys(res.get(false)), [11, 12]);

         // ???????????????????? ?????????????? ????????????
         res = strategy.getSelectionForModel({selected: [2], excluded: []}, undefined, undefined, 'sad');
         assert.deepEqual(toArrayKeys(res.get(true)), [2, 21, 22]);
         assert.deepEqual(toArrayKeys(res.get(null)), []);
         assert.deepEqual(toArrayKeys(res.get(false)), [1, 11, 12]);

         // ?????????????????? ?????????????? ????????????
         res = strategy.getSelectionForModel({selected: [null], excluded: [null, 2]}, undefined, undefined, 'sad');
         assert.deepEqual(toArrayKeys(res.get(true)), [11, 12]);
         assert.deepEqual(toArrayKeys(res.get(null)), [1]);
         assert.deepEqual(toArrayKeys(res.get(false)), [2, 21, 22]);

         // ?????????????? ?????????????? ?????????????? ????????????
         res = strategy.getSelectionForModel({selected: [11], excluded: []}, undefined, undefined, 'sad');
         assert.deepEqual(toArrayKeys(res.get(true)), [11]);
         assert.deepEqual(toArrayKeys(res.get(null)), [1]);
         assert.deepEqual(toArrayKeys(res.get(false)), [2, 12, 21, 22]);
      });
   });

   describe('getCount', () => {
      it('not selected', () => {
         const selection = { selected: [], excluded: [] };
         const count = strategy.getCount(selection, false);
         const countWithDescAndAnc = strategyWithDescendantsAndAncestors.getCount(selection, false);
         assert.equal(count, 0);
         assert.equal(countWithDescAndAnc, 0);
      });

      it('selected one', () => {
         const selection = { selected: [2], excluded: [] };
         const count = strategy.getCount(selection, false);
         const countWithDescAndAnc = strategyWithDescendantsAndAncestors.getCount(selection, false);
         assert.equal(count, 1);
         assert.equal(countWithDescAndAnc, 3);
      });

      it('selected one and has more data', () => {
         const selection = { selected: [1], excluded: [] };
         const count = strategy.getCount(selection, true);
         const countWithDescAndAnc = strategyWithDescendantsAndAncestors.getCount(selection, true);
         assert.equal(count, 1);
         assert.equal(countWithDescAndAnc, 5);
      });

      it('selected all, but one', () => {
         const selection = { selected: [null], excluded: [null, 2] };
         const count = strategy.getCount(selection, false);
         const countWithDescAndAnc = strategyWithDescendantsAndAncestors.getCount(selection, false);
         assert.equal(count, 4);
         assert.equal(countWithDescAndAnc, 4);
      });

      it('selected all, but one and has more data', () => {
         const selection = { selected: [null], excluded: [null, 2] };
         const count = strategy.getCount(selection, true);
         const countWithDescAndAnc = strategyWithDescendantsAndAncestors.getCount(selection, true);
         assert.equal(count, null);
         assert.equal(countWithDescAndAnc, null);
      });

      it('selected node with more data', () => {
         const selection = {selected: [6], excluded: []};
         model.setHasMoreStorage({
            6: true
         });
         const treeStrategyWithNodesMoreData = new TreeSelectionStrategy({
             selectAncestors: true,
             selectDescendants: true,
             rootId: null,
             model: model,
             selectionType: 'all',
            recursiveSelection: false
         });
         assert.isNull(treeStrategyWithNodesMoreData.getCount(selection, false));
      });

      it('selected node', () => {
         const selection = {selected: [1], excluded: []};
         const count = strategy.getCount(selection, false);
         const countWithDescAndAnc = strategyWithDescendantsAndAncestors.getCount(selection, false);
         assert.equal(count, 1);
         assert.equal(countWithDescAndAnc, 5);
      });

      it('selected all', () => {
         const selection = { selected: [null], excluded: [null] };
         const count = strategy.getCount(selection, false);
         const countWithDescAndAnc = strategyWithDescendantsAndAncestors.getCount(selection, false);
         assert.equal(count, 7);
         assert.equal(countWithDescAndAnc, 7);
      });

      it('with readonly items', () => {
         const data = ListData.getItems();
         data[3].checkboxState = false;

         const model = new Tree({
            collection: new RecordSet({
               keyProperty: ListData.KEY_PROPERTY,
               rawData: data
            }),
            root: new Model({ rawData: { id: null }, keyProperty: ListData.KEY_PROPERTY }),
            keyProperty: ListData.KEY_PROPERTY,
            parentProperty: ListData.PARENT_PROPERTY,
            nodeProperty: ListData.NODE_PROPERTY,
            hasChildrenProperty: ListData.HAS_CHILDREN_PROPERTY,
            multiSelectAccessibilityProperty: 'checkboxState'
         });

         const strategy = new TreeSelectionStrategy({
            selectDescendants: true,
            selectAncestors: true,
            rootId: null,
            model: model,
            selectionType: 'leaf',
            recursiveSelection: true
         });

         const selection = { selected: [null], excluded: [null] };
         const res = strategy.getCount(selection, false);
         assert.equal(res, 6);
      });

      it('selectionType=leaf and recursiveSelection', () => {
         const strategy = new TreeSelectionStrategy({
            selectDescendants: true,
            selectAncestors: true,
            rootId: null,
            model,
            selectionType: 'leaf',
            recursiveSelection: true
         });

         const selection = { selected: [2], excluded: [] };
         const res = strategy.getCount(selection, false);
         assert.equal(res, 3);
      });

      it('with limit', () => {
         const selection = { selected: [null], excluded: [null] };
         const count = strategy.getCount(selection, false, 5);
         assert.equal(count, 5);
      });

      it('selected not loaded item', () => {
         const selection = { selected: [20], excluded: [] };
         const count = strategyWithDescendantsAndAncestors.getCount(selection, false);
         assert.isNull(count);
      });
   });

   describe('cases of go inside node and out it', () => {
      it('select node and go inside it', () => {
         let selection = { selected: [], excluded: [] };
         selection = strategyWithDescendantsAndAncestors.select(selection, 2);
         strategyWithDescendantsAndAncestors._rootId = 2;
         const res = strategyWithDescendantsAndAncestors.getSelectionForModel(selection);
         assert.deepEqual(toArrayKeys(res.get(true)), [2, 3, 4] );
         assert.deepEqual(toArrayKeys(res.get(null)), [1]);
         assert.deepEqual(toArrayKeys(res.get(false)), [5, 6, 7] );
      });

      it('select leaf being inside node and go out it', () => {
         let selection = { selected: [], excluded: [] };
         strategyWithDescendantsAndAncestors._rootId = 1;
         selection = strategyWithDescendantsAndAncestors.select(selection, 5);
         strategyWithDescendantsAndAncestors._rootId = null;
         const res = strategyWithDescendantsAndAncestors.getSelectionForModel(selection);
         assert.deepEqual(toArrayKeys(res.get(true)), [5] );
         assert.deepEqual(toArrayKeys(res.get(null)), [1]);
         assert.deepEqual(toArrayKeys(res.get(false)), [2, 3, 4, 6, 7] );
      });
   });

   describe('isAllSelected', () => {
      it('all selected', () => {
         const selection = { selected: [null], excluded: [null] };
         assert.isTrue(strategy.isAllSelected(selection, false, 7));
         assert.isTrue(strategy.isAllSelected(selection, false, 7, false));

      });

      it ('all selected and one excluded', () => {
         const selection = { selected: [null], excluded: [null, 2] };
         assert.isFalse(strategy.isAllSelected(selection, false, 7));
         assert.isTrue(strategy.isAllSelected(selection, false, 7, false));
      });

      it ('selected current root', () => {
         const selection = { selected: [5], excluded: [5] };
         strategy.update({
            selectDescendants: false,
            selectAncestors: false,
            rootId: 5,
            model: model
         });
         assert.isTrue(strategy._rootChanged);
         assert.isTrue(strategy.isAllSelected(selection, false, 7));
         assert.isTrue(strategy.isAllSelected(selection, true, 7, false));
      });

      it ('selected by one all elements', () => {
         const selection = { selected: [1, 2, 3, 4, 5, 6, 7], excluded: [] };
         assert.isTrue(strategy.isAllSelected(selection, false, 7));
         assert.isFalse(strategy.isAllSelected(selection, true, 7, false));
      });

      it ('selected by one all elements and has more data', () => {
         const selection = { selected: [1, 2, 3, 4, 5, 6, 7], excluded: [] };
         assert.isFalse(strategy.isAllSelected(selection, true, 7));
         assert.isFalse(strategy.isAllSelected(selection, true, 7, false));
      });

      it('empty model', () => {
         const strategy = new TreeSelectionStrategy({
            selectDescendants: false,
            selectAncestors: false,
            rootId: null,
            model: model,
            selectionType: 'all',
            recursiveSelection: false
         });
         const selection = { selected: [], excluded: [] };
         assert.isFalse(strategy.isAllSelected(selection, false, 0, true));
      });

      it ('pass rootId', () => {
         const selection = { selected: [5], excluded: [5] };
         strategy.update({
            selectDescendants: false,
            selectAncestors: false,
            rootId: 5,
            model: model
         });
         assert.isTrue(strategy._rootChanged);
         assert.isTrue(strategy.isAllSelected(selection, false, 7));
         assert.isTrue(strategy.isAllSelected(selection, true, 7, false));
         assert.isFalse(strategy.isAllSelected(selection, true, 7, false, 4));
         assert.isTrue(strategy.isAllSelected({selected: [4], excluded: [4]}, true, 7, false, 4));
      });
   });

   describe('selectionType', () => {
      describe('leaf', () => {
         const strategy = new TreeSelectionStrategy({
            selectDescendants: true,
            selectAncestors: true,
            rootId: null,
            model: model,
            selectionType: 'leaf',
            recursiveSelection: false
         });

         it('select', () => {
            let result = strategy.select({ selected: [], excluded: [] }, 1);
            assert.deepEqual(result, { selected: [], excluded: [] });

            result = strategy.select({ selected: [], excluded: [] }, 7);
            assert.deepEqual(result, { selected: [7], excluded: [] });
         });

         it('unselect', () => {
            let result = strategy.unselect({ selected: [1], excluded: [] }, 1);
            assert.deepEqual(result, { selected: [1], excluded: [] });

            result = strategy.unselect({ selected: [7], excluded: [] }, 7);
            assert.deepEqual(result, { selected: [], excluded: [] });
         });

         it('getSelectionForModel', () => {
            const selection = { selected: [null], excluded: [null] };
            const res = strategy.getSelectionForModel(selection);
            assert.deepEqual(toArrayKeys(res.get(true)), [4, 5, 7] );
            assert.deepEqual(toArrayKeys(res.get(null)), []);
            assert.deepEqual(toArrayKeys(res.get(false)), [1, 2, 3, 6]);
         });

         it('with readonly items', () => {
            const data = ListData.getItems();
            data[3].checkboxState = false;

            const model = new Tree({
               collection: new RecordSet({
                  keyProperty: ListData.KEY_PROPERTY,
                  rawData: data
               }),
               root: new Model({ rawData: { id: null }, keyProperty: ListData.KEY_PROPERTY }),
               keyProperty: ListData.KEY_PROPERTY,
               parentProperty: ListData.PARENT_PROPERTY,
               nodeProperty: ListData.NODE_PROPERTY,
               hasChildrenProperty: ListData.HAS_CHILDREN_PROPERTY,
               multiSelectAccessibilityProperty: 'checkboxState'
            });

            const strategy = new TreeSelectionStrategy({
               selectDescendants: true,
               selectAncestors: true,
               rootId: null,
               model: model,
               selectionType: 'leaf',
               recursiveSelection: false
            });

            const selection = { selected: [null], excluded: [null] };
            const res = strategy.getSelectionForModel(selection);
            assert.deepEqual(toArrayKeys(res.get(true)), [4, 5, 7] );
            assert.deepEqual(toArrayKeys(res.get(null)), []);
            assert.deepEqual(toArrayKeys(res.get(false)), [1, 2, 3, 6]);
         });

         it('selectAll', () => {
            const result = strategy.selectAll({ selected: [], excluded: [] });
            assert.deepEqual(result, { selected: [null], excluded: [null] });
         });
      });

      describe('node', () => {
         const strategy = new TreeSelectionStrategy({
            selectDescendants: true,
            selectAncestors: true,
            rootId: null,
            model: model,
            selectionType: 'node',
            recursiveSelection: false
         });

         it('select', () => {
            let result = strategy.select({ selected: [], excluded: [] }, 1);
            assert.deepEqual(result, { selected: [1], excluded: [] });

            result = strategy.select({ selected: [], excluded: [] }, 7);
            assert.deepEqual(result, { selected: [], excluded: [] });
         });

         it('unselect', () => {
            let result = strategy.unselect({ selected: [1], excluded: [] }, 1);
            assert.deepEqual(result, { selected: [], excluded: [] });

            result = strategy.unselect({ selected: [7], excluded: [] }, 7);
            assert.deepEqual(result, { selected: [7], excluded: [] });
         });

         it('getSelectionForModel', () => {
            const selection = { selected: [null], excluded: [null] };
            const res = strategy.getSelectionForModel(selection);
            assert.deepEqual(toArrayKeys(res.get(true)), [1, 2, 3, 6] );
            assert.deepEqual(toArrayKeys(res.get(null)), []);
            assert.deepEqual(toArrayKeys(res.get(false)), [4, 5, 7]);
         });

         it('with readonly items', () => {
            const data = ListData.getItems();
            data[0].checkboxState = false;

            const model = new Tree({
               collection: new RecordSet({
                  keyProperty: ListData.KEY_PROPERTY,
                  rawData: data
               }),
               root: new Model({ rawData: { id: null }, keyProperty: ListData.KEY_PROPERTY }),
               keyProperty: ListData.KEY_PROPERTY,
               parentProperty: ListData.PARENT_PROPERTY,
               nodeProperty: ListData.NODE_PROPERTY,
               hasChildrenProperty: ListData.HAS_CHILDREN_PROPERTY,
               multiSelectAccessibilityProperty: 'checkboxState'
            });

            const strategy = new TreeSelectionStrategy({
               selectDescendants: true,
               selectAncestors: true,
               rootId: null,
               model: model,
               selectionType: 'node',
               recursiveSelection: false
            });

            const selection = { selected: [null], excluded: [null] };
            const res = strategy.getSelectionForModel(selection);
            assert.deepEqual(toArrayKeys(res.get(true)), [1, 2, 3, 6] );
            assert.deepEqual(toArrayKeys(res.get(null)), []);
            assert.deepEqual(toArrayKeys(res.get(false)), [4, 5, 7]);
         });
      });

      describe('allBySelectAction', () => {
         const strategy = new TreeSelectionStrategy({
            selectDescendants: true,
            selectAncestors: true,
            rootId: null,
            model: model,
            selectionType: 'allBySelectAction',
            recursiveSelection: false
         });

         it('should select any item', () => {
            let result = strategy.select({ selected: [], excluded: [] }, 1);
            assert.deepEqual(result, { selected: [1], excluded: [] });

            result = strategy.select({ selected: [], excluded: [] }, 7);
            assert.deepEqual(result, { selected: [7], excluded: [] });
         });
      });
   });


   describe('recursiveSelection', () => {
      describe('leaf', () => {
         const strategy = new TreeSelectionStrategy({
            selectDescendants: true,
            selectAncestors: true,
            rootId: null,
            model: model,
            selectionType: 'leaf',
            recursiveSelection: true
         });

         it('select', () => {
            let result = strategy.select({ selected: [], excluded: [] }, 1);
            assert.deepEqual(result, { selected: [1], excluded: [] });

            result = strategy.select({ selected: [], excluded: [] }, 7);
            assert.deepEqual(result, { selected: [7], excluded: [] });
         });

         it('unselect', () => {
            let result = strategy.unselect({ selected: [1], excluded: [] }, 1);
            assert.deepEqual(result, { selected: [], excluded: [] });

            result = strategy.unselect({ selected: [7], excluded: [] }, 7);
            assert.deepEqual(result, { selected: [], excluded: [] });
         });

         it('getSelectionForModel', () => {
            const selection = { selected: [null], excluded: [null] };
            const res = strategy.getSelectionForModel(selection);
            assert.deepEqual(toArrayKeys(res.get(true)), [1, 2, 3, 4, 5, 6, 7] );
            assert.deepEqual(toArrayKeys(res.get(null)), []);
            assert.deepEqual(toArrayKeys(res.get(false)), []);
         });

         it('with readonly items', () => {
            const data = ListData.getItems();
            data[3].checkboxState = false;

            const model = new Tree({
               collection: new RecordSet({
                  keyProperty: ListData.KEY_PROPERTY,
                  rawData: data
               }),
               root: new Model({ rawData: { id: null }, keyProperty: ListData.KEY_PROPERTY }),
               keyProperty: ListData.KEY_PROPERTY,
               parentProperty: ListData.PARENT_PROPERTY,
               nodeProperty: ListData.NODE_PROPERTY,
               hasChildrenProperty: ListData.HAS_CHILDREN_PROPERTY,
               multiSelectAccessibilityProperty: 'checkboxState'
            });

            const strategy = new TreeSelectionStrategy({
               selectDescendants: true,
               selectAncestors: true,
               rootId: null,
               model: model,
               selectionType: 'leaf',
               recursiveSelection: true
            });

            const selection = { selected: [2], excluded: [] };
            const res = strategy.getSelectionForModel(selection);
            assert.deepEqual(toArrayKeys(res.get(true)), [2, 3, 4] );
            assert.deepEqual(toArrayKeys(res.get(null)), [1] );
            assert.deepEqual(toArrayKeys(res.get(false)), [5, 6, 7] );
         });
      });
   });
});
