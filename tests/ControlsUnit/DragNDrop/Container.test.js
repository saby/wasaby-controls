define(['Controls/dragnDrop'], function (dragnDrop) {
   'use strict';

   describe('Controls.DragNDrop.Container', function () {
      var endDetected = false,
         startDetected = false,
         container = new dragnDrop.Controller();
      container._controllerClass = new dragnDrop.ControllerClass();

      container._controllerClass._registers.documentDragStart.start = function () {
         startDetected = true;
      };

      container._controllerClass._registers.documentDragEnd.start = function () {
         endDetected = true;
      };

      it('documentDragStart', function () {
         container._documentDragStart();
         expect(startDetected).toBe(true);
      });

      it('documentDragEnd', function () {
         container._documentDragEnd();
         expect(endDetected).toBe(true);
      });

      it('updateDraggingTemplate', function () {
         var config = {
            topPopup: true,
            opener: null,
            fittingMode: 'overflow',
            autofocus: false,
            template: 'Controls/dragnDrop:DraggingTemplateWrapper',
            className: 'controls-DragNDrop__draggingTemplatePopup',
            templateOptions: {
               draggingTemplateOptions: {
                  position: {
                     x: 1,
                     y: 2
                  },
                  draggingTemplateOffset: 1
               },
               draggingTemplate: 'draggingTemplate'
            },
            top: 3,
            left: 2,
            restrictiveContainer: 'body'
         };
         var draggingTemplateOptions = {
               position: {
                  x: 1,
                  y: 2
               },
               draggingTemplateOffset: 1
            },
            draggingTemplate = 'draggingTemplate';
         var result = {};
         container._controllerClass._dialogOpener.open = (options) => {
            result = options;
         };
         container._updateDraggingTemplate(null, draggingTemplateOptions, draggingTemplate);
         expect(result).toEqual(config);
      });
   });
});
