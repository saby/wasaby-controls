/**
 * Created by as.krasilnikov on 21.01.2019.
 */
define('Controls-demo/Popup/PopupAnimation', [
   'UI/Base',
   'wml!Controls-demo/Popup/PopupAnimation/PopupAnimation'
], function (Base, template) {
   var ModuleClass = Base.Control.extend({
      _animationDelay: 200,
      _fullCreateDelay: 1000,
      _template: template,
      openStack: function () {
         var self = this;
         if (this._animationDelay) {
            self._children.loadingIndicator.show();
            setTimeout(function () {
               self._children.loadingIndicator.hide();
               self._openStack();
            }, this._animationDelay);
         } else {
            this._openStack();
         }
      },
      _openStack: function () {
         this._children.stack.open({
            className: 'ControlsDemo-PopupAnimation_duration-' + this._animationDelay,
            templateOptions: {
               fullCreateDelay: this._fullCreateDelay
            }
         });
      },
      _inputHandlerHandler: function (event, param, value) {
         if (value < 0) {
            this[param] = 0;
         } else if (value > 10000) {
            this[param] = 10000;
         }
      }
   });

   ModuleClass._styles = ['Controls-demo/Popup/PopupAnimation/PopupAnimation'];

   return ModuleClass;
});
