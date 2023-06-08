define(['Controls/buttons', 'Types/collection'], function (
   buttons,
   collection
) {
   'use strict';

   var Validator = buttons.ActualApi;

   describe('Controls.Button.validateIconStyle', function () {
      it('iconStyleTransformation', function () {
         var oldIconStyle = 'test';
         expect(Validator.iconStyleTransformation(oldIconStyle)).toEqual(
            'test'
         );
         oldIconStyle = 'default';
         expect(Validator.iconStyleTransformation(oldIconStyle)).toEqual(
            'default'
         );
         oldIconStyle = 'error';
         expect(Validator.iconStyleTransformation(oldIconStyle)).toEqual(
            'danger'
         );
         oldIconStyle = 'attention';
         expect(Validator.iconStyleTransformation(oldIconStyle)).toEqual(
            'warning'
         );
         oldIconStyle = 'done';
         expect(Validator.iconStyleTransformation(oldIconStyle)).toEqual(
            'success'
         );
      });
      it('iconColorFromOptIconToIconStyle', function () {
         var icon =
            'test icon-large icon-small icon-Send icon-error icon-medium icon-Best';
         expect(Validator.iconColorFromOptIconToIconStyle(icon)).toEqual(
            'error'
         );
      });
      it('itemsSetOldIconStyle', function () {
         var items = new collection.RecordSet({
               keyProperty: 'id',
               rawData: [
                  {
                     id: 1,
                     iconStyle: 'test',
                     icon: 'icon-Send icon-error icon-small'
                  },
                  { id: 2, icon: 'icon-Send icon-error icon-small' },
                  { id: 3, icon: 'icon-Send icon-small' },
                  { id: 4 }
               ]
            }),
            resultItems = [
               {
                  id: 1,
                  iconStyle: 'test',
                  icon: 'icon-Send icon-error icon-small'
               },
               {
                  id: 2,
                  iconStyle: 'error',
                  icon: 'icon-Send icon-error icon-small'
               },
               { id: 3, icon: 'icon-Send icon-small' },
               { id: 4 }
            ];
         Validator.itemsSetOldIconStyle(items);
         expect(items.getRawData()).toEqual(resultItems);
      });
   });
});
