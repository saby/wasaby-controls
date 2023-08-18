define('Controls-demo/Example/resource/BaseDemoInput', [
   'UI/Base',
   'wml!Controls-demo/Example/resource/BaseDemoInput/BaseDemoInput',

   'Controls/input'
], function (BaseMod, template) {
   'use strict';

   /**
    * @name Controls-demo/Example/resource/BaseDemoInput#title
    * @cfg {String}
    */

   /**
    * @name Controls-demo/Example/resource/BaseDemoInput#blocker
    * @cfg {Boolean} Button to control the status of content activity.
    */

   /**
    * @name Controls-demo/Example/resource/BaseDemoInput#contents
    * @cfg {Object[]}
    * @param {Function} contents[].template
    * @param {Object} contents[].label
    * @param {String} contents[].label.position
    * @param {String} contents[].label.position
    * @variant top
    * @variant left
    * @param {String} contents[].label.name
    * @param {String} contents[].label.value
    * @param {String} contents[].label.required
    */

   var ModuleClass = BaseMod.Control.extend({
      _template: template,

      _switchBlocker: function () {
         this._lock = !this._lock;
      },

      _labelClickHandler: function (event, labelName) {
         this._notify('labelClick', [labelName], { bubbling: true });
      }
   });

   ModuleClass._styles = [
      'Controls-demo/Example/resource/Base',
      'Controls-demo/Example/resource/BaseDemoInput/BaseDemoInput'
   ];

   return ModuleClass;
});
