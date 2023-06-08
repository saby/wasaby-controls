/**
 * Created by mi.marachev on 07.08.2018.
 */
define(['Controls/compatiblePopup', 'Core/CompoundContainer'], function (
   compatiblePopup,
   DropdownExample
) {
   'use strict';

   var config = {
      maximize: true,
      _type: 'dialog',
      templateOptions: {},
      componentOptions: {},
      template: 'tmpl!/test/test/test',
      hoverTarget: 'testHoverTarget',
      record: 'testRecord',
      parent: 'testParent',
      opener: 'testOpener',
      newRecord: 'newTestRecord',
      handlers: {},
      linkedContext: 'testLinkedContext',
      closeButtonStyle: 'testStyle',
      border: false,
      autoShow: false,
      autoCloseOnHide: false,
      offset: {
         x: '25',
         y: 25
      },
      target: ['testTarget'],
      className: 'testClass',
      verticalAlign: 'middle',
      side: 'left',
      _initCompoundArea: function () {
         return 'test';
      },
      eventHandlers: {
         onResult: 'onResult',
         onClose: 'onclose'
      },
      enabled: true,
      draggable: true,
      closeChildWindows: true,
      closeButtonViewMode: 'toolButton',
      closeButtonTransparent: false,
      closeOnTargetScroll: true,
      width: 'auto'
   };

   describe('Controls/compatiblePopup:BaseOpener', function () {
      it('_preparePopupCfgFromOldToNew', function () {
         config.autoHide = true;
         config.onResultHandler = jest.fn();
         config.onCloseHandler = jest.fn();
         compatiblePopup.BaseOpener._preparePopupCfgFromOldToNew(config);
         expect(config.eventHandlers.onResult).toEqual(config.onResultHandler);
         expect(config.eventHandlers.onClose).toEqual(config.onCloseHandler);

         expect(config.templateOptions.target).toEqual([config.target]);
         expect(config.isDefaultOpener).toEqual(true);
         expect(config.className).toEqual('testClass');
         expect(config.templateOptions.draggable).toEqual(config.draggable);
         expect(config.modal).toBe(true);
         expect(config.closeOnOutsideClick).toBe(false);
         config.side = null;
         config.modal = true;
         config.horizontalAlign = {
            offset: undefined
         };
         config.offset = 0;
         config.closeOnOutsideClick = false;
         delete config.draggable;
         config._popupComponent = 'dialog';
         compatiblePopup.BaseOpener._preparePopupCfgFromOldToNew(config);
         expect(config.templateOptions.draggable).toEqual(true);
         expect(config.closeOnOutsideClick).toBe(false);
         expect(!!config.horizontalAlign.side).toBe(false);
         expect(!!config.horizontalAlign.offset).toBe(false);
         expect(config.modal).toBe(true);
         config.direction = 'right';
         config.horizontalAlign = 'left';
         compatiblePopup.BaseOpener._preparePopupCfgFromOldToNew(config);
         expect('right').toEqual(config.direction.horizontal);
         config.direction = 'top';
         config.verticalAlign = 'test';
         compatiblePopup.BaseOpener._preparePopupCfgFromOldToNew(config);
         expect('top').toEqual(config.direction.vertical);
         delete config.direction;
         config.side = 'right';
         compatiblePopup.BaseOpener._preparePopupCfgFromOldToNew(config);
         expect(config.direction.horizontal).toEqual('left');
         config.direction = 'top';
         config.horizontalAlign = 'left';
         config.verticalAlign = 'top';
         compatiblePopup.BaseOpener._preparePopupCfgFromOldToNew(config);
         expect(config.direction.horizontal).toEqual('left');
         config.catchFocus = false;
         compatiblePopup.BaseOpener._preparePopupCfgFromOldToNew(config);
         expect(config.autofocus).toEqual(false);
         config.catchFocus = true;
         compatiblePopup.BaseOpener._preparePopupCfgFromOldToNew(config);
         expect(config.autofocus).toEqual(true);

         config.template =
            'Examples/DropdownList/MyDropdownList/MyDropdownList';
         expect(config.isCompoundTemplate).toEqual(true);
         config.template = 'UI/Base:Control';
         compatiblePopup.BaseOpener._preparePopupCfgFromOldToNew(config);
         expect(config.isCompoundTemplate).toEqual(false);
      });

      it('prepareNotificationConfig', function () {
         let template = jest.fn();
         let cfg = {
            template,
            opener: 'opener',
            className: 'myClass',
            templateOptions: {
               myOpt: true
            }
         };
         compatiblePopup.BaseOpener.prepareNotificationConfig(cfg);
         expect(cfg.template).toEqual(
            'Controls/compatiblePopup:OldNotification'
         );
         expect(cfg.componentOptions.template).toEqual(template);
         expect(cfg.componentOptions.templateOptions).toEqual(
            cfg.templateOptions
         );
         expect(cfg.componentOptions.className).toEqual('myClass');
         expect(cfg.isVDOM).toEqual(true);
         expect(cfg.className).toEqual('controls-OldNotification');
         expect(cfg.opener).toEqual(null);
      });

      it('_prepareConfigFromOldToOldByNewEnvironment', () => {
         let cfg = {
            flipWindow: 'vertical'
         };
         compatiblePopup.BaseOpener._prepareConfigFromOldToOldByNewEnvironment(
            cfg
         );
         expect(cfg.fittingMode).toEqual('overflow');
      });
      it('_setSizes', function () {
         compatiblePopup.BaseOpener._setSizes(config, DropdownExample);
         expect(config.autoWidth).toBe(true);
         expect(config.autoHeight).toBe(true);
         let newConfig = {};
         newConfig.minWidth = 50;
         newConfig.maxWidth = 50;
         newConfig.minHeight = 50;
         newConfig.maxHeight = 50;
         expect(!!newConfig.autoWidth).toBe(false);
         expect(!!newConfig.autoHeight).toBe(false);
         var newClass = {};
         newConfig = {};
         newClass.dimensions = {
            minWidth: 30,
            maxWidth: '30',
            minHeight: 30,
            maxHeight: '30',
            width: 100
         };
         compatiblePopup.BaseOpener._setSizes(newConfig, newClass);
         expect(!!newConfig.autoWidth).toBe(false);
         expect(!!newConfig.autoHeight).toBe(false);
         expect(newConfig.minWidth).toEqual(newClass.dimensions.minWidth);
         expect(newConfig.maxWidth).toEqual(30);
         expect(newConfig.minHeight).toEqual(newClass.dimensions.minHeight);
         expect(newConfig.maxHeight).toEqual(30);
         expect(newConfig.width).toEqual(newClass.dimensions.width);

         newClass = {};
         newConfig = {};
         newClass.dimensions = {
            width: 350
         };
         compatiblePopup.BaseOpener._setSizes(newConfig, newClass);
         expect(newConfig.minWidth).toEqual(null);
      });

      it('_getCaption', function () {
         config.title = 'testTitle';
         let title = compatiblePopup.BaseOpener._getCaption(
            config,
            DropdownExample
         );
         expect(title).toEqual('testTitle');
      });

      it('_prepareConfigForNewTemplate', function () {
         let newConfig = {
            width: 800,
            maxWidth: 1200,
            minWidth: 800,
            componentName: 'floatArea'
         };
         newConfig.templateOptions = config.templateOptions;
         newConfig.template =
            'Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea';
         newConfig.onResultHandler = 'onResultHandler';
         newConfig.onCloseHandler = 'onCloseHandler';
         newConfig.onResultHandlerEvent = 'onResultHandlerEvent';
         newConfig.onCloseHandlerEvent = 'onCloseHandlerEvent';
         compatiblePopup.BaseOpener._prepareConfigForNewTemplate(
            newConfig,
            DropdownExample
         );
         expect(newConfig.border).toBe(false);
         expect(newConfig.componentOptions.catchFocus).toEqual(true);
         expect(newConfig.componentOptions.templateOptions).toEqual(
            config.templateOptions
         );
         expect(newConfig.componentOptions.template).toEqual(
            'Controls/Popup/Compatible/CompoundAreaForOldTpl/CompoundArea'
         );
         expect(newConfig.template).toEqual(
            'Controls/compatiblePopup:CompoundAreaNewTpl'
         );
         expect(newConfig.animation).toEqual('off');
         expect(newConfig.componentOptions.onResultHandler).toEqual(
            newConfig.onResultHandler
         );
         expect(newConfig.componentOptions.onCloseHandler).toEqual(
            newConfig.onCloseHandler
         );
         expect(newConfig.componentOptions.onResultHandlerEvent).toEqual(
            newConfig.onResultHandlerEvent
         );
         expect(newConfig.componentOptions.onCloseHandlerEvent).toEqual(
            newConfig.onCloseHandlerEvent
         );
         expect(newConfig.componentOptions.templateOptions.minWidth).toEqual(
            newConfig.minWidth
         );
         expect(newConfig.componentOptions.templateOptions.maxWidth).toEqual(
            1200
         );
         expect(newConfig.componentOptions.templateOptions.width).toEqual(
            newConfig.width
         );
         expect(newConfig.maxWidth).toEqual(800);
      });

      it('_getDimensions', function () {
         var newClass = {};
         newClass.dimensions = {
            minWidth: 50,
            maxWidth: 50,
            minHeight: 50,
            maxHeight: 50
         };
         var dimensions = compatiblePopup.BaseOpener._getDimensions(newClass);
         expect(newClass.dimensions).toEqual(dimensions);
      });
      it('_getConfigFromTmpl', function () {
         var cfg = {
            getDefaultOptions: function () {
               return {
                  minWidth: 300,
                  maxWidth: 900,
                  minimizedWidth: 400
               };
            }
         };
         var newcfg = compatiblePopup.BaseOpener._getConfigFromTemplate(cfg);
         expect(newcfg.minWidth).toEqual(300);
         expect(newcfg.maxWidth).toEqual(900);
         expect(newcfg.minimizedWidth).toEqual(400);
      });
   });
});
