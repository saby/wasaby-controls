define(['Controls/_popup/Openers/Base'], (Base) => {
   'use strict';
   const BaseOpener = Base.default;

   describe('Controls/_popup/PopupHelper/Base', () => {
      it('opener class options', () => {
         let opener = new BaseOpener({
            template: 'someTplString',
            modal: true,
            templateOptions: {
               someOption: 'value'
            }
         });
         opener._openPopup = function (popupOptions) {
            expect(popupOptions.modal).toEqual(false);
            expect(popupOptions.template).toEqual('someTplString');
            expect(popupOptions.templateOptions.someOption).toEqual('value');
            expect(popupOptions.templateOptions.someOption2).toEqual('value2');
         };
         opener.open({
            modal: false,
            templateOptions: {
               someOption2: 'value2'
            }
         });
      });
   });
});
