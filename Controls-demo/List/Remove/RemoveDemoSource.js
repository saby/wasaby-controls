define('Controls-demo/List/Remove/RemoveDemoSource', [
   'Types/source',
   'Core/Deferred'
], function (source, Deferred) {
   var RemoveDemoSource = source.Memory.extend({
      destroy: function (keys) {
         var result,
            self = this;
         if (keys.indexOf(2) !== -1) {
            result = Deferred.fail('Unable to delete entry with key " 3"');
         } else if (keys.indexOf(3) !== -1) {
            result = new Deferred();

            // We simulate the long deletion of records.
            setTimeout(function () {
               RemoveDemoSource.superclass.destroy.apply(self, arguments);
               result.callback(true);
            }, 2500);
         } else {
            result = RemoveDemoSource.superclass.destroy.apply(this, arguments);
         }
         return result;
      }
   });
   return RemoveDemoSource;
});
