define(['Controls/_masterDetail/Base'], function (masterDetail) {
   'use strict';
   describe('Controls.Container.MasterDetail', function () {
      it('selected master value changed', () => {
         let Control = new masterDetail.default();
         let event = {
            stopPropagation: jest.fn()
         };
         Control._selectedMasterValueChangedHandler(event, 'newValue');
         expect(Control._selected).toEqual('newValue');
         Control.destroy();
      });

      it('beforeMount', (done) => {
         const Control = new masterDetail.default();
         Control._getSettings = () => {
            return Promise.resolve({ 1: 500 });
         };

         let options = {
            propStorageId: '1',
            masterMinWidth: 100,
            masterWidth: 200,
            masterMaxWidth: 300
         };

         Control._beforeMount(options).then((result) => {
            expect(result).toEqual('300px');
            expect(Control._currentMinWidth).toEqual('100px');
            expect(Control._currentMaxWidth).toEqual('300px');
            Control.destroy();
            done();
         });
      });

      it('initCurrentWidth', () => {
         let Control = new masterDetail.default();
         let options = {
            propStorageId: '1',
            masterMinWidth: 0,
            masterWidth: 0,
            masterMaxWidth: 0
         };
         Control.initCurrentWidth(options.masterWidth);
         expect(Control._currentWidth).toEqual('0px');
         Control.destroy();
      });

      it('update offset', () => {
         let Control = new masterDetail.default();

         // base
         let options = {
            masterMinWidth: 100,
            masterWidth: 200,
            masterMaxWidth: 299,
            propStorageId: 10
         };

         Control._canResizing = Control._isCanResizing(options);
         Control._updateOffset(options);
         expect(Control._minOffset).toEqual(100);
         expect(Control._maxOffset).toEqual(99);
         expect(Control._currentWidth).toEqual('200px');

         Control._beforeUpdate(options);
         expect(Control._minOffset).toEqual(100);
         expect(Control._maxOffset).toEqual(99);
         expect(Control._currentWidth).toEqual('200px');

         // wrong maxWidth
         options = {
            masterMinWidth: 100,
            masterWidth: 200,
            masterMaxWidth: 150
         };
         Control._beforeUpdate(options);
         expect(Control._minOffset).toEqual(50);
         expect(Control._maxOffset).toEqual(0);
         expect(Control._currentWidth).toEqual('150px');

         // wrong minWidth
         options = {
            masterMinWidth: 250,
            masterWidth: 200,
            masterMaxWidth: 299
         };
         Control._beforeUpdate(options);
         expect(Control._minOffset).toEqual(0);
         expect(Control._maxOffset).toEqual(99);
         expect(Control._currentWidth).toEqual('250px');

         options = {
            masterMinWidth: 0,
            masterWidth: 0,
            masterMaxWidth: 0
         };
         Control._beforeUpdate(options);
         expect(Control._minOffset).toEqual(0);
         expect(Control._maxOffset).toEqual(0);
         expect(Control._currentMinWidth).toEqual('0px');
         expect(Control._currentMaxWidth).toEqual('0px');
         expect(Control._currentWidth).toEqual('0px');

         Control.destroy();
      });

      it('_beforeUpdate with new propStorageId', async () => {
         let Control = new masterDetail.default();
         let options = {
            ...masterDetail.default.getDefaultOptions(),
            propStorageId: 'test'
         };
         Control._beforeMount(options);
         options.propStorageId = 'newTest';
         Control._getSettings = () => {
            const result = {
               newTest: 50
            };
            return Promise.resolve(result);
         };
         await Control._beforeUpdate(options);
         expect(Control._currentWidth).toEqual('50px');
         Control.destroy();
      });

      it('_dragStartHandler', () => {
         let Control = new masterDetail.default();
         let options = {
            masterMinWidth: 100,
            masterWidth: 150,
            masterMaxWidth: 200
         };
         Control._options = options;
         Control._canResizing = true;
         Control._dragStartHandler();
         expect(Control._minOffset).toEqual(50);
         expect(Control._maxOffset).toEqual(50);
         expect(Control._currentWidth).toEqual('150px');
         Control.destroy();
      });

      it('is can resizing', () => {
         let Control = new masterDetail.default();
         let options = {
            masterMinWidth: 250,
            masterWidth: 200,
            masterMaxWidth: 299,
            propStorageId: 10
         };
         expect(Control._isCanResizing(options)).toEqual(true);

         options.masterMinWidth = options.masterMaxWidth;
         expect(Control._isCanResizing(options)).toEqual(false);
         Control.destroy();
      });

      it('afterRender', () => {
         const Control = new masterDetail.default();
         let isStartRegister = false;
         Control._startResizeRegister = () => {
            isStartRegister = true;
         };

         Control._afterRender();
         expect(isStartRegister).toEqual(false);

         Control._currentWidth = 1;
         Control._afterRender();
         expect(isStartRegister).toEqual(true);

         Control.destroy();
      });

      it('_afterUpdate', () => {
         const Control = new masterDetail.default();
         const oldOptions = {
            masterVisibility: false
         };
         let isStartRegister = false;
         Control._options = {
            masterVisibility: false
         };
         Control._startResizeRegister = () => {
            isStartRegister = true;
         };

         Control._afterUpdate(oldOptions);
         expect(isStartRegister).toBe(false);

         Control._options.masterVisibility = true;
         Control._afterUpdate(oldOptions);
         expect(isStartRegister).toBe(true);

         Control.destroy();
      });

      it('_resizeHandler with propStorageId', () => {
         const Control = new masterDetail.default();
         let isUpdateOffset = false;
         Control._startResizeRegister = jest.fn();
         Control._updateOffsetDebounced = () => {
            isUpdateOffset = true;
         };

         Control._options = {
            propStorageId: '123'
         };
         Control._container = {
            closest: () => {
               return false;
            }
         };
         Control._resizeHandler();
         expect(isUpdateOffset).toBe(true);

         Control.destroy();
      });

      it('_resizeHandler without propStorageId', () => {
         const Control = new masterDetail.default();
         let isUpdateOffset = false;
         Control._updateOffsetDebounced = () => {
            isUpdateOffset = true;
         };
         Control._startResizeRegister = jest.fn();

         Control._container = {
            closest: () => {
               return false;
            }
         };
         Control._resizeHandler();
         expect(isUpdateOffset).toBe(false);

         Control.destroy();
      });

      it('_startResizeRegister without resizeDetectMaster', () => {
         const Control = new masterDetail.default();
         Control._options = {
            masterVisibility: 'hidden'
         };
         let errorRaised = false;
         Control._children = {
            resizeDetectDetail: {
               start: jest.fn()
            }
         };
         try {
            Control._startResizeRegister();
         } catch (e) {
            errorRaised = true;
         }
         expect(errorRaised).toBe(false);
      });

      it('masterWidthChanged', () => {
         const control = new masterDetail.default();
         const event = {};
         const offset = 100;
         let isSetSettings = false;
         jest.spyOn(control, '_notify').mockClear().mockImplementation();
         control._currentWidth = 100;
         control._setSettings = () => {
            isSetSettings = true;
         };

         control._offsetHandler(event, offset);
         expect(isSetSettings).toEqual(true);

         expect(control._notify).toHaveBeenCalledWith('masterWidthChanged', ['200px']);

         jest.restoreAllMocks();
      });

      it('touch resize', () => {
         const control = new masterDetail.default();
         let isStartDragCalled = false;
         let isEndDragCalled = false;
         let moveOffset = 0;
         let endMoveOffset = 0;
         control._children = {
            resizingLine: {
               startDrag: () => {
                  isStartDragCalled = true;
               },
               drag: (offset) => {
                  moveOffset = offset;
               },
               endDrag: (offset) => {
                  isEndDragCalled = true;
                  endMoveOffset = offset;
               }
            }
         };
         const getFakeEvent = (pageX, target, currentTarget) => {
            return {
               target,
               currentTarget,
               nativeEvent: {
                  changedTouches: [
                     {
                        pageX
                     }
                  ]
               }
            };
         };
         control._needHandleTouch = () => {
            return false;
         };
         control._touchstartHandler(getFakeEvent(1, 2, 3));
         control._touchendHandler(getFakeEvent());
         expect(isStartDragCalled).toEqual(false);
         expect(isEndDragCalled).toEqual(false);

         control._needHandleTouch = () => {
            return true;
         };
         control._canResizing = true;
         control._touchstartHandler(getFakeEvent(10, 'body', 'body'));
         control._touchMoveHandler(getFakeEvent(20, 'body', 'body'));
         control._touchendHandler(getFakeEvent(31, 'body', 'body'));
         expect(moveOffset).toEqual(10);
         expect(endMoveOffset).toEqual(21);

         control.destroy();
      });
   });
});
