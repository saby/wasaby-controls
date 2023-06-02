define(['Controls/popup', 'i18n!ControlsUnits'], (popup, rk) => {
   'use strict';

   describe('Controls/_popup/Opener/BaseOpener', () => {
      it('registerOpenerUpdateCallback', () => {
         let opener = new popup.BaseOpener();
         opener._notify = (eventName, args) => {
            expect(eventName).toEqual('registerOpenerUpdateCallback');
            expect(typeof args[0]).toEqual('function');
         };
         opener._afterMount();
         opener._notify = jest.fn();
         opener.destroy();
      });

      it('_getConfig', () => {
         let opener = new popup.BaseOpener();
         opener._options.templateOptions = {
            type: 'dialog',
            name: 'options'
         };
         var popupOptions = {
            closeOnOutsideClick: true,
            templateOptions: {
               type: 'stack',
               name: 'popupOptions'
            },
            opener: null
         };
         var baseConfig = opener._getConfig(popupOptions);

         expect(opener._options.templateOptions.type).toEqual('dialog');
         expect(opener._options.templateOptions.name).toEqual('options');
         expect(baseConfig.templateOptions.name).toEqual('popupOptions');
         expect(baseConfig.closeOnOutsideClick).toEqual(true);
         expect(baseConfig.templateOptions.type).toEqual('stack');
         expect(baseConfig.opener).toEqual(null);
         let opener2 = new popup.BaseOpener();
         popupOptions = {
            templateOptions: {
               type: 'stack',
               name: 'popupOptions'
            },
            opener: null
         };
         opener2._getConfig(popupOptions);

         opener.destroy();
         opener2.destroy();
      });

      it('_beforeUnmount', () => {
         let opener = new popup.BaseOpener();
         let isHideIndicatorCall = false;
         opener.saveOptions(popup.BaseOpener.getDefaultOptions());
         opener._indicatorId = '123';
         opener._openPopupTimerId = '145';
         opener._options.closePopupBeforeUnmount = true;

         opener._notify = (eventName) => {
            if (eventName === 'hideIndicator') {
               isHideIndicatorCall = true;
            }
         };

         opener._beforeUnmount();
         expect(opener._indicatorId).toEqual(null);
         expect(isHideIndicatorCall).toEqual(true);

         isHideIndicatorCall = false;
         opener._indicatorId = null;
         opener._openPopupTimerId = '145';
         opener._options.closePopupBeforeUnmount = false;
         opener._beforeUnmount();
         expect(opener._indicatorId).toEqual(null);
         expect(isHideIndicatorCall).toEqual(false);
         opener.destroy();
      });
   });

   it('multi open', (done) => {
      const opener = new popup.BaseOpener();
      opener._openPopup = () => {
         return Promise.resolve(null);
      };
      opener._useVDOM = () => {
         return true;
      };

      let popupId1;
      let popupId2;
      let popupId3;

      opener.open().then((id) => {
         popupId1 = id;
      });
      opener.open().then((id) => {
         popupId2 = id;
      });
      opener.open().then((id) => {
         popupId3 = id;
      });

      setTimeout(() => {
         expect(popupId1).toEqual(popupId2);
         expect(popupId2).toEqual(popupId3);
         done();
      }, 10);

      opener.destroy();
   });

   it('getIndicatorConfig', () => {
      const standartCfg = {
         id: undefined,
         message: rk('Загрузка'),
         delay: 2000
      };
      expect(standartCfg).toEqual(popup.BaseOpener.util.getIndicatorConfig());
      const indicatorId = '123';
      standartCfg.id = '123';
      expect(standartCfg).toEqual(
         popup.BaseOpener.util.getIndicatorConfig(indicatorId)
      );
      const cfg = {
         indicatorConfig: {
            message: 'Error',
            delay: 0
         }
      };
      const newConfig = {
         id: '123',
         message: 'Error',
         delay: 0
      };
      expect(newConfig).toEqual(
         popup.BaseOpener.util.getIndicatorConfig(indicatorId, cfg)
      );
   });

   it('showDialog remove old id', () => {
      const config = {
         id: 'badId'
      };
      popup.BaseOpener._showIndicator(config);
      expect(config.id).toEqual(undefined); // id почистился, т.к. такого окна не было открыто
   });
});
