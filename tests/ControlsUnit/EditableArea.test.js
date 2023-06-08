define([
   'Controls/editableArea',
   'Types/entity',
   'Core/Deferred',
   'Controls/list'
], function (editableArea, entity, Deferred, Constants) {
   'use strict';

   describe('Controls.editableArea:View', function () {
      var eventQueue, instance, cfg, cfg2;
      beforeEach(function () {
         eventQueue = [];
         instance = new editableArea.View();
         cfg = {
            autoEdit: true,
            editingObject: entity.Model.fromObject({
               text: 'qwerty'
            })
         };
         cfg2 = {
            autoEdit: false,
            editingObject: entity.Model.fromObject({
               text: 'test'
            })
         };
      });
      afterEach(function () {
         instance = null;
      });

      function mockNotify(returnValue) {
         return function (event, eventArgs, eventOptions) {
            eventQueue.push({
               event: event,
               eventArgs: eventArgs,
               eventOptions: eventOptions
            });
            return returnValue;
         };
      }

      it('_beforeMount', function () {
         instance._beforeMount(cfg);
         expect(cfg.isEditing).toEqual(instance.editWhenFirstRendered);
      });

      describe('_onClickHandler', function () {
         it('isEditing: true', function () {
            var result = false;
            instance.saveOptions({
               readOnly: false
            });
            instance._beforeMount(cfg);
            instance.beginEdit = function () {
               result = true;
            };
            instance._onClickHandler();
            expect(result).toBe(false);
         });
         it('isEditing: false', function () {
            var result = false;
            instance.saveOptions({
               readOnly: false
            });
            instance._beforeMount(cfg2);
            instance.beginEdit = function () {
               result = true;
            };
            instance._onClickHandler();
            expect(result).toBe(true);
         });
      });

      describe('_onDeactivatedHandler', function () {
         var result = null;
         beforeEach(function () {
            instance.commitEdit = function () {
               result = true;
            };
         });
         afterEach(function () {
            result = null;
         });

         it('commitOnDeactivate: true, isEditing: true', function () {
            instance.saveOptions({
               readOnly: false
            });
            instance._beforeMount(cfg);
            instance._onDeactivatedHandler();
            expect(result).toBe(true);
         });

         it('if EditableArea has toolbar then changes should not commit on deactivated', function () {
            cfg = {
               readOnly: false,
               toolbarVisible: true,
               ...cfg
            };
            const event = {
               stopPropagation: jest.fn()
            };
            result = false;
            instance.saveOptions(cfg);
            instance._beforeMount(cfg);
            instance._onDeactivatedHandler();
            expect(result).toBe(true);

            result = false;
            instance._registerEditableAreaToolbar(event);
            instance._onDeactivatedHandler();
            expect(result).toBe(false);
         });
      });

      describe('_onKeyDown', function () {
         it('Enter', function () {
            var result = false;
            instance._beforeMount(cfg);
            instance.commitEdit = function () {
               result = true;
            };
            instance._onKeyDown({
               nativeEvent: {
                  keyCode: 13
               }
            });
            expect(result).toBe(true);
         });
         it('Esc', function () {
            var result = false;
            instance._beforeMount(cfg);
            instance.cancelEdit = function () {
               result = true;
            };
            instance._onKeyDown({
               nativeEvent: {
                  keyCode: 27
               },
               preventDefault: jest.fn(),
               stopPropagation: jest.fn()
            });
            expect(result).toBe(true);
         });
      });

      describe('beginEdit', function () {
         var event = {
            target: {
               closest: function (selector) {
                  return selector === '.controls-EditableArea__editorWrapper';
               }
            }
         };

         it('_beforeUpdate', () => {
            instance.saveOptions(cfg);
            instance._beforeMount(cfg);
            instance.beginEdit(event);
            expect(instance._isEditing).toBe(true);
            expect(
               instance._options.editingObject === instance._editingObject
            ).toBe(false);
            instance._beforeUpdate(cfg);
            expect(
               instance._options.editingObject === instance._editingObject
            ).toBe(false);
         });

         it('without cancelling', function () {
            instance.saveOptions(cfg);
            instance._beforeMount(cfg);
            instance._notify = mockNotify();
            instance.beginEdit(event);
            expect(eventQueue[0].event).toEqual('beforeBeginEdit');
            expect(
               eventQueue[0].eventArgs[0].isEqual(
                  instance._options.editingObject
               )
            ).toBe(true);
            expect(eventQueue[0].eventOptions.bubbling).toBe(true);
            expect(instance._isEditing).toBe(true);
            expect(instance._isStartEditing).toBe(true);
         });

         it('without arguments', function () {
            instance.saveOptions(cfg);
            instance._beforeMount(cfg);
            instance._notify = mockNotify();
            instance.beginEdit();
            expect(eventQueue[0].event).toEqual('beforeBeginEdit');
            expect(
               eventQueue[0].eventArgs[0].isEqual(
                  instance._options.editingObject
               )
            ).toBe(true);
            expect(eventQueue[0].eventOptions.bubbling).toBe(true);
            expect(instance._isEditing).toBe(true);
            expect(instance._isStartEditing).toBe(true);
         });

         it('cancel', function () {
            instance.saveOptions(cfg2);
            instance._beforeMount(cfg2);
            instance._notify = mockNotify(Constants.editing.CANCEL);
            instance.beginEdit(event);
            expect(eventQueue[0].event).toEqual('beforeBeginEdit');
            expect(
               eventQueue[0].eventArgs[0].isEqual(
                  instance._options.editingObject
               )
            ).toBe(true);
            expect(eventQueue[0].eventOptions.bubbling).toBe(true);
            expect(instance._isEditing).toBe(false);
            expect(instance._isStartEditing).toBeFalsy();
         });
      });

      describe('cancelEdit', function () {
         it('without cancelling', function () {
            instance._beforeMount(cfg);
            instance.saveOptions(cfg);
            instance._notify = mockNotify();
            instance._editingObject.set('text', 'changed');
            instance.cancelEdit();
            expect(eventQueue.length).toEqual(2);
            expect(eventQueue[0].event).toEqual('beforeEndEdit');
            expect(eventQueue[0].eventArgs[0]).toEqual(instance._editingObject);
            expect(eventQueue[1].event).toEqual('afterEndEdit');
            expect(eventQueue[1].eventArgs[0]).toEqual(instance._editingObject);
            expect(instance._editingObject.get('text')).toEqual('qwerty');
            expect(instance._editingObject.isChanged()).toBe(false);
            expect(instance._options.editingObject.isChanged()).toBe(false);
            expect(instance._isEditing).toBe(false);
         });

         it('call without starting editing', function () {
            instance._beforeMount(cfg2);
            instance.saveOptions(cfg2);
            instance._notify = mockNotify();
            instance.cancelEdit();
            expect(eventQueue.length).toEqual(0);
         });

         it('cancel', function () {
            instance.saveOptions(cfg);
            instance._beforeMount(cfg);
            instance._notify = mockNotify(Constants.editing.CANCEL);
            instance._editingObject.set('text', 'changed');
            instance.cancelEdit();
            expect(eventQueue.length).toEqual(1);
            expect(eventQueue[0].event).toEqual('beforeEndEdit');
            expect(eventQueue[0].eventArgs[0]).toEqual(instance._editingObject);
            expect(instance._editingObject.get('text')).toEqual('changed');
            expect(instance._editingObject.isChanged()).toBe(true);
            expect(instance._options.editingObject.isChanged()).toBe(true);
         });

         it('callback cancel', function () {
            instance.saveOptions(cfg2);
            instance._beforeMount(cfg2);
            instance._isEditing = true;
            let prom = new Promise((resolve) => {
               resolve(null);
            });
            instance._notify = mockNotify(
               prom.then(() => {
                  return Constants.editing.CANCEL;
               })
            );
            instance._editingObject.set('text', 'changed');
            instance.cancelEdit();
            expect(eventQueue.length).toEqual(1);
            expect(eventQueue[0].event).toEqual('beforeEndEdit');
            expect(eventQueue[0].eventArgs[0]).toEqual(instance._editingObject);
            expect(instance._editingObject.get('text')).toEqual('changed');
            expect(instance._editingObject.isChanged()).toBe(true);
            expect(instance._options.editingObject.isChanged()).toBe(true);
         });

         it('clone in begitedit', async function () {
            instance._children = {
               formController: {
                  submit: function () {
                     return Deferred.success({});
                  }
               }
            };
            instance.saveOptions(cfg);
            instance._beforeMount(cfg);
            instance._notify = mockNotify();

            // начинаем редактирование, делаем клон записи с подтверждением изменений.
            instance.beginEdit();

            // меняем рекорд
            instance._editingObject.set('text', 'asdf');

            // завершаем редактирование с сохранением
            await instance.commitEdit();

            // проверили, что опция поменялась
            expect(cfg.editingObject.get('text')).toEqual('asdf');

            // вновь начинаем редактирование, делаем клон записи с подтверждением изменений.
            instance.beginEdit();

            // меняем рекорд
            instance._editingObject.set('text', 'changed');

            // проверяем предыдущее состояние, к которому будем откатывать.
            expect(instance._editingObject._changedFields.text).toEqual('asdf');

            // завершаем редактирование с отменой. Не сохраняем.
            await instance.cancelEdit();

            // проверили, что опция не поменялась
            expect(cfg.editingObject.get('text')).toEqual('asdf');
         });
         it('change options after edit-mode', async function () {
            instance._children = {
               formController: {
                  submit: function () {
                     return Deferred.success({});
                  }
               }
            };
            instance.saveOptions(cfg);
            instance._beforeMount(cfg);
            instance._notify = mockNotify();

            // начинаем редактирование, делаем клон записи с подтверждением изменений.
            instance.beginEdit();

            // меняем рекорд
            instance._editingObject.set('text', 'asdf');

            // завершаем редактирование с сохранением
            await instance.commitEdit();

            // проверили, что опция поменялась
            expect(cfg.editingObject.get('text')).toEqual('asdf');

            // меняем опцию и проверяем, что поменялся _editingObject
            const newCfg = {
               editWhenFirstRendered: true,
               editingObject: entity.Model.fromObject({
                  text: 'changed'
               })
            };
            instance._beforeUpdate(newCfg);
            expect(instance._editingObject.get('text')).toEqual('changed');
         });

         it('deferred', async function () {
            instance.saveOptions(cfg);
            instance._beforeMount(cfg);
            instance._notify = mockNotify(Deferred.success());
            instance._editingObject.set('text', 'changed');
            await instance.cancelEdit();
            expect(eventQueue.length).toEqual(2);
            expect(eventQueue[0].event).toEqual('beforeEndEdit');
            expect(eventQueue[0].eventArgs[0]).toEqual(instance._editingObject);
            expect(instance._editingObject.get('text')).toEqual('qwerty');
            expect(eventQueue[1].event).toEqual('afterEndEdit');
            expect(eventQueue[1].eventArgs[0]).toEqual(instance._editingObject);
            expect(instance._isEditing).toBe(false);
            expect(instance._editingObject.isChanged()).toBe(false);
            expect(instance._options.editingObject.isChanged()).toBe(false);
         });
      });

      describe('commitEdit', function () {
         it('without cancelling, successful validation', async function () {
            instance._children = {
               formController: {
                  submit: function () {
                     return Deferred.success({});
                  }
               }
            };
            instance.saveOptions(cfg);
            instance._beforeMount(cfg);
            instance._notify = mockNotify();
            instance._editingObject.set('text', 'asdf');
            await instance.commitEdit();
            expect(eventQueue.length).toEqual(2);
            expect(eventQueue[0].event).toEqual('beforeEndEdit');
            expect(eventQueue[0].eventArgs[0]).toEqual(instance._editingObject);
            expect(eventQueue[1].event).toEqual('afterEndEdit');
            expect(eventQueue[1].eventArgs[0]).toEqual(instance._editingObject);
            expect(cfg.editingObject.get('text')).toEqual('asdf');
            expect(instance._editingObject).toEqual(
               instance._options.editingObject
            );
            expect(instance._options.editingObject.isChanged()).toBe(true);
            expect(instance._isEditing).toBe(false);
         });

         it('cancel, successful validation', async function () {
            instance._children = {
               formController: {
                  submit: function () {
                     return Deferred.success({});
                  }
               }
            };
            instance.saveOptions(cfg);
            instance._beforeMount(cfg);
            instance._notify = mockNotify(Constants.editing.CANCEL);
            instance._editingObject.set('text', 'asdf');
            await instance.commitEdit();
            expect(eventQueue.length).toEqual(1);
            expect(eventQueue[0].event).toEqual('beforeEndEdit');
            expect(eventQueue[0].eventArgs[0]).toEqual(instance._editingObject);
            expect(instance._editingObject.get('text')).toEqual('asdf');
            expect(instance._editingObject.isChanged()).toBe(true);
            expect(instance._options.editingObject.isChanged()).toBe(true);
            expect(instance._isEditing).toBe(true);
         });

         it('unsuccessful validation', async function () {
            instance._children = {
               formController: {
                  submit: function () {
                     return Deferred.success({
                        0: 'Поле является обязательным для заполнения'
                     });
                  }
               }
            };
            instance.saveOptions(cfg);
            instance._beforeMount(cfg);
            instance._notify = mockNotify();
            instance._editingObject.set('text', 'asdf');
            await instance.commitEdit();
            expect(eventQueue.length).toEqual(0);
            expect(instance._isEditing).toBe(true);
            expect(instance._editingObject.get('text')).toEqual('asdf');
            expect(instance._editingObject.isChanged()).toBe(true);
            expect(instance._options.editingObject.isChanged()).toBe(true);
         });

         it('deferred', async function () {
            instance._children = {
               formController: {
                  submit: function () {
                     return Deferred.success({});
                  }
               }
            };
            instance.saveOptions(cfg);
            instance._beforeMount(cfg);
            instance._notify = mockNotify(Deferred.success());
            instance._editingObject.set('text', 'asdf');
            await instance.commitEdit();
            expect(eventQueue.length).toEqual(2);
            expect(eventQueue[0].event).toEqual('beforeEndEdit');
            expect(eventQueue[0].eventArgs[0]).toEqual(instance._editingObject);
            expect(eventQueue[1].event).toEqual('afterEndEdit');
            expect(eventQueue[1].eventArgs[0]).toEqual(instance._editingObject);
            expect(cfg.editingObject.get('text')).toEqual('asdf');
            expect(instance._editingObject).toEqual(
               instance._options.editingObject
            );
            expect(instance._options.editingObject.isChanged()).toBe(true);
            expect(instance._isEditing).toBe(false);
         });
      });
   });
});
