define('Controls-demo/LongRender/LongRenderDemo', [
   'UI/Base',
   'wml!Controls-demo/LongRender/LongRenderDemo'
], function (Base, template) {
   'use strict';

   var LongRenderDemoModule = Base.Control.extend({
      _template: template
   });
   return LongRenderDemoModule;
});
