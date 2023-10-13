define(['Controls/input'], function (input) {
   'use strict';

   describe('Controls/input:CarriagePositionWhenFocus', function () {
      let inst;
      let positionChanged;
      beforeEach(function () {
         inst = new input.__CarriagePositionWhenFocus(() => {
            return positionChanged;
         });
      });
      it('Фокусировка поля по tab. После фокуса позиция каретки обновляется.', function () {
         positionChanged = true;
         expect(inst.focusHandler()).toBe(true);
         expect(inst.focusHandler()).toBe(false);
      });
      it('Фокусировка поля по tab. После фокуса позиция каретки не обновляется.', function () {
         positionChanged = false;
         expect(inst.focusHandler()).toBe(false);
         expect(inst.focusHandler()).toBe(false);
      });
      it('Фокусировка поля по tab. Смена режима с чтения на редактирование', function () {
         positionChanged = true;
         expect(inst.focusHandler()).toBe(true);
         inst.editingModeWasChanged(true, false);
         expect(inst.focusHandler()).toBe(true);
      });
      it('Фокусировка поля по tab. Смена режима с редактирования на чтение.', function () {
         positionChanged = true;
         expect(inst.focusHandler()).toBe(true);
         inst.editingModeWasChanged(false, true);
         expect(inst.focusHandler()).toBe(false);
      });
      it('Фокусировка поля по кнопке мыши. После фокуса позиция каретки обновляется.', function () {
         positionChanged = true;
         inst.mouseDownHandler();
         expect(inst.focusHandler()).toBe(false);
      });
      it('Фокусировка поля по кнопке мыши. После фокуса позиция каретки не обновляется.', function () {
         positionChanged = false;
         inst.mouseDownHandler();
         expect(inst.focusHandler()).toBe(false);
      });
   });
});
