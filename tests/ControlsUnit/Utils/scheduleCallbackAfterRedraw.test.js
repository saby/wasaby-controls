define(['Controls/Utils/scheduleCallbackAfterRedraw'], function (scheduleCallbackAfterRedraw) {
   describe('Controls.Utils.scheduleCallbackAfterRedraw', function () {
      it('should call callback only if _beforeUpdate was called before _afterUpdate', function () {
         var _beforeUpdate = jest.fn(),
            _afterUpdate = jest.fn(),
            instance = {
               _beforeUpdate,
               _afterUpdate
            },
            callback = jest.fn();

         scheduleCallbackAfterRedraw.default(instance, callback);
         instance._afterUpdate();
         expect(callback).not.toHaveBeenCalled();
         instance._beforeUpdate();
         expect(callback).not.toHaveBeenCalled();
         instance._afterUpdate();
         expect(callback).toHaveBeenCalled();
      });

      it('should restore _beforeUpdate and _afterUpdate to original values after update', function () {
         var _beforeUpdate = jest.fn(),
            _afterUpdate = jest.fn(),
            instance = {
               _beforeUpdate,
               _afterUpdate
            };

         scheduleCallbackAfterRedraw.default(instance, jest.fn());
         instance._beforeUpdate();
         instance._afterUpdate();
         expect(instance._beforeUpdate).toEqual(_beforeUpdate);
         expect(instance._afterUpdate).toEqual(_afterUpdate);
      });

      it("should work even if instance doesn't have _beforeUpdate\\_afterUpdate", function () {
         var instance = {},
            callback = jest.fn();

         scheduleCallbackAfterRedraw.default(instance, callback);
         instance._beforeUpdate();
         expect(callback).not.toHaveBeenCalled();
         instance._afterUpdate();
         expect(callback).toHaveBeenCalled();
         expect(instance._beforeUpdate).not.toBeDefined();
         expect(instance._afterUpdate).not.toBeDefined();
      });
   });
});
