define('Controls-demo/PropertyGrid/PropertyGridWrapper', [
   'UI/Base',
   'Types/deferred',
   'Core/core-merge',
   'Core/library',
   'UI/NodeCollector',
   'Controls-demo/PropertyGrid/propertyGridUtil',
   'wml!Controls-demo/PropertyGrid/PropertyGridWrapper',
   'wml!Controls-demo/PropertyGrid/PropertyGridTemplate',
   'wml!Controls-demo/PropertyGrid/Types/booleanOrNull',
   'wml!Controls-demo/PropertyGrid/Types/string',
   'wml!Controls-demo/PropertyGrid/Types/array',
   'wml!Controls-demo/PropertyGrid/Types/number',
   'wml!Controls-demo/PropertyGrid/Types/datetime',
   'wml!Controls-demo/PropertyGrid/Types/boolean',
   'wml!Controls-demo/PropertyGrid/Types/functionOrString',
   'wml!Controls-demo/PropertyGrid/Types/function',
   'wml!Controls-demo/PropertyGrid/Types/enum',
   'wml!Controls-demo/PropertyGrid/Types/object',
   'wml!Controls-demo/PropertyGrid/Types/timeInterval',

   'json!Controls-demo/PropertyGrid/pgtext'
], function (
   Base,
   defferedLib,
   cMerge,
   libHelper,
   NodeCollector,
   propertyGridUtil,
   template,
   myTmpl,
   booleanOrNull,
   stringTmpl,
   arrayTmpl,
   numberTmpl,
   datetimeTmpl,
   booleanTmpl,
   functOrString,
   functionTmpl,
   enumTmpl,
   objTmpl,
   timeIntervalTmpl
) {
   'use strict';

   var PGWrapper = Base.Control.extend({
      _template: template,
      _metaData: null,
      dataTemplates: null,
      myEvent: '',
      _my: myTmpl,
      _demoName: '',
      _exampleControlOptions: {},
      _beforeMount: function (opts) {
         this.dataTemplates = {
            'Boolean|null': booleanOrNull,
            String: stringTmpl,
            Array: arrayTmpl,
            Number: numberTmpl,
            DateTime: datetimeTmpl,
            Boolean: booleanTmpl,
            'function|String': functOrString,
            function: functionTmpl,
            enum: enumTmpl,
            Object: objTmpl,
            TimeInterval: timeIntervalTmpl
         };

         opts.componentOpt._version = 0;
         opts.componentOpt.getVersion = function () {
            return this._version;
         };
         this._exampleControlOptions = opts.componentOpt;

         var def = new defferedLib.Deferred();
         this.description = cMerge(opts.description, opts.dataObject);
         if (typeof opts.content === 'string') {
            this._demoName = propertyGridUtil.getDemoName(opts.content);
            libHelper.load(opts.content).then(function () {
               def.callback();
            });
            return def;
         }
      },
      _afterMount: function (opts) {
         var self = this,
            _container = this._children[opts.componentOpt.name]._container,
            container = _container[0] || _container;

         // TODO: https://online.sbis.ru/doc/d7b89438-00b0-404f-b3d9-cc7e02e61bb3

         var controls = NodeCollector.goUpByControlTree(container);
         controls.forEach(function (control) {
            var notOrigin = control._notify,
               resultNotify;

            if (control._container === container || control._container[0] === container) {
               control._notify = function (event, arg) {
                  self.myEvent += event + ' ';
                  if (event === opts.eventType) {
                     opts.componentOpt[opts.nameOption] = arg[0];
                  }
                  resultNotify = notOrigin.apply(this, arguments);
                  self._forceUpdate();
                  self._children.PropertyGrid._forceUpdate();
                  return resultNotify;
               };
            }
         });
      },
      _clickHandler: function () {
         if (this._options.dataObject.showClickEvent === true) {
            this.myEvent += 'click ';
         }
      },
      _valueChangedHandler: function (event, option, newValue) {
         this._exampleControlOptions[option] = newValue;
         this._exampleControlOptions._version++;
         this._notify('optionsChanged', [this._options]);
      },
      reset: function () {
         this.myEvent = '';
      }
   });
   PGWrapper._styles = [
      'Controls-demo/FilterOld/PanelVDom/PanelVDom',
      'Controls-demo/Input/resources/VdomInputs',
      'Controls-demo/Wrapper/Wrapper'
   ];

   return PGWrapper;
});
