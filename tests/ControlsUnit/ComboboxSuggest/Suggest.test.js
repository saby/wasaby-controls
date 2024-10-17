define([
   'Controls/ComboboxSuggest',
   'Core/core-clone',
   'Types/source',
   'Types/entity',
], (comboboxSuggest, Clone, sourceLib, entity) => {
   describe('Controls/comboboxSuggest', () => {
      let items = [
         {
            id: '1',
            title: 'Запись 1'
         },
         {
            id: '2',
            title: 'Запись 2'
         },
         {
            id: '3',
            title: 'Запись 3'
         }
      ];

      let config = {
         selectedKey: '2',
         displayProperty: 'title',
         keyProperty: 'id',
         value: 'New text',
         placeholder: 'This is placeholder',
         suggestTemplate: {},
         source: new sourceLib.Memory({
            keyProperty: 'id',
            data: items
         })
      };

      let getSuggest = function (cfg) {
         let suggest = new comboboxSuggest.default(cfg);

         // это сделано для того, чтобы ручные вызовы _forceUpdate не заваливали консоль ошибками
         jest.spyOn(suggest, '_forceUpdate').mockImplementation();
         suggest.saveOptions(cfg);
         return suggest;
      };

      it('_beforeMount', function (done) {
         let suggest = getSuggest(config);
         suggest._beforeMount(config).addCallback(function () {
            expect(suggest._value).toEqual('Запись 2');
            done();
         });
      });

      it('_beforeMount receivedState', function () {
         let suggest = getSuggest(config);
         let receivedState = new entity.Model({
            rawData: {
               id: '3',
               title: 'Запись 3'
            }
         });
         suggest._beforeMount(config, {}, receivedState);
         expect(suggest._value).toEqual('Запись 3');
      });

      it('_beforeMount suggestTemplateOptions', function () {
         let suggest = getSuggest(config);
         suggest._beforeMount(config);
         expect(suggest._suggestTemplate).toEqual({
            templateOptions: { displayProperty: 'title' }
         });
         let newConfig = Clone(config);
         newConfig.suggestTemplate = {
            templateOptions: {
               displayProperty: 'text',
               itemTemplate: 'newTemplate'
            }
         };
         suggest._beforeMount(newConfig);
         expect(suggest._suggestTemplate).toEqual({
            templateOptions: {
               displayProperty: 'text',
               itemTemplate: 'newTemplate'
            }
         });
      });

      it('_beforeMount selectedKey not set', function () {
         let newConfig = Clone(config);
         newConfig.selectedKey = undefined;
         let suggest = getSuggest(newConfig);
         suggest._beforeMount(newConfig);
         expect(suggest._options.value).toEqual('New text');
      });

      it('_beforeUpdate new suggestState', function () {
         let newConfig = Clone(config);
         newConfig.suggestState = true;
         let suggest = getSuggest(config);
         suggest._beforeUpdate(newConfig);
         expect(suggest._suggestState).toBe(true);
      });

      it('_beforeUpdate new suggestTemplate', function () {
         let newConfig = Clone(config);
         newConfig.suggestTemplate = { name: 'newTestTemplate' };
         let suggest = getSuggest(config);
         suggest._options.suggestTemplate = { name: 'testTemplate' };
         suggest._beforeUpdate(newConfig);
         expect(suggest._suggestTemplate.name).toEqual('newTestTemplate');
      });

      it('_beforeUpdate new selectedKey', function (done) {
         let newConfig = Clone(config);
         newConfig.selectedKey = '3';
         let suggest = getSuggest(config);
         suggest._beforeUpdate(newConfig).addCallback(function () {
            expect(suggest._value).toEqual('Запись 3');
            done();
         });
      });

      it('_changeValueHandler', function () {
         let suggest = getSuggest(config),
            newValue = '',
            key;
         suggest._notify = function (e, d) {
            if (e === 'valueChanged') {
               newValue = d[0];
            } else if (e === 'selectedKeyChanged') {
               key = d[0];
            }
         };
         suggest._changeValueHandler('valueChanged', 'New Text');
         expect(suggest._value).toEqual('New Text');
         expect(newValue).toEqual('New Text');
         expect(suggest._searchValue).toEqual('New Text');
         expect(key).toBeNull();
      });

      it('_choose', function () {
         let suggest = getSuggest(config),
            newValue = '',
            newKey,
            isActivate,
            choosedItem = new entity.Model({
               rawData: {
                  id: 'testId',
                  title: 'testTitle'
               }
            });
         suggest.activate = () => {
            isActivate = true;
         };
         suggest._notify = function (e, d) {
            if (e === 'selectedKeyChanged') {
               newKey = d[0];
            } else if (e === 'valueChanged') {
               newValue = d[0];
            }
         };

         suggest._choose('choose', choosedItem);
         expect(newKey).toEqual('testId');
         expect(newValue).toEqual('testTitle');
         expect(suggest._searchValue).toEqual('');
         expect(isActivate).toBe(true);
      });

      it('_open autoDropDown=false', function () {
         let suggest = getSuggest(config);
         suggest.activate = jest.fn();

         suggest._suggestState = true;
         suggest._open();
         expect(suggest._suggestState).toBe(false);

         suggest._suggestState = false;
         suggest._open();
         expect(suggest._suggestState).toBe(true);
      });

      it('_open autoDropDown=true', function () {
         let newConfig = Clone(config);
         newConfig.autoDropDown = true;
         let suggest = getSuggest(newConfig);
         suggest.activate = jest.fn();

         suggest._suggestState = true;
         suggest._open();
         expect(suggest._suggestState).toBe(false);

         suggest._suggestState = false;
         suggest._open();
         expect(suggest._suggestState).toBe(false);
      });

      it('_private::setValue', function () {
         let item = new entity.Model({
            rawData: { id: '1', title: 'Запись 1' }
         });
         let self = {};
         comboboxSuggest.default._private.setValue(self, item, 'title');
         expect(self._value).toEqual('Запись 1');
      });
   });
});
