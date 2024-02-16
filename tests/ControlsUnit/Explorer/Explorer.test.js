define([
   'Controls/_explorer/View',
   'Types/deferred',
   'Types/collection',
   'Types/chain',
   'Controls/dragnDrop',
   'Types/entity',
   'Types/source',
   'Controls/dataSource'
], function (
   explorerView,
   defferedLib,
   collection,
   chain,
   dragnDrop,
   entityLib,
   sourceLib,
   dataSource
) {
   function dragEntity(items, dragControlId) {
      var entity = new dragnDrop.ItemsEntity({
         items: items
      });
      entity.dragControlId = dragControlId;
      return entity;
   }

   const emptyFn = () => {
      /* empty */
   };
   const GlobalView = new explorerView.default();
   GlobalView._beforeMount({});

   describe('Controls.Explorer', function () {
      it('_private block', function () {
         const notify = emptyFn;
         const forceUpdate = emptyFn;
         const dataLoadCallback = emptyFn;
         const updateHeadingPath = emptyFn;
         let itemOpenHandlerCalled = false;
         const itemOpenHandler = () => {
            itemOpenHandlerCalled = true;
         };

         const self = {
            _forceUpdate: forceUpdate,
            _notify: notify,
            _updateHeadingPath: updateHeadingPath,
            _options: {
               dataLoadCallback: dataLoadCallback,
               itemOpenHandler: itemOpenHandler
            }
         };
         const testRoot = 'testRoot';

         GlobalView._setRoot.call(self, testRoot);
         expect({
            _forceUpdate: forceUpdate,
            _updateHeadingPath: updateHeadingPath,
            _notify: notify,
            _options: {
               dataLoadCallback: dataLoadCallback,
               itemOpenHandler: itemOpenHandler
            }
         }).toEqual(self);
         expect(itemOpenHandlerCalled).toBe(true);
      });

      it('_private.canStartDragNDrop', function () {
         const explorer = new explorerView.default({});
         explorer._beforeMount({});

         explorer._viewMode = 'table';
         expect(explorer._canStartDragNDrop()).toBe(true);
         explorer._viewMode = 'search';
         expect(explorer._canStartDragNDrop()).toBe(false);
      });

      it('_private._getTopRoot', function () {
         const cfg = {
            parentProperty: 'parent',
            root: 'rootFromOptions'
         };
         const explorer = new explorerView.default(cfg);

         explorer.saveOptions(cfg);
         expect(explorer._getTopRoot([], cfg.parentProperty, cfg.root)).toEqual('rootFromOptions');

         let breadcrumbs = [
            new entityLib.Model({
               rawData: {
                  parent: 'rootFromBreadCrumbs'
               },
               keyProperty: 'id'
            })
         ];
         expect(explorer._getTopRoot(breadcrumbs, cfg.parentProperty, cfg.root)).toEqual(
            'rootFromBreadCrumbs'
         );

         cfg.root = 'rootFromOptions';
         explorer.saveOptions(cfg);
         expect(explorer._getTopRoot(breadcrumbs, cfg.parentProperty, cfg.root)).toEqual(
            'rootFromBreadCrumbs'
         );
      });

      it('itemsReadyCallback', function () {
         var items = new collection.RecordSet(),
            itemsReadyCallbackArgs,
            itemsReadyCallback = function (innerItems) {
               itemsReadyCallbackArgs = innerItems;
            },
            cfg = {
               itemsReadyCallback: itemsReadyCallback
            },
            explorer = new explorerView.default(cfg);
         explorer.saveOptions(cfg);
         explorer._beforeMount({});

         explorer._itemsReadyCallback(items);
         expect(itemsReadyCallbackArgs).toEqual(items);
         expect(explorer._items).toEqual(items);
      });

      it('itemsSetCallback', function () {
         let markedKey = '';
         let clearSelectionCalled = false;
         const cfg = { root: null };
         const explorer = new explorerView.default(cfg);

         // это сделано для того, чтобы ручные вызовы _forceUpdate не заваливали консоль ошибками
         jest.spyOn(explorer, '_forceUpdate').mockImplementation();
         explorer.saveOptions(cfg);
         explorer._beforeMount(cfg);

         explorer._isGoingBack = true;
         explorer._breadcrumbs = [
            new entityLib.Model({
               keyProperty: 'id',
               rawData: {
                  id: 'test'
               }
            })
         ];
         explorer._restoredMarkedKeys = {
            [null]: { markedKey: 'test' }
         };
         explorer._children = {
            treeControl: {
               setMarkedKey: (key) => {
                  markedKey = key;
               },
               isAllSelected: () => {
                  return true;
               },
               clearSelection: () => {
                  clearSelectionCalled = true;
               }
            }
         };

         expect(explorer._markerForRestoredScroll).toBeUndefined();
         explorer._onBreadcrumbsChanged([]);

         const items = new collection.RecordSet({
            keyProperty: 'id',
            rawData: [
               {
                  id: 'test',
                  parent: null
               }
            ]
         });

         explorer._itemsSetCallback(items);

         expect(markedKey).toBe('test');
         expect(explorer._markerForRestoredScroll).toBe('test');
         expect(explorer._isGoingBack).toBe(false);

         clearSelectionCalled = false;
         explorer._isGoingFront = true;
         cfg.root = 'test';
         explorer._restoredMarkedKeys = {
            [null]: { markedKey: 'test' }
         };

         explorer._itemsSetCallback(items);

         expect(explorer._isGoingFront).toBe(false);
         expect(clearSelectionCalled).toBe(false);
      });

      it('setViewMode', async () => {
         const cfg = {
            root: 'rootNode',
            viewMode: 'tree',
            virtualScrollConfig: {
               pageSize: 100
            }
         };
         const newCfg = {
            viewMode: 'search',
            root: 'rootNode',
            virtualScrollConfig: {
               pageSize: 100
            }
         };
         const newCfg2 = {
            viewMode: 'tile',
            root: 'rootNode',
            virtualScrollConfig: {
               pageSize: 100
            }
         };
         const newCfg3 = {
            viewMode: 'search',
            root: 'rootNode',
            virtualScrollConfig: {
               pageSize: 100
            },
            searchStartingWith: 'root'
         };
         const instance = new explorerView.default(cfg);

         // это сделано для того, чтобы ручные вызовы _forceUpdate не заваливали консоль ошибками
         jest.spyOn(instance, '_forceUpdate').mockImplementation();
         let rootChanged = false;
         let root;

         instance.saveOptions(cfg);
         instance._isMounted = true;

         await instance._beforeMount(cfg);
         expect(instance._viewMode).toEqual('tree');
         expect(instance._viewName).toEqual(instance._constants.VIEW_NAMES.tree);
         expect(instance._viewModelConstructor).toEqual(
            instance._constants.VIEW_MODEL_CONSTRUCTORS.tree
         );
         expect(rootChanged).toBe(false);

         instance._notify = function (eventName, eventValue) {
            if (eventName === 'rootChanged') {
               rootChanged = true;
               root = eventValue[0];
            }
         };
         await instance._setViewMode(newCfg.viewMode, newCfg);
         expect(instance._viewMode).toEqual('search');
         expect(instance._viewName).toEqual(instance._constants.VIEW_NAMES.search);
         expect(instance._viewModelConstructor).toEqual(
            instance._constants.VIEW_MODEL_CONSTRUCTORS.search
         );
         expect(rootChanged).toBe(false);

         let breadcrumbs = [
            new entityLib.Model({
               rawData: [{ id: 1, title: 'item1' }],
               keyProperty: 'id'
            })
         ];
         instance.saveOptions(
            Object.assign({}, instance._options, {
               searchStartingWith: 'root',
               root: 'test',
               parentProperty: 'id'
            })
         );
         instance._onBreadcrumbsChanged(breadcrumbs);
         instance._viewMode = 'tree';
         await instance._setViewMode(newCfg.viewMode, newCfg);
         expect(rootChanged).toBe(false);

         await instance._setViewMode(newCfg2.viewMode, newCfg2);
         expect(instance._viewMode).toEqual('tile');
         expect(instance._viewName).toEqual(instance._constants.VIEW_NAMES.tile);
         expect(instance._viewModelConstructor).toEqual(
            instance._constants.VIEW_MODEL_CONSTRUCTORS.tile
         );
         expect(rootChanged).toBe(false);

         breadcrumbs = [
            new entityLib.Model({
               rawData: {
                  id: 1,
                  title: 'crumb'
               },
               keyProperty: 'id'
            })
         ];
         instance._onBreadcrumbsChanged(breadcrumbs);
         instance._setViewMode(newCfg3.viewMode, newCfg3);
         expect(rootChanged).toBe(true);
         expect(root).toEqual(1);
      });

      it('toggleExpanded', function () {
         var explorer = new explorerView.default({
               viewMode: 'tree'
            }),
            toggleExpandedCalled = false;
         explorer._children.treeControl = {
            toggleExpanded: function (id) {
               toggleExpandedCalled = true;
               expect(id).toEqual('id_toggled_item');
            }
         };
         explorer.toggleExpanded('id_toggled_item');
         expect(toggleExpandedCalled).toBe(true);
      });

      it('sourceController with error', async () => {
         const explorer = new explorerView.default();
         const sourceWithQueryError = new sourceLib.Memory();
         sourceWithQueryError.query = () => {
            const error = new Error();
            error.processed = true;
            return Promise.reject(error);
         };
         const sourceController = new dataSource.NewSourceController({
            source: sourceWithQueryError
         });
         await sourceController.reload().catch(jest.fn());

         const explorerOptions = {
            source: sourceWithQueryError,
            sourceController: sourceController,
            root: 1
         };

         explorer._beforeMount(explorerOptions);
         await explorer._itemsPromise;
      });

      describe('_beforeUpdate', function () {
         it('collapses and expands items as needed', async () => {
            const cfg = { viewMode: 'tree', root: null };
            const cfg2 = { viewMode: 'search', root: null };
            const instance = new explorerView.default(cfg);
            let resetExpandedItemsCalled = false;
            instance._children = {
               treeControl: {
                  resetExpandedItems: () => {
                     resetExpandedItemsCalled = true;
                  },
                  isColumnScrollVisible: () => {
                     return false;
                  }
               }
            };

            instance.saveOptions(cfg);
            instance._viewMode = cfg.viewMode;

            // change view mode tree -> search
            instance._beforeUpdate(cfg2);
            await instance._setViewModePromise;
            expect(resetExpandedItemsCalled).toBe(true);

            resetExpandedItemsCalled = false;
            instance._viewMode = cfg2.viewMode;
            instance.saveOptions(cfg2);

            instance._beforeUpdate(cfg2);
            await instance._setViewModePromise;
            expect(resetExpandedItemsCalled).toBe(false);

            instance._isGoingFront = true;
            instance.saveOptions(cfg);
            instance._beforeUpdate({ ...cfg2, root: 1 });
            expect(instance._isGoingFront).toBe(true);
         });

         it('changes viewMode on items set if both viewMode and root changed(tree -> search)', () => {
            const cfg = { viewMode: 'tree', root: null };
            const cfg2 = { viewMode: 'search', root: 'abc' };
            const instance = new explorerView.default(cfg);
            instance._children = {
               treeControl: {
                  resetExpandedItems: () => {
                     return null;
                  }
               }
            };

            instance.saveOptions(cfg);
            instance._viewMode = 'tree';

            instance._beforeUpdate(cfg2);
            instance.saveOptions(cfg2);
            expect(instance._pendingViewMode).toBe('search');
         });

         it('changes viewMode on items set if both viewMode and root changed(tree -> tile)', () => {
            const cfg = { viewMode: 'tree', root: null };
            const cfg2 = { viewMode: 'tile', root: 'abc' };
            const instance = new explorerView.default(cfg);
            instance._beforeMount({});
            instance._children = {
               treeControl: {
                  resetExpandedItems: () => {
                     return null;
                  },
                  isColumnScrollVisible: () => {
                     return false;
                  }
               }
            };

            instance.saveOptions(cfg);
            instance._viewMode = 'tree';

            instance._beforeUpdate(cfg2);
            instance.saveOptions(cfg2);
            expect(instance._viewMode).toBe('tree');

            instance._itemsSetCallback();
            expect(instance._viewMode).toBe('tile');
         });

         it('async change view mode', async () => {
            const cfg = {
               viewMode: 'view1',
               columns: [{}, {}, {}],
               header: [{}, {}, {}]
            };
            const cfg2 = {
               viewMode: 'view2',
               columns: [{}],
               header: [{}]
            };

            let viewModePromise;
            let resolveViewMode;
            const instance = new explorerView.default(cfg);
            instance._beforeMount(cfg);
            instance.saveOptions(cfg);
            instance._children = {
               treeControl: {
                  resetExpandedItems: () => {
                     return null;
                  },
                  isColumnScrollVisible: () => {
                     return false;
                  }
               }
            };
            instance._setViewMode = (viewMode, innerCfg) => {
               viewModePromise = new Promise((resolve) => {
                  resolveViewMode = resolve;
               }).then(() => {
                  instance._setViewModeSync(viewMode, innerCfg);
               });

               return viewModePromise;
            };

            instance._beforeUpdate(cfg2);

            // При асинхронной смене viewMode набор примененных колонок и заголовок
            // не должны измениться
            expect(instance._header).toBe(cfg.header);
            expect(instance._columns).toBe(cfg.columns);

            resolveViewMode();
            await viewModePromise;

            // После асинхронной смены viewMode набор примененных колонок и заголовок
            // должны измениться
            expect(instance._header).toBe(cfg2.header);
            expect(instance._columns).toBe(cfg2.columns);
         });
      });

      describe('_onBreadcrumbsChanged', () => {
         it('fill _restoredMarkedKeys by breadcrumbs', () => {
            // Создаем explorer c с навигацией по курсору, т.к. в
            // _restoredMarkedKeys курсор берется из крошек
            const cfg = {
               nodeProperty: 'type',
               parentProperty: 'parent',
               root: null,
               navigation: {
                  source: 'position',
                  sourceConfig: {
                     field: ['title', 'id']
                  }
               }
            };
            const explorer = new explorerView.default(cfg);
            explorer.saveOptions(cfg);
            explorer._navigation = cfg.navigation;

            // Создаем данные крошек
            const rootItem = new entityLib.Model({
               keyProperty: 'id',
               rawData: {
                  id: 1,
                  title: 'Title1',
                  type: true,
                  parent: null
               }
            });
            const childItem = new entityLib.Model({
               keyProperty: 'id',
               rawData: {
                  id: 2,
                  title: 'Title2',
                  type: true,
                  parent: 1
               }
            });

            // Эмулируем простановку новых крошек
            explorer._onBreadcrumbsChanged([rootItem, childItem]);

            // _restoredMarkedKeys должен заполнится на основании переданных крошек
            expect(explorer._restoredMarkedKeys).toEqual({
               null: {
                  markedKey: 1,
                  cursorPosition: ['Title1', 1]
               },
               1: {
                  markedKey: 2,
                  parent: null,
                  cursorPosition: ['Title2', 2]
               },
               2: {
                  cursorPosition: undefined,
                  markedKey: null,
                  parent: 1
               }
            });
         });

         it('set _potentialMarkedKey', () => {
            // Создаем explorer и эмулируем состояние когда от показывает
            // содержимое папки 2го уровня
            const cfg = {
               nodeProperty: 'type',
               parentProperty: 'parent',
               root: 2
            };
            const explorer = new explorerView.default(cfg);
            explorer.saveOptions(cfg);
            explorer._restoredMarkedKeys = {
               null: {
                  markedKey: 1,
                  cursorPosition: ['Title1', 1]
               },
               1: {
                  markedKey: 2,
                  parent: null,
                  cursorPosition: ['Title2', 2]
               },
               2: {
                  markedKey: null,
                  parent: 1
               }
            };
            explorer._breadcrumbs = [
               new entityLib.Model({
                  keyProperty: 'id',
                  rawData: {
                     id: 1
                  }
               }),
               new entityLib.Model({
                  keyProperty: 'id',
                  rawData: {
                     id: 2
                  }
               })
            ];

            const rootItem = new entityLib.Model({
               keyProperty: 'id',
               rawData: {
                  id: 1,
                  title: 'Title1',
                  type: true,
                  parent: null
               }
            });

            // Эмулируем простановку хлебных крошек после возврата назад
            cfg.root = 1;
            explorer._isGoingBack = true;
            explorer._onBreadcrumbsChanged([rootItem]);

            // explorer на основании заданного выше _restoredMarkedKeys
            // должен проставить корректный _potentialMarkedKey
            expect(explorer._potentialMarkedKey).toBe(2);
         });
      });

      it('_onBreadCrumbsClick', function () {
         const testBreadCrumbs = new collection.RecordSet({
            rawData: [
               { id: 1, title: 'item1' },
               { id: 2, title: 'item2', parent: 1 },
               { id: 3, title: 'item3', parent: 2 }
            ],
            keyProperty: 'id'
         });
         const instance = new explorerView.default();
         let root;

         // это сделано для того, чтобы ручные вызовы _forceUpdate не заваливали консоль ошибками
         jest.spyOn(instance, '_forceUpdate').mockImplementation();
         instance._children = {
            treeControl: {
               setMarkedKey: () => {
                  return true;
               }
            }
         };

         instance.saveOptions({
            parentProperty: 'parent',
            keyProperty: 'id'
         });

         instance._isMounted = true;

         instance._notify = function (eventName, eventValue) {
            if (eventName === 'rootChanged') {
               root = eventValue[0];
            }
         };

         instance._restoredMarkedKeys = {
            null: {
               markedKey: null
            },
            1: {
               markedKey: 2
            },
            2: {
               markedKey: 3
            }
         };
         instance._onBreadcrumbsClick({}, testBreadCrumbs.at(0));
         expect(root).toEqual(testBreadCrumbs.at(0).get('id'));
         instance._onBreadcrumbsClick({}, testBreadCrumbs.at(1));
         expect(root).toEqual(testBreadCrumbs.at(1).get('id'));
      });

      it('_onBreadCrumbsClick set markedKey', function () {
         const instance = new explorerView.default();

         // это сделано для того, чтобы ручные вызовы _forceUpdate не заваливали консоль ошибками
         jest.spyOn(instance, '_forceUpdate').mockImplementation();
         instance.saveOptions({
            parentProperty: 'parent',
            keyProperty: 'id'
         });

         let newMarkedKey;
         instance._children = {
            treeControl: {
               setMarkedKey: (key) => {
                  newMarkedKey = key;
               }
            }
         };
         instance._restoredMarkedKeys = {
            1: {
               markedKey: 2
            }
         };

         instance._onBreadcrumbsClick(
            {},
            {
               getKey: () => {
                  return 1;
               }
            }
         );
         expect(newMarkedKey).toEqual(2);
      });

      it('_notifyHandler', function () {
         var instance = new explorerView.default(),
            events = [],
            result;

         instance._notify = function () {
            events.push({
               eventName: arguments[0],
               eventArgs: arguments[1]
            });
            return 123;
         };

         result = instance._notifyHandler({}, 'itemActionsClick', 1, 2);
         instance._notifyHandler({}, 'beforeBeginEdit');
         instance._notifyHandler({}, 'sortingChanged', { field: 'DESC' });
         expect(result).toEqual(123);
         expect(events[0].eventName).toEqual('itemActionsClick');
         expect(events[0].eventArgs).toEqual([1, 2]);
         expect(events[1].eventName).toEqual('beforeBeginEdit');
         expect(events[1].eventArgs).toEqual([]);
         expect(events[2].eventName).toEqual('sortingChanged');
         expect(events[2].eventArgs).toEqual([{ field: 'DESC' }]);
      });

      it('reloadItem', function () {
         let instance = new explorerView.default();
         let reloadItemCalled = false;
         instance._children = {
            treeControl: {
               reloadItem: function () {
                  reloadItemCalled = true;
               }
            }
         };
         instance.reloadItem();
         expect(reloadItemCalled).toBe(true);
      });

      describe('_notify(rootChanged)', function () {
         var root,
            isNotified = false,
            _notify = function (eName, eArgs) {
               if (eName === 'rootChanged') {
                  isNotified = true;
                  root = eArgs[0];
               }
               if (eName === 'itemClick') {
                  return true;
               }
            };

         it('_beforeUpdate', function () {
            isNotified = false;

            var explorer = new explorerView.default({});
            explorer.saveOptions({});
            explorer._notify = _notify;
            explorer._beforeUpdate({
               root: 1,
               viewMode: null
            });

            expect(isNotified).toBe(false);
            isNotified = false;
         });

         it('should do nothing by item click with option ExpandByItemClick', () => {
            const cfg = {
               editingConfig: {},
               expandByItemClick: true
            };
            const explorer = new explorerView.default(cfg);
            explorer.saveOptions(cfg);

            const rootBefore = explorer._root;
            explorer.commitEdit = () => {
               throw Error("Explorer:commitEdit shouldn't be called!");
            };
            const clickEvent = {
               target: { closest: jest.fn() }
            };
            explorer._children.treeControl = {
               isEditing: () => {
                  return false;
               }
            };
            expect(() => {
               explorer._onItemClick(
                  {
                     get: () => {
                        return true;
                     }
                  },
                  clickEvent
               );
            }).not.toThrow();
            expect(rootBefore).toEqual(explorer._root);
            expect(() => {
               explorer._onItemClick(
                  {
                     get: () => {
                        return false;
                     }
                  },
                  clickEvent
               );
            }).not.toThrow();
            expect(rootBefore).toEqual(explorer._root);
            expect(() => {
               explorer._onItemClick(
                  {
                     get: () => {
                        return null;
                     }
                  },
                  clickEvent
               );
            }).not.toThrow();
            expect(rootBefore).toEqual(explorer._root);
         });

         it('should open node by item click with option expandByItemClick in search mode', () => {
            const cfg = {
               editingConfig: {},
               expandByItemClick: true,
               nodeProperty: 'node@'
            };
            const explorer = new explorerView.default(cfg);

            // это сделано для того, чтобы ручные вызовы _forceUpdate не заваливали консоль ошибками
            jest.spyOn(explorer, '_forceUpdate').mockImplementation();
            explorer.saveOptions(cfg);
            explorer._viewMode = 'search';
            explorer._restoredMarkedKeys = {
               null: {
                  markedKey: null
               }
            };
            const rootBefore = explorer._root;
            explorer._children = {
               treeControl: {
                  _children: {},
                  commitEdit: () => {
                     return {
                        addCallback(callback) {
                           callback();
                           expect(rootBefore).not.toEqual(explorer._root);
                        }
                     };
                  },
                  isEditing: () => {
                     return false;
                  }
               }
            };
            const clickEvent = {
               target: { closest: jest.fn() }
            };
            const item = {
               get: () => {
                  return true;
               },
               getKey: () => {
                  return 'itemId';
               }
            };
            expect(() => {
               explorer._onItemClick(item, clickEvent);
            }).not.toThrow();
         });

         it('_onBreadCrumbsClick', function () {
            isNotified = false;
            root = undefined;

            var explorer = new explorerView.default({});

            // это сделано для того, чтобы ручные вызовы _forceUpdate не заваливали консоль ошибками
            jest.spyOn(explorer, '_forceUpdate').mockImplementation();
            explorer.saveOptions({});
            explorer._isMounted = true;
            explorer._notify = _notify;
            explorer._children = {
               treeControl: {
                  setMarkedKey: () => {
                     return true;
                  }
               }
            };

            explorer._restoredMarkedKeys = {
               null: {
                  markedKey: null,
                  cursorPosition: '0'
               },
               itemId: {
                  parent: null,
                  cursorPosition: '1',
                  markedKey: 'itemId1'
               },
               itemId1: {
                  parent: 'itemId',
                  cursorPosition: '2',
                  markedKey: null
               }
            };
            explorer._root = 'itemId1';
            explorer._isGoingBack = false;

            explorer._onBreadcrumbsClick(
               {},
               {
                  getKey: function () {
                     return 'itemId';
                  }
               }
            );

            // После клика по хлебным крошкам должно:
            // 1. Послаться событие rootChanged
            expect(isNotified).toBe(true);

            // 1.1 В событии должен быть root кликнутой хлебной крошки
            expect(root).toBe('itemId');

            // 2. explorer должен переключиться в режим _isGoingBack
            expect(explorer._isGoingBack).toBe(true);
         });
      });

      describe('EditInPlace', function () {
         it('beginEdit', function () {
            var opt = {
               test: '123'
            };
            var instance = new explorerView.default({});
            instance._children = {
               treeControl: {
                  beginEdit: function (options) {
                     expect(opt).toEqual(options);
                     return defferedLib.Deferred.success();
                  }
               }
            };
            var result = instance.beginEdit(opt);
            expect(result).toBeInstanceOf(defferedLib.Deferred);
            expect(result.isSuccessful()).toBe(true);
         });

         it('beginAdd', function () {
            var opt = {
               test: '123'
            };
            var instance = new explorerView.default({});
            instance._children = {
               treeControl: {
                  beginAdd: function (options) {
                     expect(opt).toEqual(options);
                     return defferedLib.Deferred.success();
                  }
               }
            };
            var result = instance.beginAdd(opt);
            expect(result).toBeInstanceOf(defferedLib.Deferred);
            expect(result.isSuccessful()).toBe(true);
         });

         it('cancelEdit', function () {
            var instance = new explorerView.default({});
            instance._children = {
               treeControl: {
                  cancelEdit: function () {
                     return defferedLib.Deferred.success();
                  }
               }
            };
            var result = instance.cancelEdit();
            expect(result).toBeInstanceOf(defferedLib.Deferred);
            expect(result.isSuccessful()).toBe(true);
         });

         it('commitEdit', function () {
            var instance = new explorerView.default({});
            instance._children = {
               treeControl: {
                  commitEdit: function () {
                     return defferedLib.Deferred.success();
                  }
               }
            };
            var result = instance.commitEdit();
            expect(result).toBeInstanceOf(defferedLib.Deferred);
            expect(result.isSuccessful()).toBe(true);
         });
      });

      describe('DragNDrop', function () {
         var explorer,
            explorerCfg = {
               parentProperty: 'parent',
               root: null,
               itemsDragNDrop: true
            };

         beforeEach(function () {
            var items = new collection.RecordSet({
               rawData: [
                  { id: 1, title: 'item1', parent: null },
                  { id: 2, title: 'item2', parent: 1 },
                  { id: 3, title: 'item3', parent: 2 }
               ],
               keyProperty: 'id'
            });

            explorer = new explorerView.default(explorerCfg);

            // это сделано для того, чтобы ручные вызовы _forceUpdate не заваливали консоль ошибками
            jest.spyOn(explorer, '_forceUpdate').mockImplementation();

            explorer.saveOptions(explorerCfg);
            explorer._beforeMount(explorerCfg);
            explorer._onBreadcrumbsChanged([]);
            explorer._items = items;
         });

         it('_hoveredCrumbChanged', function () {
            var hoveredBreadCrumb = new entityLib.Model({
                  rawData: {
                     id: 1
                  },
                  keyProperty: 'id'
               }),
               innerExplorer = new explorerView.default({});

            // это сделано для того, чтобы ручные вызовы _forceUpdate не заваливали консоль ошибками
            jest.spyOn(innerExplorer, '_forceUpdate').mockImplementation();

            innerExplorer._hoveredCrumbChanged(
               {
                  stopImmediatePropagation: jest.fn(),
                  stopPropagation: jest.fn()
               },
               hoveredBreadCrumb
            );
            expect(innerExplorer._hoveredBreadCrumb).toEqual(hoveredBreadCrumb.get('id'));
         });
         it('dragItemsFromRoot', function () {
            // item from the root
            expect(explorer._dragItemsFromRoot([1])).toBe(true);

            // item is not from the root
            expect(explorer._dragItemsFromRoot([2])).toBe(false);

            // item is not from the root and from the root
            expect(explorer._dragItemsFromRoot([1, 2])).toBe(false);

            // an item that is not in the list.
            expect(explorer._dragItemsFromRoot([4])).toBe(false);
         });
         it('_dragHighlighter', function () {
            explorer._hoveredBreadCrumb = 2;

            expect(explorer._breadCrumbsDragHighlighter()).toEqual('');

            explorer._dragOnBreadCrumbs = true;
            expect(explorer._breadCrumbsDragHighlighter(1)).toEqual('');
            expect(explorer._breadCrumbsDragHighlighter(2)).toEqual(
               'controls-BreadCrumbsView__dropTarget_withoutArrow'
            );
            expect(explorer._breadCrumbsDragHighlighter(2, true)).toEqual(
               'controls-BreadCrumbsView__dropTarget_withArrow'
            );
            expect(explorer._breadCrumbsDragHighlighter('dots')).toEqual('');
         });
         it('_documentDragStart', function () {
            var dcid = 'test-id';
            explorer._dragControlId = dcid;

            explorer._documentDragStart(
               {},
               {
                  entity: 'notDragEntity'
               }
            );
            expect(explorer._dragOnBreadCrumbs).toBe(false);

            // drag in the root
            explorer._dragOnBreadCrumbs = false;
            explorer._documentDragStart(
               {},
               {
                  entity: dragEntity([1], dcid)
               }
            );
            expect(explorer._dragOnBreadCrumbs).toBe(false);

            explorer._dragOnBreadCrumbs = false;
            explorer._documentDragStart(
               {},
               {
                  entity: dragEntity([2], dcid)
               }
            );
            expect(explorer._dragOnBreadCrumbs).toBe(true);

            explorer._dragOnBreadCrumbs = false;
            explorer._options.itemsDragNDrop = false;
            explorer._documentDragStart(
               {},
               {
                  entity: dragEntity([2], dcid)
               }
            );
            expect(explorer._dragOnBreadCrumbs).toBe(false);
            explorer._options.itemsDragNDrop = true;

            // drag not in root
            explorer._options.root = 'notnull';

            explorer._dragOnBreadCrumbs = false;
            explorer._documentDragStart(
               {},
               {
                  entity: dragEntity([1], dcid)
               }
            );
            expect(explorer._dragOnBreadCrumbs).toBe(true);

            explorer._dragOnBreadCrumbs = false;
            explorer._documentDragStart(
               {},
               {
                  entity: dragEntity([2], dcid)
               }
            );
            expect(explorer._dragOnBreadCrumbs).toBe(true);

            // ignore drag entities with wrong dragControlId
            explorer._dragOnBreadCrumbs = false;
            explorer._documentDragStart(
               {},
               {
                  entity: dragEntity([2], 'wrong-id')
               }
            );
            expect(explorer._dragOnBreadCrumbs).toBe(false);

            explorerCfg.parentProperty = undefined;
            explorer.saveOptions(explorerCfg);
            explorer._documentDragStart(
               {},
               {
                  entity: dragEntity([2], dcid)
               }
            );
            expect(explorer._dragOnBreadCrumbs).toBe(false);
         });
         it('_documentDragEnd', function () {
            var dragEnrArgs,
               innerDragEntity = new dragnDrop.ItemsEntity();

            explorer._notify = function (e, args) {
               if (e === 'customdragEnd') {
                  dragEnrArgs = args;
               }
            };
            explorer._dragOnBreadCrumbs = true;

            explorer._documentDragEnd({}, {});
            expect(dragEnrArgs).toEqual(undefined);
            expect(explorer._dragOnBreadCrumbs).toBe(false);

            explorer._hoveredBreadCrumb = 'hoveredItemKey';
            explorer._documentDragEnd(
               {},
               {
                  entity: innerDragEntity
               }
            );
            expect(dragEnrArgs[0]).toEqual(innerDragEntity);
            expect(dragEnrArgs[1]).toEqual('hoveredItemKey');
            expect(dragEnrArgs[2]).toEqual('on');
         });
      });

      describe('restore position navigation when going back', () => {
         it('step back', () => {
            const root = new entityLib.Model({
               keyProperty: 'id',
               rawData: {
                  id: null
               }
            });
            const rootItem = new entityLib.Model({
               keyProperty: 'id',
               rawData: {
                  id: 1,
                  title: 'Title1',
                  type: true,
                  parent: null
               }
            });

            const cfg = {
               keyProperty: 'id',
               nodeProperty: 'type',
               parentProperty: 'parent',
               navigation: {
                  source: 'position',
                  sourceConfig: {
                     field: ['title', 'id']
                  }
               }
            };

            // Создаем explorer с навигацией по курсору и с текущим корнем в папке с id 2
            const explorer = new explorerView.default(cfg);
            explorer.saveOptions(cfg);
            explorer._navigation = cfg.navigation;
            explorer._restoredMarkedKeys = {
               null: {
                  markedKey: 1,
                  cursorPosition: ['Title1', 1]
               },
               1: {
                  markedKey: 2,
                  parent: null,
                  cursorPosition: ['Title2', 2]
               },
               2: {
                  markedKey: null,
                  parent: 1
               }
            };
            explorer._forceUpdate = () => {
               return undefined;
            };
            explorer._children = {
               treeControl: {
                  setMarkedKey: () => {
                     return true;
                  }
               }
            };

            // Сразу из текущий папки возвращаемся в самый верхний корень
            explorer._onBreadcrumbsClick(null, root);

            // В соответствии с _restoredMarkedKeys position должен выставиться в
            // ['Title1', 1]
            expect(explorer._navigation.sourceConfig.position).toEqual(['Title1', 1]);

            // Восстанавливаем состояние к исходному
            explorer._restoredMarkedKeys = {
               null: {
                  markedKey: 1,
                  cursorPosition: ['Title1', 1]
               },
               1: {
                  markedKey: 2,
                  parent: null,
                  cursorPosition: ['Title2', 2]
               },
               2: {
                  markedKey: null,
                  parent: 1
               }
            };

            // Возвращаемся в rootItem
            explorer._onBreadcrumbsClick(null, rootItem);

            // В соответствии с _restoredMarkedKeys position должен выставиться в
            // ['Title2', 2]
            expect(explorer._navigation.sourceConfig.position).toEqual(['Title2', 2]);

            // Возвращаемся в самый верхний корень
            explorer._onBreadcrumbsClick(null, root);

            // В соответствии с _restoredMarkedKeys position должен выставиться в
            // ['Title1', 1]
            expect(explorer._navigation.sourceConfig.position).toEqual(['Title1', 1]);
         });
      });
   });
});
