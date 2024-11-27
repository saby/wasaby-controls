/**
 * Created by kraynovdo on 23.10.2017.
 */
define(['Controls/list', 'Types/collection', 'Controls/display'], function (
   lists,
   collection,
   controlsDisplay
) {
   describe('Controls.List.ListView', function () {
      var data, data2;
      const DEBOUNCE_HOVERED_ITEM_CHANGED = 150;
      beforeEach(function () {
         data = [
            {
               id: 1,
               title: 'Первый',
               type: 1
            },
            {
               id: 2,
               title: 'Второй',
               type: 2
            },
            {
               id: 3,
               title: 'Третий',
               type: 2
            }
         ];
         data2 = [
            {
               id: 4,
               title: 'Четвертый',
               type: 1
            },
            {
               id: 5,
               title: 'Пятый',
               type: 2
            },
            {
               id: 6,
               title: 'Шестой',
               type: 2
            }
         ];
      });

      it('Item click', function () {
         var model = new controlsDisplay.Collection({
            collection: data,
            keyProperty: 'id',
            markedKey: null
         });
         var cfg = {
            listModel: model,
            keyProperty: 'id',
            markedKey: 2
         };
         var lv = new lists.ListView(cfg);
         lv.saveOptions(cfg);
         lv._beforeMount(cfg);

         var dispItem = lv._listModel.at(2);
         var notifyResult = null;
         lv._notify = function (e, args) {
            notifyResult = args[0];
         };
         lv._onItemClick(
            {
               target: {
                  closest: () => {
                     return null;
                  }
               }
            },
            dispItem
         );
         expect(notifyResult).toEqual(dispItem.getContents());
      });

      it('_beforeUpdate', function () {
         let itemPadding = {
            test: 'test'
         };
         let testData = [...data];
         let testData2 = [...data2];
         testData.at = function (key) {
            return {
               ...testData[key],
               getId: function () {
                  return this.id;
               }
            };
         };
         testData2.at = function (key) {
            return {
               ...testData2[key],
               getId: function () {
                  return this.id;
               }
            };
         };
         let itemPaddingChanged = false;

         var model = new controlsDisplay.Collection({
            collection: testData,
            keyProperty: 'id',
            markedKey: null,
            itemPadding: itemPadding
         });
         var cfg = {
            listModel: model,
            keyProperty: 'id',
            markedKey: 2,
            itemPadding: itemPadding
         };
         var lv = new lists.ListView(cfg);
         lv.saveOptions(cfg);
         lv._beforeMount(cfg);

         lv._beforeUpdate(cfg);

         model = new controlsDisplay.Collection({
            collection: testData2,
            keyProperty: 'id',
            markedKey: null,
            itemPadding: itemPadding
         });

         cfg = {
            listModel: model,
            keyProperty: 'id',
            markedKey: 2,
            itemPadding: itemPadding
         };
         lv._beforeUpdate(cfg);
         expect(model).toEqual(lv._listModel);

         cfg.itemPadding = {
            test: 'test'
         };
         model.setItemPadding = function () {
            itemPaddingChanged = true;
         };
         lv._beforeUpdate(cfg);
         expect(itemPaddingChanged).toBe(false);
      });

      it('should not notify about resize by hoveredItemChanged, activeItemChanged or markedKeyChanged', function () {
         var cfg = {
               listModel: new controlsDisplay.Collection({
                  collection: [],
                  keyProperty: 'id'
               }),
               keyProperty: 'id'
            },
            listView = new lists.ListView(cfg);
         listView.saveOptions(cfg);
         listView._beforeMount(cfg);
         var stubControlResize = jest.spyOn(listView, '_notify').mockClear().mockImplementation();

         listView._listModel._notify('onCollectionChange', 'ch', {
            properties: 'marked'
         });
         listView._listModel._notify('onCollectionChange', 'ch', {
            properties: 'hovered'
         });
         listView._listModel._notify('onCollectionChange', 'ch', {
            properties: 'active'
         });
         listView._beforeUpdate(cfg);
         listView._afterUpdate();
         expect(stubControlResize).not.toHaveBeenCalledWith('controlResize', [], {
            bubbling: true
         });
      });

      it('should not notify about resize by swipe, swipeAnimation', function () {
         const cfg = {
            listModel: new controlsDisplay.Collection({
               collection: [],
               keyProperty: 'id'
            }),
            keyProperty: 'id'
         };
         const listView = new lists.ListView(cfg);
         listView.saveOptions(cfg);
         listView._beforeMount(cfg);
         const stubControlResize = jest.spyOn(listView, '_notify').mockClear().mockImplementation();

         listView._listModel._notify('onCollectionChange', 'ch', {
            properties: 'swipe'
         });
         listView._listModel._notify('onCollectionChange', 'ch', {
            properties: 'swipeAnimation'
         });
         listView._beforeUpdate(cfg);
         listView._afterUpdate();
         expect(stubControlResize).not.toHaveBeenCalledWith('controlResize', [], {
            bubbling: true
         });
      });

      it('_onItemMouseEnter', function () {
         jest.useFakeTimers();
         var fakeHTMLElement = {
               className: 'controls-ListView__itemV'
            },
            fakeEvent = {
               target: {
                  closest: function (selector) {
                     if (selector === '.controls-ListView__itemV') {
                        return fakeHTMLElement;
                     }
                  }
               }
            },
            fakeItemData = {
               contents: {}
            },
            model = new controlsDisplay.Collection({
               collection: data,
               keyProperty: 'id',
               markedKey: null
            }),
            cfg = {
               listModel: model,
               keyProperty: 'id'
            },
            lv = new lists.ListView(cfg);
         jest.spyOn(lv, '_notify').mockClear().mockImplementation();
         lv._onItemMouseEnter(fakeEvent, fakeItemData);
         expect(lv._notify).toHaveBeenCalledTimes(1);
         expect(lv._notify).toHaveBeenCalledWith('itemMouseEnter', [fakeItemData, fakeEvent]);

         jest.advanceTimersByTime(DEBOUNCE_HOVERED_ITEM_CHANGED);
         jest.useRealTimers();

         expect(lv._notify).toHaveBeenCalledTimes(2);
         expect(lv._notify).toHaveBeenCalledWith('hoveredItemChanged', [
            fakeItemData.contents,
            fakeHTMLElement
         ]);
      });

      describe('_onItemContextMenu', function () {
         it('contextMenuVisibility: true', function () {
            var model = new controlsDisplay.Collection({
                  collection: data,
                  keyProperty: 'id',
                  markedKey: null
               }),
               cfg = {
                  listModel: model,
                  keyProperty: 'id',
                  contextMenuVisibility: true
               },
               lv = new lists.ListView(cfg),
               fakeItemData = {},
               fakeNativeEvent = {};
            lv.saveOptions(cfg);
            lv._beforeMount(cfg);

            lv._notify = function (eventName, eventArgs, eventOptions) {
               expect(eventName).toEqual('itemContextMenu');
               expect(eventArgs.length).toEqual(3);
               expect(eventArgs[0]).toEqual(fakeItemData);
               expect(eventArgs[1]).toEqual(fakeNativeEvent);
               expect(eventArgs[2]).toBe(false);
               expect(eventOptions).not.toBeDefined();
            };
            lv._onItemContextMenu(fakeNativeEvent, fakeItemData);
         });
         it('contextMenuVisibility: false', function () {
            var model = new controlsDisplay.Collection({
                  collection: data,
                  keyProperty: 'id',
                  markedKey: null
               }),
               cfg = {
                  listModel: model,
                  keyProperty: 'id',
                  contextMenuVisibility: false
               },
               lv = new lists.ListView(cfg),
               fakeItemData = {},
               fakeNativeEvent = {};
            lv.saveOptions(cfg);
            lv._beforeMount(cfg);

            lv._notify = function () {
               throw new Error(
                  "itemContextMenu event shouldn't fire if contextMenuVisibility is false"
               );
            };
            lv._onItemContextMenu(fakeNativeEvent, fakeItemData);
         });
         it('itemContextMenu event should fire if contextMenuVisibility: true and the list has no editing items', function () {
            var model = new controlsDisplay.Collection({
                  collection: data,
                  keyProperty: 'id',
                  markedKey: null
               }),
               cfg = {
                  listModel: model,
                  keyProperty: 'id',
                  contextMenuVisibility: true
               },
               lv = new lists.ListView(cfg),
               notifyStub = jest.spyOn(lv, '_notify').mockClear().mockImplementation();
            lv.saveOptions(cfg);
            lv._beforeMount(cfg);
            jest.spyOn(model, 'isEditing').mockClear().mockReturnValue(false);

            lv._onItemContextMenu({}, {});
            expect(notifyStub).toHaveBeenCalledTimes(1);
            expect(notifyStub).toHaveBeenCalledWith('itemContextMenu', [{}, {}, false]);
         });
      });

      it('debounced setHoveredItem', function () {
         jest.useFakeTimers();
         var model = new controlsDisplay.Collection({
            collection: new collection.RecordSet({
               rawData: data,
               keyProperty: 'id'
            }),
            keyProperty: 'id'
         });
         var cfg = {
            listModel: model,
            keyProperty: 'id'
         };
         var lv1 = new lists.ListView(cfg);
         var lv2 = new lists.ListView(cfg);
         lv1._hoveredItem = 1;
         lv2._hoveredItem = 1;
         jest.spyOn(lv1, '_notify').mockClear().mockImplementation();
         jest.spyOn(lv2, '_notify').mockClear().mockImplementation();

         lv1._onItemMouseLeave({}, {});
         lv2._onItemMouseLeave({}, {});

         jest.advanceTimersByTime(DEBOUNCE_HOVERED_ITEM_CHANGED);
         jest.useRealTimers();

         expect(lv1._notify).toHaveBeenCalledTimes(2);
         expect(lv1._notify).toHaveBeenCalledWith('hoveredItemChanged', expect.anything());
         expect(lv1._notify).toHaveBeenCalledWith('itemMouseLeave', expect.anything());
         expect(lv2._notify).toHaveBeenCalledTimes(2);
         expect(lv2._notify).toHaveBeenCalledWith('hoveredItemChanged', expect.anything());
         expect(lv2._notify).toHaveBeenCalledWith('itemMouseLeave', expect.anything());
      });

      describe('_afterMount', function () {
         it("should not fire markedKeyChanged if _options.markerVisibility is 'visible', but markedKey is not undefined", function () {
            var model = new controlsDisplay.Collection({
               collection: new collection.RecordSet({
                  rawData: data,
                  keyProperty: 'id'
               }),
               keyProperty: 'id',
               markerVisibility: 'visible'
            });
            var cfg = {
               listModel: model,
               keyProperty: 'id',
               markerVisibility: 'visible',
               markedKey: null
            };
            var lv = new lists.ListView(cfg);
            lv.saveOptions(cfg);
            lv._beforeMount(cfg);

            var notifyCalled = false;
            lv._notify = function (eventName) {
               if (eventName === 'markedKeyChanged') {
                  notifyCalled = true;
               }
            };

            lv._afterMount();
            expect(notifyCalled).toBe(false);
         });

         it("should not fire markedKeyChanged if _options.markerVisibility is not 'visible'", function () {
            var model = new controlsDisplay.Collection({
               collection: new collection.RecordSet({
                  rawData: data,
                  keyProperty: 'id'
               }),
               keyProperty: 'id'
            });
            var cfg = {
               listModel: model,
               keyProperty: 'id'
            };
            var lv = new lists.ListView(cfg);
            lv.saveOptions(cfg);
            lv._beforeMount(cfg);

            var notifyCalled = false;
            lv._notify = function (eventName) {
               if (eventName === 'markedKeyChanged') {
                  notifyCalled = true;
               }
            };

            lv._afterMount();
            expect(notifyCalled).toBe(false);
         });
      });
   });
});
