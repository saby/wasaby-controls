define([
   'Controls/propertyGrid',
   'Controls/_propertyGrid/Constants',
   'Controls/display',
   'Types/entity',
   'Types/collection',
   'Controls/itemActions'
], function (propertyGridLib, Constants, display, entity, collection, itemActions) {
   describe('Controls/_propertyGrid/PropertyGrid', () => {
      let ViewInstance = new propertyGridLib.PropertyGrid();
      let typeDescription, editingObject;
      beforeEach(() => {
         typeDescription = [
            { name: 'stringField', group: 'text' },
            { name: 'booleanField', editorOptions: { icon: 'testIcon' } },
            { name: 'stringField1' }
         ];
         editingObject = {
            booleanField: false,
            stringField: 'stringValue',
            stringField1: 'stringValue1'
         };
         const groupProperty = 'group';
         const keyProperty = 'name';
         ViewInstance = new propertyGridLib.PropertyGrid();
         ViewInstance._beforeMount({
            typeDescription,
            editingObject,
            groupProperty,
            keyProperty
         });
         ViewInstance._itemActionsController = new itemActions.Controller();
         ViewInstance.saveOptions({
            typeDescription,
            editingObject,
            groupProperty,
            keyProperty
         });
      });

      describe('_getCollapsedGroups', () => {
         const groups = [1, 2, 3];
         const result = {
            1: true,
            2: true,
            3: true
         };
         const collapsedGroups = ViewInstance._getCollapsedGroups(groups);
         expect(collapsedGroups).toEqual(result);
      });

      describe('_updatePropertyValue', () => {
         it('with different propertyValue type', () => {
            let propertyValue = new entity.Model({
               rawData: [],
               keyProperty: 'id'
            });
            let resultPropertyValue = ViewInstance._updatePropertyValue(propertyValue, 'test', 2);
            expect(resultPropertyValue.get('test')).toEqual(2);
            expect(resultPropertyValue === propertyValue).toBeTruthy();

            propertyValue = {};
            resultPropertyValue = ViewInstance._updatePropertyValue(propertyValue, 'test', 2);
            expect(resultPropertyValue.test).toEqual(2);

            propertyValue = new entity.Model({
               rawData: {},
               adapter: 'adapter.sbis',
               keyProperty: 'id'
            });
            let propertyChangedCount = 0;
            propertyValue.subscribe('onPropertyChange', () => {
               propertyChangedCount++;
            });
            resultPropertyValue = ViewInstance._updatePropertyValue(propertyValue, 'test', 2);
            expect(resultPropertyValue.get('test')).toEqual(2);
            expect(resultPropertyValue === propertyValue).toBeTruthy();
            expect(propertyChangedCount === 1).toBeTruthy();

            resultPropertyValue = ViewInstance._updatePropertyValue(propertyValue, 'test2', 0);
            expect(resultPropertyValue.get('test')).toEqual(2);
            expect(resultPropertyValue.get('test2')).toEqual(0);
            expect(resultPropertyValue === propertyValue).toBeTruthy();
            expect(propertyChangedCount === 2).toBeTruthy();
         });
      });

      describe('displayFilter', () => {
         it('not filtered item from collapsed group', () => {
            const options = {
               nodeProperty: 'node',
               parentProperty: 'parent',
               editingObject,
               typeDescription,
               keyProperty: 'name',
               collapsedGroups: ['text']
            };
            const pg = new propertyGridLib.PropertyGrid(options);
            pg._beforeMount(options);

            expect(pg._listModel.getCollapsedGroups()).toEqual(['text']);
            expect(pg._listModel.getCount()).toEqual(4);
         });

         it('not filtered item from collapsed group and groupProperty === name', () => {
            const options = {
               nodeProperty: 'node',
               parentProperty: 'parent',
               editingObject,
               typeDescription,
               keyProperty: 'name',
               groupProperty: 'name',
               collapsedGroups: ['stringField']
            };
            const pg = new propertyGridLib.PropertyGrid(options);
            pg._beforeMount(options);

            expect(pg._listModel.getCollapsedGroups()).toEqual(['stringField']);
            expect(pg._listModel.getCount()).toEqual(5);
         });
         it('filtered groupItem', () => {
            const options = {
               nodeProperty: 'node',
               parentProperty: 'parent',
               editingObject,
               typeDescription,
               keyProperty: 'name'
            };
            const collection1 = ViewInstance._getCollection(options);
            const group = collection1.at(0);
            const resultDisplay = ViewInstance._displayFilter(group.getContents());
            expect(resultDisplay).toBe(true);
         });
      });
      describe('groupClick', () => {
         it('toggle expand state on group item', () => {
            const options = {
               nodeProperty: 'node',
               parentProperty: 'parent',
               editingObject,
               typeDescription,
               keyProperty: 'name'
            };
            const collection1 = ViewInstance._getCollection(options);
            const groupItem = collection1.at(2);
            const expandedState = groupItem.isExpanded();
            let controlResizeNotified = false;
            const clickEvent = {
               target: {
                  closest: () => {
                     return true;
                  }
               }
            };
            ViewInstance._collapsedGroups = {};
            ViewInstance._listModel = collection1;
            ViewInstance._notify = (eventName) => {
               if (eventName === 'controlResize') {
                  controlResizeNotified = true;
               }
            };
            ViewInstance._groupClick(null, groupItem, clickEvent);
            ViewInstance._afterUpdate({});
            expect(expandedState !== groupItem.isExpanded()).toBe(true);
            expect(controlResizeNotified).toBe(true);
         });
      });

      describe('toggledEditors', () => {
         it('collection filtered by toggled editors', () => {
            typeDescription[0].toggleEditorButtonIcon = 'testIcon';
            ViewInstance._beforeMount({
               typeDescription,
               editingObject,
               keyProperty: 'name'
            });
            expect(ViewInstance._toggledEditors).toEqual({
               stringField: false
            });
         });

         it('toggled editors in collection after mount', () => {
            const propertyGridSource = [...typeDescription];
            const propertyGridEditingObject = { ...editingObject };
            typeDescription[0].toggleEditorButtonIcon = 'testIcon';
            const pg = new propertyGridLib.PropertyGrid();
            const options = {
               typeDescription: propertyGridSource,
               editingObject: propertyGridEditingObject,
               keyProperty: 'name'
            };
            pg._beforeMount(options);
            pg.saveOptions(options);
            expect(pg._listModel.getToggledEditors()).toEqual({
               stringField: false
            });
         });
      });

      describe('itemActions', () => {
         it('_updateItemActions', () => {
            const options = {
               nodeProperty: '',
               parentProperty: '',
               editingObject,
               typeDescription,
               keyProperty: 'name'
            };
            const collection1 = ViewInstance._getCollection(options);
            ViewInstance._updateItemActions(collection1, {
               itemActions: []
            });

            expect(ViewInstance._itemActionsController).toBeTruthy();
         });

         it('_onItemActionsMenuResult', () => {
            let isApplyAction = false;
            let isClosed = false;
            const propertyGrid = new propertyGridLib.PropertyGrid({});
            propertyGrid._itemActionsController = {
               getActiveItem: () => {
                  return {
                     getContents: jest.fn()
                  };
               }
            };
            propertyGrid._itemActionSticky = {
               close: () => {
                  isClosed = true;
               }
            };
            propertyGrid._onItemActionsMenuResult(
               'itemClick',
               new entity.Model({
                  rawData: {
                     handler: () => {
                        isApplyAction = true;
                     }
                  },
                  keyProperty: 'id'
               })
            );

            expect(isApplyAction).toBe(true);
            expect(isClosed).toBe(true);
         });

         it('_openItemActionMenu', () => {
            let isOpened = false;
            let actualConfig;
            const propertyGrid = new propertyGridLib.PropertyGrid({});
            propertyGrid._itemActionsController = {
               prepareActionsMenuConfig: () => {
                  return { param: 'menuConfig' };
               },
               setActiveItem: jest.fn()
            };
            propertyGrid._itemActionSticky = {
               open: (menuConfig) => {
                  actualConfig = menuConfig;
                  isOpened = true;
               }
            };
            propertyGrid._openItemActionMenu('item', {}, null);
            expect(isOpened).toBe(true);
            expect(actualConfig.eventHandlers).toBeTruthy();
         });
      });

      describe('removeItems', () => {
         it('hierarchy typeDescription', async () => {
            const editingObject1 = {
               field1: 'fieldValue',
               field2: 'fieldValue'
            };
            const typeDescription1 = new collection.RecordSet({
               rawData: [
                  {
                     name: 'field1',
                     parent: null
                  },
                  {
                     name: 'field2',
                     parent: 'field1'
                  }
               ],
               keyProperty: 'name'
            });
            const options = {
               parentProperty: 'parent',
               editingObject: editingObject1,
               typeDescription: typeDescription1,
               keyProperty: 'name'
            };
            const propertyGrid = new propertyGridLib.PropertyGrid();
            propertyGrid._beforeMount(options);
            propertyGrid.saveOptions(options);

            await propertyGrid.removeItems({
               selected: ['field1'],
               excluded: []
            });
            expect(typeDescription1.getCount() === 1).toBeTruthy();
         });
      });
   });
});
