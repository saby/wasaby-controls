define('Controls-demo/Popup/InfoboxTemplate',
   [
      'UI/Base',
      'wml!Controls-demo/Popup/InfoboxTemplate',
      'Types/source',
      'Controls-demo/Popup/TestDialog',
   ],
   function(Base, template, source) {
      'use strict';

      var InfoboxTemplate = Base.Control.extend({
         _template: template,
         _beforeMount: function() {
            this._verticalDirection = true;
            this._selectedKeysSimple = [1];
            this._horizontalDirection = true;
            this._verticalPoint = true;
            this._horizontalPoint = true;
            this._config = [
               {
                  direction: {
                     horizontal: 'right',
                     vertical: 'top'
                  },
                  targetPoint: {
                     horizontal: 'left',
                     vertical: 'top'
                  }
               },
               {
                  direction: {
                     horizontal: 'left',
                     vertical: 'top'
                  },
                  targetPoint: {
                     horizontal: 'right',
                     vertical: 'top'
                  }
               },
               {
                  direction: {
                     horizontal: 'right',
                     vertical: 'top'
                  },
                  targetPoint: {
                     horizontal: 'right',
                     vertical: 'bottom'
                  }
               },
               {
                  direction: {
                     horizontal: 'right',
                     vertical: 'bottom'
                  },
                  targetPoint: {
                     horizontal: 'right',
                     vertical: 'top'
                  }
               },
               {
                  direction: {
                     horizontal: 'left',
                     vertical: 'bottom'
                  },
                  targetPoint: {
                     horizontal: 'right',
                     vertical: 'bottom'
                  }
               },
               {
                  direction: {
                     horizontal: 'right',
                     vertical: 'bottom'
                  },
                  targetPoint: {
                     horizontal: 'left',
                     vertical: 'bottom'
                  }
               },
               {
                  direction: {
                     horizontal: 'left',
                     vertical: 'bottom'
                  },
                  targetPoint: {
                     horizontal: 'left',
                     vertical: 'top'
                  }
               },
               {
                  direction: {
                     horizontal: 'left',
                     vertical: 'top'
                  },
                  targetPoint: {
                     horizontal: 'left',
                     vertical: 'bottom'
                  }
               }
            ];
            this._simpleItems = this._createMemory([
               { id: 1, title: '??????????-????????????' },
               { id: 2, title: '??????????-??????????' },
               { id: 3, title: '????????????-??????????' },
               { id: 4, title: '????????????-????????' },
               { id: 5, title: '????????-??????????' },
               { id: 6, title: '????????-????????????' },
               { id: 7, title: '??????????-????????' },
               { id: 8, title: '??????????-??????????' }
            ]);
         },
         _createMemory: function(items) {
            return new source.Memory({
               keyProperty: 'id',
               data: items
            });
         },

         openSticky: function() {
            this._children.sticky.open({
               target: this._children.stickyButton._container,
               opener: this._children.stickyButton,
               templateOptions: {
                  type: 'dialog'
               }
            });
            this._firstClick = true;
         }
      });

      return InfoboxTemplate;
   });
