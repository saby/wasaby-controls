define('Controls-ListEnv-demo/Filter/NotConnectedView/RichDemo/resources/historySourceFast', [
   'Controls/historyOld',
   'Types/deferred',
   'Types/collection',
   'Types/entity',
   'Types/source',
   'Env/Env',
   'Controls/HistoryStore'
], function (history, defferedLib, collection, entity, source, Env, historyStore) {
   'use strict';

   var items = [
      { id: '1', title: 'My' },
      { id: '2', title: 'My department' },
      {
         id: '3',
         title: 'Игнатов Сергей Юрьевич',
         comment: 'Информационные системы',
         photo:
             Env.constants.resourceRoot +
             'Controls-ListEnv-demo/Filter/NotConnectedView/RichDemo/resources/dogadkin.png',
         itemTpl:
             'wml!Controls-ListEnv-demo/Filter/NotConnectedView/RichDemo/resources/itemTemplatePhoto'
      },
      {
         id: '4',
         title: 'Иванова Надежда Михайловна',
         comment: 'Офис Тензор/Юридический отдел',
         photo:
             Env.constants.resourceRoot +
             'Controls-ListEnv-demo/Filter/NotConnectedView/RichDemo/resources/kesareva.png',
         itemTpl:
             'wml!Controls-ListEnv-demo/Filter/NotConnectedView/RichDemo/resources/itemTemplatePhoto'
      },
      {
         id: '5',
         title: 'Петровичев Аркадий Аврамович',
         comment: 'Офис Тензор/Юридический отдел',
         photo:
             Env.constants.resourceRoot +
             'Controls-ListEnv-demo/Filter/NotConnectedView/RichDemo/resources/korbyt.png',
         itemTpl:
             'wml!Controls-ListEnv-demo/Filter/NotConnectedView/RichDemo/resources/itemTemplatePhoto'
      },
      {
         id: '6',
         title: 'Иванов Иван Иванович',
         comment: 'Информационные системы',
         photo:
             Env.constants.resourceRoot +
             'Controls-ListEnv-demo/Filter/NotConnectedView/RichDemo/resources/krainov.png',
         itemTpl:
             'wml!Controls-ListEnv-demo/Filter/NotConnectedView/RichDemo/resources/itemTemplatePhoto'
      },
      {
         id: '7',
         title: 'Чиркова Валентина Владимировна',
         comment: 'Информационные системы/Разработка',
         photo:
             Env.constants.resourceRoot +
             'Controls-ListEnv-demo/Filter/NotConnectedView/RichDemo/resources/baturina.png',
         itemTpl:
             'wml!Controls-ListEnv-demo/Filter/NotConnectedView/RichDemo/resources/itemTemplatePhoto'
      },
      { id: '8', title: 'News Services' },
      { id: '9', title: 'Interface Standards' }
   ];
   var recentData = {
      _type: 'recordset',
      d: [],
      s: [
         { n: 'ObjectId', t: 'Строка' },
         { n: 'ObjectData', t: 'Строка' },
         { n: 'HistoryId', t: 'Строка' }
      ]
   };
   var pinnedData = {
      _type: 'recordset',
      d: [['1'], ['2']],
      s: [
         { n: 'ObjectId', t: 'Строка' },
         { n: 'ObjectData', t: 'Строка' },
         { n: 'HistoryId', t: 'Строка' }
      ]
   };

   function createRecordSet(data) {
      return new collection.RecordSet({
         rawData: data,
         idProperty: 'ObjectId',
         adapter: new entity.adapter.Sbis()
      });
   }

   function getDataSet() {
      return new source.DataSet({
         rawData: {
            frequent: createRecordSet(),
            pinned: createRecordSet(pinnedData),
            recent: createRecordSet(recentData)
         },
         itemsProperty: '',
         idProperty: 'ObjectId'
      });
   }

   function createMemory() {
      if (!historyStore.Store.getLocal('TEST_HISTORY_ID_FAST_EMPLOYEE')['pinned'].getCount()) {
         historyStore.Store.togglePin('TEST_HISTORY_ID_FAST_EMPLOYEE', 1);
         historyStore.Store.togglePin('TEST_HISTORY_ID_FAST_EMPLOYEE', 2);
      }
      var hs = new history.Source({
         originSource: new source.Memory({
            idProperty: 'id',
            data: items
         }),
         historySource: new history.Service({
            historyId: 'TEST_HISTORY_ID_FAST_EMPLOYEE',
            pinned: true
         })
      });
      var query = new source.Query().where({
         $_history: true
      });
      var paramName = '_$historySource';
      hs[paramName].query = function () {
         var def = new defferedLib.Deferred();
         def.addCallback(function (set) {
            return set;
         });
         def.callback(getDataSet());
         return def;
      };

      // Заглушка, чтобы демка не ломилась не сервис истории
      hs[paramName].update = function () {
         return {};
      };
      hs.query(query);
      // eslint-disable-next-line
      hs[paramName].query();
      return hs;
   }

   return {
      createMemory: createMemory
   };
});
