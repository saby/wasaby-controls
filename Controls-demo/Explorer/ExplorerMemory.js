define('Controls-demo/Explorer/ExplorerMemory', [
   'Types/source',
   'Types/collection',
   'Types/deferred',
   'Core/core-clone'
], function (source, collection, defferedLib, cClone) {
   'use strict';

   function getById(items, id, keyProperty) {
      for (var i = 0; i < items.length; i++) {
         if (items[i][keyProperty] === id) {
            return cClone(items[i]);
         }
      }
   }

   function getFullPath(items, currentRoot, needRecordSet, keyProperty) {
      var path = [],
         currentNode = getById(items, currentRoot, keyProperty);
      path.unshift(getById(items, currentRoot, keyProperty));
      while (currentNode.parent !== null) {
         currentNode = getById(items, currentNode.parent, keyProperty);
         path.unshift(currentNode);
      }
      if (needRecordSet) {
         return new collection.RecordSet({
            rawData: path,
            keyProperty: keyProperty
         });
      }
      return path;
   }

   function pushIfNeed(items, item, keyProperty) {
      if (
         items.some(function (it) {
            return it[keyProperty] === item[keyProperty];
         })
      ) {
         return;
      }
      items.push(item);
   }

   var TreeMemory = source.Memory.extend({
      query: function (query) {
         var self = this,
            result = new defferedLib.Deferred(),
            rootData = [],
            data = [],
            items = {},
            parents,
            filter = query.getWhere(),
            parent = filter.parent instanceof Array ? filter.parent[0] : filter.parent;

         // if search mode
         if (filter.title) {
            this._$data.forEach(function (item) {
               if (item.title.toUpperCase().indexOf(filter.title.toUpperCase()) !== -1) {
                  items[item[self._$keyProperty || 'id']] = item;
               }
            });
            for (var i in items) {
               if (items.hasOwnProperty(i)) {
                  if (items[i].parent !== null) {
                     parents = getFullPath(
                        self._$data,
                        items[i].parent,
                        false,
                        self._$keyProperty || 'id'
                     );
                     parents.forEach(function (par) {
                        pushIfNeed(data, par, self._$keyProperty);
                     });
                     pushIfNeed(data, items[i], self._$keyProperty);
                  } else {
                     pushIfNeed(rootData, items[i], self._$keyProperty);
                  }
               }
            }
            rootData.forEach(function (rootItem) {
               return pushIfNeed(data, rootItem, self._$keyProperty);
            });
            result.callback(
               new source.DataSet({
                  rawData: data,
                  adapter: this.getAdapter(),
                  keyProperty: self._$keyProperty || 'id'
               })
            );
         } else {
            query.where(function (item) {
               if (filter.parent && filter.parent.forEach) {
                  for (var j = 0; j < filter.parent.length; j++) {
                     if (item.get('parent') === filter.parent[j]) {
                        return true;
                     }
                  }
                  return false;
               }

               if (filter.historyKeys) {
                  return filter.historyKeys.includes(item.getData().id);
               }

               if (parent !== undefined) {
                  return item.get('parent') === parent;
               }
               return true;
            });
            TreeMemory.superclass.query.apply(this, arguments).addCallback(function (innerData) {
               var originalGetAll = innerData.getAll;

               innerData.getAll = function () {
                  var originResult = originalGetAll.apply(this, arguments);
                  var meta = originResult.getMetaData();

                  if (parent !== undefined && parent !== null) {
                     meta.path = getFullPath(self._$data, parent, true, self._$keyProperty || 'id');
                  }

                  originResult.setMetaData(meta);
                  return originResult;
               };

               result.callback(innerData);
            });
         }
         return result;
      }
   });

   return TreeMemory;
});
