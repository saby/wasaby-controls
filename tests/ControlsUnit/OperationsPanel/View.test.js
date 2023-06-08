define([
   'Controls/operations',
   'Controls/operationsPanel',
   'Types/source',
   'Controls/_operationsPanel/OperationsPanel/Utils',
   'Controls/toolbars',
   'Types/entity',
   'Types/collection',
   'UI/Utils'
], function (
   View,
   ViewPanel,
   sourceLib,
   WidthUtils,
   toolbars,
   entity,
   collection,
   { Logger }
) {
   function mockFillItemsType(itemsSizes) {
      return function fillItemsType(
         keyProperty,
         parentProperty,
         items,
         availableWidth
      ) {
         var visibleItemsKeys = [],
            currentWidth = itemsSizes.reduce(function (acc, size) {
               return acc + size;
            }, 0);

         items.each(function (item) {
            if (!item.get(parentProperty)) {
               visibleItemsKeys.push(item.get(keyProperty));
            }
         });

         if (visibleItemsKeys.length > 1 && currentWidth > availableWidth) {
            for (var i = visibleItemsKeys.length - 1; i >= 0; i--) {
               items
                  .getRecordById(visibleItemsKeys[i])
                  .set('showType', currentWidth > availableWidth ? 0 : 1);
               currentWidth -= itemsSizes[i];
            }
         } else {
            items.each(function (item) {
               item.set('showType', 2);
            });
         }

         return items;
      };
   }

   describe('Controls/_operationsPanel/OperationsPanel', function () {
      var instance,
         oldFillItemsType,
         data = [
            {
               id: 0,
               title: 'print'
            },
            {
               id: 1,
               title: 'unload'
            }
         ],
         cfg = {
            source: new sourceLib.Memory({
               keyProperty: 'id',
               data: data
            }),
            keyProperty: 'id'
         },
         cfgWithOneItem = {
            source: new sourceLib.Memory({
               keyProperty: 'id',
               data: [data[0]]
            }),
            keyProperty: 'id'
         },
         cfgWithoutItems = {
            keyProperty: 'id'
         };

      beforeEach(function () {
         instance = new ViewPanel.OperationsPanel();
         instance._container = {
            offsetParent: 100
         };
         instance.saveOptions(cfg);
         oldFillItemsType = WidthUtils.fillItemsType;
      });

      afterEach(function () {
         WidthUtils.fillItemsType = oldFillItemsType;
         instance = null;
      });

      describe('_beforeMount', function () {
         /*         it('several items', async() => {
            expect(instance._initialized).toBe(false);
            const items = await instance._beforeMount(cfg);
            expect(instance._initialized).toBe(false);
            expect(instance._items.getRawData()).toEqual(data);
            expect(!items).toBeTruthy();
         }); */

         it('without items', () => {
            expect(instance._initialized).toBe(false);
            instance._beforeMount(cfgWithoutItems);
         });

         it('without source', () => {
            var cfgWithoutSource = {
               keyProperty: 'id'
            };
            instance._initialized = false;
            instance._beforeMount(cfgWithoutSource);
         });
      });

      describe('_afterMount', function () {
         it('enough space', function (done) {
            var notifyCalled = false;
            instance._children = {
               toolbarBlock: {
                  clientWidth: 360
               }
            };
            WidthUtils.fillItemsType = mockFillItemsType([80, 90]);
            instance._beforeMount(cfg).addCallback(function () {
               instance.saveOptions(cfg);
               expect(instance._initialized).toBe(false);
               instance._notify = function (eventName) {
                  expect(eventName).toEqual('operationsPanelOpened');
                  notifyCalled = true;
               };
               instance._afterMount();
               expect(instance._initialized).toBe(true);
               expect(notifyCalled).toBe(true);
               instance._toolbarSource.query().addCallback(function (result) {
                  expect(
                     result.getAll().getRecordById(0).get('showType')
                  ).toEqual(2);
                  expect(
                     result.getAll().getRecordById(1).get('showType')
                  ).toEqual(2);
                  done();
               });
            });
         });

         it('not enough space', function (done) {
            instance._children = {
               toolbarBlock: {
                  clientWidth: 100
               }
            };
            instance._forceUpdate = jest.fn();
            WidthUtils.fillItemsType = mockFillItemsType([80, 90]);
            instance._beforeMount(cfg).addCallback(function () {
               instance.saveOptions(cfg);
               expect(instance._initialized).toBe(false);
               instance._afterMount();
               expect(instance._initialized).toBe(true);
               instance._toolbarSource.query().addCallback(function (result) {
                  expect(
                     result.getAll().getRecordById(0).get('showType')
                  ).toEqual(1);
                  expect(
                     result.getAll().getRecordById(1).get('showType')
                  ).toEqual(0);
                  done();
               });
            });
         });

         it('resize event on afterMount', async () => {
            let resizeEventFired = false;
            instance._notify = (eventName) => {
               if (eventName === 'controlResize') {
                  resizeEventFired = true;
               }
            };
            instance._children = {
               toolbarBlock: {
                  clientWidth: 100
               }
            };
            WidthUtils.fillItemsType = mockFillItemsType([80, 90]);
            await instance._beforeMount(cfg);
            instance.saveOptions(cfg);
            instance._afterMount();
            expect(resizeEventFired).toBe(false);
            expect(instance._initialized).toBe(true);

            instance._beforeUpdate(cfg);
            instance._afterUpdate(cfg);
            expect(resizeEventFired).toBe(true);
         });
      });

      describe('_beforeUpdate', function () {
         it('old source', function (done) {
            var forceUpdateCalled = false;
            instance._children = {
               toolbarBlock: {
                  clientWidth: 100
               }
            };
            WidthUtils.fillItemsType = mockFillItemsType([80, 90]);
            instance._beforeMount(cfg).addCallback(function () {
               instance._afterMount();
               instance._forceUpdate = function () {
                  forceUpdateCalled = true;
               };
               instance._beforeUpdate(cfg);
               expect(forceUpdateCalled).toBe(false);
               done();
            });
         });
         it('new source', function (done) {
            var forceUpdateCalled = false,
               newCfg = {
                  source: new sourceLib.Memory({
                     keyProperty: 'id',
                     data: data
                  }),
                  keyProperty: 'id'
               };
            instance._children = {
               toolbarBlock: {
                  clientWidth: 100
               }
            };
            WidthUtils.fillItemsType = mockFillItemsType([80, 90]);
            instance._beforeMount(cfg).addCallback(function () {
               instance._afterMount();
               instance._forceUpdate = function () {
                  forceUpdateCalled = true;
               };
               instance._beforeUpdate(newCfg);
               expect(forceUpdateCalled).toBe(false);
               done();
            });
         });
      });

      describe('_afterUpdate', function () {
         it('old source', function (done) {
            var forceUpdateCalled = false;
            instance._children = {
               toolbarBlock: {
                  clientWidth: 100
               }
            };
            WidthUtils.fillItemsType = mockFillItemsType([80, 90]);
            instance._beforeMount(cfg).addCallback(function () {
               instance._afterMount();
               instance._forceUpdate = function () {
                  forceUpdateCalled = true;
               };
               instance._afterUpdate(cfg);
               expect(forceUpdateCalled).toBe(false);
               done();
            });
         });
         it('new source', function (done) {
            var newCfg = {
               source: new sourceLib.Memory({
                  keyProperty: 'id',
                  data: data
               }),
               keyProperty: 'id'
            };
            instance._children = {
               toolbarBlock: {
                  clientWidth: 100
               }
            };
            WidthUtils.fillItemsType = mockFillItemsType([80, 90]);
            instance._beforeMount(cfg).addCallback(function () {
               instance._afterMount();
               instance._forceUpdate = jest.fn();
               instance._afterUpdate(newCfg);
               done();
            });
         });
         it('enough space', function (done) {
            instance._children = {
               toolbarBlock: {
                  clientWidth: 360
               }
            };
            instance._forceUpdate = jest.fn();
            WidthUtils.fillItemsType = mockFillItemsType([80, 90]);
            instance._beforeMount(cfg).addCallback(function () {
               instance._afterUpdate(cfg);
               instance._toolbarSource.query().addCallback(function (result) {
                  expect(
                     result.getAll().getRecordById(0).get('showType')
                  ).toEqual(2);
                  expect(
                     result.getAll().getRecordById(1).get('showType')
                  ).toEqual(2);
                  done();
               });
            });
         });

         it('not enough space', function (done) {
            instance._children = {
               toolbarBlock: {
                  clientWidth: 100
               }
            };
            instance._forceUpdate = jest.fn();
            WidthUtils.fillItemsType = mockFillItemsType([80, 90]);
            instance._beforeMount(cfg).addCallback(function () {
               instance._afterUpdate(cfg);
               instance._toolbarSource.query().addCallback(function (result) {
                  expect(
                     result.getAll().getRecordById(0).get('showType')
                  ).toEqual(1);
                  expect(
                     result.getAll().getRecordById(1).get('showType')
                  ).toEqual(0);
                  done();
               });
            });
         });

         it('not enough space for one item', function (done) {
            instance._children = {
               toolbarBlock: {
                  clientWidth: 50
               }
            };
            instance._forceUpdate = jest.fn();
            WidthUtils.fillItemsType = mockFillItemsType([80]);
            instance._beforeMount(cfgWithOneItem).addCallback(function () {
               instance._options = cfgWithOneItem;
               instance._afterUpdate(cfgWithOneItem);
               instance._toolbarSource.query().addCallback(function (result) {
                  expect(
                     result.getAll().getRecordById(0).get('showType')
                  ).toEqual(2);
                  done();
               });
            });
         });
      });

      describe('_onResize', function () {
         it('enough space', function (done) {
            instance._children = {
               toolbarBlock: {
                  clientWidth: 360
               }
            };
            instance._forceUpdate = jest.fn();
            WidthUtils.fillItemsType = mockFillItemsType([80, 90]);
            instance._beforeMount(cfg).addCallback(function () {
               instance._onResize();
               instance._toolbarSource.query().addCallback(function (result) {
                  expect(
                     result.getAll().getRecordById(0).get('showType')
                  ).toEqual(2);
                  expect(
                     result.getAll().getRecordById(1).get('showType')
                  ).toEqual(2);
                  done();
               });
            });
         });

         it('not enough space', function (done) {
            instance._children = {
               toolbarBlock: {
                  clientWidth: 100
               }
            };
            instance._forceUpdate = jest.fn();
            WidthUtils.fillItemsType = mockFillItemsType([80, 90]);
            instance._beforeMount(cfg).addCallback(function () {
               instance._onResize();
               instance._toolbarSource.query().addCallback(function (result) {
                  expect(
                     result.getAll().getRecordById(0).get('showType')
                  ).toEqual(1);
                  expect(
                     result.getAll().getRecordById(1).get('showType')
                  ).toEqual(0);
                  done();
               });
            });
         });
      });

      it('panel is not visible', function (done) {
         var forceUpdateCalled = false;
         instance._container = {
            offsetParent: null
         };
         instance._children = {
            toolbarBlock: {
               clientWidth: 100
            }
         };
         WidthUtils.fillItemsType = mockFillItemsType([80, 90]);
         instance._beforeMount(cfg).addCallback(function () {
            instance._afterMount();
            instance._forceUpdate = function () {
               forceUpdateCalled = true;
            };
            instance._children.toolbarBlock.clientWidth = 0;
            instance._afterUpdate(cfg);
            expect(forceUpdateCalled).toBe(false);
            done();
         });
      });
   });

   describe('Controls/_operationsPanel/OperationsPanel/Utils', () => {
      describe('getContentTemplate', () => {
         it('returns itemTemplate from item if it has one', () => {
            const fakeItem = {
               get: (name) => {
                  return name === 'customTemplate'
                     ? 'this template'
                     : 'wrong field';
               }
            };
            expect(
               WidthUtils._private.getContentTemplate(
                  fakeItem,
                  'default',
                  'customTemplate'
               )
            ).toBe('this template');
         });

         it('returns itemTemplate from panel if item does not have one', () => {
            const fakeItem = {
               get: (name) => {
                  return name === 'myOwnTemplate' ? null : 'wrong field';
               }
            };
            expect(
               WidthUtils._private.getContentTemplate(
                  fakeItem,
                  'default template',
                  'myOwnTemplate'
               )
            ).toBe('default template');
         });

         it('returns nothing if no template is specified', () => {
            const fakeItem = {
               get: () => {
                  return null;
               }
            };
            expect(
               WidthUtils._private.getContentTemplate(fakeItem, null, null)
            ).toBeFalsy();
         });

         it('returns nothing if default template is toolbars:ItemTemplate', () => {
            const fakeItem = {
               get: (name) => {
                  return name === 'myOwnTemplate' ? null : 'wrong field';
               }
            };
            expect(
               WidthUtils._private.getContentTemplate(
                  fakeItem,
                  toolbars.ItemTemplate,
                  'myOwnTemplate'
               )
            ).toBeFalsy();
         });
      });

      describe('getButtonTemplateOptionsForItem', () => {
         let itemWithCaptionAndIcon = new entity.Model({
            keyProperty: 'id',
            rawData: {
               id: 'testId',
               caption: 'testCaption',
               icon: 'testIcon',
               viewMode: 'outlined'
            }
         });
         let itemWithItemTemplateProperty = new entity.Model({
            keyProperty: 'id',
            rawData: {
               id: 'testId',
               caption: 'testCaption',
               icon: 'testIcon',
               templateProperty: 'testTemplateProperty',
               viewMode: 'outlined'
            }
         });
         let getExpectedOptions = () => {
            return {
               _hoverIcon: true,
               _buttonStyle: 'secondary',
               _translucent: false,
               _contrastBackground: undefined,
               _fontSize: 'm',
               _hasIcon: true,
               _caption: '',
               _stringCaption: true,
               _captionPosition: 'end',
               _icon: undefined,
               _iconSize: 'm',
               _iconStyle: 'secondary',
               _isSVGIcon: false,
               _fontColorStyle: undefined,
               _height: 'default',
               _viewMode: 'outlined',
               readOnly: undefined
            };
         };

         beforeEach(() => {
            jest.spyOn(Logger, 'error').mockClear().mockImplementation();
         });

         it('get options for item with caption and icon', () => {
            const expectedOptions = getExpectedOptions();
            expectedOptions._icon = 'testIcon';
            expectedOptions._caption = 'testCaption';
            expect(
               WidthUtils._private.getButtonTemplateOptionsForItem(
                  itemWithCaptionAndIcon
               )
            ).toEqual(expectedOptions);
            expect(Logger.error).not.toHaveBeenCalled();
         });

         it('get options for item with caption, icon and itemTemplateProperty', () => {
            const expectedOptions = getExpectedOptions();
            expectedOptions._icon = 'testIcon';
            expectedOptions._caption = 'testCaption';
            expect(
               WidthUtils._private.getButtonTemplateOptionsForItem(
                  itemWithItemTemplateProperty
               )
            ).toEqual(expectedOptions);
            expect(Logger.error).not.toHaveBeenCalled();
         });
      });

      it('setShowType', () => {
         let items = new collection.List({
            items: [
               new entity.Model({
                  rawData: { id: 1 },
                  keyProperty: 'id'
               }),
               new entity.Model({
                  rawData: { id: 2 },
                  keyProperty: 'id'
               })
            ]
         });

         WidthUtils._private.setShowType(items, 1);
         expect(items.at(0).get('showType')).toEqual(1);
         expect(items.at(1).get('showType')).toEqual(1);
      });
   });
});
