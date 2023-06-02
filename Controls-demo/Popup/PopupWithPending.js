define('Controls-demo/Popup/PopupWithPending', [
   'UI/Base',
   'wml!Controls-demo/Popup/PopupWithPending',
   'Types/entity',
   'Types/deferred',
   'i18n!Controls-demo'
], function (Base, template, entity, defferedLib, rk) {
   'use strict';

   var TestDialog = Base.Control.extend({
      _template: template,

      _close: function () {
         this._notify('close', [], { bubbling: true });
      },
      _afterMount: function () {
         this._onPropertyChangeHandler = this._onPropertyChange.bind(this);
         this._record = new entity.Record();
         this._record.subscribe(
            'onPropertyChange',
            this._onPropertyChangeHandler
         );
      },
      _onPropertyChange: function () {
         if (!this._propertyChangeNotified) {
            var def = new defferedLib.Deferred();
            var self = this;

            self._propertyChangeNotified = true;
            self._notify(
               'registerPending',
               [
                  def,
                  {
                     showLoadingIndicator: false,
                     onPendingFail: function (forceFinishValue, deferred) {
                        self._showConfirmDialog(deferred, forceFinishValue);
                     }
                  }
               ],
               { bubbling: true }
            );
         }
      },
      _showConfirmDialog: function (def) {
         var self = this;
         function updating(answer) {
            if (answer === true) {
               self._propertyChangeNotified = false;
               def.callback(true);
            } else if (answer === false) {
               def.callback(false);
            } else {
               def.cancel();
            }
         }

         return self._children.popupOpener
            .open({
               message: rk('Сохранить изменения?'),
               details: rk(
                  'Чтобы продолжить редактирование, нажмите "Отмена".'
               ),
               type: 'yesnocancel'
            })
            .addCallback(function (answer) {
               updating.call(self, answer);
            });
      }
   });

   return TestDialog;
});
