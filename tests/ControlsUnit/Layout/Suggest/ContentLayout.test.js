define(['Controls/_suggestPopup/Layer/__ContentLayer'], function (__ContentLayer) {
   describe('Controls._suggestPopup.Layer.__ContentLayer', function () {
      var getComponentObject = function () {
         var self = {};
         self._options = {};
         self._options.suggestTemplate = {};
         self._options.footerTemplate = {};
         return self;
      };

      var getContainer = function (size) {
         return {
            style: { height: '' },
            getBoundingClientRect: function () {
               return {
                  toJSON: function () {
                     return size;
                  }
               };
            }
         };
      };

      var getContainerIE = function (size) {
         return {
            style: { height: '' },
            getBoundingClientRect: function () {
               return {
                  __proto__: size
               };
            }
         };
      };

      var getDropDownContainer = function (height) {
         return {
            getBoundingClientRect: function () {
               return {
                  bottom: 0,
                  top: 0,
                  height: height
               };
            }
         };
      };

      it('Suggest::close', function () {
         var suggestComponent = new __ContentLayer.default();
         var closed = false;

         suggestComponent._notify = function (event) {
            if (event === 'close') {
               closed = true;
            }
         };
         suggestComponent.close();
         expect(closed).toBe(true);
      });

      it('Suggest::_private.calcHeight', function () {
         var self = getComponentObject();

         self._container = getContainer({
            top: 100,
            bottom: 0,
            height: 400
         });
         self._options.target = getContainer({
            bottom: 324,
            top: 300
         });
         self._height = 'auto';
         expect(
            __ContentLayer.default._private.calcHeight(self, getDropDownContainer(900))
         ).toEqual('auto');
         expect(
            __ContentLayer.default._private.calcHeight(self, getDropDownContainer(400))
         ).toEqual('300px');
         self._height = '76px';
         expect(
            __ContentLayer.default._private.calcHeight(self, getDropDownContainer(900))
         ).toEqual('auto');
      });

      it('Suggest::_private.getSizes', function () {
         var self = getComponentObject();

         self._container = getContainerIE({
            top: 100,
            bottom: 0,
            height: 400
         });
         self._options.target = getContainerIE({
            bottom: 324,
            top: 300
         });
         self._height = 'auto';
         var sizes = __ContentLayer.default._private.getSizes(self, getDropDownContainer(900));
         expect(sizes.suggest).toEqual({ top: 100, bottom: 0, height: 400 });
         expect(sizes.container).toEqual({ bottom: 324, top: 300 });
      });

      it('Suggest::_private.updateHeight', function () {
         var self = getComponentObject();
         self._height = '200px';
         self._forceUpdate = jest.fn();
         __ContentLayer.default._private.calcHeight = function () {
            return '400px';
         };
         __ContentLayer.default._private.updateHeight(self, false);
         expect(self._height).toEqual('400px');
      });

      it('Suggest::_private.updateMaxHeight', function () {
         var self = getComponentObject();
         self._forceUpdate = jest.fn();
         __ContentLayer.default._private.getDropDownContainerSize = function () {
            return { height: 500 };
         };
         self._container = getContainerIE({ top: 40 });

         __ContentLayer.default._private.updateMaxHeight(self);
         expect(self._maxHeight).toEqual('460px');
      });

      it('Suggest::_afterUpdate', function () {
         const layer = new __ContentLayer.default();
         let resizeStarted = false;

         layer.saveOptions({
            showContent: true
         });
         layer._controlResized = true;

         layer._children = {
            resize: {
               start: () => {
                  resizeStarted = true;
               }
            }
         };
         jest
            .spyOn(__ContentLayer.default._private, 'updateHeight')
            .mockClear()
            .mockImplementation();
         jest
            .spyOn(__ContentLayer.default._private, 'determineOpenDirection')
            .mockClear()
            .mockImplementation();
         __ContentLayer.default._private.getScrollContainerSize = function () {
            return { top: 0 };
         };
         layer._container = getContainer({ top: 0 });
         layer._showContent = false;

         layer._afterUpdate();
         expect(resizeStarted).toBe(true);
         expect(layer._showContent).toBe(true);
      });

      it('updateMaxHeight when resized', function () {
         const layer = new __ContentLayer.default();
         let maxHeightUpdated = false;
         const updateMaxHeight = __ContentLayer.default._private.updateMaxHeight;
         layer._container = getContainer({ top: 0 });
         __ContentLayer.default._private.getDropDownContainerSize = () => {
            return { height: 500 };
         };
         __ContentLayer.default._private.updateMaxHeight = (self) => {
            maxHeightUpdated = true;
            updateMaxHeight(self);
         };
         __ContentLayer.default._private.determineOpenDirection = jest.fn();
         layer._resize();
         expect(maxHeightUpdated).toBe(true);
      });
   });
});
