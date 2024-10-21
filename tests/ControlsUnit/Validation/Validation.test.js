define(['Controls/validate', 'Types/deferred', 'Types/function'], function (
   validateMod,
   defferedLib,
   types
) {
   'use strict';

   function getValidator(validateResult, readOnly) {
      let validator = {
         _validateCall: false,
         _activateCall: false,
         _validationResult: false,
         _isValidCall: false,
         _isOpened: false,
         _options: {
            readOnly: readOnly
         },
         validate: () => {
            validator._validateCall = true;
            return new defferedLib.Deferred().callback(validateResult);
         },
         activate: () => {
            validator._activateCall = true;
         },
         openInfoBox: () => {
            validator._isOpened = true;
         },
         setValidationResult: (result) => {
            validator._validationResult = result;
         },
         isValid: () => {
            validator._isValidCall = true;
            return !validator._validationResult;
         }
      };

      return validator;
   }

   describe('Validate/Container', () => {
      let validCtrl;
      beforeEach(function () {
         validCtrl = new validateMod.Container();
         jest.spyOn(validCtrl, '_callInfoBox').mockImplementation();

         // это сделано для того, чтобы ручные вызовы _forceUpdate не заваливали консоль ошибками
         jest.spyOn(validCtrl, '_forceUpdate').mockImplementation();
      });
      it('closeInfoBox', () => {
         validCtrl._isOpened = false;
         validCtrl._validationResult = 'error';
         validCtrl._openInfoBox(validCtrl);
         validCtrl._openInfoBox(validCtrl);
         validCtrl._onOpenHandler();
         validCtrl._mouseInfoboxHandler({ type: 'mouseenter' });
         expect(validCtrl._isOpened).toEqual(true);
         validCtrl._mouseInfoboxHandler({ type: 'close' });
         expect(validCtrl._isOpened).toEqual(false);
      });
      it('cleanValid', () => {
         const event = {
            stopImmediatePropagation: jest.fn()
         };
         validCtrl._callInfoBox = jest.fn();
         validCtrl._valueChangedHandler(event, 'test');
         expect(validCtrl._validationResult).toEqual(null);
         validCtrl._validationResult = 'Error';
         validCtrl._valueChangedHandler(event, 'test');
         expect(validCtrl._validationResult).toEqual('Error');
      });
      it('setValidResult', () => {
         validCtrl._callInfoBox = jest.fn();
         var validConfig = {
            hideInfoBox: true
         };
         validCtrl._isOpened = false;
         validCtrl.setValidationResult('Error 404');
         validCtrl._onOpenHandler();
         expect(validCtrl._isOpened).toEqual(true);

         // вызов с hideInfobox = true не закрывает инфобокс
         validCtrl.setValidationResult(null, validConfig);
         expect(validCtrl._isOpened).toEqual(true);

         // вызов с hideInfobox = true не октрывает инфобокс
         validCtrl._isOpened = false;
         validCtrl.setValidationResult('Error 404', validConfig);
         expect(validCtrl._isOpened).toEqual(false);
      });
   });
   describe('Validate/ControllerClass', () => {
      let Controller;
      beforeEach(() => {
         Controller = new validateMod.ControllerClass();
      });
      it('add/remove validator', () => {
         let validator1 = getValidator();
         let validator2 = getValidator();

         Controller.addValidator(validator1);
         Controller.addValidator(validator2);

         expect(Controller._validates.length).toEqual(2);

         Controller.removeValidator(validator1);
         Controller.removeValidator(validator2);

         expect(Controller._validates.length).toEqual(0);
      });

      it('isValid', () => {
         let validator1 = getValidator();
         let validator2 = getValidator();
         Controller.addValidator(validator1);
         Controller.addValidator(validator2);

         let isValid = Controller.isValid();
         expect(validator1._isValidCall).toEqual(true);
         expect(validator2._isValidCall).toEqual(true);
         expect(isValid).toEqual(true);

         let validator3 = getValidator();
         validator3.setValidationResult('Error');
         Controller.addValidator(validator3);
         isValid = Controller.isValid();
         expect(validator3._isValidCall).toEqual(true);
         expect(isValid).toEqual(false);
      });
      it('activateFirstValidField', async () => {
         Controller.scrollToInvalidContainer = jest.fn();
         let validator1 = getValidator();
         let validator2 = getValidator(null, true);
         let validator3 = getValidator('Error');
         let validator4 = getValidator('Error');

         Controller._validates.push(validator1, validator2, validator3, validator4);
         await Controller.submit();
         expect(validator3._activateCall).toEqual(true);
      });

      it('openInfoBox at first valid container', async () => {
         Controller.scrollToInvalidContainer = jest.fn();
         let validator1 = getValidator('Error');

         // Deal with propery getter
         const delay = types.delay;
         delete types.delay;
         types.delay = delay;

         jest.spyOn(types, 'delay').mockImplementation(() => {
            validator1.openInfoBox();
         });
         Controller._validates.push(validator1);
         await Controller.submit();
         expect(validator1._activateCall).toEqual(true);
         expect(validator1._isOpened).toEqual(true);
      });

      it('setValidationResult', () => {
         let validator1 = getValidator();
         let validator2 = getValidator();
         Controller.addValidator(validator1);
         Controller.addValidator(validator2);

         Controller.setValidationResult();
         expect(validator1._validationResult).toEqual(null);
         expect(validator2._validationResult).toEqual(null);
      });

      it('submit', async () => {
         Controller.scrollToInvalidContainer = jest.fn();
         let validator1 = getValidator(true);
         let validator2 = getValidator(false);
         Controller.addValidator(validator1);
         Controller.addValidator(validator2);
         jest.spyOn(types, 'delay').mockImplementation(() => {
            validator1.openInfoBox();
         });

         const result = await Controller.submit();
         expect(validator1._validateCall).toEqual(true);
         expect(validator2._validateCall).toEqual(true);

         expect(result[0]).toEqual(false);
         expect(result[1]).toEqual(true);

         expect(validator1._activateCall).toEqual(true);
         expect(validator2._activateCall).toEqual(false);
      });
      it('closeInfobox by submit ', async () => {
         let validCtrl = new validateMod.Container();
         validCtrl._isOpened = true;
         validCtrl._validationResult = true;
         Controller._validates.push(validCtrl);
         await Controller.submit();
         expect(validCtrl._openingInProcess).toBe(false);
      });
   });
});
