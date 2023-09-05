define('ControlsUnit/ListData', function () {
   'use strict';
   return {
      KEY_PROPERTY: 'id',
      PARENT_PROPERTY: 'parent',
      NODE_PROPERTY: 'node',
      HAS_CHILDREN_PROPERTY: 'hasChildren',

      /*
       * 1
       *    2
       *       3
       *       4
       *    5
       * 6
       * 7
       */
      getItems: function () {
         return [
            {
               id: 1,
               parent: null,
               node: true,
               hasChildren: true,
               childredCount: 4,
               group: 111
            },
            {
               id: 2,
               parent: 1,
               node: false,
               hasChildren: false,
               childredCount: 2,
               group: 111
            },
            {
               id: 3,
               parent: 2,
               node: false,
               hasChildren: false,
               childredCount: 0,
               group: 111
            },
            {
               id: 4,
               parent: 2,
               node: null,
               hasChildren: false,
               group: 111
            },
            {
               id: 5,
               parent: 1,
               node: null,
               hasChildren: false,
               group: 111
            },
            {
               id: 6,
               parent: null,
               node: true,
               hasChildren: false,
               childredCount: 0,
               group: 111
            },
            {
               id: 7,
               parent: null,
               node: null,
               hasChildren: false,
               group: 222
            }
         ];
      },

      getFlatItems: function () {
         return [
            {
               id: 1,
               parent: null,
               node: false,
               hasChildren: true
            },
            {
               id: 2,
               parent: 1,
               node: false,
               hasChildren: true
            },
            {
               id: 3,
               parent: 2,
               node: false,
               hasChildren: false
            },
            {
               id: 4,
               parent: 2,
               node: false,
               hasChildren: false
            },
            {
               id: 5,
               parent: 1,
               node: false,
               hasChildren: false
            },
            {
               id: 6,
               parent: null,
               node: false,
               hasChildren: false
            },
            {
               id: 7,
               parent: null,
               node: false,
               hasChildren: false
            }
         ];
      },

      getRootItems: function () {
         return [
            {
               id: 1,
               parent: null,
               node: true,
               hasChildren: true
            },
            {
               id: 6,
               parent: null,
               node: true,
               hasChildren: false
            },
            {
               id: 7,
               parent: null,
               node: false,
               hasChildren: false
            }
         ];
      }
   };
});
